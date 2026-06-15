export interface HorarioDia {
  inicio: string;
  fin: string;
}

export interface HorarioDisponible {
  lunes?: HorarioDia;
  martes?: HorarioDia;
  miercoles?: HorarioDia;
  jueves?: HorarioDia;
  viernes?: HorarioDia;
  sabado?: HorarioDia;
}

export interface Usuario {
  _id: string;
  id?: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'admin' | 'estilista' | 'cliente';
  telefono?: string;
  estado: string;
  suspensionFin?: string | null;
  especialidades?: string[];
  horarioDisponible?: HorarioDisponible;
  calificacionPromedio?: number;
  reportesCount?: number;
  createdAt?: string;
}

export interface Servicio {
  _id: string;
  nombre: string;
  descripcion?: string;
  categoria: string;
  precioBase: number;
  duracion: number;
  imagen?: string;
  imagenes?: string[];
  activo: boolean;
  variantes?: Variante[];
  contadorSemana?: number;
}

export interface Variante {
  tipo: string;
  nombre: string;
  precioExtra: number;
  descripcion?: string;
}

export interface Cita {
  _id: string;
  clienteId: any;
  estilistaId: any;
  servicioId?: any;
  solicitudId?: any;
  fecha: string;
  hora: string;
  duracion: number;
  estado: string;
  precioFinal?: number;
  notas?: string;
  motivoCancelacion?: string;
  creadoEn: string;
}

export interface SolicitudEspecial {
  _id: string;
  clienteId: any;
  categoria: string;
  descripcion: string;
  imagenUrl?: string;
  presupuesto?: string;
  estilistaPreferida?: any;
  estado: 'pendiente' | 'propuesta' | 'contraoferta' | 'aceptada' | 'rechazada' | 'cancelada';
  respuesta?: string;
  precioEstimado?: number;
  duracionEstimada?: number;
  fechaSugerida?: string;
  horaSugerida?: string;
  fechaPropuesta?: string;
  horaPropuesta?: string;
  estilistaAsignada?: any;
  fechaContraoferta?: string;
  horaContraoferta?: string;
  estilistaContraoferta?: any;
  mensajeContraoferta?: string;
  creadoEn: string;
}

export interface ReporteCliente {
  _id: string;
  estilistaId: any;
  clienteId: any;
  citaId: any;
  motivo: string;
  descripcion: string;
  estado: string;
  accionTomada?: string;
  creadoEn: string;
}

export interface Categoria {
  _id: string;
  nombre: string;
  activo: boolean;
  createdAt?: string;
}

export interface Notificacion {
  _id: string;
  usuarioId: string;
  titulo: string;
  descripcion?: string;
  tipo: 'cita' | 'solicitud' | 'sistema' | 'calificacion';
  icono: string;
  leida: boolean;
  referencia?: string;
  creadoEn: string;
}

export interface Bloqueo {
  _id: string;
  estilistaId: any;
  fechaInicio: string;
  fechaFin: string;
  razon?: string;
  cierreTotalSalon: boolean;
  createdAt?: string;
}

export interface ConflictoBloqueo {
  count: number;
  citas: Cita[];
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}
