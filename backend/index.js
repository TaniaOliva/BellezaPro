require('dotenv').config();
const express = require('express');
const cors = require('cors');
const conectarDB = require('./src/config/database');

const app = express();

conectarDB();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth',               require('./src/routes/auth.routes'));
app.use('/api/usuarios',           require('./src/routes/usuario.routes'));
app.use('/api/servicios',          require('./src/routes/servicio.routes'));
app.use('/api/citas',              require('./src/routes/cita.routes'));
app.use('/api/calificaciones',     require('./src/routes/calificacion.routes'));
app.use('/api/solicitudes',        require('./src/routes/solicitudEspecial.routes'));
app.use('/api/reportes',           require('./src/routes/reporteCliente.routes'));
app.use('/api/bloqueos',           require('./src/routes/bloqueo.routes'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', proyecto: 'BellezaPro' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
