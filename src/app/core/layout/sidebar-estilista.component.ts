import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sidebar-estilista',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar-estilista.component.html',
  styleUrl: './sidebar-estilista.component.css'
})
export class SidebarEstilistaComponent {
  nombre = '';

  constructor(private auth: AuthService) {
    const u = this.auth.getUsuario();
    this.nombre = u ? `${u.nombre} ${u.apellido ?? ''}`.trim() : 'Estilista';
  }

  logout(): void {
    this.auth.logout();
  }
}
