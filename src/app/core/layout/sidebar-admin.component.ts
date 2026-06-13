import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sidebar-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar-admin.component.html',
  styleUrls: ['./sidebar-admin.component.css']
})
export class SidebarAdminComponent {
  constructor(private auth: AuthService) {}

  get nombreAdmin(): string {
    const u = this.auth.getUsuario();
    return u ? `${u.nombre} ${u.apellido}` : 'Administrador';
  }

  logout(): void {
    this.auth.logout();
  }
}
