import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Usuario } from '../models';

@Component({
  selector: 'app-sidebar-cliente',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar-cliente.component.html',
  styleUrls: ['./sidebar-cliente.component.css']
})
export class SidebarClienteComponent {
  usuario: Usuario | null = null;

  constructor(private auth: AuthService) {
    this.auth.usuario$.subscribe(u => this.usuario = u);
  }

  logout(): void {
    this.auth.logout();
  }
}
