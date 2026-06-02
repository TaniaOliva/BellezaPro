const Servicio = require('../models/Servicio');

const listar = async (req, res) => {
  try {
    const { categoria } = req.query;
    const filtro = { activo: true };
    if (categoria) filtro.categoria = categoria;
    const servicios = await Servicio.find(filtro);
    res.json(servicios);
  } catch (err) { res.status(500).json({ mensaje: err.message }); }
};

const obtener = async (req, res) => {
  try {
    const servicio = await Servicio.findById(req.params.id);
    if (!servicio) return res.status(404).json({ mensaje: 'Servicio no encontrado' });
    res.json(servicio);
  } catch (err) { res.status(500).json({ mensaje: err.message }); }
};

const crear = async (req, res) => {
  try {
    const servicio = await Servicio.create(req.body);
    res.status(201).json(servicio);
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

const actualizar = async (req, res) => {
  try {
    const servicio = await Servicio.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(servicio);
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

module.exports = { listar, obtener, crear, actualizar };
