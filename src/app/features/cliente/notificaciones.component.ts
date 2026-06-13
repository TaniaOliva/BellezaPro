import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../core/services/notificacion.service';
import { Notificacion } from '../../core/models';

const ICONO_POR_TIPO: Record<string, { icon: string; bg: string; text: string }> = {
  cita:      { icon: 'calendar_today', bg: 'bg-blue-50',   text: 'text-blue-600' },
  solicitud: { icon: 'auto_awesome',   bg: 'bg-purple-50', text: 'text-purple-600' },
  promo:     { icon: 'campaign',       bg: 'bg-yellow-50', text: 'text-yellow-600' },
  sistema:   { icon: 'notifications',  bg: 'bg-gray-100',  text: 'text-gray-600' },
};

@Component({
  selector: 'app-cliente-notificaciones',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white min-h-screen">
      <div class="max-w-4xl mx-auto px-8 py-8 space-y-8">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Notificaciones</h1>
            <p class="text-gray-600 mt-2">Mantente al tanto de tus citas y mensajes.</p>
          </div>
          <button (click)="marcarTodas()" [disabled]="noHayNoLeidas"
            class="rounded-3xl bg-red-600 px-5 py-3 text-white font-semibold hover:bg-red-700 disabled:opacity-40 transition">
            Marcar todo leído
          </button>
        </div>

        <!-- Filtros -->
        <div class="flex flex-wrap items-center gap-3">
          <button type="button" (click)="filtroActivo = 'todas'"
            [class]="filtroActivo === 'todas' ? 'bg-red-100 text-red-600' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'"
            class="rounded-full px-4 py-2 text-sm font-semibold transition">Todas</button>
          <button type="button" (click)="filtroActivo = 'cita'"
            [class]="filtroActivo === 'cita' ? 'bg-red-100 text-red-600' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'"
            class="rounded-full px-4 py-2 text-sm font-semibold transition">Citas</button>
          <button type="button" (click)="filtroActivo = 'solicitud'"
            [class]="filtroActivo === 'solicitud' ? 'bg-red-100 text-red-600' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'"
            class="rounded-full px-4 py-2 text-sm font-semibold transition">Solicitudes</button>
          <button type="button" (click)="filtroActivo = 'promo'"
            [class]="filtroActivo === 'promo' ? 'bg-red-100 text-red-600' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'"
            class="rounded-full px-4 py-2 text-sm font-semibold transition">Promos</button>
        </div>

        <!-- Cargando -->
        <div *ngIf="cargando" class="text-center py-16 text-gray-400">Cargando notificaciones...</div>

        <!-- Sin notificaciones -->
        <div *ngIf="!cargando && filtradas.length === 0" class="text-center py-16">
          <span class="material-symbols-outlined text-gray-300 text-5xl block mb-3">notifications_off</span>
          <p class="text-gray-400">No tienes notificaciones{{ filtroActivo !== 'todas' ? ' en esta categoría' : '' }}.</p>
        </div>

        <!-- Lista -->
        <div class="space-y-3">
          <div *ngFor="let n of filtradas" (click)="marcarLeida(n)"
            [class]="n.leida ? 'border-gray-200 bg-white' : 'border-red-200 bg-red-50 border-l-4 border-l-red-500'"
            class="flex items-start gap-4 rounded-2xl border p-5 cursor-pointer hover:shadow-sm transition">
            <div class="flex h-10 w-10 items-center justify-center rounded-2xl shrink-0"
              [class]="iconoMeta(n.tipo).bg">
              <span class="material-symbols-outlined text-base" [class]="iconoMeta(n.tipo).text">
                {{ n.icono || iconoMeta(n.tipo).icon }}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-gray-800" [class.font-bold]="!n.leida">{{ n.titulo }}</p>
              <p class="text-sm text-gray-600 mt-1">{{ n.descripcion }}</p>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <p class="text-xs text-gray-400">{{ formatFecha(n.creadoEn) }}</p>
              <div *ngIf="!n.leida" class="w-2 h-2 rounded-full bg-red-500"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class NotificacionesComponent implements OnInit {
  notificaciones: Notificacion[] = [];
  filtroActivo = 'todas';
  cargando = true;

  constructor(private notifSvc: NotificacionService) {}

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.cargando = true;
    this.notifSvc.listar().subscribe({
      next: (data) => { this.notificaciones = data; this.cargando = false; },
      error: () => this.cargando = false
    });
  }

  get filtradas(): Notificacion[] {
    return this.filtroActivo === 'todas'
      ? this.notificaciones
      : this.notificaciones.filter(n => n.tipo === this.filtroActivo);
  }

  get noHayNoLeidas(): boolean {
    return this.notificaciones.every(n => n.leida);
  }

  marcarLeida(n: Notificacion): void {
    if (n.leida) return;
    this.notifSvc.marcarLeida(n._id).subscribe(() => {
      n.leida = true;
    });
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
}
