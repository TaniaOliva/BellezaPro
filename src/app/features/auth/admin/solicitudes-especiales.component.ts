import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitudService } from '../../../core/services/solicitud.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { BloqueoService } from '../../../core/services/bloqueo.service';
import { NotificacionService } from '../../../core/services/notificacion.service';
import { CitaService } from '../../../core/services/cita.service';
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

  precio = 0;
  duracion = 0;
  respuesta = '';
  fechaPropuesta = '';
  horaPropuesta = '';
  estilistaAsignadaId = '';

  error = '';
  guardando = false;
  filtroEstado = 'pendiente';

  bloqueos: { fechaInicio: string; fechaFin: string; cierreTotalSalon: boolean; estilistaId?: any }[] = [];

  mesActual = new Date();
  diasMes: Date[] = [];
  spacers: null[] = [];
  diasBloqueadosSet: Set<string> = new Set();
  razonesBloqueoMap: Map<string, string> = new Map();

  todosSlots: { hora: string; disponible: boolean }[] = [];
  cargandoSlots = false;
  mensajeBloqueoFecha = '';

  readonly tabs = [
    { label: 'Pendientes / Contraoferta', value: 'pendiente' },
    { label: 'Propuestas',  value: 'propuesta' },
    { label: 'Aceptadas',   value: 'aceptada' },
    { label: 'Rechazadas',  value: 'rechazada' },
  ];

  constructor(
    private solicitudSvc: SolicitudService,
    private usuarioSvc: UsuarioService,
    private bloqueoSvc: BloqueoService,
    private notifSvc: NotificacionService,
    private citaSvc: CitaService
  ) {}

  ngOnInit(): void {
    this.cargar();
    this.usuarioSvc.listarEstilistas().subscribe({ next: (data) => this.estilistas = data });
    this.notifSvc.marcarPorTipo('solicitud').subscribe();
    const hoy = new Date();
    const inicio = hoy.toISOString().slice(0, 10);
    const finAnio = new Date(hoy.getFullYear() + 1, hoy.getMonth(), hoy.getDate()).toISOString().slice(0, 10);
    this.bloqueoSvc.listarEnRango(inicio, finAnio).subscribe({
      next: (data: any[]) => {
        this.bloqueos = data;
        if (this.seleccionada) this.computarDiasBloqueados();
      },
      error: () => {}
    });
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
    this.todosSlots = [];
    this.mensajeBloqueoFecha = '';

    if (this.fechaPropuesta) {
      const [y, m] = this.fechaPropuesta.split('-').map(Number);
      this.mesActual = new Date(y, m - 1, 1);
    } else {
      this.mesActual = new Date();
    }
    this.generarDias();
    this.computarDiasBloqueados();

    if (this.fechaPropuesta && this.duracion > 0) {
      this.cargarSlots();
    }
  }

  generarDias(): void {
    const inicio = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth(), 1);
    const fin = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() + 1, 0);
    this.diasMes = [];
    for (let d = new Date(inicio); d <= fin; d.setDate(d.getDate() + 1)) {
      this.diasMes.push(new Date(d));
    }
    this.spacers = Array(inicio.getDay()).fill(null);
  }

  getFechaStr(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  }

  esPasado(dia: Date): boolean {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return dia < hoy;
  }

  esBloqueado(dia: Date): boolean {
    return this.diasBloqueadosSet.has(this.getFechaStr(dia));
  }

  computarDiasBloqueados(): void {
    const set = new Set<string>();
    const reasons = new Map<string, string>();
    const inicioMes = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth(), 1);
    const finMes = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() + 1, 0);

    for (const b of this.bloqueos) {
      const bid = typeof b.estilistaId === 'object' ? b.estilistaId?._id : b.estilistaId;
      const esRelevante = b.cierreTotalSalon || (this.estilistaAsignadaId && bid === this.estilistaAsignadaId);
      if (!esRelevante) continue;

      const razon = (b as any).razon
        || (b.cierreTotalSalon ? 'El salón está cerrado este período.' : 'La estilista no está disponible.');

      const bIni = new Date(b.fechaInicio.slice(0, 10) + 'T12:00:00');
      const bFin = new Date(b.fechaFin.slice(0, 10) + 'T12:00:00');
      const cur = new Date(Math.max(bIni.getTime(), inicioMes.getTime()));
      const end = new Date(Math.min(bFin.getTime(), finMes.getTime()));

      while (cur <= end) {
        const key = this.getFechaStr(cur);
        set.add(key);
        reasons.set(key, razon);
        cur.setDate(cur.getDate() + 1);
      }
    }

    this.diasBloqueadosSet = set;
    this.razonesBloqueoMap = reasons;
  }

  mesSiguiente(): void {
    this.mesActual = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() + 1, 1);
    this.generarDias();
    this.computarDiasBloqueados();
  }

  mesAnterior(): void {
    this.mesActual = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() - 1, 1);
    this.generarDias();
    this.computarDiasBloqueados();
  }

  seleccionarFechaCalendario(dia: Date): void {
    if (this.esPasado(dia)) return;
    const fechaStr = this.getFechaStr(dia);
    this.fechaPropuesta = fechaStr;
    this.horaPropuesta = '';
    this.todosSlots = [];
    this.mensajeBloqueoFecha = '';

    if (this.esBloqueado(dia)) {
      this.mensajeBloqueoFecha = this.razonesBloqueoMap.get(fechaStr) || 'Este día no está disponible.';
      return;
    }

    if (this.duracion > 0) {
      this.cargarSlots();
    }
  }

  cargarSlots(): void {
    if (!this.fechaPropuesta || this.duracion <= 0) return;
    this.cargandoSlots = true;
    this.todosSlots = [];
    const estilistaId = this.estilistaAsignadaId || undefined;
    this.citaSvc.getDisponibilidad(this.fechaPropuesta, this.duracion, estilistaId).subscribe({
      next: (res) => {
        this.cargandoSlots = false;
        if (res.bloqueado === 'salon') {
          this.mensajeBloqueoFecha = 'El salón está cerrado ese día.';
        } else if (res.bloqueado === 'estilista') {
          this.mensajeBloqueoFecha = 'La estilista no está disponible ese día.';
        } else {
          this.todosSlots = res.todos;
        }
      },
      error: () => { this.cargandoSlots = false; }
    });
  }

  seleccionarHoraSlot(slot: { hora: string; disponible: boolean }): void {
    if (!slot.disponible) return;
    this.horaPropuesta = slot.hora;
  }

  get sinDisponibles(): boolean {
    return this.todosSlots.length > 0 && this.todosSlots.every(s => !s.disponible);
  }

  onEstilistaChange(): void {
    this.computarDiasBloqueados();
    this.horaPropuesta = '';
    this.todosSlots = [];
    this.mensajeBloqueoFecha = '';
    if (this.fechaPropuesta && this.duracion > 0) {
      this.cargarSlots();
    }
  }

  onDuracionChange(): void {
    this.horaPropuesta = '';
    this.todosSlots = [];
    if (this.fechaPropuesta && this.duracion > 0) {
      this.cargarSlots();
    }
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
