import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-recuperar-password',
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

          <!-- Paso 1: ingresar correo -->
          <div *ngIf="paso === 1">
            <h2 class="text-xl font-bold text-on-surface mb-2">Recuperar contrasena</h2>
            <p class="text-sm text-secondary mb-6">Ingresa tu correo y te enviaremos un codigo de verificacion.</p>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-on-surface mb-1">Correo electronico</label>
                <input type="email" [(ngModel)]="email" placeholder="tu@correo.com"
                  class="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary">
              </div>
              <div *ngIf="error" class="bg-error-container text-on-error-container text-sm rounded-lg px-3 py-2">
                {{ error }}
              </div>
              <button (click)="enviarCodigo()" [disabled]="cargando"
                class="w-full bg-primary text-on-primary font-semibold py-2.5 rounded-lg hover:bg-primary-container transition-colors disabled:opacity-50">
                {{ cargando ? 'Enviando...' : 'Enviar codigo' }}
              </button>
              <button (click)="router.navigate(['/login'])"
                class="w-full text-sm text-primary font-semibold py-2 hover:underline">
                Volver al inicio de sesion
              </button>
            </div>
          </div>

          <!-- Paso 2: ingresar codigo -->
          <div *ngIf="paso === 2">
            <h2 class="text-xl font-bold text-on-surface mb-2">Verifica tu identidad</h2>
            <p class="text-sm text-secondary mb-6">Ingresa el codigo de 6 digitos que enviamos a <strong>{{ email }}</strong>.</p>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-on-surface mb-1">Codigo de verificacion</label>
                <input type="text" [(ngModel)]="codigo" placeholder="000000" maxlength="6"
                  class="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm text-center tracking-widest text-lg focus:outline-none focus:border-primary">
              </div>
              <div *ngIf="error" class="bg-error-container text-on-error-container text-sm rounded-lg px-3 py-2">
                {{ error }}
              </div>
              <button (click)="verificarCodigo()" [disabled]="cargando"
                class="w-full bg-primary text-on-primary font-semibold py-2.5 rounded-lg hover:bg-primary-container transition-colors disabled:opacity-50">
                {{ cargando ? 'Verificando...' : 'Verificar codigo' }}
              </button>
              <button (click)="enviarCodigo()" [disabled]="cargando"
                class="w-full text-sm text-primary font-semibold py-2 hover:underline">
                Reenviar codigo
              </button>
            </div>
          </div>

          <!-- Paso 3: nueva contrasena -->
          <div *ngIf="paso === 3">
            <h2 class="text-xl font-bold text-on-surface mb-2">Nueva contrasena</h2>
            <p class="text-sm text-secondary mb-6">Elige una nueva contrasena para tu cuenta.</p>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-on-surface mb-1">Nueva contrasena</label>
                <input type="password" [(ngModel)]="nuevaPass" placeholder="••••••••"
                  class="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary">
              </div>
              <div>
                <label class="block text-sm font-semibold text-on-surface mb-1">Repetir contrasena</label>
                <input type="password" [(ngModel)]="confirmar" placeholder="••••••••"
                  class="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary">
              </div>
              <div *ngIf="error" class="bg-error-container text-on-error-container text-sm rounded-lg px-3 py-2">
                {{ error }}
              </div>
              <button (click)="guardarPassword()" [disabled]="cargando"
                class="w-full bg-primary text-on-primary font-semibold py-2.5 rounded-lg hover:bg-primary-container transition-colors disabled:opacity-50">
                {{ cargando ? 'Guardando...' : 'Listo' }}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class RecuperarPasswordComponent {
  paso = 1;
  email = '';
  codigo = '';
  nuevaPass = '';
  confirmar = '';
  error = '';
  cargando = false;

  constructor(public router: Router, private auth: AuthService) {}

  enviarCodigo(): void {
    if (!this.email) { this.error = 'Ingresa tu correo'; return; }
    this.cargando = true;
    this.error = '';
    this.auth.solicitarRecuperacion(this.email).subscribe({
      next: () => { this.paso = 2; this.cargando = false; },
      error: err => { this.error = err.error?.mensaje || 'Error al enviar el codigo'; this.cargando = false; }
    });
  }

  verificarCodigo(): void {
    if (!this.codigo) { this.error = 'Ingresa el codigo'; return; }
    this.cargando = true;
    this.error = '';
    this.auth.verificarCodigo(this.email, this.codigo).subscribe({
      next: () => { this.paso = 3; this.cargando = false; },
      error: err => { this.error = err.error?.mensaje || 'Codigo incorrecto'; this.cargando = false; }
    });
  }

  guardarPassword(): void {
    if (!this.nuevaPass || !this.confirmar) { this.error = 'Completa ambos campos'; return; }
    if (this.nuevaPass !== this.confirmar) { this.error = 'Las contrasenas no coinciden'; return; }
    if (this.nuevaPass.length < 8) { this.error = 'La contrasena debe tener al menos 8 caracteres'; return; }
    this.cargando = true;
    this.error = '';
    this.auth.nuevaPassword(this.email, this.codigo, this.nuevaPass).subscribe({
      next: () => this.router.navigate(['/login']),
      error: err => { this.error = err.error?.mensaje || 'Error al guardar'; this.cargando = false; }
    });
  }
}
