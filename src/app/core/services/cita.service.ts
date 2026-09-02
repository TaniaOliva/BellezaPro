import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cita } from '../models';

@Injectable({ providedIn: 'root' })
export class CitaService {
  private apiUrl = '/api/citas';
  constructor(private http: HttpClient) {}

  misCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.apiUrl}/mis-citas`);
  }

  miAgenda(): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.apiUrl}/mi-agenda`);
  }

  crear(datos: Partial<Cita>): Observable<Cita> {
    return this.http.post<Cita>(this.apiUrl, datos);
  }

  listarTodas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(this.apiUrl);
  }

  actualizarEstado(id: string, estado: string): Observable<Cita> {
    return this.http.patch<Cita>(`${this.apiUrl}/${id}/estado`, { estado });
  }

  getDisponibilidad(fecha: string, duracion: number, estilistaId?: string): Observable<{ todos: { hora: string; disponible: boolean }[]; bloqueado: string | null }> {
    const params: Record<string, string> = { fecha, duracion: duracion.toString() };
    if (estilistaId) params['estilistaId'] = estilistaId;
    return this.http.get<{ todos: { hora: string; disponible: boolean }[]; bloqueado: string | null }>(`${this.apiUrl}/disponibilidad`, { params });
  }

  cancelar(id: string, motivo: string, detalle?: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/cancelar-cliente`, { motivo, detalle });
  }

  reagendar(id: string, fecha: string, hora: string): Observable<Cita> {
    return this.http.patch<Cita>(`${this.apiUrl}/${id}/reagendar`, { fecha, hora });
  }

  cancelarComoEstilista(id: string, motivo: string, detalle?: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/cancelar-estilista`, { motivo, detalle });
  }

  obtenerPorAdmin(id: string): Observable<Cita> {
    return this.http.get<Cita>(`${this.apiUrl}/${id}`);
  }

  valorarCliente(id: string, estrellas: number, comentario: string): Observable<Cita> {
    return this.http.patch<Cita>(`${this.apiUrl}/${id}/valorar-cliente`, { estrellas, comentario });
  }
}
