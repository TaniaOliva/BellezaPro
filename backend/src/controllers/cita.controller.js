const Cita = require('../models/Cita');
const Bloqueo = require('../models/Bloqueo');
const Servicio = require('../models/Servicio');
const Usuario = require('../models/Usuario');
const { crearNotificacion } = require('./notificacion.controller');
const { inicioDelDiaHN, instanteHN } = require('../utils/fechas');
const { MOTIVOS_CANCELACION, MOTIVOS_CANCELACION_CLIENTE, ETIQUETAS_MOTIVO } = require('../utils/catalogos');

const HORA_CIERRE_MIN = 18 * 60;
const DIAS_VENTANA_AUTOCANCELAR = 7;

// Motivos que puede usar una estilista al cancelar: todos menos 'no_asistio',
// que solo lo asigna el sistema.
const MOTIVOS_CANCELACION_ESTILISTA = MOTIVOS_CANCELACION.filter(m => m !== 'no_asistio');

const verificarDisponibilidad = async (estilistaId, fecha, hora, duracion) => {
  const [nh, nm] = hora.split(':').map(Number);
  const nuevaInicio = nh * 60 + nm;
  const nuevaFin = nuevaInicio + Number(duracion);

  if (nuevaFin > HORA_CIERRE_MIN) return false;

  const citasDelDia = await Cita.find({
    estilistaId, fecha: new Date(fecha),
    estado: { $in: ['confirmada'] }
  }).select('hora duracion');

  const hayConflicto = citasDelDia.some(cita => {
    const [ch, cm] = cita.hora.split(':').map(Number);
    const citaInicio = ch * 60 + cm;
    const citaFin = citaInicio + (cita.duracion || 60);
    return nuevaInicio < citaFin && nuevaFin > citaInicio;
  });

  if (hayConflicto) return false;

  const bloqueado = await Bloqueo.findOne({
    fechaInicio: { $lte: new Date(fecha) },
    fechaFin: { $gte: new Date(fecha) },
    $or: [{ estilistaId }, { cierreTotalSalon: true }]
  });
  return !bloqueado;
};

const listarPorCliente = async (req, res) => {
  try {
    const activas = await Cita.find({
      clienteId: req.usuario.id,
      estado: { $in: ['confirmada'] }
    });
    for (const cita of activas) {
      const bloqueo = await Bloqueo.findOne({
        fechaInicio: { $lte: cita.fecha },
        fechaFin:    { $gte: cita.fecha },
        $or: [{ cierreTotalSalon: true }, { estilistaId: cita.estilistaId }]
      });
      if (bloqueo) {
        await Cita.findByIdAndUpdate(cita._id, {
          estado: 'cancelada',
          motivoCancelacion: bloqueo.cierreTotalSalon ? 'cierre_salon' : 'ausencia_estilista',
          canceladoPor: 'admin',
          canceladoEn: new Date(),
          detalleCancelacion: bloqueo.detalleRazon || undefined,
        });
        await crearNotificacion(
          req.usuario.id,
          'Tu cita fue cancelada',
          bloqueo.cierreTotalSalon
            ? 'El salón bloqueó este período. Por favor reagenda tu cita.'
            : 'Tu estilista no estará disponible ese día. Por favor reagenda tu cita.',
          'cita', 'event_busy'
        );
      }
    }

    const citas = await Cita.find({ clienteId: req.usuario.id, estado: { $in: ['confirmada', 'cancelada', 'no_asistio', 'terminada'] } })
      .populate('estilistaId', 'nombre apellido')
      .populate('servicioId', 'nombre precioBase duracion')
      .sort({ fecha: -1 });
    res.json(citas);
  } catch (err) { res.status(500).json({ mensaje: err.message }); }
};

