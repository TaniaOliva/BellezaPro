/*
 * BLOQUE C1 — normaliza razon de los bloqueos a enum cerrado.
 *
 *   node scripts/migrar-razon-bloqueo.js            (dry-run)
 *   node scripts/migrar-razon-bloqueo.js --commit   (escribe)
 *
 * Reglas: razón vacía -> 'otro'; 'Mantenimiento' -> 'mantenimiento';
 *         cualquier variante de "vacaciones" -> 'vacaciones'; resto -> 'otro'.
 * Idempotente: un bloqueo cuya razon ya es un valor del catálogo se omite.
 */
const mongoose = require('mongoose');
const path = require('path');
require(path.join(__dirname, '..', 'node_modules', 'dotenv')).config({ path: path.join(__dirname, '..', '.env') });
const { RAZONES_BLOQUEO } = require('../src/utils/catalogos');

const COMMIT = process.argv.includes('--commit');

function mapear(razon) {
  const r = (razon || '').trim().toLowerCase();
  if (r === '') return 'otro';
  if (r === 'mantenimiento') return 'mantenimiento';
  if (r.includes('vacacion')) return 'vacaciones';
  return 'otro';
}

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('bloqueos');
  const bloqueos = await col.find({}).sort({ fechaInicio: 1 }).toArray();

  const filas = [];
  let cambios = 0;
  for (const b of bloqueos) {
    if (RAZONES_BLOQUEO.includes(b.razon)) {
      filas.push({ _id: String(b._id), razon_actual: JSON.stringify(b.razon), razon_nueva: '(sin cambios)' });
      continue;
    }
    const nueva = mapear(b.razon);
    cambios++;
    filas.push({
      _id: String(b._id),
      cierreTotal: !!b.cierreTotalSalon,
      razon_actual: JSON.stringify(b.razon),
      razon_nueva: nueva,
    });
    if (COMMIT) await col.updateOne({ _id: b._id }, { $set: { razon: nueva } });
  }

  console.table(filas);
  console.log(`\n${COMMIT ? 'ESCRITO' : 'DRY-RUN'} — ${cambios} de ${bloqueos.length} bloqueos ${COMMIT ? 'actualizados' : 'a actualizar'}.`);
  await mongoose.disconnect();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
