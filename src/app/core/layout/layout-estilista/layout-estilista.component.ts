import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent, NavLink } from '../topbar/topbar.component';
import { SidebarEstilistaComponent } from '../sidebar-estilista/sidebar-estilista.component';

@Component({
  selector: 'app-layout-estilista',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TopbarComponent, SidebarEstilistaComponent],
  templateUrl: './layout-estilista.component.html',
  styleUrls: ['./layout-estilista.component.css']
})
export class LayoutEstilistaComponent {
  navLinks: NavLink[] = [
    { label: 'Inicio', href: '/inicio', active: false },
    { label: 'Servicios', href: '/servicios', active: false },
    { label: 'Estilistas', href: '/estilistas', active: false },
    { label: 'Portafolio', href: '/portafolio', active: false },
    { label: 'Nosotros', href: '/nosotros', active: false }
  ];

  activeRoute: string = 'inicio';
}