// Cierra las citas confirmadas de dias anteriores que el estilista nunca
// marco como terminada. Se le da todo el dia de la cita como margen (no se
// toca mientras siga siendo "hoy"); solo se cancelan automaticamente al
// cambiar de fecha, para que no queden como 'confirmada' para siempre.
const autoCancelarVencidas = async (estilistaId) => {
  const hoyHN = inicioDelDiaHN();
  const desdeHN = new Date(hoyHN.getTime() - DIAS_VENTANA_AUTOCANCELAR * 24 * 60 * 60 * 1000);

  // Solo cierra no-shows recientes (ultimos DIAS_VENTANA_AUTOCANCELAR dias); el
  // historico mas viejo no se toca. "hoy" es el dia calendario de Honduras.
  await Cita.updateMany(
    { estilistaId, estado: 'confirmada', fecha: { $gte: desdeHN, $lt: hoyHN } },
    { estado: 'no_asistio', motivoCancelacion: 'no_asistio', canceladoPor: 'sistema', canceladoEn: new Date() }
  );
};

const listarPorEstilista = async (req, res) => {
  try {
    await autoCancelarVencidas(req.usuario.id);
    const citas = await Cita.find({ estilistaId: req.usuario.id, estado: { $in: ['confirmada', 'cancelada', 'no_asistio', 'terminada'] } })
      .populate('clienteId', 'nombre apellido telefono calificacionPromedio')
      .populate('servicioId', 'nombre duracion precioBase')
      .sort({ fecha: 1, hora: 1 });
    res.json(citas);
  } catch (err) { res.status(500).json({ mensaje: err.message }); }
};

const crear = async (req, res) => {
  try {
    // C4: lista blanca explicita de campos que acepta el cliente.
    const { estilistaId, servicioId, fecha, hora, duracion, notas } = req.body;
    if (!estilistaId || !fecha || !hora) {
      return res.status(400).json({ mensaje: 'Faltan datos de la cita' });
    }

    // C3: rechazar citas cuya fecha/hora ya pasaron (reloj de Honduras).
    if (instanteHN(fecha, hora).getTime() <= Date.now()) {
      return res.status(400).json({ mensaje: 'No se puede reservar una cita en una fecha u hora que ya pasó' });
    }

    const disponible = await verificarDisponibilidad(estilistaId, fecha, hora, duracion);
    if (!disponible) return res.status(409).json({ mensaje: 'El horario ya no esta disponible' });

    const cita = await Cita.create({ clienteId: req.usuario.id, estilistaId, servicioId, fecha, hora, duracion, notas });
    if (servicioId) {
      await Servicio.findByIdAndUpdate(servicioId, { $inc: { contadorSemana: 1 } });
    }
    res.status(201).json(cita);
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

// 'no_asistio' queda fuera: solo lo asigna el sistema (autoCancelarVencidas).
const ESTADOS_CITA = ['confirmada', 'cancelada', 'terminada'];

const actualizarEstado = async (req, res) => {
  try {
    const { estado, motivo, detalle } = req.body;
    if (estado === 'no_asistio') {
      return res.status(400).json({ mensaje: "El estado 'no asistió' solo lo asigna el sistema" });
    }
    if (!ESTADOS_CITA.includes(estado)) {
      return res.status(400).json({ mensaje: 'Estado no valido' });
    }

    // Solo el estilista dueno de la cita puede cambiarle el estado; el admin puede cualquiera
    const filtro = { _id: req.params.id };
    if (req.usuario.rol === 'estilista') {
      filtro.estilistaId = req.usuario.id;
    } else if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'No autorizado' });
    }

    // Cancelar por esta via exige un motivo del catalogo; se completan los
    // campos de cancelacion para no dejar el dato incompleto.
    const cambios = { estado };
    if (estado === 'cancelada') {
      const permitidos = req.usuario.rol === 'estilista' ? MOTIVOS_CANCELACION_ESTILISTA : MOTIVOS_CANCELACION;
      if (!permitidos.includes(motivo)) {
        return res.status(400).json({ mensaje: 'Para cancelar debes enviar un motivo válido del catálogo' });
      }
      cambios.motivoCancelacion = motivo;
      cambios.canceladoPor = req.usuario.rol; // 'estilista' | 'admin'
      cambios.canceladoEn = new Date();
      cambios.detalleCancelacion = motivo === 'otro' ? (detalle || '').trim() : undefined;
    }

    const cita = await Cita.findOneAndUpdate(filtro, cambios, { new: true })
      .populate('clienteId', 'nombre apellido')
      .populate('servicioId', 'nombre');
    if (!cita) return res.status(404).json({ mensaje: 'Cita no encontrada' });

    if (req.body.estado === 'cancelada') {
      const clienteNombre = cita.clienteId?.nombre
        ? `${cita.clienteId.nombre} ${cita.clienteId.apellido ?? ''}`.trim()
        : 'Cliente';
      const servicioNombre = cita.servicioId?.nombre ?? 'servicio';
      const admins = await Usuario.find({ rol: 'admin' }).select('_id');
      for (const admin of admins) {
        await crearNotificacion(admin._id, 'Cita cancelada',
          `${clienteNombre} canceló su cita de ${servicioNombre}`, 'cita', 'event_busy', req.params.id);
      }
    }

    if (req.body.estado === 'terminada') {
      const estilista = await Usuario.findById(cita.estilistaId).select('nombre apellido');
      const nombreEst = estilista ? `${estilista.nombre} ${estilista.apellido}`.trim() : 'tu estilista';
      const clienteId = cita.clienteId?._id ?? cita.clienteId;
      await crearNotificacion(
        clienteId,
        '¡Tu cita ha concluido!',
        `Califica tu experiencia con ${nombreEst}. ¡Tu opinión es importante!`,
        'calificacion', 'star',
        cita._id.toString()
      );
    }

    res.json(cita);
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

const listarTodas = async (req, res) => {
  try {
    const citas = await Cita.find()
      .populate('clienteId', 'nombre apellido')
      .populate('estilistaId', 'nombre apellido')
      .populate('servicioId', 'nombre')
      .sort({ fecha: -1, hora: 1 });
    res.json(citas);
  } catch (err) { res.status(500).json({ mensaje: err.message }); }
};

const SLOTS_DIA = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30'
];

