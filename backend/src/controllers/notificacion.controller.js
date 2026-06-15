const Notificacion = require('../models/Notificacion');

const listar = async (req, res) => {
  try {
    const notificaciones = await Notificacion.find({ usuarioId: req.usuario.id })
      .sort({ creadoEn: -1 })
      .limit(50);
    res.json(notificaciones);
  } catch (err) { res.status(500).json({ mensaje: err.message }); }
};

const marcarLeida = async (req, res) => {
  try {
    const notif = await Notificacion.findOneAndUpdate(
      { _id: req.params.id, usuarioId: req.usuario.id },
      { leida: true },
      { new: true }
    );
    if (!notif) return res.status(404).json({ mensaje: 'Notificacion no encontrada' });
    res.json(notif);
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

const marcarTodas = async (req, res) => {
  try {
    await Notificacion.updateMany({ usuarioId: req.usuario.id, leida: false }, { leida: true });
    res.json({ mensaje: 'Todas marcadas como leidas' });
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

const marcarPorTipo = async (req, res) => {
  try {
    await Notificacion.updateMany({ usuarioId: req.usuario.id, tipo: req.params.tipo, leida: false }, { leida: true });
    res.json({ mensaje: 'ok' });
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

const crearNotificacion = async (usuarioId, titulo, descripcion, tipo = 'sistema', icono = 'notifications', referencia = null) => {
  try {
    const doc = { usuarioId, titulo, descripcion, tipo, icono };
    if (referencia) doc.referencia = referencia;
    await Notificacion.create(doc);
  } catch (_) {}
};

module.exports = { listar, marcarLeida, marcarTodas, marcarPorTipo, crearNotificacion };
