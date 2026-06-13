const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Usuario = require('../models/Usuario');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const registrar = async (req, res) => {
  try {
    const { nombre, apellido, email, password, telefono } = req.body;
    const existe = await Usuario.findOne({ email });
    if (existe) return res.status(400).json({ mensaje: 'El correo ya esta registrado' });
    const hash = await bcrypt.hash(password, 10);
    const usuario = await Usuario.create({ nombre, apellido, email, password: hash, telefono, rol: 'cliente' });
    const token = jwt.sign({ id: usuario._id, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, usuario: { id: usuario._id, nombre, apellido, email, rol: usuario.rol, calificacionPromedio: 0 } });
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
    res.json({ token, usuario: { id: usuario._id, nombre: usuario.nombre, apellido: usuario.apellido, email, rol: usuario.rol, calificacionPromedio: usuario.calificacionPromedio } });
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
};

const solicitarRecuperacion = async (req, res) => {
  try {
    const { email } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(404).json({ mensaje: 'No existe una cuenta con ese correo' });

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    const expira = new Date(Date.now() + 15 * 60 * 1000);

    await Usuario.findByIdAndUpdate(usuario._id, { codigoRecuperacion: codigo, codigoExpira: expira });

    await transporter.sendMail({
      from: `"BellezaPro" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Codigo de recuperacion de contrasena',
      html: `
        <div style="font-family: sans-serif; max-width: 400px; margin: auto;">
          <h2 style="color: #7c3aed;">BellezaPro</h2>
          <p>Tu codigo de verificacion es:</p>
          <h1 style="letter-spacing: 8px; color: #7c3aed;">${codigo}</h1>
          <p style="color: #666;">Este codigo expira en 15 minutos.</p>
        </div>
      `
    });

    res.json({ mensaje: 'Codigo enviado al correo' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al enviar el correo: ' + err.message });
  }
};

const verificarCodigo = async (req, res) => {
  try {
    const { email, codigo } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(404).json({ mensaje: 'Correo no encontrado' });
    if (!usuario.codigoRecuperacion || usuario.codigoRecuperacion !== codigo)
      return res.status(400).json({ mensaje: 'Codigo incorrecto' });
    if (new Date() > usuario.codigoExpira)
      return res.status(400).json({ mensaje: 'El codigo ha expirado' });
    res.json({ mensaje: 'Codigo correcto' });
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
};

const nuevaPassword = async (req, res) => {
  try {
    const { email, codigo, password } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(404).json({ mensaje: 'Correo no encontrado' });
    if (!usuario.codigoRecuperacion || usuario.codigoRecuperacion !== codigo)
      return res.status(400).json({ mensaje: 'Codigo invalido' });
    if (new Date() > usuario.codigoExpira)
      return res.status(400).json({ mensaje: 'El codigo ha expirado' });
    const hash = await bcrypt.hash(password, 10);
    await Usuario.findByIdAndUpdate(usuario._id, {
      password: hash,
      codigoRecuperacion: null,
      codigoExpira: null
    });
    res.json({ mensaje: 'Contrasena actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
};

const setupAdmin = async (req, res) => {
  try {
    const existe = await Usuario.findOne({ rol: 'admin' });
    if (existe) return res.status(403).json({ mensaje: 'Ya existe un administrador registrado.' });
    const hash = await bcrypt.hash('Admin123!', 10);
    const admin = await Usuario.create({
      nombre: 'Admin', apellido: 'BellezaPro',
      email: 'admin@bellezapro.com', password: hash,
      rol: 'admin', estado: 'activo'
    });
    const token = jwt.sign({ id: admin._id, rol: admin.rol }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      mensaje: 'Administrador creado exitosamente.',
      credenciales: { email: 'admin@bellezapro.com', password: 'Admin123!' },
      token,
      usuario: { id: admin._id, nombre: admin.nombre, apellido: admin.apellido, email: admin.email, rol: admin.rol }
    });
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
};

module.exports = { registrar, login, solicitarRecuperacion, verificarCodigo, nuevaPassword, setupAdmin };
