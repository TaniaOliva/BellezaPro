const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const registrar = async (req, res) => {
  try {
    const { nombre, apellido, email, password, telefono } = req.body;
    const existe = await Usuario.findOne({ email });
    if (existe) return res.status(400).json({ mensaje: 'El correo ya esta registrado' });
    const hash = await bcrypt.hash(password, 10);
    const usuario = await Usuario.create({ nombre, apellido, email, password: hash, telefono, rol: 'cliente' });
    const token = jwt.sign({ id: usuario._id, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, usuario: { id: usuario._id, nombre, apellido, email, rol: usuario.rol } });
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(400).json({ mensaje: 'Credenciales incorrectas' });
    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido) return res.status(400).json({ mensaje: 'Credenciales incorrectas' });
    if (usuario.estado === 'bloqueado') return res.status(403).json({ mensaje: 'Cuenta bloqueada' });
    const token = jwt.sign({ id: usuario._id, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, usuario: { id: usuario._id, nombre: usuario.nombre, apellido: usuario.apellido, email, rol: usuario.rol } });
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
};

module.exports = { registrar, login };
