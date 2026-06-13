const Cita = require('../models/Cita');
const Bloqueo = require('../models/Bloqueo');
const Servicio = require('../models/Servicio');

const verificarDisponibilidad = async (estilistaId, fecha, hora, duracion) => {
  const inicio = new Date(`${fecha}T${hora}`);
  const fin = new Date(inicio.getTime() + duracion * 60000);
  const conflicto = await Cita.findOne({
    estilistaId, fecha: new Date(fecha),
    estado: { $in: ['pendiente', 'confirmada', 'en_progreso'] },
    $or: [{ hora: { $gte: hora, $lt: fin.toTimeString().slice(0, 5) } }]
  });
  const bloqueado = await Bloqueo.findOne({
    estilistaId,
    fechaInicio: { $lte: new Date(fecha) },
    fechaFin: { $gte: new Date(fecha) }
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
    const cita = await Cita.findByIdAndUpdate(req.params.id, { estado: req.body.estado }, { new: true });
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

module.exports = { listarPorCliente, listarPorEstilista, listarTodas, crear, actualizarEstado };
