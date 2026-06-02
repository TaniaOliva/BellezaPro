import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servicio } from '../models';

@Injectable({ providedIn: 'root' })
export class ServicioService {
  private apiUrl = '/api/servicios';
  constructor(private http: HttpClient) {}

  listar(categoria?: string): Observable<Servicio[]> {
    const params = categoria ? `?categoria=${categoria}` : '';
    return this.http.get<Servicio[]>(`${this.apiUrl}${params}`);
  }

  obtener(id: string): Observable<Servicio> {
    return this.http.get<Servicio>(`${this.apiUrl}/${id}`);
  }

  crear(datos: Partial<Servicio>): Observable<Servicio> {
    return this.http.post<Servicio>(this.apiUrl, datos);
  }

  actualizar(id: string, datos: Partial<Servicio>): Observable<Servicio> {
    return this.http.put<Servicio>(`${this.apiUrl}/${id}`, datos);
  }
}
