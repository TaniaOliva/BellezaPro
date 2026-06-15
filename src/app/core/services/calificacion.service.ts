import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CalificacionService {
  private apiUrl = '/api/calificaciones';
  constructor(private http: HttpClient) {}

  getPromedio(estilistaId: string): Observable<{ promedio: number; total: number }> {
    return this.http.get<{ promedio: number; total: number }>(
      `${this.apiUrl}/estilista/${estilistaId}/promedio`
    );
  }

  crear(citaId: string, puntuacion: number, comentario: string): Observable<any> {
    return this.http.post(this.apiUrl, { citaId, puntuacion, comentario });
  }
}
