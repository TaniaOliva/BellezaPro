const mongoose = require('mongoose');
const { MOTIVOS_CANCELACION } = require('../utils/catalogos');

const citaSchema = new mongoose.Schema({
  clienteId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario',          required: true },
  estilistaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario',          required: true },
  servicioId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Servicio',         required: false },
  solicitudId: { type: mongoose.Schema.Types.ObjectId, ref: 'SolicitudEspecial', required: false },
  fecha:       { type: Date,   required: true },
  hora:        { type: String, required: true, trim: true },
  duracion:    { type: Number, default: 60 },
  precioFinal: { type: Number },
  estado:           { type: String, default: 'confirmada', enum: ['confirmada', 'cancelada', 'no_asistio', 'terminada'] },
  notas:              { type: String, trim: true },
  motivoCancelacion:  { type: String, enum: MOTIVOS_CANCELACION },
  canceladoPor:       { type: String, enum: ['cliente', 'estilista', 'admin', 'sistema'] },
  canceladoEn:        { type: Date },
  detalleCancelacion: { type: String, trim: true },
  valoracionEstilista: { type: Number, min: 1, max: 5 },
  comentarioEstilista: { type: String, trim: true },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cita', citaSchema);
