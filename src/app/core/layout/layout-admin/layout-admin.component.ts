import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent, NavLink } from '../topbar/topbar.component';
import { SidebarAdminComponent } from '../sidebar-admin/sidebar-admin.component';

@Component({
  selector: 'app-layout-admin',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TopbarComponent, SidebarAdminComponent],
  templateUrl: './layout-admin.component.html',
  styleUrls: ['./layout-admin.component.css']
})
export class LayoutAdminComponent {
  navLinks: NavLink[] = [
    { label: 'Inicio', href: '/inicio', active: false },
    { label: 'Servicios', href: '/servicios', active: false },
    { label: 'Estilistas', href: '/estilistas', active: false },
    { label: 'Portafolio', href: '/portafolio', active: false },
    { label: 'Nosotros', href: '/nosotros', active: false }
  ];

  activeRoute: string = 'inicio';
}
