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

  getDisponibilidad(fecha: string, duracion: number, estilistaId?: string): Observable<{ slots: string[]; bloqueado: string | null }> {
    const params: Record<string, string> = { fecha, duracion: duracion.toString() };
    if (estilistaId) params['estilistaId'] = estilistaId;
    return this.http.get<{ slots: string[]; bloqueado: string | null }>(`${this.apiUrl}/disponibilidad`, { params });
  }

  cancelar(id: string, motivo: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/cancelar-cliente`, { motivo });
  }

  reagendar(id: string, fecha: string, hora: string): Observable<Cita> {
    return this.http.patch<Cita>(`${this.apiUrl}/${id}/reagendar`, { fecha, hora });
  }
}
