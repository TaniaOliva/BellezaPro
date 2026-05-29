const mongoose = require('mongoose');

const reporteClienteSchema = new mongoose.Schema({
  estilistaId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  clienteId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  citaId:          { type: mongoose.Schema.Types.ObjectId, ref: 'Cita', required: true },
  motivo:          { type: String, required: true, enum: ['inasistencia', 'cancelacion_repetida', 'mal_comportamiento', 'pago', 'otro'] },
  descripcion:     { type: String, required: true, minlength: 20 },
  fechaIncidente:  { type: Date, required: true },
  estado:          { type: String, default: 'en_revision', enum: ['en_revision', 'resuelto'] },
  accionTomada:    { type: String, enum: ['advertencia', 'bloqueo'] },
  creadoEn:        { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReporteCliente', reporteClienteSchema);
