import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-registro',
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
          <h2 class="text-xl font-bold text-on-surface mb-6">Crear cuenta</h2>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-semibold text-on-surface mb-1">Nombre</label>
                <input type="text" [(ngModel)]="nombre" placeholder="Tu nombre"
                  class="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary">
              </div>
              <div>
                <label class="block text-sm font-semibold text-on-surface mb-1">Apellido</label>
                <input type="text" [(ngModel)]="apellido" placeholder="Tu apellido"
                  class="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary">
              </div>
            </div>
            <div>
              <label class="block text-sm font-semibold text-on-surface mb-1">Correo electronico</label>
              <input type="email" [(ngModel)]="email" placeholder="tu@correo.com"
                class="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary">
            </div>
            <div>
              <label class="block text-sm font-semibold text-on-surface mb-1">Numero de telefono</label>
              <input type="tel" [(ngModel)]="telefono" placeholder="+504 0000-0000"
                class="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary">
            </div>
            <div>
              <label class="block text-sm font-semibold text-on-surface mb-1">Contrasena</label>
              <input type="password" [(ngModel)]="password" placeholder="••••••••"
                class="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary">
            </div>
            <div>
              <label class="block text-sm font-semibold text-on-surface mb-1">Confirmar contrasena</label>
              <input type="password" [(ngModel)]="confirmar" placeholder="••••••••"
                class="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary">
            </div>
            <div *ngIf="error" class="bg-error-container text-on-error-container text-sm rounded-lg px-3 py-2">
              {{ error }}
            </div>
            <button (click)="registrar()" [disabled]="cargando"
              class="w-full bg-primary text-on-primary font-semibold py-2.5 rounded-lg hover:bg-primary-container transition-colors disabled:opacity-50">
              {{ cargando ? 'Creando cuenta...' : 'Crear cuenta' }}
            </button>
            <button (click)="router.navigate(['/login'])"
              class="w-full text-sm text-primary font-semibold py-2 hover:underline">
              Ya tengo cuenta, iniciar sesion
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegistroComponent {
  nombre = '';
  apellido = '';
  email = '';
  telefono = '';
  password = '';
  confirmar = '';
  error = '';
  cargando = false;

  constructor(public router: Router, private auth: AuthService) {}

  registrar(): void {
    if (!this.nombre || !this.apellido || !this.email || !this.password || !this.confirmar) {
      this.error = 'Completa todos los campos';
      return;
    }
    if (this.password !== this.confirmar) {
      this.error = 'Las contrasenas no coinciden';
      return;
    }
    if (this.password.length < 8) {
      this.error = 'La contrasena debe tener al menos 8 caracteres';
      return;
    }
    this.cargando = true;
    this.error = '';
    this.auth.registrar({ nombre: this.nombre, apellido: this.apellido, email: this.email, telefono: this.telefono, password: this.password }).subscribe({
      next: () => this.router.navigate(['/cliente/inicio']),
      error: err => {
        this.error = err.error?.mensaje || 'Error al crear la cuenta';
        this.cargando = false;
      }
    });
  }
}
