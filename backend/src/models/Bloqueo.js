const mongoose = require('mongoose');

const bloqueoSchema = new mongoose.Schema({
  estilistaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', default: null },
  fechaInicio: { type: Date, required: true },
  fechaFin: { type: Date, required: true },
  razon: String,
  cierreTotalSalon: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bloqueo', bloqueoSchema);
