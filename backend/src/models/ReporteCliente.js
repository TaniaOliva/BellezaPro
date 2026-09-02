const mongoose = require('mongoose');

const reporteClienteSchema = new mongoose.Schema({
  estilistaId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  clienteId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  citaId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Cita' },
  motivo:       { type: String, required: true, trim: true },
  descripcion:  { type: String, required: true, trim: true },
  estado:       { type: String, enum: ['en_revision', 'resuelto'], default: 'en_revision' },
  accionTomada: { type: String, trim: true },
  creadoEn:     { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReporteCliente', reporteClienteSchema);
