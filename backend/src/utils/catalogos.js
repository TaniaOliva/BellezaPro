// Catálogos cerrados compartidos entre modelos y controladores.
// El frontend tiene su espejo en src/app/core/models/catalogos.ts.

const MOTIVOS_CANCELACION = [
  'enfermedad',
  'imprevisto_personal',
  'conflicto_horario',
  'motivo_economico',
  'clima_transporte',
  'cierre_salon',
  'ausencia_estilista',
  'no_asistio',
  'otro',
];

// Motivos que puede elegir un cliente al cancelar (subconjunto de arriba).
const MOTIVOS_CANCELACION_CLIENTE = [
  'enfermedad',
  'imprevisto_personal',
  'conflicto_horario',
  'motivo_economico',
  'clima_transporte',
  'otro',
];

const RAZONES_BLOQUEO = [
  'vacaciones',
  'incapacidad',
  'permiso_personal',
  'mantenimiento',
  'feriado',
  'capacitacion',
  'otro',
];

// Etiquetas legibles en español (para mensajes de notificación).
const ETIQUETAS_MOTIVO = {
  enfermedad: 'Enfermedad',
  imprevisto_personal: 'Imprevisto personal',
  conflicto_horario: 'Conflicto de horario',
  motivo_economico: 'Motivo económico',
  clima_transporte: 'Clima o transporte',
  cierre_salon: 'Cierre del salón',
  ausencia_estilista: 'Ausencia de la estilista',
  no_asistio: 'No asistió',
  otro: 'Otro',
};

const ETIQUETAS_RAZON_BLOQUEO = {
  vacaciones: 'Vacaciones',
  incapacidad: 'Incapacidad',
  permiso_personal: 'Permiso personal',
  mantenimiento: 'Mantenimiento',
  feriado: 'Feriado',
  capacitacion: 'Capacitación',
  otro: 'Otro',
};

module.exports = {
  MOTIVOS_CANCELACION,
  MOTIVOS_CANCELACION_CLIENTE,
  RAZONES_BLOQUEO,
  ETIQUETAS_MOTIVO,
  ETIQUETAS_RAZON_BLOQUEO,
};
