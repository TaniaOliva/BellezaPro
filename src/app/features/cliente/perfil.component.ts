import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../../core/services/usuario.service';
import { SolicitudService } from '../../core/services/solicitud.service';
import { Usuario, SolicitudEspecial } from '../../core/models';

@Component({
  selector: 'app-cliente-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="bg-white min-h-screen">
      <div class="max-w-6xl mx-auto px-8 py-8 space-y-8">

        <!-- Header -->
        <div class="bg-red-50 rounded-3xl p-8 flex flex-col lg:flex-row gap-8 items-start">
          <div class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl shrink-0">
            <span class="material-symbols-outlined text-5xl">person</span>
          </div>
          <div class="flex-1 space-y-1">
            <div class="flex flex-wrap items-center gap-3">
              <p class="text-3xl font-bold text-gray-800">{{ usuario?.nombre }} {{ usuario?.apellido }}</p>
              <span class="rounded-full bg-red-100 px-3 py-1 text-sm text-red-700 font-semibold">Cliente</span>
            </div>
            <p class="text-gray-500 text-sm">{{ usuario?.email }}</p>
          </div>
        </div>

        <div class="grid gap-8 lg:grid-cols-2">

          <!-- Información personal -->
          <div class="rounded-3xl border border-gray-200 p-8 space-y-5">
            <p class="text-xl font-semibold text-gray-800">Información personal</p>

            <div *ngIf="mensajePerfil"
              [class]="mensajePerfil === 'Cambios guardados'
                ? 'p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm'
                : 'p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm'">
              {{ mensajePerfil }}
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="text-sm text-gray-500 block mb-2">Nombre</label>
                <input [(ngModel)]="nombre" type="text"
                  class="w-full rounded-2xl bg-gray-50 border border-gray-200 p-4 text-gray-800 focus:outline-none focus:border-red-500">
              </div>
              <div>
                <label class="text-sm text-gray-500 block mb-2">Apellido</label>
                <input [(ngModel)]="apellido" type="text"
                  class="w-full rounded-2xl bg-gray-50 border border-gray-200 p-4 text-gray-800 focus:outline-none focus:border-red-500">
              </div>
              <div>
                <label class="text-sm text-gray-500 block mb-2">Teléfono</label>
                <input [(ngModel)]="telefono" type="tel" placeholder="+504 0000-0000"
                  class="w-full rounded-2xl bg-gray-50 border border-gray-200 p-4 text-gray-800 focus:outline-none focus:border-red-500">
              </div>
              <div>
                <label class="text-sm text-gray-500 block mb-2">Correo</label>
                <p class="rounded-2xl bg-gray-100 p-4 text-gray-500 text-sm border border-gray-100">{{ usuario?.email }}</p>
              </div>
            </div>

            <button (click)="guardarPerfil()" [disabled]="guardando"
              class="w-full py-3 bg-red-600 text-white rounded-2xl font-semibold hover:bg-red-700 disabled:opacity-50 transition">
              {{ guardando ? 'Guardando...' : 'Guardar cambios' }}
            </button>
          </div>

          <div class="space-y-6">

            <!-- Cambiar contraseña -->
            <div class="rounded-3xl border border-gray-200 p-8 space-y-4">
              <p class="text-xl font-semibold text-gray-800">Cambiar contraseña</p>

              <div *ngIf="mensajePassword"
                [class]="mensajePassword.includes('actualizada')
                  ? 'p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm'
                  : 'p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm'">
                {{ mensajePassword }}
              </div>

              <div>
                <label class="text-sm text-gray-500 block mb-2">Contraseña actual</label>
                <input [(ngModel)]="passwordActual" type="password"
                  class="w-full rounded-2xl bg-gray-50 border border-gray-200 p-4 focus:outline-none focus:border-red-500">
              </div>
              <div>
                <label class="text-sm text-gray-500 block mb-2">Nueva contraseña</label>
                <input [(ngModel)]="passwordNueva" type="password"
                  class="w-full rounded-2xl bg-gray-50 border border-gray-200 p-4 focus:outline-none focus:border-red-500">
              </div>
              <div>
                <label class="text-sm text-gray-500 block mb-2">Confirmar contraseña</label>
                <input [(ngModel)]="passwordConfirm" type="password"
                  class="w-full rounded-2xl bg-gray-50 border border-gray-200 p-4 focus:outline-none focus:border-red-500">
              </div>
              <button (click)="cambiarPassword()"
                class="w-full py-3 border border-red-600 text-red-600 rounded-2xl font-semibold hover:bg-red-50 transition">
                Actualizar contraseña
              </button>
            </div>

            <!-- Solicitudes especiales -->
            <div class="rounded-3xl border border-gray-200 p-8">
              <div class="flex items-center justify-between mb-4">
                <p class="text-xl font-semibold text-gray-800">Solicitudes especiales</p>
                <a routerLink="/cliente/solicitud-especial"
                  class="rounded-2xl bg-red-600 px-4 py-2 text-white font-semibold text-sm hover:bg-red-700 transition">
                  Nueva
                </a>
              </div>
              <div *ngIf="solicitudes.length === 0" class="text-sm text-gray-400 text-center py-4">
                Sin solicitudes registradas.
              </div>
              <div class="space-y-3">
                <div *ngFor="let s of solicitudes" class="rounded-2xl bg-gray-50 border border-gray-100 p-4">
                  <p class="font-semibold text-gray-800 text-sm">{{ s.descripcion }}</p>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ s.creadoEn | date:'dd MMM yyyy':'UTC' }} ·
                    <span [class]="s.estado === 'aprobada' ? 'text-green-600' : s.estado === 'rechazada' ? 'text-red-600' : 'text-yellow-600'" class="font-semibold capitalize">
                      {{ s.estado }}
                    </span>
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  `
})
export class PerfilComponent implements OnInit {
  usuario: Usuario | null = null;
  solicitudes: SolicitudEspecial[] = [];
  nombre = ''; apellido = ''; telefono = '';
  passwordActual = ''; passwordNueva = ''; passwordConfirm = '';
  mensajePerfil = ''; mensajePassword = '';
  guardando = false;

  constructor(
    private usuarioSvc: UsuarioService,
    private solicitudSvc: SolicitudService
  ) {}

  ngOnInit(): void {
    this.usuarioSvc.obtenerPerfil().subscribe((u: Usuario) => {
      this.usuario = u;
      this.nombre = u.nombre;
      this.apellido = u.apellido ?? '';
      this.telefono = u.telefono ?? '';
    });
    this.solicitudSvc.misSolicitudes().subscribe((s: SolicitudEspecial[]) => this.solicitudes = s.slice(0, 3));
  }

  guardarPerfil(): void {
    this.guardando = true;
    this.mensajePerfil = '';
    this.usuarioSvc.actualizarPerfil({ nombre: this.nombre, apellido: this.apellido, telefono: this.telefono }).subscribe({
      next: () => { this.mensajePerfil = 'Cambios guardados'; this.guardando = false; },
      error: () => { this.mensajePerfil = 'Error al guardar'; this.guardando = false; }
    });
  }

  cambiarPassword(): void {
    if (this.passwordNueva !== this.passwordConfirm) {
      this.mensajePassword = 'Las contraseñas no coinciden';
      return;
    }
    this.mensajePassword = '';
    this.usuarioSvc.cambiarPassword(this.passwordActual, this.passwordNueva).subscribe({
      next: () => {
        this.mensajePassword = 'Contraseña actualizada';
        this.passwordActual = this.passwordNueva = this.passwordConfirm = '';
      },
      error: (err: any) => this.mensajePassword = err.error?.mensaje || 'Error al cambiar contraseña'
    });
  }
}
