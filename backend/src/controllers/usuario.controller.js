const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

const listarEstilistas = async (req, res) => {
  try {
    const estilistas = await Usuario.find({ rol: 'estilista', estado: 'activo' })
      .select('nombre apellido email telefono estado especialidades calificacionPromedio');
    res.json(estilistas);
  } catch (err) { res.status(500).json({ mensaje: err.message }); }
};

const listarTodosEstilistas = async (req, res) => {
  try {
    const estilistas = await Usuario.find({ rol: 'estilista' })
      .select('nombre apellido email telefono estado especialidades calificacionPromedio createdAt');
    res.json(estilistas);
  } catch (err) { res.status(500).json({ mensaje: err.message }); }
};

const listarClientes = async (req, res) => {
  try {
    // Auto-reactivar suspensiones definidas que ya vencieron
    await Usuario.updateMany(
      { rol: 'cliente', estado: 'suspendido', suspensionFin: { $lte: new Date(), $ne: null } },
      { $set: { estado: 'activo', suspensionFin: null } }
    );
    const clientes = await Usuario.find({ rol: 'cliente' })
      .select('nombre apellido email telefono estado suspensionFin createdAt');
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
    const { nombre, apellido, telefono, especialidades, horarioDisponible } = req.body;
    const campos = {};
    if (nombre !== undefined) campos.nombre = nombre;
    if (apellido !== undefined) campos.apellido = apellido;
    if (telefono !== undefined) campos.telefono = telefono;
    if (especialidades !== undefined) campos.especialidades = especialidades;
    if (horarioDisponible !== undefined) campos.horarioDisponible = horarioDisponible;
    const usuario = await Usuario.findByIdAndUpdate(
      req.usuario.id, campos, { new: true }
    ).select('-password');
    res.json(usuario);
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

const cambiarPassword = async (req, res) => {
  try {
    const { passwordActual, passwordNueva } = req.body;
    const usuario = await Usuario.findById(req.usuario.id);
    const valido = await bcrypt.compare(passwordActual, usuario.password);
    if (!valido) return res.status(400).json({ mensaje: 'Contrasena actual incorrecta' });
    usuario.password = await bcrypt.hash(passwordNueva, 10);
    await usuario.save();
    res.json({ mensaje: 'Contrasena actualizada' });
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

const actualizarEstado = async (req, res) => {
  try {
    const { estado, suspensionFin } = req.body;
    const update = { estado };
    if (estado === 'suspendido') {
      update.suspensionFin = suspensionFin ? new Date(suspensionFin) : null;
    } else {
      update.suspensionFin = null;
    }
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id, update, { new: true }
    ).select('-password');
    res.json(usuario);
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

const crearEmpleado = async (req, res) => {
  try {
    const { nombre, apellido, email, telefono, especialidades } = req.body;
    const existe = await Usuario.findOne({ email });
    if (existe) return res.status(400).json({ mensaje: 'El correo ya esta registrado' });
    const hash = await bcrypt.hash('12345678', 10);
    const usuario = await Usuario.create({
      nombre, apellido, email, telefono,
      especialidades: especialidades ?? [],
      password: hash, rol: 'estilista'
    });
    const obj = usuario.toObject();
    delete obj.password;
    res.status(201).json(obj);
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

const actualizarEmpleado = async (req, res) => {
  try {
    const { nombre, apellido, email, telefono, especialidades, estado } = req.body;
    const campos = {};
    if (nombre !== undefined) campos.nombre = nombre;
    if (apellido !== undefined) campos.apellido = apellido;
    if (email !== undefined) {
      const existe = await Usuario.findOne({ email, _id: { $ne: req.params.id } });
      if (existe) return res.status(400).json({ mensaje: 'El correo ya esta en uso' });
      campos.email = email;
    }
    if (telefono !== undefined) campos.telefono = telefono;
    if (especialidades !== undefined) campos.especialidades = especialidades;
    if (estado !== undefined) campos.estado = estado;

    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id, campos, { new: true }
    ).select('-password');
    if (!usuario) return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    res.json(usuario);
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

const eliminarEmpleado = async (req, res) => {
  try {
    const usuario = await Usuario.findOneAndDelete({ _id: req.params.id, rol: 'estilista' });
    if (!usuario) return res.status(404).json({ mensaje: 'Estilista no encontrado' });
    res.json({ mensaje: 'Estilista eliminado' });
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

module.exports = {
  listarEstilistas,
  listarTodosEstilistas,
  listarClientes,
  obtenerPerfil,
  actualizarPerfil,
  cambiarPassword,
  actualizarEstado,
  crearEmpleado,
  actualizarEmpleado,
  eliminarEmpleado
};
