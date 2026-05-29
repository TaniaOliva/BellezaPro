require('dotenv').config();
const mongoose = require('mongoose');
const conectarDB = require('./database');

const Usuario = require('../models/Usuario');
const Servicio = require('../models/Servicio');
const Cita = require('../models/Cita');
const Calificacion = require('../models/Calificacion');
const SolicitudEspecial = require('../models/SolicitudEspecial');
const ReporteCliente = require('../models/ReporteCliente');
const Bloqueo = require('../models/Bloqueo');

const seed = async () => {
  await conectarDB();

  // Limpiar colecciones existentes
  await Promise.all([
    Usuario.deleteMany({}),
    Servicio.deleteMany({}),
    Cita.deleteMany({}),
    Calificacion.deleteMany({}),
    SolicitudEspecial.deleteMany({}),
    ReporteCliente.deleteMany({}),
    Bloqueo.deleteMany({})
  ]);

  // Crear usuario admin de prueba
  const admin = await Usuario.create({
    nombre: 'Admin', apellido: 'BellezaPro',
    email: 'admin@bellezapro.com', password: '12345678',
    rol: 'admin'
  });

  // Crear estilista de prueba
  const estilista = await Usuario.create({
    nombre: 'Ana', apellido: 'Garcia',
    email: 'ana@bellezapro.com', password: '12345678',
    rol: 'estilista'
  });

  // Crear cliente de prueba
  const cliente = await Usuario.create({
    nombre: 'Maria', apellido: 'Garcia',
    email: 'maria@bellezapro.com', password: '12345678',
    rol: 'cliente'
  });

  // Crear servicio de prueba
  const servicio = await Servicio.create({
    nombre: 'Manicure Clasico', categoria: 'Manicure',
    precioBase: 150, duracion: 45,
    variantes: [{ tipo: 'acabado', nombre: 'Gel', precioExtra: 50 }]
  });

  // Crear cita de prueba
  const cita = await Cita.create({
    clienteId: cliente._id, estilistaId: estilista._id,
    servicioId: servicio._id, fecha: new Date('2025-10-15'),
    hora: '10:00', duracion: 45, estado: 'completada', precioFinal: 150
  });

  // Crear calificacion de prueba
  await Calificacion.create({
    citaId: cita._id, clienteId: cliente._id,
    estilistaId: estilista._id, estrellas: 5,
    comentario: 'Excelente servicio'
  });

  // Crear solicitud especial de prueba
  await SolicitudEspecial.create({
    clienteId: cliente._id, categoria: 'Cabello',
    descripcion: 'Peinado para boda con recogido elegante',
    presupuesto: 'L.300-600'
  });

  // Crear reporte de prueba
  await ReporteCliente.create({
    estilistaId: estilista._id, clienteId: cliente._id,
    citaId: cita._id, motivo: 'inasistencia',
    descripcion: 'La cliente no se presento a su cita confirmada sin avisar',
    fechaIncidente: new Date('2025-10-15')
  });

  // Crear bloqueo de prueba
  await Bloqueo.create({
    estilistaId: estilista._id,
    fechaInicio: new Date('2025-11-01'),
    fechaFin: new Date('2025-11-05'),
    motivo: 'Vacaciones', creadoPor: admin._id
  });

  console.log('Colecciones creadas correctamente');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
