const mongoose = require('mongoose');
const { RAZONES_BLOQUEO } = require('../utils/catalogos');

const bloqueoSchema = new mongoose.Schema({
  estilistaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', default: null },
  fechaInicio: { type: Date, required: true },
  fechaFin: { type: Date, required: true },
  razon: { type: String, enum: RAZONES_BLOQUEO },
  detalleRazon: { type: String, trim: true },
  cierreTotalSalon: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bloqueo', bloqueoSchema);
