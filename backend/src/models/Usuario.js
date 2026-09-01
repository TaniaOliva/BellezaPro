const mongoose = require('mongoose');
const { EMAIL_REGEX } = require('../utils/validadores');

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  email: {
    type: String, required: true, unique: true, trim: true,
    match: [EMAIL_REGEX, 'El correo electronico no es valido']
  },
  password: { type: String, required: true },
  telefono: { type: String },
  rol: { type: String, enum: ['cliente', 'estilista', 'admin'], default: 'cliente' },
  especialidades: [String],
  horarioDisponible: {
    lunes: { inicio: String, fin: String },
    martes: { inicio: String, fin: String },
    miercoles: { inicio: String, fin: String },
    jueves: { inicio: String, fin: String },
    viernes: { inicio: String, fin: String },
    sabado: { inicio: String, fin: String }
  },
  estado: { type: String, enum: ['activo', 'inactivo', 'suspendido', 'bloqueado'], default: 'activo' },
  suspensionFin: { type: Date, default: null },
  calificacionPromedio: { type: Number, default: 0 },
  totalCalificaciones: { type: Number, default: 0 },
  codigoRecuperacion: { type: String },
  codigoExpira: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Usuario', usuarioSchema);
