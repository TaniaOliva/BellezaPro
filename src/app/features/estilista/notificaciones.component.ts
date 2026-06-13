import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../core/services/notificacion.service';
import { Notificacion } from '../../core/models';

@Component({
  selector: 'app-estilista-notificaciones',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white min-h-screen">
      <div class="bg-red-50 px-8 py-6 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Notificaciones</h1>
          <p class="text-gray-600 text-sm mt-1">Tus alertas y actualizaciones</p>
        </div>
        <button (click)="marcarTodas()" [disabled]="noHayNoLeidas"
          class="text-sm font-semibold text-red-600 hover:underline disabled:opacity-40">
          Marcar todo leído
        </button>
      </div>

      <div class="px-8 py-8 max-w-2xl">
        <!-- Filtros -->
        <div class="mb-6 flex gap-2 flex-wrap">
          <button (click)="filtroActivo = 'todas'"
            [class]="filtroActivo === 'todas' ? 'bg-red-100 text-red-600' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'"
            class="px-4 py-2 rounded-lg font-semibold text-sm transition">Todas</button>
          <button (click)="filtroActivo = 'no-leidas'"
            [class]="filtroActivo === 'no-leidas' ? 'bg-red-100 text-red-600' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'"
            class="px-4 py-2 rounded-lg font-semibold text-sm transition">No leídas</button>
          <button (click)="filtroActivo = 'cita'"
            [class]="filtroActivo === 'cita' ? 'bg-red-100 text-red-600' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'"
            class="px-4 py-2 rounded-lg font-semibold text-sm transition">Citas</button>
        </div>

        <!-- Cargando -->
        <div *ngIf="cargando" class="text-center py-16 text-gray-400">Cargando...</div>

        <!-- Sin notificaciones -->
        <div *ngIf="!cargando && filtradas.length === 0" class="text-center py-16">
          <span class="material-symbols-outlined text-gray-300 text-5xl block mb-3">notifications_off</span>
          <p class="text-gray-400">Sin notificaciones.</p>
        </div>

        <!-- Lista -->
        <div class="space-y-3">
          <div *ngFor="let n of filtradas" (click)="marcarLeida(n)" cursor-pointer
            [class]="n.leida ? 'bg-white border-gray-200' : 'bg-red-50 border-red-200'"
            class="border rounded-lg p-4 cursor-pointer hover:shadow-md transition">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-base">{{ n.icono || 'notifications' }}</span>
              </div>
              <div class="flex-1">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <p [class.font-bold]="!n.leida" class="text-gray-800">{{ n.titulo }}</p>
                    <p class="text-sm text-gray-600 mt-1">{{ n.descripcion }}</p>
                  </div>
                  <div *ngIf="!n.leida" class="w-2 h-2 rounded-full bg-red-600 mt-1 shrink-0"></div>
                </div>
                <p class="text-xs text-gray-500 mt-2">{{ formatFecha(n.creadoEn) }}</p>
              </div>
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
    if (this.filtroActivo === 'no-leidas') return this.notificaciones.filter(n => !n.leida);
    if (this.filtroActivo === 'todas') return this.notificaciones;
    return this.notificaciones.filter(n => n.tipo === this.filtroActivo);
  }

  get noHayNoLeidas(): boolean {
    return this.notificaciones.every(n => n.leida);
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
