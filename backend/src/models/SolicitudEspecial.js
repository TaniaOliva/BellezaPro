const mongoose = require('mongoose');

const solicitudEspecialSchema = new mongoose.Schema({
  clienteId:         { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  categoria:         { type: String, required: true },
  descripcion:       { type: String, required: true },
  imagenUrl:         { type: String },
  presupuesto:       { type: String },
  estilistaPreferida:{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  estado:            { type: String, enum: ['pendiente', 'aprobada', 'rechazada'], default: 'pendiente' },
  respuesta:         { type: String },
  precioEstimado:    { type: Number },
  duracionEstimada:  { type: Number },
  creadoEn:          { type: Date, default: Date.now }
});

module.exports = mongoose.model('SolicitudEspecial', solicitudEspecialSchema);
