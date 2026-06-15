import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../core/services/usuario.service';
import { AuthService } from '../../core/services/auth.service';
import { Usuario } from '../../core/models';

@Component({
  selector: 'app-cliente-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  usuario: Usuario | null = null;

  nombre = ''; apellido = ''; telefono = '';
  private originalNombre = ''; private originalApellido = ''; private originalTelefono = '';

  passwordActual = ''; passwordNueva = ''; passwordConfirm = '';
  mensajePerfil = ''; mensajePassword = '';
  guardando = false; cambiandoPassword = false;

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
      this.originalNombre = this.nombre;
      this.originalApellido = this.apellido;
      this.originalTelefono = this.telefono;
    });
  }

  get hayCambios(): boolean {
    return this.nombre !== this.originalNombre ||
      this.apellido !== this.originalApellido ||
      this.telefono !== this.originalTelefono;
  }

  guardarPerfil(): void {
    if (!this.nombre.trim()) {
      this.mostrarMensajePerfil('El nombre es obligatorio');
      return;
    }
    this.guardando = true;
    this.mensajePerfil = '';
    this.usuarioSvc.actualizarPerfil({ nombre: this.nombre.trim(), apellido: this.apellido.trim(), telefono: this.telefono.trim() }).subscribe({
      next: () => {
        this.originalNombre = this.nombre;
        this.originalApellido = this.apellido;
        this.originalTelefono = this.telefono;
        if (this.usuario) {
          this.usuario = { ...this.usuario, nombre: this.nombre, apellido: this.apellido, telefono: this.telefono };
        }
        this.authSvc.actualizarUsuario({ nombre: this.nombre, apellido: this.apellido, telefono: this.telefono });
        this.guardando = false;
        this.mostrarMensajePerfil('Cambios guardados');
      },
      error: () => {
        this.guardando = false;
        this.mostrarMensajePerfil('Error al guardar');
      }
    });
  }

  cambiarPassword(): void {
    if (!this.passwordActual) {
      this.mostrarMensajePassword('Ingresa tu contraseña actual');
      return;
    }
    if (this.passwordNueva.length < 8) {
      this.mostrarMensajePassword('La nueva contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (this.passwordNueva !== this.passwordConfirm) {
      this.mostrarMensajePassword('Las contraseñas no coinciden');
      return;
    }
    this.cambiandoPassword = true;
    this.mensajePassword = '';
    this.usuarioSvc.cambiarPassword(this.passwordActual, this.passwordNueva).subscribe({
      next: () => {
        this.cambiandoPassword = false;
        this.passwordActual = this.passwordNueva = this.passwordConfirm = '';
        this.mostrarMensajePassword('Contraseña actualizada');
      },
      error: (err: any) => {
        this.cambiandoPassword = false;
        this.mostrarMensajePassword(err.error?.mensaje || 'Error al cambiar contraseña');
      }
    });
  }

  private mostrarMensajePerfil(msg: string): void {
    this.mensajePerfil = msg;
    setTimeout(() => this.mensajePerfil = '', 4000);
  }

  private mostrarMensajePassword(msg: string): void {
    this.mensajePassword = msg;
    setTimeout(() => this.mensajePassword = '', 4000);
  }
}
