import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CitaService } from '../../core/services/cita.service';
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

  // Cancel
  citaACancelar: Cita | null = null;
  motivoCancelacion = '';
  cancelando = false;
  errorCancelar = '';

  // Reagendar
  citaAReagendar: Cita | null = null;
  reagendarFecha = '';
  reagendarHora = '';
  reagendando = false;
  errorReagendar = '';

  readonly HORAS = [
    '09:00','09:30','10:00','10:30','11:00','11:30',
    '12:00','12:30','14:00','14:30','15:00','15:30',
    '16:00','16:30','17:00','17:30'
  ];

  get hoyStr(): string {
    const hoy = new Date();
    return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
  }

  constructor(private citaSvc: CitaService) {}

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
            return ['confirmada', 'pendiente', 'en_progreso'].includes(c.estado) && fechaStr >= hoy;
          })
          .sort((a: Cita, b: Cita) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

        this.historial = data
          .filter((c: Cita) => {
            const fechaStr = c.fecha.substring(0, 10);
            return c.estado === 'completada' || c.estado === 'cancelada' || fechaStr < hoy;
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

  abrirReagendar(cita: Cita): void {
    this.citaAReagendar = cita;
    this.reagendarFecha = '';
    this.reagendarHora = '';
    this.errorReagendar = '';
  }

  confirmarReagendar(): void {
    if (!this.reagendarFecha || !this.reagendarHora) { this.errorReagendar = 'Selecciona fecha y hora'; return; }
    if (!this.citaAReagendar) return;
    this.reagendando = true;
    this.errorReagendar = '';
    this.citaSvc.reagendar(this.citaAReagendar._id, this.reagendarFecha, this.reagendarHora).subscribe({
      next: () => { this.reagendando = false; this.citaAReagendar = null; this.cargar(); },
      error: (err: any) => { this.errorReagendar = err.error?.mensaje || 'Error al reagendar'; this.reagendando = false; }
    });
  }
}
