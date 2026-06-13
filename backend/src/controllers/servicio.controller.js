const Servicio  = require('../models/Servicio');
const Categoria = require('../models/Categoria');

const listar = async (req, res) => {
  try {
    const categoriasActivas = await Categoria.find({ activo: true }).distinct('nombre');
    const filtro = { activo: true, categoria: { $in: categoriasActivas } };
    const servicios = await Servicio.find(filtro).sort({ nombre: 1 });
    res.json(servicios);
  } catch (err) { res.status(500).json({ mensaje: err.message }); }
};

const listarAdmin = async (req, res) => {
  try {
    const servicios = await Servicio.find({}).sort({ categoria: 1, nombre: 1 });
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

const listarPopulares = async (req, res) => {
  try {
    const categoriasActivas = await Categoria.find({ activo: true }).distinct('nombre');
    const hace7Dias = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    await Servicio.updateMany(
      { semanaInicio: { $lt: hace7Dias } },
      { $set: { contadorSemana: 0, semanaInicio: new Date() } }
    );
    const populares = await Servicio.find({ activo: true, categoria: { $in: categoriasActivas } })
      .sort({ contadorSemana: -1 })
      .limit(4);
    res.json(populares);
  } catch (err) { res.status(500).json({ mensaje: err.message }); }
};

module.exports = { listar, listarAdmin, obtener, crear, actualizar, listarPopulares };
