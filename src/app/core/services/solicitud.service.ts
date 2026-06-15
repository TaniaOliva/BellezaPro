import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SolicitudEspecial } from '../models';

@Injectable({ providedIn: 'root' })
export class SolicitudService {
  private apiUrl = '/api/solicitudes';
  constructor(private http: HttpClient) {}

  crear(datos: Partial<SolicitudEspecial>): Observable<SolicitudEspecial> {
    return this.http.post<SolicitudEspecial>(this.apiUrl, datos);
  }

  misSolicitudes(): Observable<SolicitudEspecial[]> {
    return this.http.get<SolicitudEspecial[]>(`${this.apiUrl}/mis`);
  }

  listarPendientes(): Observable<SolicitudEspecial[]> {
    return this.http.get<SolicitudEspecial[]>(`${this.apiUrl}/pendientes`);
  }

  listarTodas(): Observable<SolicitudEspecial[]> {
    return this.http.get<SolicitudEspecial[]>(this.apiUrl);
  }

  responder(id: string, datos: any): Observable<SolicitudEspecial> {
    return this.http.patch<SolicitudEspecial>(`${this.apiUrl}/${id}`, datos);
  }

  aceptarContraoferta(id: string): Observable<SolicitudEspecial> {
    return this.http.patch<SolicitudEspecial>(`${this.apiUrl}/${id}/aceptar-contrao`, {});
  }

  aceptarPropuesta(id: string): Observable<SolicitudEspecial> {
    return this.http.patch<SolicitudEspecial>(`${this.apiUrl}/${id}/aceptar`, {});
  }

  contraproponer(id: string, datos: { fechaContraoferta: string; horaContraoferta: string; estilistaContraoferta?: string; mensajeContraoferta?: string }): Observable<SolicitudEspecial> {
    return this.http.patch<SolicitudEspecial>(`${this.apiUrl}/${id}/contraoferta`, datos);
  }

  cancelar(id: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/cancelar`, {});
  }
}
