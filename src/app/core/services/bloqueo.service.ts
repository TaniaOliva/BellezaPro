import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bloqueo, ConflictoBloqueo } from '../models';

@Injectable({ providedIn: 'root' })
export class BloqueoService {
  private apiUrl = '/api/bloqueos';
  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Bloqueo[]> {
    return this.http.get<Bloqueo[]>(this.apiUrl);
  }

  listarEnRango(inicio: string, fin: string): Observable<Bloqueo[]> {
    return this.http.get<Bloqueo[]>(`${this.apiUrl}/rango`, { params: { inicio, fin } });
  }

  crear(datos: {
    estilistaId?: string;
    fechaInicio: string;
    fechaFin: string;
    razon?: string;
    cierreTotalSalon?: boolean;
  }): Observable<Bloqueo> {
    return this.http.post<Bloqueo>(this.apiUrl, datos);
  }

  verificarConflictos(datos: {
    estilistaId?: string;
    fechaInicio: string;
    fechaFin: string;
    cierreTotalSalon?: boolean;
  }): Observable<ConflictoBloqueo> {
    return this.http.post<ConflictoBloqueo>(`${this.apiUrl}/conflictos`, datos);
  }

  actualizar(id: string, datos: {
    estilistaId?: string;
    fechaInicio: string;
    fechaFin: string;
    razon?: string;
    cierreTotalSalon?: boolean;
  }): Observable<Bloqueo> {
    return this.http.put<Bloqueo>(`${this.apiUrl}/${id}`, datos);
  }

  eliminar(id: string): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.apiUrl}/${id}`);
  }
}
