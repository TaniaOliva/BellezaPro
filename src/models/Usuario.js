const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre:   { type: String, required: true, trim: true },
  apellido: { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  rol:      { type: String, required: true, enum: ['admin', 'estilista', 'cliente'] },
  telefono: { type: String },
  estado:   { type: String, default: 'activo', enum: ['activo', 'advertido', 'bloqueado'] },
  creadoEn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Usuario', usuarioSchema);
