import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../core/services/notificacion.service';
import { Notificacion } from '../../core/models';

@Component({
  selector: 'app-estilista-notificaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notificaciones.component.html',
  styleUrl: './notificaciones.component.css'
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
