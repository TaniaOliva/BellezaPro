import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8 space-y-8">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex flex-wrap gap-3">
          <button type="button" (click)="activeFilter = 'todas'" class="rounded-full px-4 py-2 text-sm font-semibold" [ngClass]="activeFilter === 'todas' ? 'bg-secondary-fixed text-primary' : 'border border-outline-variant text-secondary'">Todas</button>
          <button type="button" (click)="activeFilter = 'citas'" class="rounded-full px-4 py-2 text-sm font-semibold" [ngClass]="activeFilter === 'citas' ? 'bg-secondary-fixed text-primary' : 'border border-outline-variant text-secondary'">Citas</button>
          <button type="button" (click)="activeFilter = 'mensajes'" class="rounded-full px-4 py-2 text-sm font-semibold" [ngClass]="activeFilter === 'mensajes' ? 'bg-secondary-fixed text-primary' : 'border border-outline-variant text-secondary'">Mensajes</button>
          <button type="button" (click)="activeFilter = 'promos'" class="rounded-full px-4 py-2 text-sm font-semibold" [ngClass]="activeFilter === 'promos' ? 'bg-secondary-fixed text-primary' : 'border border-outline-variant text-secondary'">Promos</button>
        </div>
        <button type="button" class="ml-auto text-primary font-semibold text-label-md">Marcar todo leido</button>
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
