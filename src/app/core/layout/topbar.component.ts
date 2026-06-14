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
  styleUrls: ['./topbar.component.css']
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
    this.navegarPorTipo(notif.tipo);
  }

  private navegarPorTipo(tipo: string): void {
    const u = this.authSvc.getUsuario();
    const isAdmin = u?.rol === 'admin';

    if (isAdmin) {
      const rutasAdmin: Record<string, string> = {
        cita:      '/admin/agenda-general',
        sistema:   '/admin/reportes-clientes',
        solicitud: '/admin/solicitudes-especiales',
        promo:     '/admin/inicio',
      };
      const ruta = rutasAdmin[tipo] ?? '/admin/inicio';
      this.router.navigate([ruta]);
    } else {
      this.router.navigate(['/cliente/inicio']);
    }
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
      cita:     'event_busy',
      solicitud:'star',
      sistema:  'flag',
      promo:    'local_offer',
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
