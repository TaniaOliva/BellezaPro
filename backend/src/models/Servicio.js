const mongoose = require('mongoose');

const servicioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  descripcion: { type: String, trim: true },
  categoria: { type: String, required: true, trim: true },
  precioBase: { type: Number, required: true },
  duracion: { type: Number, required: true },
  variantes: [{
    tipo:        { type: String, required: true, trim: true },
    nombre:      { type: String, required: true, trim: true },
    precioExtra: { type: Number, default: 0 },
    descripcion: { type: String, default: '', trim: true }
  }],
  imagenes: [{ type: String }],
  activo: { type: Boolean, default: true },
  contadorSemana: { type: Number, default: 0 },
  semanaInicio: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

// Catálogo público: servicios activos por categoría.
servicioSchema.index({ activo: 1, categoria: 1 });

module.exports = mongoose.model('Servicio', servicioSchema);
