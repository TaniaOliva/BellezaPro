const mongoose = require('mongoose');

const calificacionSchema = new mongoose.Schema({
  citaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cita', required: true },
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  estilistaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  puntuacion: { type: Number, min: 1, max: 5, required: true },
  comentario: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now }
});

// Promedio/listado por estilista; una sola calificación por cita.
calificacionSchema.index({ estilistaId: 1 });
calificacionSchema.index({ citaId: 1 }, { unique: true });

module.exports = mongoose.model('Calificacion', calificacionSchema);
