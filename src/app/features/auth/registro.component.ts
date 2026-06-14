import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
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
