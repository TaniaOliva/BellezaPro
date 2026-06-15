const mongoose = require('mongoose');

const solicitudEspecialSchema = new mongoose.Schema({
  clienteId:             { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  categoria:             { type: String, required: true },
  descripcion:           { type: String, required: true },
  imagenUrl:             { type: String },
  presupuesto:           { type: String },
  estilistaPreferida:    { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  // Estados: pendiente → propuesta (admin) → contraoferta (cliente) → aceptada / rechazada / cancelada
  estado: {
    type: String,
    enum: ['pendiente', 'propuesta', 'contraoferta', 'aceptada', 'rechazada', 'cancelada'],
    default: 'pendiente'
  },
  respuesta:             { type: String },
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
  mensajeContraoferta:   { type: String },
  creadoEn:              { type: Date, default: Date.now }
});

module.exports = mongoose.model('SolicitudEspecial', solicitudEspecialSchema);
