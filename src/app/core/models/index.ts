export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'admin' | 'estilista' | 'cliente';
  telefono?: string;
  estado: string;
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
}

export interface Variante {
  tipo: string;
  nombre: string;
  precioExtra: number;
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

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}
