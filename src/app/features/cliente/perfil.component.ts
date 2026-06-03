import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../core/services/usuario.service';
import { SolicitudService } from '../../core/services/solicitud.service';
import { Usuario, SolicitudEspecial } from '../../core/models';

@Component({
  selector: 'app-cliente-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white min-h-screen">
      <div class="max-w-6xl mx-auto px-8 py-8 space-y-8">
        <div class="bg-red-50 rounded-3xl p-8 flex flex-col lg:flex-row gap-8">
          <div class="relative flex-shrink-0">
            <div class="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-4xl">
              <span class="material-symbols-outlined">person</span>
            </div>
            <button class="absolute -bottom-1 -right-1 rounded-full bg-primary px-3 py-3 text-white shadow-lg">
              <span class="material-symbols-outlined text-lg">photo_camera</span>
            </button>
          </div>
          <div class="flex-1 space-y-2">
            <div class="flex flex-wrap items-center gap-3">
              <p class="text-3xl font-bold text-gray-800">María Garcia</p>
              <span class="rounded-full bg-secondary-container px-3 py-1 text-sm text-secondary">Cliente</span>
            </div>
            <p class="text-gray-600">Miembro desde Enero 2025</p>
            <p class="text-sm text-gray-500">Correo: maria.garcia&#64;email.com</p>
          </div>
          <div class="grid grid-cols-2 gap-4 w-full lg:w-auto">
            <div class="rounded-3xl bg-white p-5 shadow-sm text-center">
              <p class="text-xs uppercase text-secondary">Visitas</p>
              <p class="text-2xl font-bold text-gray-800">12</p>
            </div>
            <div class="rounded-3xl bg-white p-5 shadow-sm text-center">
              <p class="text-xs uppercase text-secondary">Citas este mes</p>
              <p class="text-2xl font-bold text-gray-800">3</p>
            </div>
          </div>
        </div>

        <div class="grid gap-8 lg:grid-cols-2">
          <div class="rounded-3xl border border-gray-200 bg-surface p-8 space-y-6">
            <div class="flex items-center justify-between">
              <p class="text-xl font-semibold text-gray-800">Información personal</p>
              <button class="text-primary font-semibold">Editar</button>
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <p class="text-sm text-secondary">Nombre</p>
                <p class="mt-2 rounded-3xl bg-white p-4 text-gray-800">María Garcia</p>
              </div>
              <div>
                <p class="text-sm text-secondary">Teléfono</p>
                <p class="mt-2 rounded-3xl bg-white p-4 text-gray-800">+504 9988-7766</p>
              </div>
              <div>
                <p class="text-sm text-secondary">Correo</p>
                <p class="mt-2 rounded-3xl bg-white p-4 text-gray-800">maria.garcia&#64;email.com</p>
              </div>
              <div>
                <p class="text-sm text-secondary">Cumpleaños</p>
                <p class="mt-2 rounded-3xl bg-white p-4 text-gray-800">10 Jun 1990</p>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div class="rounded-3xl border border-gray-200 bg-surface p-8">
              <div class="flex items-center justify-between mb-4">
                <p class="text-xl font-semibold text-gray-800">Seguridad</p>
                <button class="text-primary font-semibold">Cambiar</button>
              </div>
              <div class="space-y-4">
                <div class="rounded-3xl bg-white p-4">
                  <p class="text-sm text-secondary">Contraseña</p>
                  <p class="mt-2 text-gray-800 font-semibold">Última actualización hace 3 meses</p>
                </div>
              </div>
            </div>
            <div class="rounded-3xl border border-gray-200 bg-surface p-8">
              <div class="flex items-center justify-between mb-4">
                <p class="text-xl font-semibold text-gray-800">Solicitudes especiales</p>
                <button class="rounded-2xl bg-primary px-4 py-2 text-white font-semibold">Nueva solicitud</button>
              </div>
              <div class="space-y-4">
                <div class="rounded-3xl bg-white p-4">
                  <p class="font-semibold text-gray-800">Prueba peinado novia</p>
                  <p class="text-sm text-secondary mt-1">12 Oct 2024 · Pendiente</p>
                </div>
                <div class="rounded-3xl bg-white p-4">
                  <p class="font-semibold text-gray-800">Keratina orgánica</p>
                  <p class="text-sm text-secondary mt-1">05 Sep 2024 · Aprobada</p>
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

