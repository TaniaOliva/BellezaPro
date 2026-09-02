// Espejo de backend/src/utils/catalogos.js. Mantener sincronizados.

export interface OpcionCatalogo {
  valor: string;
  label: string;
  cliente?: boolean; // visible para el cliente al cancelar
}

export const MOTIVOS_CANCELACION: OpcionCatalogo[] = [
  { valor: 'enfermedad',          label: 'Enfermedad',               cliente: true },
  { valor: 'imprevisto_personal', label: 'Imprevisto personal',      cliente: true },
  { valor: 'conflicto_horario',   label: 'Conflicto de horario',     cliente: true },
  { valor: 'motivo_economico',    label: 'Motivo económico',         cliente: true },
  { valor: 'clima_transporte',    label: 'Clima o transporte',       cliente: true },
  { valor: 'cierre_salon',        label: 'Cierre del salón',         cliente: false },
  { valor: 'ausencia_estilista',  label: 'Ausencia de la estilista', cliente: false },
  { valor: 'no_asistio',          label: 'No asistió',               cliente: false },
  { valor: 'otro',                label: 'Otro',                     cliente: true },
];

export const MOTIVOS_CANCELACION_CLIENTE = MOTIVOS_CANCELACION.filter(m => m.cliente);
// La estilista elige cualquiera menos 'no_asistio' (lo pone solo el sistema).
export const MOTIVOS_CANCELACION_ESTILISTA = MOTIVOS_CANCELACION.filter(m => m.valor !== 'no_asistio');

export const RAZONES_BLOQUEO: OpcionCatalogo[] = [
  { valor: 'vacaciones',       label: 'Vacaciones' },
  { valor: 'incapacidad',      label: 'Incapacidad' },
  { valor: 'permiso_personal', label: 'Permiso personal' },
  { valor: 'mantenimiento',    label: 'Mantenimiento' },
  { valor: 'feriado',          label: 'Feriado' },
  { valor: 'capacitacion',     label: 'Capacitación' },
  { valor: 'otro',             label: 'Otro' },
];

const _mapMotivo = new Map(MOTIVOS_CANCELACION.map(m => [m.valor, m.label]));
const _mapRazon = new Map(RAZONES_BLOQUEO.map(r => [r.valor, r.label]));

export const labelMotivoCancelacion = (v?: string): string => (v ? _mapMotivo.get(v) ?? v : '');
export const labelRazonBloqueo = (v?: string): string => (v ? _mapRazon.get(v) ?? v : '');

// Estados de cita: etiqueta + clases de color de badge.
export const ESTADO_CITA_LABEL: Record<string, string> = {
  confirmada: 'Confirmada',
  cancelada:  'Cancelada',
  no_asistio: 'No asistió',
  terminada:  'Terminada',
};

export const ESTADO_CITA_BADGE: Record<string, string> = {
  confirmada: 'bg-blue-100 text-blue-700',
  cancelada:  'bg-red-100 text-red-700',
  no_asistio: 'bg-amber-100 text-amber-700',
  terminada:  'bg-green-100 text-green-700',
};

export const labelEstadoCita = (v?: string): string => (v ? ESTADO_CITA_LABEL[v] ?? v : '');
export const badgeEstadoCita = (v?: string): string => (v ? ESTADO_CITA_BADGE[v] ?? 'bg-gray-100 text-gray-500' : 'bg-gray-100 text-gray-500');
