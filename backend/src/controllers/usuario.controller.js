const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

const listarEstilistas = async (req, res) => {
  try {
    const estilistas = await Usuario.find({ rol: 'estilista', estado: 'activo' })
      .select('nombre apellido email telefono estado');
    res.json(estilistas);
  } catch (err) { res.status(500).json({ mensaje: err.message }); }
};

const listarClientes = async (req, res) => {
  try {
    const clientes = await Usuario.find({ rol: 'cliente' })
      .select('nombre apellido email telefono estado creadoEn');
    res.json(clientes);
  } catch (err) { res.status(500).json({ mensaje: err.message }); }
};

const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select('-password');
    res.json(usuario);
  } catch (err) { res.status(500).json({ mensaje: err.message }); }
};

const actualizarPerfil = async (req, res) => {
  try {
    const { nombre, apellido, telefono } = req.body;
    const usuario = await Usuario.findByIdAndUpdate(
      req.usuario.id, { nombre, apellido, telefono }, { new: true }
    ).select('-password');
    res.json(usuario);
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

const cambiarPassword = async (req, res) => {
  try {
    const { passwordActual, passwordNueva } = req.body;
    const usuario = await Usuario.findById(req.usuario.id);
    const valido = await require('bcryptjs').compare(passwordActual, usuario.password);
    if (!valido) return res.status(400).json({ mensaje: 'Contrasena actual incorrecta' });
    usuario.password = await require('bcryptjs').hash(passwordNueva, 10);
    await usuario.save();
    res.json({ mensaje: 'Contrasena actualizada' });
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

const actualizarEstado = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id, { estado: req.body.estado }, { new: true }
    ).select('-password');
    res.json(usuario);
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

const crearEmpleado = async (req, res) => {
  try {
    const { nombre, apellido, email, telefono } = req.body;
    const existe = await Usuario.findOne({ email });
    if (existe) return res.status(400).json({ mensaje: 'El correo ya esta registrado' });
    const hash = await require('bcryptjs').hash('bellezapro2025', 10);
    const usuario = await Usuario.create({
      nombre, apellido, email, telefono,
      password: hash, rol: 'estilista'
    });
    res.status(201).json({ ...usuario.toObject(), password: undefined });
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

module.exports = { listarEstilistas, listarClientes, obtenerPerfil, actualizarPerfil, cambiarPassword, actualizarEstado, crearEmpleado };
