const Bloqueo = require('../models/Bloqueo');

const crear = async (req, res) => {
  try {
    const bloqueo = await Bloqueo.create({ ...req.body, creadoPor: req.usuario.id });
    res.status(201).json(bloqueo);
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

const listarPorEstilista = async (req, res) => {
  try {
    const bloqueos = await Bloqueo.find({ estilistaId: req.params.estilistaId })
      .sort({ fechaInicio: 1 });
    res.json(bloqueos);
  } catch (err) { res.status(500).json({ mensaje: err.message }); }
};

const eliminar = async (req, res) => {
  try {
    await Bloqueo.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Bloqueo eliminado' });
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

module.exports = { crear, listarPorEstilista, eliminar };
