const mongoose = require('mongoose');

const reporteClienteSchema = new mongoose.Schema({
  reportadoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  reportadorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  tipo: { type: String, required: true },
  descripcion: { type: String, required: true },
  estado: { type: String, enum: ['pendiente', 'en_revision', 'resuelta', 'desestimada'], default: 'pendiente' },
  resultado: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReporteCliente', reporteClienteSchema);
