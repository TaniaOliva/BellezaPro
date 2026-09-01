import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = '/api/usuarios';
  constructor(private http: HttpClient) {}

  listarEstilistas(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/estilistas`);
  }

  listarTodosEstilistas(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/estilistas/admin`);
  }

  listarClientes(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/clientes`);
  }

  obtenerPerfil(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/perfil`);
  }

  actualizarPerfil(datos: Partial<Usuario>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/perfil`, datos);
  }

  cambiarPassword(passwordActual: string, passwordNueva: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/perfil/password`, { passwordActual, passwordNueva });
  }

  actualizarEstado(id: string, estado: string, suspensionFin?: string | null): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.apiUrl}/${id}/estado`, { estado, suspensionFin });
  }

  crearEmpleado(datos: Partial<Usuario>): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/empleados`, datos);
  }

  actualizarEmpleado(id: string, datos: Partial<Usuario>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/empleados/${id}`, datos);
  }

  eliminarEmpleado(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/empleados/${id}`);
  }

  resetearPasswordEmpleado(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/empleados/${id}/resetear-password`, {});
  }
}
