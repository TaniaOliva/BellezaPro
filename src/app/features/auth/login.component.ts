import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  cargando = false;
  mostrarPassword = false;

  constructor(private auth: AuthService, public router: Router) {}

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

  // TEMPORAL - SOLO DESARROLLO: eliminar junto con el boton en el HTML y
  // devLoginAdmin() en auth.service.ts / auth.controller.js.
  entrarComoAdminDev(): void {
    this.error = '';
    this.cargando = true;
    this.auth.devLoginAdmin().subscribe({
      next: () => this.router.navigate(['/admin/inicio']),
      error: err => {
        this.error = err.error?.mensaje || 'No se pudo entrar como admin de desarrollo';
        this.cargando = false;
      }
    });
  }
}
