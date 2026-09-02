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

// Solapamiento de rango, con y sin filtro por estilista.
bloqueoSchema.index({ estilistaId: 1, fechaInicio: 1, fechaFin: 1 });
bloqueoSchema.index({ fechaInicio: 1, fechaFin: 1 });

module.exports = mongoose.model('Bloqueo', bloqueoSchema);
