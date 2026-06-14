const Cita = require('../models/Cita');
const Bloqueo = require('../models/Bloqueo');
const Servicio = require('../models/Servicio');
const Usuario = require('../models/Usuario');
const { crearNotificacion } = require('./notificacion.controller');

const verificarDisponibilidad = async (estilistaId, fecha, hora, duracion) => {
  const inicio = new Date(`${fecha}T${hora}`);
  const fin = new Date(inicio.getTime() + duracion * 60000);
  const conflicto = await Cita.findOne({
    estilistaId, fecha: new Date(fecha),
    estado: { $in: ['pendiente', 'confirmada', 'en_progreso'] },
    $or: [{ hora: { $gte: hora, $lt: fin.toTimeString().slice(0, 5) } }]
  });
  const bloqueado = await Bloqueo.findOne({
    fechaInicio: { $lte: new Date(fecha) },
    fechaFin: { $gte: new Date(fecha) },
    $or: [{ estilistaId }, { cierreTotalSalon: true }]
  });
  return !conflicto && !bloqueado;
};

const listarPorCliente = async (req, res) => {
  try {
    const citas = await Cita.find({ clienteId: req.usuario.id })
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
    const citas = await Cita.find({ estilistaId: req.usuario.id })
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
          `${clienteNombre} canceló su cita de ${servicioNombre}`, 'cita', 'event_busy');
      }
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
    if (bloqueoTotal) return res.json({ slots: [], bloqueado: 'salon' });

    if (estilistaId) {
      const bloqueoEstilista = await Bloqueo.findOne({
        fechaInicio: { $lte: fechaDate },
        fechaFin: { $gte: fechaDate },
        estilistaId
      });
      if (bloqueoEstilista) return res.json({ slots: [], bloqueado: 'estilista' });
    }

    const query = {
      fecha: fechaDate,
      estado: { $in: ['pendiente', 'confirmada', 'en_progreso'] }
    };
    if (estilistaId) query.estilistaId = estilistaId;
    const citasExistentes = await Cita.find(query).select('hora duracion');

    const slotsDisponibles = SLOTS_DIA.filter(slot => {
      const [h, m] = slot.split(':').map(Number);
      const inicio = h * 60 + m;
      const fin = inicio + dur;
      if (fin > 18 * 60) return false;
      for (const cita of citasExistentes) {
        const [ch, cm] = cita.hora.split(':').map(Number);
        const citaInicio = ch * 60 + cm;
        const citaFin = citaInicio + cita.duracion;
        if (inicio < citaFin && fin > citaInicio) return false;
      }
      return true;
    });

    res.json({ slots: slotsDisponibles, bloqueado: null });
  } catch (err) { res.status(500).json({ mensaje: err.message }); }
};

const cancelarPorCliente = async (req, res) => {
  try {
    const { motivo } = req.body;
    if (!motivo || !motivo.trim()) return res.status(400).json({ mensaje: 'Debes indicar un motivo' });
    const cita = await Cita.findOne({ _id: req.params.id, clienteId: req.usuario.id });
    if (!cita) return res.status(404).json({ mensaje: 'Cita no encontrada' });
    if (!['pendiente', 'confirmada'].includes(cita.estado)) {
      return res.status(400).json({ mensaje: 'No se puede cancelar esta cita' });
    }
    await Cita.findByIdAndUpdate(req.params.id, { estado: 'cancelada', motivoCancelacion: motivo.trim() });
    await crearNotificacion(cita.estilistaId, 'Cita cancelada por cliente',
      `El cliente canceló su cita. Motivo: ${motivo.trim()}`, 'cita', 'event_busy');
    const admins = await Usuario.find({ rol: 'admin' }).select('_id');
    for (const admin of admins) {
      await crearNotificacion(admin._id, 'Cita cancelada',
        `Un cliente canceló su cita. Motivo: ${motivo.trim()}`, 'cita', 'event_busy');
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
      $set: { fecha: new Date(fecha), hora, estado: 'pendiente' },
      $unset: { motivoCancelacion: '' }
    }, { new: true }).populate('estilistaId', 'nombre apellido').populate('servicioId', 'nombre');
    res.json(actualizada);
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

module.exports = { listarPorCliente, listarPorEstilista, listarTodas, crear, actualizarEstado, verificarSlotsDisponibles, cancelarPorCliente, reagendar };
