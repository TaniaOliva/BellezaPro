import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../../core/services/notificacion.service';
import { ReporteService } from '../../../core/services/reporte.service';
import { CitaService } from '../../../core/services/cita.service';
import { Notificacion, ReporteCliente, Cita } from '../../../core/models';

const ICONO_POR_TIPO: Record<string, { icon: string; bg: string; text: string }> = {
  cita:      { icon: 'calendar_today', bg: 'bg-blue-50',   text: 'text-blue-600' },
  solicitud: { icon: 'star',           bg: 'bg-purple-50', text: 'text-purple-600' },
  sistema:   { icon: 'notifications',  bg: 'bg-gray-100',  text: 'text-gray-600' },
};

@Component({
  selector: 'app-admin-notificaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notificaciones.component.html',
})
export class NotificacionesAdminComponent implements OnInit {
  notificaciones: Notificacion[] = [];
  filtroActivo = 'todas';
  cargando = true;

  // Detail modal
  notifSeleccionada: Notificacion | null = null;
  detalleReporte: ReporteCliente | null = null;
  detalleCita: Cita | null = null;
  cargandoDetalle = false;
  errorDetalle = '';

  constructor(
    private notifSvc: NotificacionService,
    private reporteSvc: ReporteService,
    private citaSvc: CitaService
  ) {}

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.cargando = true;
    this.notifSvc.listar().subscribe({
      next: (data) => { this.notificaciones = data; this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }

  get filtradas(): Notificacion[] {
    if (this.filtroActivo === 'todas') return this.notificaciones;
    return this.notificaciones.filter(n => n.tipo === this.filtroActivo);
  }

  get noHayNoLeidas(): boolean {
    return this.notificaciones.every(n => n.leida);
  }

  clickNotificacion(n: Notificacion): void {
    if (!n.leida) {
      this.notifSvc.marcarLeida(n._id).subscribe(() => { n.leida = true; });
    }

    if (!n.referencia) return;

    this.notifSeleccionada = n;
    this.detalleReporte = null;
    this.detalleCita = null;
    this.cargandoDetalle = true;
    this.errorDetalle = '';

    if (n.tipo === 'sistema') {
      this.reporteSvc.obtener(n.referencia).subscribe({
        next: (r) => { this.detalleReporte = r; this.cargandoDetalle = false; },
        error: () => { this.errorDetalle = 'No se pudieron cargar los detalles del reporte.'; this.cargandoDetalle = false; }
      });
    } else if (n.tipo === 'cita') {
      this.citaSvc.obtenerPorAdmin(n.referencia).subscribe({
        next: (c) => { this.detalleCita = c; this.cargandoDetalle = false; },
        error: () => { this.errorDetalle = 'No se pudieron cargar los detalles de la cita.'; this.cargandoDetalle = false; }
      });
    } else {
      this.cargandoDetalle = false;
    }
  }

  cerrarDetalle(): void {
    this.notifSeleccionada = null;
    this.detalleReporte = null;
    this.detalleCita = null;
  }

  marcarLeida(n: Notificacion): void {
    if (n.leida) return;
    this.notifSvc.marcarLeida(n._id).subscribe(() => { n.leida = true; });
  }

  marcarTodas(): void {
    this.notifSvc.marcarTodas().subscribe(() => {
      this.notificaciones.forEach(n => n.leida = true);
    });
  }

  iconoMeta(tipo: string): { icon: string; bg: string; text: string } {
    return ICONO_POR_TIPO[tipo] ?? ICONO_POR_TIPO['sistema'];
  }

  formatFecha(fecha: string): string {
    const diff = Date.now() - new Date(fecha).getTime();
    const min = Math.floor(diff / 60000);
    if (min < 1)  return 'ahora';
    if (min < 60) return `hace ${min} min`;
    const h = Math.floor(min / 60);
    if (h < 24)   return `hace ${h} h`;
    const d = Math.floor(h / 24);
    if (d === 1)  return 'ayer';
    return `hace ${d} días`;
  }

  formatFechaLarga(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-HN', {
      year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
    });
  }
}
