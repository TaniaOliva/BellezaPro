require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const conectarDB = require('./src/config/database');

const Usuario = require('./src/models/Usuario');
const Servicio = require('./src/models/Servicio');
const Cita = require('./src/models/Cita');
const Calificacion = require('./src/models/Calificacion');
const SolicitudEspecial = require('./src/models/SolicitudEspecial');
const ReporteCliente = require('./src/models/ReporteCliente');
const Bloqueo = require('./src/models/Bloqueo');

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

  const hashedPassword = await bcrypt.hash('12345678', 10);

  // Crear usuario admin de prueba
  const admin = await Usuario.create({
    nombre: 'Admin', apellido: 'BellezaPro',
    email: 'admin@bellezapro.com', password: hashedPassword,
    rol: 'admin'
  });

  // Crear estilista de prueba
  const estilista = await Usuario.create({
    nombre: 'Ana', apellido: 'Garcia',
    email: 'ana@bellezapro.com', password: hashedPassword,
    rol: 'estilista'
  });

  // Crear cliente de prueba
  const cliente = await Usuario.create({
    nombre: 'Maria', apellido: 'Garcia',
    email: 'maria@bellezapro.com', password: hashedPassword,
    rol: 'cliente'
  });

  const variantesUnas = [
    { tipo: 'nivel',    nombre: 'Clásico',           precioExtra: 0   },
    { tipo: 'nivel',    nombre: 'Premium',            precioExtra: 80  },
    { tipo: 'nivel',    nombre: 'Spa',                precioExtra: 150 },
    { tipo: 'largo',    nombre: 'Corta',              precioExtra: 0   },
    { tipo: 'largo',    nombre: 'Mediana',            precioExtra: 0   },
    { tipo: 'largo',    nombre: 'Larga',              precioExtra: 0   },
    { tipo: 'largo',    nombre: 'Extra larga',        precioExtra: 0   },
    { tipo: 'acabado',  nombre: 'Esmalte normal',     precioExtra: 0   },
    { tipo: 'acabado',  nombre: 'Gel semipermanente', precioExtra: 50  },
    { tipo: 'acabado',  nombre: 'Acrílico',           precioExtra: 100 },
  ];

  const variantesCabello = [
    { tipo: 'nivel', nombre: 'Básico',    precioExtra: 0   },
    { tipo: 'nivel', nombre: 'Estilizado',precioExtra: 100 },
    { tipo: 'nivel', nombre: 'Premium',   precioExtra: 200 },
    { tipo: 'largo', nombre: 'Corto',     precioExtra: 0   },
    { tipo: 'largo', nombre: 'Medio',     precioExtra: 0   },
    { tipo: 'largo', nombre: 'Largo',     precioExtra: 0   },
    { tipo: 'largo', nombre: 'Muy largo', precioExtra: 0   },
  ];

  const variantesTinte = [
    ...variantesCabello,
    { tipo: 'tecnica', nombre: 'Color completo', precioExtra: 0   },
    { tipo: 'tecnica', nombre: 'Mechas',         precioExtra: 0   },
    { tipo: 'tecnica', nombre: 'Balayage',       precioExtra: 150 },
  ];

  const variantesMaquillaje = [
    { tipo: 'ocasion',    nombre: 'Natural',     precioExtra: 0   },
    { tipo: 'ocasion',    nombre: 'Social',      precioExtra: 0   },
    { tipo: 'ocasion',    nombre: 'Quinceañera', precioExtra: 0   },
    { tipo: 'ocasion',    nombre: 'Novia',       precioExtra: 0   },
    { tipo: 'ocasion',    nombre: 'Editorial',   precioExtra: 0   },
    { tipo: 'intensidad', nombre: 'Ligero',      precioExtra: 0   },
    { tipo: 'intensidad', nombre: 'Completo',    precioExtra: 80  },
    { tipo: 'intensidad', nombre: 'Glam',        precioExtra: 150 },
  ];

  // Crear servicios
  const serviciosCreados = await Servicio.insertMany([
    { nombre: 'Manicure Clasico',  categoria: 'Manicure',   precioBase: 150, duracion: 45,  variantes: variantesUnas      },
    { nombre: 'Manicure Gel',      categoria: 'Manicure',   precioBase: 350, duracion: 60,  variantes: variantesUnas      },
    { nombre: 'Nail Art Sencillo', categoria: 'Manicure',   precioBase: 420, duracion: 75,  variantes: variantesUnas      },
    { nombre: 'Pedicure Spa',      categoria: 'Pedicure',   precioBase: 300, duracion: 60,  variantes: variantesUnas      },
    { nombre: 'Corte Clasico',     categoria: 'Cortes',     precioBase: 250, duracion: 45,  variantes: variantesCabello   },
    { nombre: 'Tinte Completo',    categoria: 'Tintes',     precioBase: 600, duracion: 120, variantes: variantesTinte     },
    { nombre: 'Maquillaje Social', categoria: 'Maquillaje', precioBase: 450, duracion: 60,  variantes: variantesMaquillaje},
  ]);
  const servicio = serviciosCreados[0];

  // Crear cita de prueba
  const cita = await Cita.create({
    clienteId: cliente._id, estilistaId: estilista._id,
    servicioId: servicio._id, fecha: new Date('2025-10-15'),
    hora: '10:00', duracion: 45, estado: 'completada', precioFinal: 150
  });

  // Crear calificacion de prueba
  await Calificacion.create({
    citaId: cita._id, clienteId: cliente._id,
    estilistaId: estilista._id, puntuacion: 5,
    comentario: 'Excelente servicio'
  });

  // Crear solicitud especial de prueba
  await SolicitudEspecial.create({
    clienteId: cliente._id, tipo: 'Cabello',
    descripcion: 'Peinado para boda con recogido elegante'
  });

  // Crear reporte de prueba
  await ReporteCliente.create({
    reportadorId: estilista._id, reportadoId: cliente._id,
    tipo: 'inasistencia',
    descripcion: 'La cliente no se presento a su cita confirmada sin avisar'
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

