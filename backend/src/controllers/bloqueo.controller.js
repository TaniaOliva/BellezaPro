const Bloqueo = require('../models/Bloqueo');
const Cita = require('../models/Cita');
const { crearNotificacion } = require('./notificacion.controller');

const verificarSuperposicion = async (fechaInicio, fechaFin, cierreTotalSalon, estilistaId, excluirId = null) => {
  const ini = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  const rangoQuery = {
    fechaInicio: { $lte: fin },
    fechaFin: { $gte: ini }
  };
  if (excluirId) rangoQuery._id = { $ne: excluirId };

  if (cierreTotalSalon) {
    const existente = await Bloqueo.findOne(rangoQuery);
    if (!existente) return null;
    return existente.cierreTotalSalon
      ? 'Ya existe un cierre total del salón en ese rango de fechas.'
      : 'Existen bloqueos individuales en ese rango. Elimínalos antes de crear un cierre total.';
  } else {
    const existente = await Bloqueo.findOne({
      ...rangoQuery,
      $or: [{ cierreTotalSalon: true }, { estilistaId }]
    });
    if (!existente) return null;
    return existente.cierreTotalSalon
      ? 'Ese rango está cubierto por un cierre total del salón.'
      : 'Esa estilista ya tiene un bloqueo en ese rango de fechas.';
  }
};

const crear = async (req, res) => {
  try {
    const { cierreTotalSalon, estilistaId, fechaInicio, fechaFin, razon } = req.body;
    if (!cierreTotalSalon && !estilistaId) {
      return res.status(400).json({ mensaje: 'Se requiere estilistaId o cierreTotalSalon' });
    }
    const conflicto = await verificarSuperposicion(fechaInicio, fechaFin, cierreTotalSalon, estilistaId);
    if (conflicto) return res.status(409).json({ mensaje: conflicto });

    const bloqueo = await Bloqueo.create({
      estilistaId: cierreTotalSalon ? null : estilistaId,
      fechaInicio,
      fechaFin,
      razon,
      cierreTotalSalon: !!cierreTotalSalon
    });

    // Auto-cancelar citas que caen dentro del bloqueo
    const citasQuery = {
      fecha: { $gte: new Date(fechaInicio), $lte: new Date(fechaFin) },
      estado: { $in: ['pendiente', 'confirmada', 'en_progreso'] }
    };
    if (!cierreTotalSalon && estilistaId) citasQuery.estilistaId = estilistaId;
    const citasAfectadas = await Cita.find(citasQuery).populate('clienteId', '_id');
    const motivoBloqueo = `${razon || 'El salón ha bloqueado este período.'} Te invitamos a reagendar tu cita.`;
    for (const cita of citasAfectadas) {
      await Cita.findByIdAndUpdate(cita._id, { estado: 'cancelada', motivoCancelacion: motivoBloqueo });
      if (cita.clienteId?._id) {
        await crearNotificacion(
          cita.clienteId._id,
          'Tu cita fue cancelada',
          razon ? `${razon} Por favor reagenda tu cita.` : 'El salón bloqueó este período. Por favor reagenda tu cita.',
          'cita',
          'event_busy'
        );
      }
    }

    res.status(201).json(bloqueo);
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

const listarTodos = async (req, res) => {
  try {
    const bloqueos = await Bloqueo.find()
      .populate('estilistaId', 'nombre apellido')
      .sort({ fechaInicio: 1 });
    res.json(bloqueos);
  } catch (err) { res.status(500).json({ mensaje: err.message }); }
};

const listarEnRango = async (req, res) => {
  try {
    const { inicio, fin } = req.query;
    if (!inicio || !fin) return res.status(400).json({ mensaje: 'Se requieren inicio y fin' });
    const bloqueos = await Bloqueo.find({
      fechaInicio: { $lte: new Date(fin) },
      fechaFin: { $gte: new Date(inicio) }
    })
      .populate('estilistaId', 'nombre apellido')
      .sort({ fechaInicio: 1 });
    res.json(bloqueos);
  } catch (err) { res.status(500).json({ mensaje: err.message }); }
};

const verificarConflictos = async (req, res) => {
  try {
    const { estilistaId, fechaInicio, fechaFin, cierreTotalSalon } = req.body;
    const query = {
      fecha: { $gte: new Date(fechaInicio), $lte: new Date(fechaFin) },
      estado: { $in: ['pendiente', 'confirmada', 'en_progreso'] }
    };
    if (!cierreTotalSalon && estilistaId) query.estilistaId = estilistaId;
    const citas = await Cita.find(query)
      .populate('clienteId', 'nombre apellido')
      .populate('estilistaId', 'nombre apellido')
      .populate('servicioId', 'nombre');
    res.json({ count: citas.length, citas });
  } catch (err) { res.status(500).json({ mensaje: err.message }); }
};

const listarPorEstilista = async (req, res) => {
  try {
    const bloqueos = await Bloqueo.find({ estilistaId: req.params.estilistaId })
      .sort({ fechaInicio: 1 });
    res.json(bloqueos);
  } catch (err) { res.status(500).json({ mensaje: err.message }); }
};

const actualizar = async (req, res) => {
  try {
    const { cierreTotalSalon, estilistaId, fechaInicio, fechaFin, razon } = req.body;
    const conflicto = await verificarSuperposicion(fechaInicio, fechaFin, cierreTotalSalon, estilistaId, req.params.id);
    if (conflicto) return res.status(409).json({ mensaje: conflicto });

    const bloqueo = await Bloqueo.findByIdAndUpdate(
      req.params.id,
      { estilistaId: cierreTotalSalon ? null : estilistaId, fechaInicio, fechaFin, razon, cierreTotalSalon: !!cierreTotalSalon },
      { new: true }
    ).populate('estilistaId', 'nombre apellido');
    if (!bloqueo) return res.status(404).json({ mensaje: 'Bloqueo no encontrado' });
    res.json(bloqueo);
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

const eliminar = async (req, res) => {
  try {
    await Bloqueo.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Bloqueo eliminado' });
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

const listarParaCliente = async (req, res) => {
  try {
    const { inicio, fin, estilistaId } = req.query;
    if (!inicio || !fin) return res.status(400).json({ mensaje: 'Se requieren inicio y fin' });
    const baseQuery = {
      fechaInicio: { $lte: new Date(fin) },
      fechaFin:    { $gte: new Date(inicio) }
    };
    const orClause = [{ cierreTotalSalon: true }];
    if (estilistaId) orClause.push({ estilistaId });
    const bloqueos = await Bloqueo.find({ ...baseQuery, $or: orClause })
      .select('fechaInicio fechaFin cierreTotalSalon');
    res.json(bloqueos);
  } catch (err) { res.status(500).json({ mensaje: err.message }); }
};

module.exports = { crear, actualizar, listarTodos, listarEnRango, verificarConflictos, listarPorEstilista, eliminar, listarParaCliente };
