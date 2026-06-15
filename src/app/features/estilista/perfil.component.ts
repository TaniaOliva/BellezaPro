import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../core/services/usuario.service';
import { AuthService } from '../../core/services/auth.service';
import { Usuario } from '../../core/models';

@Component({
  selector: 'app-estilista-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  usuario: Usuario | null = null;

  nombre = ''; apellido = ''; telefono = '';
  private origNombre = ''; private origApellido = ''; private origTelefono = '';
  guardandoPerfil = false;
  mensajePerfil = '';

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
    });
  }

  get hayCambiosPerfil(): boolean {
    return this.nombre !== this.origNombre ||
      this.apellido !== this.origApellido ||
      this.telefono !== this.origTelefono;
  }

  guardarPerfil(): void {
    if (!this.nombre.trim()) { this.mostrarMsg('perfil', 'El nombre es obligatorio'); return; }
    this.guardandoPerfil = true;
    this.usuarioSvc.actualizarPerfil({
      nombre: this.nombre.trim(),
      apellido: this.apellido.trim(),
      telefono: this.telefono.trim()
    }).subscribe({
      next: () => {
        this.origNombre = this.nombre;
        this.origApellido = this.apellido;
        this.origTelefono = this.telefono;
        if (this.usuario) {
          this.usuario = { ...this.usuario, nombre: this.nombre, apellido: this.apellido, telefono: this.telefono };
        }
        this.authSvc.actualizarUsuario({ nombre: this.nombre, apellido: this.apellido, telefono: this.telefono });
        this.guardandoPerfil = false;
        this.mostrarMsg('perfil', 'Cambios guardados');
      },
      error: () => { this.guardandoPerfil = false; this.mostrarMsg('perfil', 'Error al guardar'); }
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

  private mostrarMsg(campo: 'perfil' | 'password', msg: string): void {
    if (campo === 'perfil') {
      this.mensajePerfil = msg;
      setTimeout(() => this.mensajePerfil = '', 4000);
    } else {
      this.mensajePassword = msg;
      setTimeout(() => this.mensajePassword = '', 4000);
    }
  }
}
