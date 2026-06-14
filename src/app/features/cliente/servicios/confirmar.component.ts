import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService, BookingState } from '../../../core/services/booking.service';
import { CitaService } from '../../../core/services/cita.service';

@Component({
  selector: 'app-cliente-confirmar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './confirmar.component.html',
  styleUrl: './confirmar.component.css'
})
export class ConfirmarComponent implements OnInit {
  estado: Partial<BookingState> = {};
  notas = '';
  enviando = false;
  error = '';

  constructor(
    private bookingSvc: BookingService,
    private citaSvc: CitaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.estado = this.bookingSvc.getEstado();
    if (!this.estado.servicio || !this.estado.fecha) {
      this.router.navigate(['/cliente/servicios']);
    }
  }

  confirmar(): void {
    if (this.enviando) return;
    this.enviando = true;
    this.error = '';
    const { servicio, variantes, precioFinal, estilista, fecha, hora } = this.estado;

    const body: any = {
      servicioId: servicio._id,
      variantesElegidas: variantes,
      fecha: fecha,
      hora: hora!,
      duracion: servicio.duracion,
      precioFinal: precioFinal,
      notas: this.notas
    };

    if (estilista?._id) {
      body.estilistaId = estilista._id;
    }

    this.citaSvc.crear(body).subscribe({
      next: () => {
        this.bookingSvc.limpiar();
        this.router.navigate(['/cliente/mis-citas']);
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'El horario ya no está disponible. Elige otro.';
        this.enviando = false;
      }
    });
  }

  modificar(): void {
    this.router.navigate(['/cliente/servicios/horario']);
  }
}
