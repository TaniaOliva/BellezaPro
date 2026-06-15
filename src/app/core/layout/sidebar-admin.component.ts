import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificacionService } from '../services/notificacion.service';

@Component({
  selector: 'app-sidebar-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar-admin.component.html',
  styleUrl: './sidebar-admin.component.css'
})
export class SidebarAdminComponent implements OnInit {
  noLeidas = 0;

  constructor(private auth: AuthService, private notifSvc: NotificacionService) {}

  ngOnInit(): void {
    this.notifSvc.listar().subscribe({
      next: (data) => { this.noLeidas = data.filter(n => !n.leida).length; },
      error: () => {}
    });
  }

  get nombreAdmin(): string {
    const u = this.auth.getUsuario();
    return u ? `${u.nombre} ${u.apellido}` : 'Administrador';
  }

  logout(): void {
    this.auth.logout();
  }
}
