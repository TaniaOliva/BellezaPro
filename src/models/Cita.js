const mongoose = require('mongoose');

const citaSchema = new mongoose.Schema({
  clienteId:         { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  estilistaId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  servicioId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Servicio', required: true },
  variantesElegidas: { type: Object },
  fecha:             { type: Date, required: true },
  hora:              { type: String, required: true },
  duracion:          { type: Number, required: true },
  estado:            { type: String, default: 'pendiente', enum: ['pendiente', 'confirmada', 'en_progreso', 'completada', 'cancelada'] },
  precioFinal:       { type: Number },
  notas:             { type: String },
  creadoEn:          { type: Date, default: Date.now }
});

citaSchema.index({ estilistaId: 1, fecha: 1 });

module.exports = mongoose.model('Cita', citaSchema);
