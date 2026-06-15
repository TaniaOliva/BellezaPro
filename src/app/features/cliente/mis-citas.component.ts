import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CitaService } from '../../core/services/cita.service';
import { ServicioService } from '../../core/services/servicio.service';
import { BookingService } from '../../core/services/booking.service';
import { Cita } from '../../core/models';

@Component({
  selector: 'app-cliente-mis-citas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mis-citas.component.html',
  styleUrl: './mis-citas.component.css'
})
export class MisCitasComponent implements OnInit {
  citas: Cita[] = [];
  proximas: Cita[] = [];
  historial: Cita[] = [];
  activeTab = 'proximas';
  cargando = true;

  citaACancelar: Cita | null = null;
  motivoCancelacion = '';
  cancelando = false;
  errorCancelar = '';

  get hoyStr(): string {
    const hoy = new Date();
    return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
  }

  constructor(
    private citaSvc: CitaService,
    private router: Router,
    private servicioSvc: ServicioService,
    private bookingSvc: BookingService
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.citaSvc.misCitas().subscribe({
      next: (data: Cita[]) => {
        this.citas = data;
        const hoy = this.hoyStr;

        this.proximas = data
          .filter((c: Cita) => {
            const fechaStr = c.fecha.substring(0, 10);
            return c.estado === 'confirmada' && fechaStr >= hoy;
          })
          .sort((a: Cita, b: Cita) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

        this.historial = data
          .filter((c: Cita) => {
            const fechaStr = c.fecha.substring(0, 10);
            return c.estado === 'terminada' || c.estado === 'cancelada' || fechaStr < hoy;
          })
          .sort((a: Cita, b: Cita) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }

  abrirCancelar(cita: Cita): void {
    this.citaACancelar = cita;
    this.motivoCancelacion = '';
    this.errorCancelar = '';
  }

  confirmarCancelacion(): void {
    if (!this.motivoCancelacion.trim()) { this.errorCancelar = 'Por favor escribe un motivo'; return; }
    if (!this.citaACancelar) return;
    this.cancelando = true;
    this.errorCancelar = '';
    this.citaSvc.cancelar(this.citaACancelar._id, this.motivoCancelacion).subscribe({
      next: () => { this.cancelando = false; this.citaACancelar = null; this.cargar(); },
      error: (err: any) => { this.errorCancelar = err.error?.mensaje || 'Error al cancelar'; this.cancelando = false; }
    });
  }

  reagendar(cita: Cita): void {
    const servicioRef = cita.servicioId as any;
    const servicioId = servicioRef?._id ?? (typeof servicioRef === 'string' ? servicioRef : null);
    if (!servicioId) { this.router.navigate(['/cliente/servicios']); return; }
    this.servicioSvc.obtener(servicioId).subscribe({
      next: (servicio) => {
        this.bookingSvc.preseleccionarServicio(servicio);
        this.router.navigate(['/cliente/servicios/opciones']);
      },
      error: () => this.router.navigate(['/cliente/servicios'])
    });
  }
}
