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
  especialidades?: string[];
  horarioDisponible?: HorarioDisponible;
  calificacionPromedio?: number;
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
  servicioId: any;
  fecha: string;
  hora: string;
  duracion: number;
  estado: string;
  precioFinal?: number;
  notas?: string;
  creadoEn: string;
}

export interface SolicitudEspecial {
  _id: string;
  clienteId: any;
  categoria: string;
  descripcion: string;
  imagenUrl?: string;
  presupuesto?: string;
  estado: string;
  respuesta?: string;
  precioEstimado?: number;
  duracionEstimada?: number;
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
  tipo: 'cita' | 'solicitud' | 'sistema' | 'promo';
  icono: string;
  leida: boolean;
  creadoEn: string;
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}
