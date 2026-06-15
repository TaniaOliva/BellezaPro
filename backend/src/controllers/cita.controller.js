const Cita = require('../models/Cita');
const Bloqueo = require('../models/Bloqueo');
const Servicio = require('../models/Servicio');
const Usuario = require('../models/Usuario');
const { crearNotificacion } = require('./notificacion.controller');

const HORA_CIERRE_MIN = 18 * 60;

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
        const motivo = `${bloqueo.razon || 'El salón ha bloqueado este período.'} Te invitamos a reagendar tu cita.`;
        await Cita.findByIdAndUpdate(cita._id, { estado: 'cancelada', motivoCancelacion: motivo });
        await crearNotificacion(
          req.usuario.id,
          'Tu cita fue cancelada',
          bloqueo.razon ? `${bloqueo.razon} Por favor reagenda tu cita.` : 'El salón bloqueó este período. Por favor reagenda tu cita.',
          'cita', 'event_busy'
        );
      }
    }

    const citas = await Cita.find({ clienteId: req.usuario.id, estado: { $in: ['confirmada', 'cancelada', 'terminada'] } })
      .populate('estilistaId', 'nombre apellido')
      .populate('servicioId', 'nombre precioBase duracion')
      .sort({ fecha: -1 });
    res.json(citas);
  } catch (err) { res.status(500).json({ mensaje: err.message }); }
};

const autoCancelarVencidas = async (estilistaId) => {
  const ahora = new Date();
  const hoy = new Date(ahora); hoy.setHours(0, 0, 0, 0);
  const manana = new Date(hoy); manana.setDate(manana.getDate() + 1);

  const confirmadas = await Cita.find({
    estilistaId, estado: 'confirmada',
    fecha: { $gte: hoy, $lt: manana }
  });

  for (const cita of confirmadas) {
    const [h, m] = cita.hora.split(':').map(Number);
    const horaCita = new Date(cita.fecha);
    horaCita.setHours(h, m, 0, 0);
    const limite = new Date(horaCita.getTime() + 2 * 60 * 60 * 1000);
    if (ahora > limite) {
      await Cita.findByIdAndUpdate(cita._id, { estado: 'cancelada' });
    }
  }
};

const listarPorEstilista = async (req, res) => {
  try {
    await autoCancelarVencidas(req.usuario.id);
    const citas = await Cita.find({ estilistaId: req.usuario.id, estado: { $in: ['confirmada', 'cancelada', 'terminada'] } })
      .populate('clienteId', 'nombre apellido telefono')
      .populate('servicioId', 'nombre duracion precioBase')
      .sort({ fecha: 1, hora: 1 });
    res.json(citas);
  } catch (err) { res.status(500).json({ mensaje: err.message }); }
};

const crear = async (req, res) => {
  try {
    const { estilistaId, fecha, hora, duracion } = req.body;
    const disponible = await verificarDisponibilidad(estilistaId, fecha, hora, duracion);
    if (!disponible) return res.status(409).json({ mensaje: 'El horario ya no esta disponible' });
    const cita = await Cita.create({ ...req.body, clienteId: req.usuario.id });
    if (req.body.servicioId) {
      await Servicio.findByIdAndUpdate(req.body.servicioId, { $inc: { contadorSemana: 1 } });
    }
    res.status(201).json(cita);
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

const actualizarEstado = async (req, res) => {
  try {
    const cita = await Cita.findByIdAndUpdate(req.params.id, { estado: req.body.estado }, { new: true })
      .populate('clienteId', 'nombre apellido')
      .populate('servicioId', 'nombre');

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
    const { motivo } = req.body;
    if (!motivo || !motivo.trim()) return res.status(400).json({ mensaje: 'Debes indicar un motivo' });
    const cita = await Cita.findOne({ _id: req.params.id, clienteId: req.usuario.id });
    if (!cita) return res.status(404).json({ mensaje: 'Cita no encontrada' });
    if (cita.estado !== 'confirmada') {
      return res.status(400).json({ mensaje: 'No se puede cancelar esta cita' });
    }
    await Cita.findByIdAndUpdate(req.params.id, { estado: 'cancelada', motivoCancelacion: motivo.trim() });
    await crearNotificacion(cita.estilistaId, 'Cita cancelada por cliente',
      `El cliente canceló su cita. Motivo: ${motivo.trim()}`, 'cita', 'event_busy');
    const admins = await Usuario.find({ rol: 'admin' }).select('_id');
    for (const admin of admins) {
      await crearNotificacion(admin._id, 'Cita cancelada',
        `Un cliente canceló su cita. Motivo: ${motivo.trim()}`, 'cita', 'event_busy', req.params.id);
    }
    res.json({ mensaje: 'Cita cancelada' });
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

const reagendar = async (req, res) => {
  try {
    const { fecha, hora } = req.body;
    if (!fecha || !hora) return res.status(400).json({ mensaje: 'Fecha y hora son requeridas' });
    const cita = await Cita.findOne({ _id: req.params.id, clienteId: req.usuario.id });
    if (!cita) return res.status(404).json({ mensaje: 'Cita no encontrada' });
    if (cita.estado !== 'cancelada') return res.status(400).json({ mensaje: 'Solo puedes reagendar citas canceladas' });
    const disponible = await verificarDisponibilidad(cita.estilistaId.toString(), fecha, hora, cita.duracion);
    if (!disponible) return res.status(409).json({ mensaje: 'El horario seleccionado no está disponible' });
    const actualizada = await Cita.findByIdAndUpdate(req.params.id, {
      $set: { fecha: new Date(fecha), hora, estado: 'confirmada' },
      $unset: { motivoCancelacion: '' }
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
    const { motivo } = req.body;
    if (!motivo || !motivo.trim()) {
      return res.status(400).json({ mensaje: 'Debes indicar un motivo para la cancelación' });
    }

    const cita = await Cita.findOne({ _id: req.params.id, estilistaId: req.usuario.id })
      .populate('clienteId', 'nombre apellido')
      .populate('servicioId', 'nombre');
    if (!cita) return res.status(404).json({ mensaje: 'Cita no encontrada' });
    if (cita.estado !== 'confirmada') {
      return res.status(400).json({ mensaje: 'Solo se pueden cancelar citas confirmadas' });
    }

    const hoyStr = new Date().toISOString().slice(0, 10);
    const citaFechaStr = new Date(cita.fecha).toISOString().slice(0, 10);
    if (citaFechaStr !== hoyStr) {
      return res.status(400).json({ mensaje: 'Solo puedes cancelar citas del día de hoy' });
    }

    await Cita.findByIdAndUpdate(req.params.id, {
      estado: 'cancelada',
      motivoCancelacion: motivo.trim()
    });

    const estilista = await Usuario.findById(req.usuario.id).select('nombre apellido');
    const nombreEst = estilista
      ? `${estilista.nombre} ${estilista.apellido}`.trim()
      : 'La estilista';
    const servicioNombre = cita.servicioId?.nombre ?? 'tu servicio';
    const clienteId = cita.clienteId?._id ?? cita.clienteId;
    await crearNotificacion(
      clienteId,
      'Tu cita fue cancelada',
      `${nombreEst} canceló tu cita de ${servicioNombre}. Motivo: ${motivo.trim()}`,
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
        `${nombreEst} canceló la cita de ${clienteNombre} (${servicioNombre}). Motivo: ${motivo.trim()}`,
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
