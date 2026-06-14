import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitudService } from '../../../core/services/solicitud.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { SolicitudEspecial, Usuario } from '../../../core/models';

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
  estilistas: Usuario[] = [];

  // Campos de propuesta
  precio = 0;
  duracion = 0;
  respuesta = '';
  fechaPropuesta = '';
  horaPropuesta = '';
  estilistaAsignadaId = '';

  error = '';
  guardando = false;
  filtroEstado = 'pendiente';

  readonly tabs = [
    { label: 'Pendientes / Contraoferta', value: 'pendiente' },
    { label: 'Propuestas',  value: 'propuesta' },
    { label: 'Aceptadas',   value: 'aceptada' },
    { label: 'Rechazadas',  value: 'rechazada' },
  ];

  readonly HORAS = [
    '09:00','09:30','10:00','10:30','11:00','11:30',
    '12:00','12:30','14:00','14:30','15:00','15:30',
    '16:00','16:30','17:00','17:30'
  ];

  constructor(
    private solicitudSvc: SolicitudService,
    private usuarioSvc: UsuarioService
  ) {}

  ngOnInit(): void {
    this.cargar();
    this.usuarioSvc.listarEstilistas().subscribe({ next: (data) => this.estilistas = data });
  }

  cargar(): void {
    this.solicitudSvc.listarTodas().subscribe({
      next: (data: SolicitudEspecial[]) => { this.solicitudes = data; this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }

  get solicitudesFiltradas(): SolicitudEspecial[] {
    if (this.filtroEstado === 'pendiente') {
      return this.solicitudes.filter(s => s.estado === 'pendiente' || s.estado === 'contraoferta');
    }
    return this.solicitudes.filter(s => s.estado === this.filtroEstado);
  }

  contarPorEstado(value: string): number {
    if (value === 'pendiente') return this.solicitudes.filter(s => s.estado === 'pendiente' || s.estado === 'contraoferta').length;
    return this.solicitudes.filter(s => s.estado === value).length;
  }

  estadoClase(estado: string): string {
    const map: Record<string, string> = {
      pendiente: 'bg-yellow-100 text-yellow-700',
      propuesta: 'bg-blue-100 text-blue-700',
      contraoferta: 'bg-orange-100 text-orange-700',
      aceptada: 'bg-green-100 text-green-700',
      rechazada: 'bg-red-100 text-red-700'
    };
    return map[estado] ?? 'bg-gray-100 text-gray-700';
  }

  estadoLabel(estado: string): string {
    const map: Record<string, string> = {
      pendiente: 'Pendiente', propuesta: 'Propuesta enviada',
      contraoferta: 'Contraoferta del cliente', aceptada: 'Aceptada', rechazada: 'Rechazada'
    };
    return map[estado] ?? estado;
  }

  abrir(s: SolicitudEspecial): void {
    this.seleccionada = s;
    this.precio = s.precioEstimado ?? 0;
    this.duracion = s.duracionEstimada ?? 0;
    this.respuesta = s.respuesta ?? '';
    this.fechaPropuesta = s.fechaPropuesta ?? '';
    this.horaPropuesta = s.horaPropuesta ?? '';
    this.estilistaAsignadaId = s.estilistaAsignada?._id ?? '';
    this.error = '';
  }

  proponer(): void {
    if (!this.seleccionada) return;
    if (!this.precio || !this.duracion || !this.fechaPropuesta || !this.horaPropuesta) {
      this.error = 'Completa precio, duración, fecha y hora para enviar la propuesta'; return;
    }
    this.guardando = true;
    this.error = '';
    this.solicitudSvc.responder(this.seleccionada._id, {
      estado: 'propuesta',
      respuesta: this.respuesta,
      precioEstimado: this.precio,
      duracionEstimada: this.duracion,
      fechaPropuesta: this.fechaPropuesta,
      horaPropuesta: this.horaPropuesta,
      estilistaAsignada: this.estilistaAsignadaId || undefined
    }).subscribe({
      next: () => { this.seleccionada = null; this.guardando = false; this.cargar(); },
      error: (err: any) => { this.error = err.error?.mensaje || 'Error al enviar'; this.guardando = false; }
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

  aceptarContraoferta(): void {
    if (!this.seleccionada) return;
    this.guardando = true;
    this.error = '';
    this.solicitudSvc.aceptarContraoferta(this.seleccionada._id).subscribe({
      next: () => { this.seleccionada = null; this.guardando = false; this.cargar(); },
      error: (err: any) => { this.error = err.error?.mensaje || 'Error'; this.guardando = false; }
    });
  }
}
