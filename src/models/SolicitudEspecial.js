const mongoose = require('mongoose');

const solicitudEspecialSchema = new mongoose.Schema({
  clienteId:          { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  categoria:          { type: String, required: true },
  descripcion:        { type: String, required: true, minlength: 10 },
  imagenUrl:          { type: String },
  presupuesto:        { type: String },
  estilistaPreferida: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  estado:             { type: String, default: 'pendiente', enum: ['pendiente', 'aprobada', 'rechazada'] },
  respuesta:          { type: String },
  precioEstimado:     { type: Number },
  duracionEstimada:   { type: Number },
  creadoEn:           { type: Date, default: Date.now }
});

module.exports = mongoose.model('SolicitudEspecial', solicitudEspecialSchema);
