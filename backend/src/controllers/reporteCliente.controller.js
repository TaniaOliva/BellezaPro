const ReporteCliente = require('../models/ReporteCliente');
const Usuario = require('../models/Usuario');
const { crearNotificacion } = require('./notificacion.controller');

const crear = async (req, res) => {
  try {
    const reporte = await ReporteCliente.create({ ...req.body, estilistaId: req.usuario.id });

    const estilista = await Usuario.findById(req.usuario.id).select('nombre apellido');
    const nombreEst = estilista ? `${estilista.nombre} ${estilista.apellido}`.trim() : 'Estilista';
    const admins = await Usuario.find({ rol: 'admin' }).select('_id');
    for (const admin of admins) {
      await crearNotificacion(admin._id, 'Nuevo reporte de cliente', `${nombreEst} reportó un cliente`, 'sistema', 'flag');
    }

    res.status(201).json(reporte);
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

const listarPendientes = async (req, res) => {
  try {
    const reportes = await ReporteCliente.find({ estado: 'en_revision' })
      .populate('estilistaId', 'nombre apellido')
      .populate('clienteId', 'nombre apellido email estado')
      .populate('citaId', 'fecha hora')
      .sort({ creadoEn: -1 });
    res.json(reportes);
  } catch (err) { res.status(500).json({ mensaje: err.message }); }
};

const listarTodos = async (req, res) => {
  try {
    const reportes = await ReporteCliente.find()
      .populate('estilistaId', 'nombre apellido')
      .populate('clienteId', 'nombre apellido email estado')
      .populate('citaId', 'fecha hora')
      .sort({ creadoEn: -1 });
    res.json(reportes);
  } catch (err) { res.status(500).json({ mensaje: err.message }); }
};

const resolver = async (req, res) => {
  try {
    const { accionTomada } = req.body;
    const reporte = await ReporteCliente.findByIdAndUpdate(
      req.params.id, { estado: 'resuelto', accionTomada }, { new: true }
    ).populate('clienteId', 'nombre apellido estado');

    if (accionTomada === 'advertencia') {
      await Usuario.findByIdAndUpdate(reporte.clienteId._id, { estado: 'advertido' });
    } else if (accionTomada === 'bloqueo') {
      await Usuario.findByIdAndUpdate(reporte.clienteId._id, { estado: 'bloqueado' });
    }

    res.json(reporte);
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

const listarPorCliente = async (req, res) => {
  try {
    const reportes = await ReporteCliente.find({ clienteId: req.params.clienteId })
      .populate('estilistaId', 'nombre apellido')
      .populate('citaId', 'fecha hora')
      .sort({ creadoEn: -1 });
    res.json(reportes);
  } catch (err) { res.status(500).json({ mensaje: err.message }); }
};

module.exports = { crear, listarPendientes, listarTodos, resolver, listarPorCliente };
