const mongoose = require('mongoose');

const notificacionSchema = new mongoose.Schema({
  usuarioId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true, index: true },
  titulo:      { type: String, required: true },
  descripcion: { type: String },
  tipo:        { type: String, enum: ['cita', 'solicitud', 'sistema', 'calificacion'], default: 'sistema' },
  icono:       { type: String, default: 'notifications' },
  leida:       { type: Boolean, default: false },
  referencia:  { type: String },
  creadoEn:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notificacion', notificacionSchema);