const verificarSlotsDisponibles = async (req, res) => {
  try {
    const { fecha, estilistaId, duracion } = req.query;
    if (!fecha || !duracion) return res.status(400).json({ mensaje: 'Se requieren fecha y duracion' });

    const dur = parseInt(duracion);
    const fechaDate = new Date(fecha);

    const bloqueoTotal = await Bloqueo.findOne({
      fechaInicio: { $lte: fechaDate },
      fechaFin: { $gte: fechaDate },
      cierreTotalSalon: true
    });
    if (bloqueoTotal) return res.json({ todos: SLOTS_DIA.map(h => ({ hora: h, disponible: false })), bloqueado: 'salon' });

    if (estilistaId) {
      const bloqueoEstilista = await Bloqueo.findOne({
        fechaInicio: { $lte: fechaDate },
        fechaFin: { $gte: fechaDate },
        estilistaId
      });
      if (bloqueoEstilista) return res.json({ todos: SLOTS_DIA.map(h => ({ hora: h, disponible: false })), bloqueado: 'estilista' });
    }

    const query = {
      fecha: fechaDate,
      estado: { $in: ['confirmada'] }
    };
    if (estilistaId) query.estilistaId = estilistaId;
    const citasExistentes = await Cita.find(query).select('hora duracion');

    const todos = SLOTS_DIA.map(slot => {
      const [h, m] = slot.split(':').map(Number);
      const inicio = h * 60 + m;
      const fin = inicio + dur;
      if (fin > HORA_CIERRE_MIN) return { hora: slot, disponible: false };
      for (const cita of citasExistentes) {
        const [ch, cm] = cita.hora.split(':').map(Number);
        const citaInicio = ch * 60 + cm;
        const citaFin = citaInicio + (cita.duracion || 60);
        if (inicio < citaFin && fin > citaInicio) return { hora: slot, disponible: false };
      }
      return { hora: slot, disponible: true };
    });

    res.json({ todos, bloqueado: null });
  } catch (err) { res.status(500).json({ mensaje: err.message }); }
};

