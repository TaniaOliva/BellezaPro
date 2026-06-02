require('dotenv').config();
const express = require('express');
const cors = require('cors');
const conectarDB = require('./config/database');

const app = express();

conectarDB();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth',               require('./routes/auth.routes'));
app.use('/api/usuarios',           require('./routes/usuario.routes'));
app.use('/api/servicios',          require('./routes/servicio.routes'));
app.use('/api/citas',              require('./routes/cita.routes'));
app.use('/api/calificaciones',     require('./routes/calificacion.routes'));
app.use('/api/solicitudes',        require('./routes/solicitudEspecial.routes'));
app.use('/api/reportes',           require('./routes/reporteCliente.routes'));
app.use('/api/bloqueos',           require('./routes/bloqueo.routes'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', proyecto: 'BellezaPro' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
