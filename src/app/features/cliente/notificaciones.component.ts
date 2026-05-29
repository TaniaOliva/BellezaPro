import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
            <p class="text-gray-600 mt-2">Mantente al tanto de tus citas, mensajes y promociones.</p>
          </div>
          <button class="rounded-3xl bg-primary px-5 py-3 text-white font-semibold">Marcar todo leído</button>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button type="button" (click)="activeFilter = 'todas'" [ngClass]="activeFilter === 'todas' ? 'bg-secondary-fixed text-primary' : 'border border-outline-variant text-secondary'" class="rounded-full px-4 py-2 text-sm font-semibold">Todas</button>
          <button type="button" (click)="activeFilter = 'citas'" [ngClass]="activeFilter === 'citas' ? 'bg-secondary-fixed text-primary' : 'border border-outline-variant text-secondary'" class="rounded-full px-4 py-2 text-sm font-semibold">Citas</button>
          <button type="button" (click)="activeFilter = 'mensajes'" [ngClass]="activeFilter === 'mensajes' ? 'bg-secondary-fixed text-primary' : 'border border-outline-variant text-secondary'" class="rounded-full px-4 py-2 text-sm font-semibold">Mensajes</button>
          <button type="button" (click)="activeFilter = 'promos'" [ngClass]="activeFilter === 'promos' ? 'bg-secondary-fixed text-primary' : 'border border-outline-variant text-secondary'" class="rounded-full px-4 py-2 text-sm font-semibold">Promos</button>
        </div>

        <div class="space-y-4">
          <ng-container *ngFor="let item of notifications">
            <div *ngIf="activeFilter === 'todas' || activeFilter === item.category" class="flex items-start gap-3 rounded-[28px] border border-outline-variant p-5" [ngClass]="item.unread ? 'border-l-[3px] border-primary bg-surface-container-lowest' : ''">
              <div class="flex h-10 w-10 items-center justify-center rounded-2xl" [ngClass]="item.iconBg">
                <span class="material-symbols-outlined text-base" [ngClass]="item.iconText">{{ item.icon }}</span>
              </div>
              <div class="flex-1">
                <p class="text-label-md font-semibold text-on-surface">{{ item.title }}</p>
                <p class="text-body-md text-secondary mt-1">{{ item.description }}</p>
              </div>
              <p class="text-label-sm text-secondary">{{ item.time }}</p>
            </div>
          </ng-container>
        </div>
      </div>
    </div>
  `
})
export class NotificacionesComponent {
  activeFilter: string = 'todas';

  notifications = [
    {
      icon: 'calendar_today',
      title: 'Cita confirmada',
      description: 'Tu cita de Manicure con Sofia fue confirmada',
      time: 'hace 5 min',
      category: 'citas',
      unread: true,
      iconBg: 'bg-primary-fixed/10 text-primary-fixed',
      iconText: 'text-primary-fixed'
    },
    {
      icon: 'auto_awesome',
      title: 'Solicitud aprobada',
      description: 'Tu solicitud especial fue aprobada',
      time: 'hace 1 h',
      category: 'mensajes',
      unread: true,
      iconBg: 'bg-secondary-fixed/10 text-secondary-fixed',
      iconText: 'text-secondary-fixed'
    },
    {
      icon: 'calendar_today',
      title: 'Recordatorio',
      description: 'Tienes una cita manana a las 10:00 AM',
      time: 'hace 3 h',
      category: 'citas',
      unread: false,
      iconBg: 'bg-primary-fixed/10 text-primary-fixed',
      iconText: 'text-primary-fixed'
    },
    {
      icon: 'star',
      title: 'Califica tu servicio',
      description: 'Como fue tu experiencia con Ana Garcia?',
      time: 'ayer',
      category: 'mensajes',
      unread: false,
      iconBg: 'bg-tertiary-fixed/10 text-tertiary-fixed',
      iconText: 'text-tertiary-fixed'
    },
    {
      icon: 'campaign',
      title: 'Promo especial',
      description: '20% de descuento en manicure este fin de semana',
      time: 'hace 2 dias',
      category: 'promos',
      unread: false,
      iconBg: 'bg-surface-container/80 text-secondary',
      iconText: 'text-secondary'
    }
  ];
}
