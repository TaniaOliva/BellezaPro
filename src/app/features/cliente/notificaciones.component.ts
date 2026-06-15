import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificacionService } from '../../core/services/notificacion.service';
import { CalificacionService } from '../../core/services/calificacion.service';
import { Notificacion } from '../../core/models';

const ICONO_POR_TIPO: Record<string, { icon: string; bg: string; text: string }> = {
  cita:         { icon: 'calendar_today', bg: 'bg-blue-50',   text: 'text-blue-600' },
  solicitud:    { icon: 'auto_awesome',   bg: 'bg-purple-50', text: 'text-purple-600' },
  sistema:      { icon: 'notifications',  bg: 'bg-gray-100',  text: 'text-gray-600' },
  calificacion: { icon: 'star',           bg: 'bg-yellow-50', text: 'text-yellow-500' },
};

@Component({
  selector: 'app-cliente-notificaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notificaciones.component.html',
  styleUrl: './notificaciones.component.css'
})
export class NotificacionesComponent implements OnInit {
  notificaciones: Notificacion[] = [];
  filtroActivo = 'todas';
  cargando = true;

  // Modal calificación estilista
  citaACalificar: string | null = null;
  estrellasSeleccionadas = 0;
  estrellaHover = 0;
  comentarioCalificacion = '';
  enviandoCalificacion = false;
  errorCalificacion = '';
  readonly rangoEstrellas = [1, 2, 3, 4, 5];

  constructor(
    private notifSvc: NotificacionService,
    private calificacionSvc: CalificacionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargar();
    this.route.queryParams.subscribe(params => {
      if (params['calificar']) {
        this.citaACalificar = params['calificar'];
        this.estrellasSeleccionadas = 0;
        this.estrellaHover = 0;
        this.comentarioCalificacion = '';
        this.errorCalificacion = '';
      }
    });
  }

  cargar(): void {
    this.cargando = true;
    this.notifSvc.listar().subscribe({
      next: (data) => { this.notificaciones = data; this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }

  get filtradas(): Notificacion[] {
    if (this.filtroActivo === 'todas') {
      return this.notificaciones.filter(n => n.tipo !== 'sistema');
    }
    return this.notificaciones.filter(n => n.tipo === this.filtroActivo);
  }

  get noHayNoLeidas(): boolean {
    return this.notificaciones.every(n => n.leida);
  }

  manejarClick(n: Notificacion): void {
    if (!n.leida) {
      this.notifSvc.marcarLeida(n._id).subscribe(() => { n.leida = true; });
    }
    if (n.tipo === 'calificacion' && n.referencia) {
      this.citaACalificar = n.referencia;
      this.estrellasSeleccionadas = 0;
      this.estrellaHover = 0;
      this.comentarioCalificacion = '';
      this.errorCalificacion = '';
    }
  }

  marcarTodas(): void {
    this.notifSvc.marcarTodas().subscribe(() => {
      this.notificaciones.forEach(n => n.leida = true);
    });
  }

  cerrarCalificacion(): void {
    this.citaACalificar = null;
    this.errorCalificacion = '';
    this.router.navigate([], { relativeTo: this.route, queryParams: {}, replaceUrl: true });
  }

  enviarCalificacion(): void {
    if (!this.citaACalificar || this.estrellasSeleccionadas === 0) return;
    this.enviandoCalificacion = true;
    this.errorCalificacion = '';
    this.calificacionSvc.crear(this.citaACalificar, this.estrellasSeleccionadas, this.comentarioCalificacion).subscribe({
      next: () => {
        this.enviandoCalificacion = false;
        this.citaACalificar = null;
        this.router.navigate([], { relativeTo: this.route, queryParams: {}, replaceUrl: true });
      },
      error: (err) => {
        this.enviandoCalificacion = false;
        this.errorCalificacion = err?.error?.mensaje ?? 'No se pudo enviar la calificación';
      }
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
}
