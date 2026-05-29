const mongoose = require('mongoose');

const varianteSchema = new mongoose.Schema({
  tipo:       { type: String },
  nombre:     { type: String },
  precioExtra: { type: Number, default: 0 }
}, { _id: false });

const servicioSchema = new mongoose.Schema({
  nombre:      { type: String, required: true, trim: true },
  descripcion: { type: String },
  categoria:   { type: String, required: true, enum: ['Manicure', 'Pedicure', 'Cortes', 'Tintes', 'Maquillaje'] },
  precioBase:  { type: Number, required: true, min: 0 },
  duracion:    { type: Number, required: true, min: 15 },
  imagen:      { type: String },
  activo:      { type: Boolean, default: true },
  variantes:   [varianteSchema]
});

module.exports = mongoose.model('Servicio', servicioSchema);
