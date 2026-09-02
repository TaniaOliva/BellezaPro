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

// Reportes por cliente, por estilista y filtro por estado (pendientes).
reporteClienteSchema.index({ clienteId: 1 });
reporteClienteSchema.index({ estilistaId: 1 });
reporteClienteSchema.index({ estado: 1 });

module.exports = mongoose.model('ReporteCliente', reporteClienteSchema);
