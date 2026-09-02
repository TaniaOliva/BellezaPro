require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const conectarDB = require('./config/database');
const router = require('./routes/router');

const app = express();
const port = process.env.PORT || 3000;

process.on('unhandledRejection', (err) => {
  console.error('Promesa sin manejar:', err);
});

app.use(cors());
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(express.json({ limit: '20mb' }));

app.get('/health', (req, res) => {
  const estados = ['desconectado', 'conectado', 'conectando', 'desconectando'];
  const rs = mongoose.connection.readyState;
  res.status(rs === 1 ? 200 : 503).json({ api: 'ok', mongo: estados[rs] ?? String(rs) });
});

app.use(router);

const iniciar = async () => {
  const MAX_INTENTOS = 3;
  for (let intento = 1; intento <= MAX_INTENTOS; intento++) {
    try {
      await conectarDB();
      break;
    } catch (err) {
      console.error(`Conexión a MongoDB — intento ${intento}/${MAX_INTENTOS} falló: ${err.message}`);
      if (intento === MAX_INTENTOS) {
        console.error('No se pudo conectar tras 3 intentos. El servidor arranca igual y el driver seguirá reintentando en segundo plano.');
        break;
      }
      const espera = 2000 * intento; // backoff: 2s, luego 4s
      console.log(`Reintentando en ${espera / 1000}s...`);
      await new Promise((r) => setTimeout(r, espera));
    }
  }

  app.listen(port, () => console.log(`API ejecutándose en http://localhost:${port}`));
};

iniciar();
