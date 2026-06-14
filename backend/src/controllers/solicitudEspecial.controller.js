const SolicitudEspecial = require('../models/SolicitudEspecial');
const Cita = require('../models/Cita');

const POPULATE_OPTS = [
  { path: 'estilistaPreferida',    select: 'nombre apellido' },
  { path: 'estilistaAsignada',     select: 'nombre apellido' },
  { path: 'estilistaContraoferta', select: 'nombre apellido' },
];

const crear = async (req, res) => {
  try {
    const solicitud = await SolicitudEspecial.create({ ...req.body, clienteId: req.usuario.id });
    res.status(201).json(solicitud);
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

const listarPorCliente = async (req, res) => {
  try {
    const solicitudes = await SolicitudEspecial.find({ clienteId: req.usuario.id })
      .populate(POPULATE_OPTS)
      .sort({ creadoEn: -1 });
    res.json(solicitudes);
  } catch (err) { res.status(500).json({ mensaje: err.message }); }
};

const listarPendientes = async (req, res) => {
  try {
    const solicitudes = await SolicitudEspecial.find({ estado: { $in: ['pendiente', 'contraoferta'] } })
      .populate('clienteId', 'nombre apellido email')
      .populate(POPULATE_OPTS)
      .sort({ creadoEn: -1 });
    res.json(solicitudes);
  } catch (err) { res.status(500).json({ mensaje: err.message }); }
};

const listarTodas = async (req, res) => {
  try {
    const solicitudes = await SolicitudEspecial.find()
      .populate('clienteId', 'nombre apellido email')
      .populate(POPULATE_OPTS)
      .sort({ creadoEn: -1 });
    res.json(solicitudes);
  } catch (err) { res.status(500).json({ mensaje: err.message }); }
};

// Admin: proponer (precio + duración + fecha + hora + estilista) o rechazar
const responder = async (req, res) => {
  try {
    const { estado, respuesta, precioEstimado, duracionEstimada, fechaPropuesta, horaPropuesta, estilistaAsignada } = req.body;

    if (estado === 'propuesta') {
      if (!precioEstimado || !duracionEstimada || !fechaPropuesta || !horaPropuesta) {
        return res.status(400).json({ mensaje: 'Precio, duración, fecha y hora son obligatorios para proponer' });
      }
    }

    const update = { estado, respuesta };
    if (estado === 'propuesta') {
      Object.assign(update, { precioEstimado, duracionEstimada, fechaPropuesta, horaPropuesta, estilistaAsignada: estilistaAsignada || null });
    }

    const solicitud = await SolicitudEspecial.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate('clienteId', 'nombre apellido')
      .populate(POPULATE_OPTS);

    res.json(solicitud);
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

// Admin: aceptar contraoferta del cliente → crea cita
const aceptarContraoferta = async (req, res) => {
  try {
    const sol = await SolicitudEspecial.findById(req.params.id).populate('clienteId');
    if (!sol || sol.estado !== 'contraoferta') {
      return res.status(400).json({ mensaje: 'La solicitud no tiene una contraoferta activa' });
    }
    if (!sol.fechaContraoferta || !sol.horaContraoferta) {
      return res.status(400).json({ mensaje: 'La contraoferta no tiene fecha u hora' });
    }

    const estilistaId = sol.estilistaContraoferta || sol.estilistaAsignada;
    if (!estilistaId) return res.status(400).json({ mensaje: 'No hay estilista asignada' });

    await Cita.create({
      clienteId:   sol.clienteId._id,
      estilistaId,
      solicitudId: sol._id,
      fecha:       new Date(sol.fechaContraoferta),
      hora:        sol.horaContraoferta,
      duracion:    sol.duracionEstimada ?? 60,
      precioFinal: sol.precioEstimado,
      notas:       `Solicitud especial: ${sol.descripcion}`,
      estado:      'confirmada'
    });

    sol.estado = 'aceptada';
    await sol.save();
    res.json(sol);
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

// Cliente: aceptar propuesta del admin → crea cita
const aceptarPropuesta = async (req, res) => {
  try {
    const sol = await SolicitudEspecial.findById(req.params.id);
    if (!sol) return res.status(404).json({ mensaje: 'Solicitud no encontrada' });
    if (sol.clienteId.toString() !== req.usuario.id) return res.status(403).json({ mensaje: 'No autorizado' });
    if (sol.estado !== 'propuesta') return res.status(400).json({ mensaje: 'La solicitud no tiene una propuesta activa' });
    if (!sol.estilistaAsignada) return res.status(400).json({ mensaje: 'La propuesta no tiene estilista asignada' });

    await Cita.create({
      clienteId:   sol.clienteId,
      estilistaId: sol.estilistaAsignada,
      solicitudId: sol._id,
      fecha:       new Date(sol.fechaPropuesta),
      hora:        sol.horaPropuesta,
      duracion:    sol.duracionEstimada ?? 60,
      precioFinal: sol.precioEstimado,
      notas:       `Solicitud especial: ${sol.descripcion}`,
      estado:      'confirmada'
    });

    sol.estado = 'aceptada';
    await sol.save();
    res.json(sol);
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

// Cliente: contraoferta (cambia fecha/hora/estilista, NO precio)
const contraproponer = async (req, res) => {
  try {
    const { fechaContraoferta, horaContraoferta, estilistaContraoferta, mensajeContraoferta } = req.body;
    const sol = await SolicitudEspecial.findById(req.params.id);
    if (!sol) return res.status(404).json({ mensaje: 'Solicitud no encontrada' });
    if (sol.clienteId.toString() !== req.usuario.id) return res.status(403).json({ mensaje: 'No autorizado' });
    if (sol.estado !== 'propuesta') return res.status(400).json({ mensaje: 'Solo puedes contraproponfer a una propuesta activa' });
    if (!fechaContraoferta || !horaContraoferta) return res.status(400).json({ mensaje: 'Fecha y hora son obligatorias' });

    const updated = await SolicitudEspecial.findByIdAndUpdate(
      req.params.id,
      { estado: 'contraoferta', fechaContraoferta, horaContraoferta, estilistaContraoferta: estilistaContraoferta || null, mensajeContraoferta },
      { new: true }
    ).populate(POPULATE_OPTS);

    res.json(updated);
  } catch (err) { res.status(400).json({ mensaje: err.message }); }
};

module.exports = { crear, listarPorCliente, listarPendientes, listarTodas, responder, aceptarPropuesta, contraproponer, aceptarContraoferta };
