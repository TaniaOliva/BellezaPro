import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estilista-notificaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
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

