const mongoose = require('mongoose');

const solicitudEspecialSchema = new mongoose.Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  tipo: { type: String, required: true },
  descripcion: { type: String, required: true },
  estado: { type: String, enum: ['pendiente', 'en_revision', 'aprobada', 'rechazada'], default: 'pendiente' },
  respuesta: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SolicitudEspecial', solicitudEspecialSchema);
