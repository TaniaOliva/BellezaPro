const Calificacion = require('../models/Calificacion');
const Cita = require('../models/Cita');
const Usuario = require('../models/Usuario');

const crear = async (req, res) => {
  try {
    const { citaId, puntuacion, comentario } = req.body;
    if (!puntuacion || puntuacion < 1 || puntuacion > 5) return res.status(400).json({ mensaje: 'Puntuación inválida (1-5)' });
    const cita = await Cita.findById(citaId);
    if (!cita) return res.status(404).json({ mensaje: 'Cita no encontrada' });
    if (cita.estado !== 'terminada') return res.status(400).json({ mensaje: 'Solo se puede calificar una cita terminada' });
    if (String(cita.clienteId) !== req.usuario.id) return res.status(403).json({ mensaje: 'No autorizado' });
    const existe = await Calificacion.findOne({ citaId });
    if (existe) return res.status(400).json({ mensaje: 'Esta cita ya fue calificada' });
    const cal = await Calificacion.create({
      citaId, clienteId: req.usuario.id,
      estilistaId: cita.estilistaId, puntuacion, comentario
    });

    const stats = await Calificacion.aggregate([
      { $match: { estilistaId: cal.estilistaId } },
      { $group: { _id: null, promedio: { $avg: '$puntuacion' }, total: { $sum: 1 } } }
    ]);
    if (stats.length > 0) {
      await Usuario.findByIdAndUpdate(cita.estilistaId, {
        calificacionPromedio: Math.round(stats[0].promedio * 10) / 10,
        totalCalificaciones: stats[0].total
      });
    }

    res.status(201).json(cal);
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

const promedioEstilista = async (req, res) => {
  try {
    const result = await Calificacion.aggregate([
      { $match: { estilistaId: require('mongoose').Types.ObjectId.createFromHexString(req.params.estilistaId) } },
      { $group: { _id: null, promedio: { $avg: '$puntuacion' }, total: { $sum: 1 } } }
    ]);
    res.json(result[0] || { promedio: 0, total: 0 });
  } catch (err) { res.status(500).json({ mensaje: err.message }); }
};

const listarPorEstilista = async (req, res) => {
  try {
    const cals = await Calificacion.find({ estilistaId: req.params.estilistaId })
      .populate('clienteId', 'nombre apellido')
      .sort({ createdAt: -1 });
    res.json(cals);
  } catch (err) { res.status(500).json({ mensaje: err.message }); }
};

module.exports = { crear, promedioEstilista, listarPorEstilista };
