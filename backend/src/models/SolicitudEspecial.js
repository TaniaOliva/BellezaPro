const mongoose = require('mongoose');

const solicitudEspecialSchema = new mongoose.Schema({
  clienteId:             { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  categoria:             { type: String, required: true, trim: true },
  descripcion:           { type: String, required: true, trim: true },
  imagenUrl:             { type: String, trim: true },
  presupuesto:           { type: Number },
  estilistaPreferida:    { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  // Estados: pendiente → propuesta (admin) → contraoferta (cliente) → aceptada / rechazada / cancelada
  estado: {
    type: String,
    enum: ['pendiente', 'propuesta', 'contraoferta', 'aceptada', 'rechazada', 'cancelada'],
    default: 'pendiente'
  },
  respuesta:             { type: String, trim: true },
  precioEstimado:        { type: Number },
  duracionEstimada:      { type: Number },
  // Propuesta del admin
  fechaPropuesta:        { type: String },
  horaPropuesta:         { type: String },
  estilistaAsignada:     { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  // Fecha sugerida por el cliente al crear
  fechaSugerida:         { type: String },
  horaSugerida:          { type: String },
  // Contraoferta del cliente
  fechaContraoferta:     { type: String },
  horaContraoferta:      { type: String },
  estilistaContraoferta: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  mensajeContraoferta:   { type: String, trim: true },
  creadoEn:              { type: Date, default: Date.now }
});

// Solicitudes por cliente y filtro por estado (pendientes / contraoferta).
solicitudEspecialSchema.index({ clienteId: 1 });
solicitudEspecialSchema.index({ estado: 1 });

module.exports = mongoose.model('SolicitudEspecial', solicitudEspecialSchema);
