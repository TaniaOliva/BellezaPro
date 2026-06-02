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

  actualizarEstado(id: string, estado: string): Observable<Cita> {
    return this.http.patch<Cita>(`${this.apiUrl}/${id}/estado`, { estado });
  }
}
