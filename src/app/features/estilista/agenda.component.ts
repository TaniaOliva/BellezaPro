import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CitaService } from '../../core/services/cita.service';
import { Cita } from '../../core/models';

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

  citaACancelar: Cita | null = null;
  motivoCancelacion = '';
  enviandoCancelacion = false;
  errorCancelacion = '';

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
    this.motivoCancelacion = '';
    this.errorCancelacion = '';
  }

  ejecutarCancelacion(): void {
    if (!this.citaACancelar || !this.motivoCancelacion.trim()) return;
    this.enviandoCancelacion = true;
    this.errorCancelacion = '';
    this.citaSvc.cancelarComoEstilista(this.citaACancelar._id, this.motivoCancelacion).subscribe({
      next: () => {
        this.enviandoCancelacion = false;
        this.citaACancelar = null;
        this.motivoCancelacion = '';
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
    const base = 'text-xs font-semibold px-2 py-0.5 rounded-full';
    const map: Record<string, string> = {
      confirmada: `${base} bg-blue-100 text-blue-700`,
      terminada:  `${base} bg-green-100 text-green-700`,
    };
    return map[estado] ?? `${base} bg-gray-100 text-gray-500`;
  }

  etiquetaEstado(estado: string): string {
    const map: Record<string, string> = {
      confirmada: 'Confirmada',
      terminada:  'Terminada',
    };
    return map[estado] ?? estado;
  }
}
