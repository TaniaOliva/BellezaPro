const mongoose = require('mongoose');

const citaSchema = new mongoose.Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  estilistaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  servicioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Servicio', required: true },
  fecha: { type: Date, required: true },
  hora: { type: String, required: true },
  estado: { type: String, default: 'confirmada', enum: ['pendiente', 'confirmada', 'en_progreso', 'completada', 'cancelada'] },
  notas: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cita', citaSchema);
