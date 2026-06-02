const Calificacion = require('../models/Calificacion');
const Cita = require('../models/Cita');

const crear = async (req, res) => {
  try {
    const { citaId, estrellas, comentario } = req.body;
    const cita = await Cita.findById(citaId);
    if (!cita) return res.status(404).json({ mensaje: 'Cita no encontrada' });
    if (cita.estado !== 'completada') return res.status(400).json({ mensaje: 'Solo se puede calificar una cita completada' });
    if (String(cita.clienteId) !== req.usuario.id) return res.status(403).json({ mensaje: 'No autorizado' });
    const existe = await Calificacion.findOne({ citaId });
    if (existe) return res.status(400).json({ mensaje: 'Esta cita ya fue calificada' });
    const cal = await Calificacion.create({
      citaId, clienteId: req.usuario.id,
      estilistaId: cita.estilistaId, estrellas, comentario
    });
    res.status(201).json(cal);
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

const promedioEstilista = async (req, res) => {
  try {
    const result = await Calificacion.aggregate([
      { $match: { estilistaId: require('mongoose').Types.ObjectId.createFromHexString(req.params.estilistaId) } },
      { $group: { _id: null, promedio: { $avg: '$estrellas' }, total: { $sum: 1 } } }
    ]);
    res.json(result[0] || { promedio: 0, total: 0 });
  } catch (err) { res.status(500).json({ mensaje: err.message }); }
};

const listarPorEstilista = async (req, res) => {
  try {
    const cals = await Calificacion.find({ estilistaId: req.params.estilistaId })
      .populate('clienteId', 'nombre apellido')
      .sort({ fecha: -1 });
    res.json(cals);
  } catch (err) { res.status(500).json({ mensaje: err.message }); }
};

module.exports = { crear, promedioEstilista, listarPorEstilista };
