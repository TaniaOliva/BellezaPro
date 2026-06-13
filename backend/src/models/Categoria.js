const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  nombre:    { type: String, required: true, unique: true, trim: true },
  activo:    { type: Boolean, default: true },
  createdAt: { type: Date,   default: Date.now },
});

module.exports = mongoose.model('Categoria', categoriaSchema);
