const mongoose = require('mongoose');

const citaSchema = new mongoose.Schema({
  clienteId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario',          required: true },
  estilistaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario',          required: true },
  servicioId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Servicio',         required: false },
  solicitudId: { type: mongoose.Schema.Types.ObjectId, ref: 'SolicitudEspecial', required: false },
  fecha:       { type: Date,   required: true },
  hora:        { type: String, required: true },
  duracion:    { type: Number, default: 60 },
  precioFinal: { type: Number },
  estado:           { type: String, default: 'confirmada', enum: ['confirmada', 'cancelada', 'terminada'] },
  notas:              { type: String },
  motivoCancelacion:  { type: String },
  valoracionEstilista: { type: Number, min: 1, max: 5 },
  comentarioEstilista: { type: String },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cita', citaSchema);
