require('dotenv').config();
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

  // Eliminar datos de prueba por correos específicos (no toca datos reales)
  const correosPrueba = ['ana@bellezapro.com', 'maria@bellezapro.com'];
  await Usuario.deleteMany({ email: { $in: correosPrueba } });

  // Limpiar colecciones transaccionales de prueba
  await Promise.all([
    Servicio.deleteMany({}),
    Cita.deleteMany({}),
    Calificacion.deleteMany({}),
    SolicitudEspecial.deleteMany({}),
    ReporteCliente.deleteMany({}),
    Bloqueo.deleteMany({})
  ]);

  // Asegurar que existe el admin (no elimina si ya existe)
  const adminExiste = await Usuario.findOne({ email: 'admin@bellezapro.com' });
  if (!adminExiste) {
    const hash = await bcrypt.hash('Admin123!', 10);
    await Usuario.create({
      nombre: 'Admin', apellido: 'BellezaPro',
      email: 'admin@bellezapro.com',
      password: hash,
      rol: 'admin'
    });
    console.log('Admin creado: admin@bellezapro.com / Admin123!');
  } else {
    console.log('Admin ya existe, no se modifico.');
  }

  console.log('Datos de prueba eliminados correctamente.');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
