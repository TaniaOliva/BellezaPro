/*
 * BLOQUE C2 — convierte presupuesto de String a Number en SolicitudEspecial.
 *
 *   node scripts/migrar-presupuesto-solicitud.js            (dry-run)
 *   node scripts/migrar-presupuesto-solicitud.js --commit   (escribe)
 *
 * Extrae el valor numérico del string (quita "L.", espacios, texto).
 * Idempotente: si presupuesto ya es número o no existe, se omite.
 * Si el string no tiene ningún dígito, se deja como está y se avisa.
 */
const mongoose = require('mongoose');
const path = require('path');
require(path.join(__dirname, '..', 'node_modules', 'dotenv')).config({ path: path.join(__dirname, '..', '.env') });

const COMMIT = process.argv.includes('--commit');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('solicitudespecials');
  const sols = await col.find({}).toArray();

  const filas = [];
  let cambios = 0;
  for (const s of sols) {
    if (typeof s.presupuesto !== 'string') {
      filas.push({ _id: String(s._id), presupuesto_actual: JSON.stringify(s.presupuesto), accion: 'sin cambios' });
      continue;
    }
    const limpio = s.presupuesto.replace(/[^\d.]/g, '');
    const n = limpio === '' ? null : Number(limpio);
    if (n === null || Number.isNaN(n)) {
      filas.push({ _id: String(s._id), presupuesto_actual: JSON.stringify(s.presupuesto), accion: 'SIN DÍGITOS — se deja como está' });
      continue;
    }
    cambios++;
    filas.push({ _id: String(s._id), presupuesto_actual: JSON.stringify(s.presupuesto), presupuesto_nuevo: n });
    if (COMMIT) await col.updateOne({ _id: s._id }, { $set: { presupuesto: n } });
  }

  console.table(filas);
  console.log(`\n${COMMIT ? 'ESCRITO' : 'DRY-RUN'} — ${cambios} de ${sols.length} solicitudes ${COMMIT ? 'actualizadas' : 'a actualizar'}.`);
  await mongoose.disconnect();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
