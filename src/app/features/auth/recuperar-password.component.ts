import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recuperar-password.component.html',
  styleUrl: './recuperar-password.component.css'
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
