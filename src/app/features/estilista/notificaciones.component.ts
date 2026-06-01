import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estilista-notificaciones',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white min-h-screen">
      <!-- Header -->
      <div class="bg-red-50 px-8 py-6 border-b border-gray-200">
        <h1 class="text-2xl font-bold text-gray-800">Notificaciones</h1>
        <p class="text-gray-600 text-sm mt-1">Tus alertas y actualizaciones</p>
      </div>

      <div class="px-8 py-8 max-w-2xl">
        <!-- Filtros -->
        <div class="mb-6 flex gap-2">
          <button class="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-semibold text-sm">Todas</button>
          <button class="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg font-semibold text-sm hover:bg-gray-50">No leídas</button>
          <button class="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg font-semibold text-sm hover:bg-gray-50">Citas</button>
        </div>

        <!-- Lista de notificaciones -->
        <div class="space-y-3">
          <div *ngFor="let notif of notificaciones" [class]="!notif.leida ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'" class="border rounded-lg p-4 cursor-pointer hover:shadow-md transition">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                <span class="material-symbols-outlined text-base">{{ notif.icono }}</span>
              </div>
              <div class="flex-1">
                <div class="flex items-start justify-between">
                  <div>
                    <p [class]="!notif.leida ? 'font-bold' : ''" class="text-gray-800">{{ notif.titulo }}</p>
                    <p class="text-sm text-gray-600 mt-1">{{ notif.descripcion }}</p>
                  </div>
                  <div *ngIf="!notif.leida" class="w-2 h-2 rounded-full bg-red-600 mt-1"></div>
                </div>
                <p class="text-xs text-gray-500 mt-2">{{ notif.tiempo }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class NotificacionesComponent {
  notificaciones = [
    {
      id: 1,
      icono: 'calendar_today',
      iconoColor: 'text-primary-fixed',
      titulo: 'Nueva cita asignada',
      descripcion: 'Carmen Reyes agendo Manicure Gel para el 02 May',
      tiempo: 'hace 10 min',
      leida: false
    },
    {
      id: 2,
      icono: 'star',
      iconoColor: 'text-tertiary-fixed',
      titulo: 'Nueva calificacion',
      descripcion: 'Laura Mendez te dio 5 estrellas',
      tiempo: 'hace 1 h',
      leida: false
    },
    {
      id: 3,
      icono: 'cancel',
      iconoColor: 'text-error-container',
      titulo: 'Cita cancelada',
      descripcion: 'Sofia Torres cancelo su cita de hoy',
      tiempo: 'hace 3 h',
      leida: true
    },
    {
      id: 4,
      icono: 'analytics',
      iconoColor: 'text-secondary-fixed',
      titulo: 'Reporte semanal',
      descripcion: 'Esta semana atendiste 18 clientes',
      tiempo: 'ayer',
      leida: true
    },
    {
      id: 5,
      icono: 'warning',
      iconoColor: 'text-surface-container',
      titulo: 'Reporte enviado',
      descripcion: 'Tu reporte sobre Ana P. fue recibido',
      tiempo: 'hace 2 dias',
      leida: true
    }
  ];

  marcarComoLeida(id: number) {
    const notif = this.notificaciones.find(n => n.id === id);
    if (notif) {
      notif.leida = true;
    }
  }
}


