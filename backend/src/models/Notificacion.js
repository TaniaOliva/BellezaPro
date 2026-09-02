const mongoose = require('mongoose');

const notificacionSchema = new mongoose.Schema({
  usuarioId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  titulo:      { type: String, required: true, trim: true },
  descripcion: { type: String, trim: true },
  tipo:        { type: String, enum: ['cita', 'solicitud', 'sistema', 'calificacion'], default: 'sistema' },
  icono:       { type: String, default: 'notifications' },
  leida:       { type: Boolean, default: false },
  referencia:  { type: String },
  creadoEn:    { type: Date, default: Date.now }
});

// Bandeja del usuario: sus notificaciones ordenadas por fecha desc, con limit.
notificacionSchema.index({ usuarioId: 1, creadoEn: -1 });

module.exports = mongoose.model('Notificacion', notificacionSchema);
