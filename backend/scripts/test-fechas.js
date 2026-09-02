/*
 * Pruebas del helper de zona horaria de Honduras.
 * Uso: node scripts/test-fechas.js   (sale 1 si algo falla)
 *
 * Honduras = UTC-6 fijo (sin horario de verano), así que UTC = hora HN + 6h.
 */
const { inicioDelDiaHN, instanteHN } = require('../src/utils/fechas');

let pass = 0, fail = 0;
const check = (desc, got, exp) => {
  const ok = JSON.stringify(got) === JSON.stringify(exp);
  ok ? pass++ : fail++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${desc}  => ${got}${ok ? '' : `  (esperado ${exp})`}`);
};

// --- instanteHN: reloj de pared HN -> instante UTC ---
check('15:00 HN = 21:00Z', instanteHN('2026-06-18', '15:00').toISOString(), '2026-06-18T21:00:00.000Z');
check('09:00 HN = 15:00Z', instanteHN('2026-06-18', '09:00').toISOString(), '2026-06-18T15:00:00.000Z');
check('00:00 HN = 06:00Z', instanteHN('2026-06-18', '00:00').toISOString(), '2026-06-18T06:00:00.000Z');
check('acepta Date como fecha', instanteHN(new Date('2026-06-18T00:00:00Z'), '15:00').toISOString(), '2026-06-18T21:00:00.000Z');

// --- inicioDelDiaHN: medianoche del día calendario HN, en UTC ---
check('20:00 HN del 15 -> inicio día = 15 00:00Z', inicioDelDiaHN(new Date('2026-09-16T02:00:00Z')).toISOString(), '2026-09-15T00:00:00.000Z');
check('00:01 HN del 16 -> inicio día = 16 00:00Z', inicioDelDiaHN(new Date('2026-09-16T06:01:00Z')).toISOString(), '2026-09-16T00:00:00.000Z');

// --- Borde de las 18:00 de Honduras (donde nos mordió antes) ---
// La validación de "ya pasó" en crear() es: instanteHN(fecha, hora) <= Date.now()
const instaCita1800 = instanteHN('2026-06-18', '18:00').getTime();      // 2026-06-19T00:00:00Z
const ahora1759HN   = Date.parse('2026-06-18T23:59:00Z');               // 17:59 HN del 18
const ahora1801HN   = Date.parse('2026-06-19T00:01:00Z');               // 18:01 HN del 18
check('cita 18:00 HN, ahora 17:59 HN -> NO pasó (se permite)', instaCita1800 <= ahora1759HN, false);
check('cita 18:00 HN, ahora 18:01 HN -> pasó (se rechaza)',    instaCita1800 <= ahora1801HN, true);

// Escenario original del bug: 19:00 HN del 17 (=01:00Z del 18) reservando 09:00 HN del 18.
const instaManiana0900 = instanteHN('2026-06-18', '09:00').getTime();   // 15:00Z del 18
const ahora1900HNdia17 = Date.parse('2026-06-18T01:00:00Z');
check('reservar mañana 09:00 HN estando 19:00 HN de hoy -> NO pasó', instaManiana0900 <= ahora1900HNdia17, false);

console.log(`\n${pass} ok, ${fail} fail`);
process.exit(fail ? 1 : 0);
