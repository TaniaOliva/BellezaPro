import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../core/services/usuario.service';
import { Usuario } from '../../core/models';

@Component({
  selector: 'app-estilista-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white min-h-screen">
      <!-- Header -->
      <div class="bg-red-50 px-8 py-6 border-b border-gray-200">
        <h1 class="text-2xl font-bold text-gray-800">Mi Perfil</h1>
        <p class="text-gray-600 text-sm mt-1">Gestiona tu información profesional</p>
      </div>

      <div class="px-8 py-8 max-w-4xl">
        <!-- Información básica -->
        <div class="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 class="text-xl font-bold text-gray-800 mb-6">Información Básica</h2>
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre completo</label>
              <input type="text" value="Sofia Rodriguez" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-red-600">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input type="email" value="sofia@example.com" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-red-600">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
              <input type="tel" value="+504 9234-5678" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-red-600">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Experiencia (años)</label>
              <input type="number" value="5" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-red-600">
            </div>
          </div>
        </div>

        <!-- Especialidades -->
        <div class="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Mis Especialidades</h2>
          <div class="grid grid-cols-3 gap-3 mb-4">
            <div *ngFor="let esp of especialidades; let i = index" class="flex items-center">
              <input
                type="checkbox"
                [checked]="esp.activa"
                (change)="toggleEspecialidad(i)"
                class="w-4 h-4 border border-gray-300 rounded accent-red-600">
              <label class="ml-2 text-gray-700 font-medium">{{ esp.nombre }}</label>
            </div>
          </div>
          <button (click)="guardarEspecialidades()" class="bg-red-600 text-white rounded-lg px-6 py-2 font-semibold hover:bg-red-700 transition">
            Guardar especialidades
          </button>
        </div>

        <!-- Horarios -->
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Horario de Trabajo</h2>
          <div class="space-y-3 mb-4">
            <div *ngFor="let h of horario; let i = index" class="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-b-0">
              <div class="w-24 font-semibold text-gray-700">{{ h.dia }}</div>
              <input
                type="checkbox"
                [checked]="h.activo"
                (change)="toggleHorario(i)"
                class="w-4 h-4 border border-gray-300 rounded accent-red-600">
              <input
                *ngIf="h.activo"
                type="time"
                [(ngModel)]="h.inicio"
                class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-red-600">
              <span *ngIf="h.activo" class="text-gray-600">-</span>
              <input
                *ngIf="h.activo"
                type="time"
                [(ngModel)]="h.fin"
                class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-red-600">
            </div>
          </div>
          <button (click)="guardarHorario()" class="bg-red-600 text-white rounded-lg px-6 py-2 font-semibold hover:bg-red-700 transition">
            Guardar horario
          </button>
        </div>
      </div>
    </div>
  `
})
export class PerfilComponent implements OnInit {
  usuario: Usuario | null = null;
  nombre = ''; apellido = ''; telefono = '';
  passwordActual = ''; passwordNueva = ''; passwordConfirm = '';
  mensajePerfil = ''; mensajePassword = '';
  guardando = false;

  especialidades = [
    { nombre: 'Manicure', activa: true },
    { nombre: 'Nail Art', activa: true },
    { nombre: 'Pedicure', activa: true },
    { nombre: 'Cortes', activa: false },
    { nombre: 'Tintes', activa: false },
    { nombre: 'Maquillaje', activa: false },
    { nombre: 'Cejas', activa: false }
  ];

  horario = [
    { dia: 'Lunes', activo: true, inicio: '09:00', fin: '18:00' },
    { dia: 'Martes', activo: true, inicio: '09:00', fin: '18:00' },
    { dia: 'Miercoles', activo: true, inicio: '09:00', fin: '18:00' },
    { dia: 'Jueves', activo: true, inicio: '09:00', fin: '18:00' },
    { dia: 'Viernes', activo: true, inicio: '09:00', fin: '18:00' },
    { dia: 'Sabado', activo: false, inicio: '', fin: '' },
    { dia: 'Domingo', activo: false, inicio: '', fin: '' }
  ];

  constructor(private usuarioSvc: UsuarioService) {}

  ngOnInit(): void {
    this.usuarioSvc.obtenerPerfil().subscribe((u: Usuario) => {
      this.usuario = u;
      this.nombre = u.nombre;
      this.apellido = u.apellido ?? '';
      this.telefono = u.telefono ?? '';
    });
  }

  toggleEspecialidad(index: number): void { this.especialidades[index].activa = !this.especialidades[index].activa; }

  toggleHorario(index: number): void {
    this.horario[index].activo = !this.horario[index].activo;
    if (!this.horario[index].activo) {
      this.horario[index].inicio = '';
      this.horario[index].fin = '';
    } else {
      this.horario[index].inicio = '09:00';
      this.horario[index].fin = '18:00';
    }
  }

  guardarEspecialidades(): void { alert('Especialidades guardadas'); }

  guardarHorario(): void { alert('Horario guardado'); }

  guardarPerfil(): void {
    this.guardando = true;
    this.usuarioSvc.actualizarPerfil({ nombre: this.nombre, apellido: this.apellido, telefono: this.telefono }).subscribe({
      next: () => { this.mensajePerfil = 'Cambios guardados'; this.guardando = false; },
      error: () => { this.mensajePerfil = 'Error al guardar'; this.guardando = false; }
    });
  }

  cambiarPassword(): void {
    if (this.passwordNueva !== this.passwordConfirm) {
      this.mensajePassword = 'Las contrasenas no coinciden';
      return;
    }
    this.usuarioSvc.cambiarPassword(this.passwordActual, this.passwordNueva).subscribe({
      next: () => {
        this.mensajePassword = 'Contrasena actualizada';
        this.passwordActual = this.passwordNueva = this.passwordConfirm = '';
      },
      error: (err: any) => this.mensajePassword = err.error?.mensaje || 'Error'
    });
  }
}