const cancelarPorCliente = async (req, res) => {
  try {
    const { motivo, detalle } = req.body;
    if (!MOTIVOS_CANCELACION_CLIENTE.includes(motivo)) {
      return res.status(400).json({ mensaje: 'Motivo de cancelación no válido' });
    }
    const cita = await Cita.findOne({ _id: req.params.id, clienteId: req.usuario.id });
    if (!cita) return res.status(404).json({ mensaje: 'Cita no encontrada' });
    if (cita.estado !== 'confirmada') {
      return res.status(400).json({ mensaje: 'No se puede cancelar esta cita' });
    }
    await Cita.findByIdAndUpdate(req.params.id, {
      estado: 'cancelada',
      motivoCancelacion: motivo,
      canceladoPor: 'cliente',
      canceladoEn: new Date(),
      detalleCancelacion: motivo === 'otro' ? (detalle || '').trim() : undefined,
    });

    const etiqueta = ETIQUETAS_MOTIVO[motivo] || motivo;
    await crearNotificacion(cita.estilistaId, 'Cita cancelada por cliente',
      `El cliente canceló su cita. Motivo: ${etiqueta}`, 'cita', 'event_busy');
    const admins = await Usuario.find({ rol: 'admin' }).select('_id');
    for (const admin of admins) {
      await crearNotificacion(admin._id, 'Cita cancelada',
        `Un cliente canceló su cita. Motivo: ${etiqueta}`, 'cita', 'event_busy', req.params.id);
    }
    res.json({ mensaje: 'Cita cancelada' });
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

const reagendar = async (req, res) => {
  try {
    const { fecha, hora } = req.body;
    if (!fecha || !hora) return res.status(400).json({ mensaje: 'Fecha y hora son requeridas' });
    if (instanteHN(fecha, hora).getTime() <= Date.now()) {
      return res.status(400).json({ mensaje: 'No se puede reagendar a una fecha u hora que ya pasó' });
    }
    const cita = await Cita.findOne({ _id: req.params.id, clienteId: req.usuario.id });
    if (!cita) return res.status(404).json({ mensaje: 'Cita no encontrada' });
    if (cita.estado !== 'cancelada') return res.status(400).json({ mensaje: 'Solo puedes reagendar citas canceladas' });
    const disponible = await verificarDisponibilidad(cita.estilistaId.toString(), fecha, hora, cita.duracion);
    if (!disponible) return res.status(409).json({ mensaje: 'El horario seleccionado no está disponible' });
    const actualizada = await Cita.findByIdAndUpdate(req.params.id, {
      $set: { fecha: new Date(fecha), hora, estado: 'confirmada' },
      $unset: { motivoCancelacion: '', canceladoPor: '', canceladoEn: '', detalleCancelacion: '' }
    }, { new: true }).populate('estilistaId', 'nombre apellido').populate('servicioId', 'nombre');
    res.json(actualizada);
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

const valorarCliente = async (req, res) => {
  try {
    const { estrellas, comentario } = req.body;
    if (!estrellas || estrellas < 1 || estrellas > 5) return res.status(400).json({ mensaje: 'Puntuación inválida' });
    const cita = await Cita.findOne({ _id: req.params.id, estilistaId: req.usuario.id });
    if (!cita) return res.status(404).json({ mensaje: 'Cita no encontrada' });
    if (cita.estado !== 'terminada') return res.status(400).json({ mensaje: 'Solo puedes valorar una cita terminada' });
    const actualizada = await Cita.findByIdAndUpdate(
      req.params.id,
      { valoracionEstilista: estrellas, comentarioEstilista: comentario ?? '' },
      { new: true }
    );

    const stats = await Cita.aggregate([
      { $match: { clienteId: cita.clienteId, valoracionEstilista: { $exists: true, $ne: null } } },
      { $group: { _id: null, promedio: { $avg: '$valoracionEstilista' }, total: { $sum: 1 } } }
    ]);
    if (stats.length > 0) {
      await Usuario.findByIdAndUpdate(cita.clienteId, {
        calificacionPromedio: Math.round(stats[0].promedio * 10) / 10,
        totalCalificaciones: stats[0].total
      });
    }

    res.json(actualizada);
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

const cancelarPorEstilista = async (req, res) => {
  try {
    const { motivo, detalle } = req.body;
    if (!MOTIVOS_CANCELACION_ESTILISTA.includes(motivo)) {
      return res.status(400).json({ mensaje: 'Motivo de cancelación no válido' });
    }

    const cita = await Cita.findOne({ _id: req.params.id, estilistaId: req.usuario.id })
      .populate('clienteId', 'nombre apellido')
      .populate('servicioId', 'nombre');
    if (!cita) return res.status(404).json({ mensaje: 'Cita no encontrada' });
    if (cita.estado !== 'confirmada') {
      return res.status(400).json({ mensaje: 'Solo se pueden cancelar citas confirmadas' });
    }

    // "Hoy" es el dia calendario de Honduras, no el UTC: entre las 18:00 y la
    // medianoche HN el UTC ya rodo al dia siguiente.
    if (new Date(cita.fecha).getTime() !== inicioDelDiaHN().getTime()) {
      return res.status(400).json({ mensaje: 'Solo puedes cancelar citas del día de hoy' });
    }

    await Cita.findByIdAndUpdate(req.params.id, {
      estado: 'cancelada',
      motivoCancelacion: motivo,
      canceladoPor: 'estilista',
      canceladoEn: new Date(),
      detalleCancelacion: motivo === 'otro' ? (detalle || '').trim() : undefined,
    });

    const etiqueta = ETIQUETAS_MOTIVO[motivo] || motivo;
    const estilista = await Usuario.findById(req.usuario.id).select('nombre apellido');
    const nombreEst = estilista
      ? `${estilista.nombre} ${estilista.apellido}`.trim()
      : 'La estilista';
    const servicioNombre = cita.servicioId?.nombre ?? 'tu servicio';
    const clienteId = cita.clienteId?._id ?? cita.clienteId;
    await crearNotificacion(
      clienteId,
      'Tu cita fue cancelada',
      `${nombreEst} canceló tu cita de ${servicioNombre}. Motivo: ${etiqueta}`,
      'cita', 'event_busy'
    );

    const clienteNombre = cita.clienteId?.nombre
      ? `${cita.clienteId.nombre} ${cita.clienteId.apellido ?? ''}`.trim()
      : 'un cliente';
    const admins = await Usuario.find({ rol: 'admin' }).select('_id');
    for (const admin of admins) {
      await crearNotificacion(
        admin._id,
        'Cita cancelada por estilista',
        `${nombreEst} canceló la cita de ${clienteNombre} (${servicioNombre}). Motivo: ${etiqueta}`,
        'cita', 'event_busy', req.params.id
      );
    }

    res.json({ mensaje: 'Cita cancelada' });
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

const obtenerPorAdmin = async (req, res) => {
  try {
    const cita = await Cita.findById(req.params.id)
      .populate('clienteId', 'nombre apellido email')
      .populate('estilistaId', 'nombre apellido')
      .populate('servicioId', 'nombre precioBase');
    if (!cita) return res.status(404).json({ mensaje: 'Cita no encontrada' });
    res.json(cita);
  } catch (err) { res.status(500).json({ mensaje: err.message }); }
};

module.exports = { listarPorCliente, listarPorEstilista, listarTodas, obtenerPorAdmin, crear, actualizarEstado, verificarSlotsDisponibles, cancelarPorCliente, reagendar, valorarCliente, cancelarPorEstilista };
