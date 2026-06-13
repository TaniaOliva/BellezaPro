const mongoose = require('mongoose');

const servicioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  categoria: { type: String, required: true },
  precioBase: { type: Number, required: true },
  duracion: { type: Number, required: true },
  variantes: [{
    tipo:        { type: String, required: true },
    nombre:      { type: String, required: true },
    precioExtra: { type: Number, default: 0 },
    descripcion: { type: String, default: '' }
  }],
  activo: { type: Boolean, default: true },
  contadorSemana: { type: Number, default: 0 },
  semanaInicio: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Servicio', servicioSchema);
