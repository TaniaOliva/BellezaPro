// Honduras (zona America/Tegucigalpa) está fija en UTC-6 todo el año:
// el país no aplica horario de verano (lo probó en 2006 y lo descartó).
const OFFSET_HN_MS = -6 * 60 * 60 * 1000;

/**
 * Medianoche del día calendario de Honduras, devuelta como Date en UTC.
 * Coincide con cómo se guarda `fecha` en las citas: new Date('YYYY-MM-DD')
 * produce la medianoche UTC de ese día.
 * @param {Date} [base] instante de referencia (por defecto, ahora)
 * @returns {Date}
 */
const inicioDelDiaHN = (base = new Date()) => {
  const hn = new Date(base.getTime() + OFFSET_HN_MS);
  return new Date(Date.UTC(hn.getUTCFullYear(), hn.getUTCMonth(), hn.getUTCDate()));
};

/**
 * Convierte una fecha 'YYYY-MM-DD' y una hora 'HH:MM' entendidas como
 * reloj de pared de Honduras al instante UTC correspondiente.
 * Honduras = UTC-6 fijo, así que UTC = hora local + 6h.
 * @param {string|Date} fecha 'YYYY-MM-DD' (o Date, del que se toma la parte UTC)
 * @param {string} hora 'HH:MM'
 * @returns {Date}
 */
const instanteHN = (fecha, hora) => {
  let Y, M, D;
  if (fecha instanceof Date) {
    Y = fecha.getUTCFullYear(); M = fecha.getUTCMonth() + 1; D = fecha.getUTCDate();
  } else {
    [Y, M, D] = String(fecha).slice(0, 10).split('-').map(Number);
  }
  const [h, min] = String(hora).split(':').map(Number);
  // Date.UTC da el instante de ese reloj interpretado como UTC; restar el
  // offset (-6h) equivale a sumar 6h y lleva de hora HN a UTC real.
  return new Date(Date.UTC(Y, M - 1, D, h || 0, min || 0) - OFFSET_HN_MS);
};

module.exports = { OFFSET_HN_MS, inicioDelDiaHN, instanteHN };
