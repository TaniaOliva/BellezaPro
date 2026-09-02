/*
 * BLOQUE A8 — normaliza motivoCancelacion / estado de las citas históricas.
 *
 *   node scripts/migrar-motivos-cita.js            (dry-run: solo muestra)
 *   node scripts/migrar-motivos-cita.js --commit   (escribe en la base)
 *
 * Reglas:
 *  - "No se registro asistencia"            -> estado 'no_asistio', motivo 'no_asistio', canceladoPor 'sistema'
 *  - texto "... Te invitamos a reagendar…"  -> cancelación por bloqueo: motivo según _id, canceladoPor 'admin',
 *                                             el texto original (sin el sufijo) va a detalleCancelacion
 *  - cancelada sin motivo                   -> motivo 'otro'
 *  - cancelada con texto libre              -> mapeo por palabra clave, canceladoPor 'cliente', texto -> detalleCancelacion
 *  - terminada / confirmada / no_asistio    -> sin cambios
 * Idempotente: una cita cuyo motivoCancelacion ya es un valor del catálogo se omite.
 */
const mongoose = require('mongoose');
const path = require('path');
require(path.join(__dirname, '..', 'node_modules', 'dotenv')).config({ path: path.join(__dirname, '..', '.env') });
const { MOTIVOS_CANCELACION } = require('../src/utils/catalogos');

const COMMIT = process.argv.includes('--commit');
const SUFIJO = ' Te invitamos a reagendar tu cita.';

// Citas originadas por bloqueo: se cruzó a mano con los bloqueos (ver conversación).
const OVERRIDE_BLOQUEO = {
  '6a2f5517a5ca91fd5d2bd6fb': 'cierre_salon',       // 13-jun, bloqueo cierre total 13→14
  '6a2e73d856848f54887d7339': 'ausencia_estilista', // 18-jun, bloqueo de estilista (cierreTotalSalon=false)
};

function mapearTextoLibre(txt) {
  const t = txt.toLowerCase();
  if (/medic|enferm|salud|gripe|fiebre/.test(t)) return 'enfermedad';
  if (/no puedo ese d|otro d|horario|reprogram|choca|cruza/.test(t)) return 'conflicto_horario';
  return 'otro';
}

function planificar(cita) {
  if (cita.estado !== 'cancelada') return null;                       // terminada/confirmada/no_asistio
  const m = cita.motivoCancelacion;
  if (m && MOTIVOS_CANCELACION.includes(m)) return null;              // ya migrada

  if (m === 'No se registro asistencia') {
    return { estado: 'no_asistio', motivoCancelacion: 'no_asistio', canceladoPor: 'sistema' };
  }
  if (m && m.endsWith(SUFIJO)) {
    const detalle = m.slice(0, -SUFIJO.length).trim();
    return {
      motivoCancelacion: OVERRIDE_BLOQUEO[String(cita._id)] || 'otro',
      canceladoPor: 'admin',
      detalleCancelacion: detalle || undefined,
    };
  }
  if (!m || !m.trim()) {
    return { motivoCancelacion: 'otro' };
  }
  const detalle = m.trim();
  return { motivoCancelacion: mapearTextoLibre(detalle), canceladoPor: 'cliente', detalleCancelacion: detalle };
}

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('citas');
  const citas = await col.find({}).sort({ fecha: 1 }).toArray();

  const filas = [];
  let cambios = 0;
  for (const c of citas) {
    const plan = planificar(c);
    if (!plan) { filas.push({ _id: String(c._id), estado: c.estado, motivo_actual: c.motivoCancelacion ?? '—', accion: 'sin cambios' }); continue; }
    cambios++;
    filas.push({
      _id: String(c._id),
      estado: `${c.estado}${plan.estado ? ' -> ' + plan.estado : ''}`,
      motivo_actual: c.motivoCancelacion ?? '—',
      motivo_nuevo: plan.motivoCancelacion,
      canceladoPor: plan.canceladoPor ?? '(sin dato)',
      detalleCancelacion: plan.detalleCancelacion ?? '—',
    });
    if (COMMIT) {
      const $set = { motivoCancelacion: plan.motivoCancelacion };
      if (plan.estado) $set.estado = plan.estado;
      if (plan.canceladoPor) $set.canceladoPor = plan.canceladoPor;
      const update = { $set };
      if (plan.detalleCancelacion) update.$set.detalleCancelacion = plan.detalleCancelacion;
      await col.updateOne({ _id: c._id }, update);
    }
  }

  console.table(filas);
  console.log(`\n${COMMIT ? 'ESCRITO' : 'DRY-RUN'} — ${cambios} de ${citas.length} citas ${COMMIT ? 'actualizadas' : 'a actualizar'}. canceladoEn queda NULL en los históricos (a propósito).`);
  await mongoose.disconnect();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
