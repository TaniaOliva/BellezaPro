import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitaService } from '../../core/services/cita.service';
import { Cita } from '../../core/models';

@Component({
  selector: 'app-estilista-agenda',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.css'
})
export class AgendaComponent implements OnInit {
  citas: Cita[] = [];
  cargando = true;
  citaACancelar: Cita | null = null;

  citasHoy: Cita[] = [];
  citasProximas: Cita[] = [];
  citasCanceladasHoy: Cita[] = [];
  citasCanceladasFuturas: Cita[] = [];

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
      error: () => this.cargando = false
    });
  }

  private clasificar(): void {
    const hoyStr = new Date().toISOString().slice(0, 10);

    this.citasHoy = this.citas.filter(c =>
      c.fecha.slice(0, 10) === hoyStr && c.estado !== 'cancelada'
    );

    this.citasProximas = this.citas.filter(c =>
      c.fecha.slice(0, 10) > hoyStr && ['confirmada', 'pendiente'].includes(c.estado)
    );

    this.citasCanceladasHoy = this.citas.filter(c =>
      c.fecha.slice(0, 10) === hoyStr && c.estado === 'cancelada'
    );

    this.citasCanceladasFuturas = this.citas.filter(c =>
      c.fecha.slice(0, 10) > hoyStr && c.estado === 'cancelada'
    );
  }

  cambiarEstado(cita: Cita, estado: string): void {
    this.citaSvc.actualizarEstado(cita._id, estado).subscribe(() => this.cargar());
  }

  confirmarCancelar(cita: Cita): void {
    this.citaACancelar = cita;
  }

  ejecutarCancelacion(): void {
    if (this.citaACancelar) {
      this.cambiarEstado(this.citaACancelar, 'cancelada');
      this.citaACancelar = null;
    }
  }

  badgeEstado(estado: string): string {
    const base = 'text-xs font-semibold px-2 py-0.5 rounded-full';
    const map: Record<string, string> = {
      confirmada:  `${base} bg-blue-100 text-blue-700`,
      en_progreso: `${base} bg-orange-100 text-orange-700`,
      completada:  `${base} bg-green-100 text-green-700`,
      cancelada:   `${base} bg-gray-100 text-gray-500`,
      pendiente:   `${base} bg-yellow-100 text-yellow-700`,
    };
    return map[estado] ?? `${base} bg-gray-100 text-gray-500`;
  }

  etiquetaEstado(estado: string): string {
    const map: Record<string, string> = {
      confirmada:  'Confirmada',
      en_progreso: 'En progreso',
      completada:  'Completada',
      cancelada:   'Cancelada',
      pendiente:   'Pendiente',
    };
    return map[estado] ?? estado;
  }
}
