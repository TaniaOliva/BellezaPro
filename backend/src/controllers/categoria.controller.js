const Categoria = require('../models/Categoria');
const Servicio  = require('../models/Servicio');

const listar = async (req, res) => {
  try {
    const categorias = await Categoria.find({ activo: true }).sort({ nombre: 1 });
    res.json(categorias);
  } catch (err) { res.status(500).json({ mensaje: err.message }); }
};

const listarAdmin = async (req, res) => {
  try {
    const categorias = await Categoria.find({}).sort({ activo: -1, nombre: 1 });
    res.json(categorias);
  } catch (err) { res.status(500).json({ mensaje: err.message }); }
};

const crear = async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre?.trim()) return res.status(400).json({ mensaje: 'El nombre es obligatorio' });
    const existe = await Categoria.findOne({ nombre: nombre.trim() });
    if (existe) return res.status(400).json({ mensaje: 'Ya existe una categoría con ese nombre' });
    const categoria = await Categoria.create({ nombre: nombre.trim() });
    res.status(201).json(categoria);
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

const actualizar = async (req, res) => {
  try {
    const categoria = await Categoria.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!categoria) return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    res.json(categoria);
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

const eliminar = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    await Servicio.deleteMany({ categoria: categoria.nombre });
    await Categoria.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Categoría y sus servicios eliminados' });
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

module.exports = { listar, listarAdmin, crear, actualizar, eliminar };
