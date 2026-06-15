import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notificacion } from '../models';

@Injectable({ providedIn: 'root' })
export class NotificacionService {
  private apiUrl = '/api/notificaciones';
  constructor(private http: HttpClient) {}

  listar(): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(this.apiUrl);
  }

  marcarLeida(id: string): Observable<Notificacion> {
    return this.http.patch<Notificacion>(`${this.apiUrl}/${id}/leida`, {});
  }

  marcarTodas(): Observable<any> {
    return this.http.patch(`${this.apiUrl}/marcar-todas`, {});
  }

  marcarPorTipo(tipo: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/tipo/${tipo}/leida`, {});
  }
}
