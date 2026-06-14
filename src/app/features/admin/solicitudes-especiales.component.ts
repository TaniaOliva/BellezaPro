import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitudService } from '../../core/services/solicitud.service';
import { SolicitudEspecial } from '../../core/models';

@Component({
  selector: 'app-admin-solicitudes-especiales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitudes-especiales.component.html',
  styleUrl: './solicitudes-especiales.component.css'
})
export class SolicitudesEspecialesComponent implements OnInit {
  solicitudes: SolicitudEspecial[] = [];
  seleccionada: SolicitudEspecial | null = null;
  cargando = true;
  precio = 0;
  duracion = 0;
  respuesta = '';
  error = '';
  guardando = false;
  filtroEstado = 'pendiente';

  readonly tabs = [
    { label: 'Pendientes', value: 'pendiente' },
    { label: 'Aprobadas',  value: 'aprobada' },
    { label: 'Rechazadas', value: 'rechazada' },
  ];

  constructor(private solicitudSvc: SolicitudService) {}

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.solicitudSvc.listarTodas().subscribe({
      next: (data: SolicitudEspecial[]) => { this.solicitudes = data; this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }

  get solicitudesFiltradas(): SolicitudEspecial[] {
    return this.solicitudes.filter(s => s.estado === this.filtroEstado);
  }

  contarPorEstado(estado: string): number {
    return this.solicitudes.filter(s => s.estado === estado).length;
  }

  estadoClase(estado: string): string {
    if (estado === 'aprobada')  return 'bg-green-100 text-green-700';
    if (estado === 'rechazada') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  }

  abrir(s: SolicitudEspecial): void {
    this.seleccionada = s;
    this.precio = s.precioEstimado ?? 0;
    this.duracion = s.duracionEstimada ?? 0;
    this.respuesta = s.respuesta ?? '';
    this.error = '';
  }

  aprobar(): void {
    if (!this.seleccionada) return;
    this.guardando = true;
    this.error = '';
    this.solicitudSvc.responder(this.seleccionada._id, {
      estado: 'aprobada', respuesta: this.respuesta,
      precioEstimado: this.precio, duracionEstimada: this.duracion
    }).subscribe({
      next: () => { this.seleccionada = null; this.guardando = false; this.cargar(); },
      error: (err: any) => { this.error = err.error?.mensaje || 'Error al aprobar'; this.guardando = false; }
    });
  }

  rechazar(): void {
    if (!this.seleccionada) return;
    this.guardando = true;
    this.error = '';
    this.solicitudSvc.responder(this.seleccionada._id, {
      estado: 'rechazada', respuesta: this.respuesta
    }).subscribe({
      next: () => { this.seleccionada = null; this.guardando = false; this.cargar(); },
      error: () => { this.guardando = false; }
    });
  }
}
