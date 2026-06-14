const SolicitudEspecial = require('../models/SolicitudEspecial');

const crear = async (req, res) => {
  try {
    const solicitud = await SolicitudEspecial.create({ ...req.body, clienteId: req.usuario.id });
    res.status(201).json(solicitud);
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

const listarPorCliente = async (req, res) => {
  try {
    const solicitudes = await SolicitudEspecial.find({ clienteId: req.usuario.id })
      .sort({ creadoEn: -1 });
    res.json(solicitudes);
  } catch (err) { res.status(500).json({ mensaje: err.message }); }
};

const listarPendientes = async (req, res) => {
  try {
    const solicitudes = await SolicitudEspecial.find({ estado: 'pendiente' })
      .populate('clienteId', 'nombre apellido email')
      .populate('estilistaPreferida', 'nombre apellido')
      .sort({ creadoEn: -1 });
    res.json(solicitudes);
  } catch (err) { res.status(500).json({ mensaje: err.message }); }
};

const listarTodas = async (req, res) => {
  try {
    const solicitudes = await SolicitudEspecial.find()
      .populate('clienteId', 'nombre apellido email')
      .sort({ creadoEn: -1 });
    res.json(solicitudes);
  } catch (err) { res.status(500).json({ mensaje: err.message }); }
};

const responder = async (req, res) => {
  try {
    const { estado, respuesta, precioEstimado, duracionEstimada } = req.body;
    if (estado === 'aprobada' && (precioEstimado == null || duracionEstimada == null))
      return res.status(400).json({ mensaje: 'Precio y duracion son obligatorios al aprobar' });
    const solicitud = await SolicitudEspecial.findByIdAndUpdate(
      req.params.id, { estado, respuesta, precioEstimado, duracionEstimada }, { new: true }
    );
    res.json(solicitud);
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

module.exports = { crear, listarPorCliente, listarPendientes, listarTodas, responder };
