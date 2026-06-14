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
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
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
