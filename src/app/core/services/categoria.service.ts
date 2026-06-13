import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../models';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private apiUrl = '/api/categorias';
  constructor(private http: HttpClient) {}

  listar(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  listarAdmin(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/admin`);
  }

  crear(nombre: string): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, { nombre });
  }

  actualizar(id: string, datos: Partial<Categoria>): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}/${id}`, datos);
  }

  eliminar(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
