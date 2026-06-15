import { Component, Input, OnInit, OnChanges, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificacionService } from '../services/notificacion.service';
import { AuthService } from '../services/auth.service';
import { Notificacion } from '../models';

export interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent implements OnInit, OnChanges {
  @Input() navLinks: NavLink[] = [];
  @Input() showAcceder: boolean = true;
  @Input() showUserAvatar: boolean = false;

  notificaciones: Notificacion[] = [];
  mostrarDropdown = false;

  constructor(
    private notificacionSvc: NotificacionService,
    private authSvc: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.showUserAvatar) this.cargarNotificaciones();
  }

  ngOnChanges(): void {
    if (this.showUserAvatar && this.notificaciones.length === 0) {
      this.cargarNotificaciones();
    }
  }

  get noLeidas(): number {
    return this.notificaciones.filter(n => !n.leida).length;
  }

  cargarNotificaciones(): void {
    this.notificacionSvc.listar().subscribe({
      next: (data) => { this.notificaciones = data; },
      error: () => {}
    });
  }

  toggleDropdown(): void {
    this.mostrarDropdown = !this.mostrarDropdown;
    if (this.mostrarDropdown) this.cargarNotificaciones();
  }

  get notificacionesMostradas(): Notificacion[] {
    const u = this.authSvc.getUsuario();
    if (u?.rol === 'admin') return this.notificaciones.filter(n => !n.leida);
    return this.notificaciones;
  }

  clickNotificacion(notif: Notificacion): void {
    if (!notif.leida) {
      this.notificacionSvc.marcarLeida(notif._id).subscribe({
        next: (actualizada) => {
          const idx = this.notificaciones.findIndex(n => n._id === notif._id);
          if (idx !== -1) this.notificaciones[idx] = actualizada;
        },
        error: () => {}
      });
    }
    this.mostrarDropdown = false;
    const u = this.authSvc.getUsuario();
    if (u?.rol === 'admin') {
      this.router.navigate(['/admin/notificaciones']);
    } else {
      this.navegarPorTipo(notif.tipo, notif.referencia);
    }
  }

  private navegarPorTipo(tipo: string, referencia?: string): void {
    if (tipo === 'calificacion') {
      const extras = referencia ? { queryParams: { calificar: referencia } } : {};
      this.router.navigate(['/cliente/notificaciones'], extras);
      return;
    }
    const rutasCliente: Record<string, string> = {
      cita:      '/cliente/mis-citas',
      solicitud: '/cliente/solicitud-especial',
      sistema:   '/cliente/inicio',
    };
    this.router.navigate([rutasCliente[tipo] ?? '/cliente/inicio']);
  }

  marcarTodas(): void {
    this.notificacionSvc.marcarTodas().subscribe({
      next: () => { this.notificaciones = this.notificaciones.map(n => ({ ...n, leida: true })); },
      error: () => {}
    });
  }

  tiempoRelativo(fecha: string): string {
    const diff = Date.now() - new Date(fecha).getTime();
    const min = Math.floor(diff / 60000);
    if (min < 1)  return 'Ahora';
    if (min < 60) return `Hace ${min} min`;
    const h = Math.floor(min / 60);
    if (h < 24)   return `Hace ${h} h`;
    const d = Math.floor(h / 24);
    return `Hace ${d} día${d !== 1 ? 's' : ''}`;
  }

  iconoPorTipo(tipo: string): string {
    const mapa: Record<string, string> = {
      cita:         'event_busy',
      solicitud:    'auto_awesome',
      sistema:      'flag',
      promo:        'local_offer',
      calificacion: 'star',
    };
    return mapa[tipo] ?? 'notifications';
  }

  @HostListener('document:click', ['$event'])
  cerrarAlClickFuera(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.notif-wrapper')) {
      this.mostrarDropdown = false;
    }
  }
}
