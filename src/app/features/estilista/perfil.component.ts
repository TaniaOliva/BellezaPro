import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../core/services/usuario.service';
import { AuthService } from '../../core/services/auth.service';
import { Usuario, HorarioDisponible } from '../../core/models';

interface DiaTrabajo {
  key: keyof HorarioDisponible;
  dia: string;
  activo: boolean;
  inicio: string;
  fin: string;
}

@Component({
  selector: 'app-estilista-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white min-h-screen">
      <!-- Header -->
      <div class="bg-red-50 px-8 py-6 border-b border-gray-200">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-3xl text-gray-500">person</span>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-800">{{ usuario?.nombre }} {{ usuario?.apellido }}</h1>
            <p class="text-gray-500 text-sm">{{ usuario?.email }}</p>
          </div>
        </div>
      </div>

      <div class="px-8 py-8 max-w-4xl space-y-8">

        <!-- Información básica -->
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-6">Información Básica</h2>

          <div *ngIf="mensajePerfil"
            [class]="mensajePerfil === 'Cambios guardados'
              ? 'mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm'
              : 'mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm'">
            {{ mensajePerfil }}
          </div>

          <div class="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
              <input [(ngModel)]="nombre" type="text"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-red-600">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Apellido</label>
              <input [(ngModel)]="apellido" type="text"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-red-600">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
              <input [(ngModel)]="telefono" type="tel" placeholder="+504 0000-0000"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-red-600">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Correo</label>
              <p class="w-full border border-gray-100 rounded-lg px-4 py-2 bg-gray-50 text-gray-500 text-sm">{{ usuario?.email }}</p>
            </div>
          </div>

          <button (click)="guardarPerfil()" [disabled]="guardandoPerfil || !hayCambiosPerfil"
            class="bg-red-600 text-white rounded-lg px-6 py-2 font-semibold hover:bg-red-700 disabled:opacity-50 transition">
            {{ guardandoPerfil ? 'Guardando...' : 'Guardar cambios' }}
          </button>
        </div>

        <!-- Especialidades (solo lectura, asignadas por el admin) -->
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-gray-800">Mis Especialidades</h2>
            <span class="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Asignadas por el administrador</span>
          </div>

          <div *ngIf="!usuario?.especialidades?.length" class="text-gray-400 text-sm italic py-2">
            No tienes especialidades asignadas aún.
          </div>

          <div *ngIf="usuario?.especialidades?.length" class="flex flex-wrap gap-2">
            <span *ngFor="let esp of usuario?.especialidades"
              class="bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-full text-sm font-medium">
              {{ esp }}
            </span>
          </div>
        </div>

        <!-- Horario de trabajo -->
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Horario de Trabajo</h2>

          <div *ngIf="mensajeHorario"
            [class]="mensajeHorario === 'Horario guardado'
              ? 'mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm'
              : 'mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm'">
            {{ mensajeHorario }}
          </div>

          <div class="space-y-3 mb-5">
            <div *ngFor="let h of horario; let i = index"
              class="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-b-0">
              <div class="w-24 font-semibold text-gray-700">{{ h.dia }}</div>
              <input type="checkbox" [checked]="h.activo" (change)="toggleHorario(i)"
                class="w-4 h-4 border border-gray-300 rounded accent-red-600">
              <ng-container *ngIf="h.activo">
                <input type="time" [(ngModel)]="h.inicio"
                  class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-red-600">
                <span class="text-gray-400">—</span>
                <input type="time" [(ngModel)]="h.fin"
                  class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-red-600">
                <span *ngIf="h.inicio && h.fin && h.fin <= h.inicio" class="text-xs text-red-500">
                  La hora de fin debe ser mayor al inicio
                </span>
              </ng-container>
              <span *ngIf="!h.activo" class="text-sm text-gray-400">No disponible</span>
            </div>
          </div>

          <button (click)="guardarHorario()" [disabled]="guardandoHorario || !horarioValido"
            class="bg-red-600 text-white rounded-lg px-6 py-2 font-semibold hover:bg-red-700 disabled:opacity-50 transition">
            {{ guardandoHorario ? 'Guardando...' : 'Guardar horario' }}
          </button>
        </div>

        <!-- Cambiar contraseña -->
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Cambiar Contraseña</h2>

          <div *ngIf="mensajePassword"
            [class]="mensajePassword === 'Contraseña actualizada'
              ? 'mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm'
              : 'mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm'">
            {{ mensajePassword }}
          </div>

          <div class="grid grid-cols-1 gap-4 max-w-md mb-5">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Contraseña actual</label>
              <input [(ngModel)]="passwordActual" type="password"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-red-600">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Nueva contraseña</label>
              <input [(ngModel)]="passwordNueva" type="password"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-red-600">
              <p *ngIf="passwordNueva && passwordNueva.length < 8" class="text-xs text-red-500 mt-1">
                Mínimo 8 caracteres
              </p>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Confirmar contraseña</label>
              <input [(ngModel)]="passwordConfirm" type="password"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-red-600">
              <p *ngIf="passwordConfirm && passwordNueva !== passwordConfirm" class="text-xs text-red-500 mt-1">
                Las contraseñas no coinciden
              </p>
            </div>
          </div>

          <button (click)="cambiarPassword()" [disabled]="cambiandoPassword"
            class="border border-red-600 text-red-600 rounded-lg px-6 py-2 font-semibold hover:bg-red-50 disabled:opacity-50 transition">
            {{ cambiandoPassword ? 'Actualizando...' : 'Actualizar contraseña' }}
          </button>
        </div>

      </div>
    </div>
  `
})
export class PerfilComponent implements OnInit {
  usuario: Usuario | null = null;

  nombre = ''; apellido = ''; telefono = '';
  private origNombre = ''; private origApellido = ''; private origTelefono = '';
  guardandoPerfil = false;
  mensajePerfil = '';

  horario: DiaTrabajo[] = [
    { key: 'lunes',     dia: 'Lunes',     activo: false, inicio: '', fin: '' },
    { key: 'martes',    dia: 'Martes',    activo: false, inicio: '', fin: '' },
    { key: 'miercoles', dia: 'Miércoles', activo: false, inicio: '', fin: '' },
    { key: 'jueves',    dia: 'Jueves',    activo: false, inicio: '', fin: '' },
    { key: 'viernes',   dia: 'Viernes',   activo: false, inicio: '', fin: '' },
    { key: 'sabado',    dia: 'Sábado',    activo: false, inicio: '', fin: '' },
  ];
  guardandoHorario = false;
  mensajeHorario = '';

  passwordActual = ''; passwordNueva = ''; passwordConfirm = '';
  cambiandoPassword = false;
  mensajePassword = '';

  constructor(
    private usuarioSvc: UsuarioService,
    private authSvc: AuthService
  ) {}

  ngOnInit(): void {
    this.usuarioSvc.obtenerPerfil().subscribe((u: Usuario) => {
      this.usuario = u;
      this.nombre = u.nombre;
      this.apellido = u.apellido ?? '';
      this.telefono = u.telefono ?? '';
      this.origNombre = this.nombre;
      this.origApellido = this.apellido;
      this.origTelefono = this.telefono;

      const hd = u.horarioDisponible ?? {};
      this.horario = this.horario.map(d => {
        const day = hd[d.key];
        return day?.inicio ? { ...d, activo: true, inicio: day.inicio, fin: day.fin } : d;
      });
    });
  }

  get hayCambiosPerfil(): boolean {
    return this.nombre !== this.origNombre ||
      this.apellido !== this.origApellido ||
      this.telefono !== this.origTelefono;
  }

  get horarioValido(): boolean {
    return this.horario.filter(d => d.activo).every(d => d.inicio && d.fin && d.fin > d.inicio);
  }

  toggleHorario(index: number): void {
    this.horario[index].activo = !this.horario[index].activo;
    if (this.horario[index].activo) {
      this.horario[index].inicio = '09:00';
      this.horario[index].fin = '18:00';
    } else {
      this.horario[index].inicio = '';
      this.horario[index].fin = '';
    }
  }

  guardarPerfil(): void {
    if (!this.nombre.trim()) { this.mostrarMsg('perfil', 'El nombre es obligatorio'); return; }
    this.guardandoPerfil = true;
    this.usuarioSvc.actualizarPerfil({ nombre: this.nombre.trim(), apellido: this.apellido.trim(), telefono: this.telefono.trim() }).subscribe({
      next: () => {
        this.origNombre = this.nombre;
        this.origApellido = this.apellido;
        this.origTelefono = this.telefono;
        if (this.usuario) this.usuario = { ...this.usuario, nombre: this.nombre, apellido: this.apellido, telefono: this.telefono };
        this.authSvc.actualizarUsuario({ nombre: this.nombre, apellido: this.apellido, telefono: this.telefono });
        this.guardandoPerfil = false;
        this.mostrarMsg('perfil', 'Cambios guardados');
      },
      error: () => { this.guardandoPerfil = false; this.mostrarMsg('perfil', 'Error al guardar'); }
    });
  }

  guardarHorario(): void {
    this.guardandoHorario = true;
    const horarioDisponible: HorarioDisponible = {};
    for (const d of this.horario) {
      if (d.activo) horarioDisponible[d.key] = { inicio: d.inicio, fin: d.fin };
    }
    this.usuarioSvc.actualizarPerfil({ horarioDisponible } as any).subscribe({
      next: () => { this.guardandoHorario = false; this.mostrarMsg('horario', 'Horario guardado'); },
      error: () => { this.guardandoHorario = false; this.mostrarMsg('horario', 'Error al guardar'); }
    });
  }

  cambiarPassword(): void {
    if (!this.passwordActual) { this.mostrarMsg('password', 'Ingresa tu contraseña actual'); return; }
    if (this.passwordNueva.length < 8) { this.mostrarMsg('password', 'Mínimo 8 caracteres'); return; }
    if (this.passwordNueva !== this.passwordConfirm) { this.mostrarMsg('password', 'Las contraseñas no coinciden'); return; }
    this.cambiandoPassword = true;
    this.usuarioSvc.cambiarPassword(this.passwordActual, this.passwordNueva).subscribe({
      next: () => {
        this.cambiandoPassword = false;
        this.passwordActual = this.passwordNueva = this.passwordConfirm = '';
        this.mostrarMsg('password', 'Contraseña actualizada');
      },
      error: (err: any) => {
        this.cambiandoPassword = false;
        this.mostrarMsg('password', err.error?.mensaje || 'Error al cambiar contraseña');
      }
    });
  }

  private mostrarMsg(campo: 'perfil' | 'horario' | 'password', msg: string): void {
    switch (campo) {
      case 'perfil':   this.mensajePerfil   = msg; setTimeout(() => this.mensajePerfil   = '', 4000); break;
      case 'horario':  this.mensajeHorario  = msg; setTimeout(() => this.mensajeHorario  = '', 4000); break;
      case 'password': this.mensajePassword = msg; setTimeout(() => this.mensajePassword = '', 4000); break;
    }
  }
}
