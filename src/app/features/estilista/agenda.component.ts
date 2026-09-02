import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CitaService } from '../../core/services/cita.service';
import { Cita } from '../../core/models';
import { MOTIVOS_CANCELACION_ESTILISTA, labelMotivoCancelacion, labelEstadoCita, badgeEstadoCita } from '../../core/models/catalogos';

@Component({
  selector: 'app-estilista-agenda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.css'
})
export class AgendaComponent implements OnInit {
  citas: Cita[] = [];
  cargando = true;

  citasHoy: Cita[] = [];
  citasProximas: Cita[] = [];
  citasHistorial: Cita[] = [];
  mostrarTodoHistorial = false;

  citaACancelar: Cita | null = null;
  motivoSel = '';
  detalleSel = '';
  enviandoCancelacion = false;
  errorCancelacion = '';

  readonly motivosEstilista = MOTIVOS_CANCELACION_ESTILISTA;
  labelMotivo = labelMotivoCancelacion;

  // Modal calificación cliente
  citaACalificar: Cita | null = null;
  estrellasSeleccionadas = 0;
  estrellaHover = 0;
  comentarioCalificacion = '';
  enviandoCalificacion = false;
  readonly rangoEstrellas = [1, 2, 3, 4, 5];

  hoyFormateado = new Date().toLocaleDateString('es-HN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  constructor(private citaSvc: CitaService) {}

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.cargando = true;
    this.citaSvc.miAgenda().subscribe({
      next: (data: Cita[]) => {
        this.citas = data;
        this.clasificar();
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  private clasificar(): void {
    const hoyStr = new Date().toISOString().slice(0, 10);

    this.citasHoy = this.citas.filter(c =>
      c.fecha.slice(0, 10) === hoyStr && c.estado === 'confirmada'
    );

    this.citasProximas = this.citas.filter(c =>
      c.fecha.slice(0, 10) > hoyStr && c.estado === 'confirmada'
    );

    // Todo lo que no es de hoy ni futuro confirmado va al historial, para que
    // ninguna cita quede sin aparecer en pantalla. Mas reciente primero.
    this.citasHistorial = this.citas
      .filter(c => !this.citasHoy.includes(c) && !this.citasProximas.includes(c))
      .sort((a, b) => (b.fecha + b.hora).localeCompare(a.fecha + a.hora));
  }

  get historialVisible(): Cita[] {
    return this.mostrarTodoHistorial ? this.citasHistorial : this.citasHistorial.slice(0, 5);
  }

  marcarTerminada(cita: Cita): void {
    this.citaSvc.actualizarEstado(cita._id, 'terminada').subscribe(() => {
      this.cargar();
      this.citaACalificar = cita;
      this.estrellasSeleccionadas = 0;
      this.estrellaHover = 0;
      this.comentarioCalificacion = '';
    });
  }

  confirmarCancelar(cita: Cita): void {
    this.citaACancelar = cita;
    this.motivoSel = '';
    this.detalleSel = '';
    this.errorCancelacion = '';
  }

  ejecutarCancelacion(): void {
    if (!this.citaACancelar || !this.motivoSel) return;
    if (this.motivoSel === 'otro' && !this.detalleSel.trim()) {
      this.errorCancelacion = 'Describe el motivo'; return;
    }
    this.enviandoCancelacion = true;
    this.errorCancelacion = '';
    this.citaSvc.cancelarComoEstilista(this.citaACancelar._id, this.motivoSel, this.detalleSel.trim() || undefined).subscribe({
      next: () => {
        this.enviandoCancelacion = false;
        this.citaACancelar = null;
        this.motivoSel = '';
        this.detalleSel = '';
        this.cargar();
      },
      error: (err: any) => {
        this.enviandoCancelacion = false;
        this.errorCancelacion = err?.error?.mensaje ?? 'No se pudo cancelar la cita';
      }
    });
  }

  cerrarCalificacion(): void {
    this.citaACalificar = null;
  }

  enviarCalificacion(): void {
    if (!this.citaACalificar || this.estrellasSeleccionadas === 0) return;
    this.enviandoCalificacion = true;
    this.citaSvc.valorarCliente(
      this.citaACalificar._id,
      this.estrellasSeleccionadas,
      this.comentarioCalificacion
    ).subscribe({
      next: () => {
        this.enviandoCalificacion = false;
        this.citaACalificar = null;
      },
      error: () => { this.enviandoCalificacion = false; }
    });
  }

  badgeEstado(estado: string): string {
    return `text-xs font-semibold px-2 py-0.5 rounded-full ${badgeEstadoCita(estado)}`;
  }

  etiquetaEstado(estado: string): string {
    return labelEstadoCita(estado);
  }
}
