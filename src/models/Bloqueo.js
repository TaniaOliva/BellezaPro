const mongoose = require('mongoose');

const bloqueoSchema = new mongoose.Schema({
  estilistaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  fechaInicio: { type: Date, required: true },
  fechaFin:    { type: Date, required: true },
  motivo:      { type: String, required: true },
  creadoPor:   { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }
});

module.exports = mongoose.model('Bloqueo', bloqueoSchema);
