const mongoose = require('mongoose');

const calificacionSchema = new mongoose.Schema({
  citaId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Cita', required: true, unique: true },
  clienteId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  estilistaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  estrellas:   { type: Number, required: true, min: 1, max: 5 },
  comentario:  { type: String, maxlength: 500 },
  fecha:       { type: Date, default: Date.now }
});

module.exports = mongoose.model('Calificacion', calificacionSchema);
