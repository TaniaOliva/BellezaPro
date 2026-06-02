import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-surface flex items-center justify-center px-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-primary font-serif">BellezaPro</h1>
          <p class="text-secondary text-sm mt-1">Sistema de Gestion Integral</p>
        </div>
        <div class="bg-white rounded-xl border border-outline-variant p-8 shadow-sm">
          <h2 class="text-xl font-bold text-on-surface mb-6">Iniciar sesion</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-on-surface mb-1">Correo electronico</label>
              <input type="email" [(ngModel)]="email" placeholder="tu@correo.com"
                class="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary">
            </div>
            <div>
              <label class="block text-sm font-semibold text-on-surface mb-1">Contrasena</label>
              <input type="password" [(ngModel)]="password" placeholder="••••••••"
                class="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary">
            </div>
            <div *ngIf="error" class="bg-error-container text-on-error-container text-sm rounded-lg px-3 py-2">
              {{ error }}
            </div>
            <button (click)="login()" [disabled]="cargando"
              class="w-full bg-primary text-on-primary font-semibold py-2.5 rounded-lg hover:bg-primary-container transition-colors disabled:opacity-50">
              {{ cargando ? 'Ingresando...' : 'Ingresar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  cargando = false;

  constructor(private auth: AuthService, private router: Router) {}

  login(): void {
    if (!this.email || !this.password) {
      this.error = 'Completa todos los campos';
      return;
    }
    this.cargando = true;
    this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: res => {
        if (res.usuario.rol === 'admin') this.router.navigate(['/admin/inicio']);
        else if (res.usuario.rol === 'estilista') this.router.navigate(['/estilista/inicio']);
        else this.router.navigate(['/cliente/inicio']);
      },
      error: err => {
        this.error = err.error?.mensaje || 'Error al iniciar sesion';
        this.cargando = false;
      }
    });
  }
}
