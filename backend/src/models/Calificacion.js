const mongoose = require('mongoose');

const calificacionSchema = new mongoose.Schema({
  citaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cita', required: true },
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  estilistaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  puntuacion: { type: Number, min: 1, max: 5, required: true },
  comentario: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Calificacion', calificacionSchema);
