import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, Usuario } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = '/api/auth';
  private usuarioSubject = new BehaviorSubject<Usuario | null>(this.cargarUsuario());
  usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  private cargarUsuario(): Usuario | null {
    const data = localStorage.getItem('bellezapro_usuario');
    return data ? JSON.parse(data) : null;
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(res => {
        localStorage.setItem('bellezapro_token', res.token);
        localStorage.setItem('bellezapro_usuario', JSON.stringify(res.usuario));
        this.usuarioSubject.next(res.usuario);
      })
    );
  }

  registrar(datos: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/registrar`, datos).pipe(
      tap(res => {
        localStorage.setItem('bellezapro_token', res.token);
        localStorage.setItem('bellezapro_usuario', JSON.stringify(res.usuario));
        this.usuarioSubject.next(res.usuario);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('bellezapro_token');
    localStorage.removeItem('bellezapro_usuario');
    this.usuarioSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('bellezapro_token');
  }

  getUsuario(): Usuario | null {
    return this.usuarioSubject.value;
  }

  estaAutenticado(): boolean {
    return !!this.getToken();
  }

  get rol(): string | null {
    return this.usuarioSubject.value?.rol ?? null;
  }
}
