import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReporteCliente } from '../models';

@Injectable({ providedIn: 'root' })
export class ReporteService {
  private apiUrl = '/api/reportes';
  constructor(private http: HttpClient) {}

  crear(datos: Partial<ReporteCliente>): Observable<ReporteCliente> {
    return this.http.post<ReporteCliente>(this.apiUrl, datos);
  }

  listarPendientes(): Observable<ReporteCliente[]> {
    return this.http.get<ReporteCliente[]>(`${this.apiUrl}/pendientes`);
  }

  listarTodos(): Observable<ReporteCliente[]> {
    return this.http.get<ReporteCliente[]>(this.apiUrl);
  }

  resolver(id: string, accionTomada: string): Observable<ReporteCliente> {
    return this.http.patch<ReporteCliente>(`${this.apiUrl}/${id}/resolver`, { accionTomada });
  }

  porCliente(clienteId: string): Observable<ReporteCliente[]> {
    return this.http.get<ReporteCliente[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }
}
