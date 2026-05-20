import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent, NavLink } from '../topbar/topbar.component';
import { SidebarClienteComponent } from '../sidebar-cliente/sidebar-cliente.component';

@Component({
  selector: 'app-layout-cliente',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TopbarComponent, SidebarClienteComponent],
  templateUrl: './layout-cliente.component.html',
  styleUrls: ['./layout-cliente.component.css']
})
export class LayoutClienteComponent {
  navLinks: NavLink[] = [
    { label: 'Inicio', href: '/inicio', active: false },
    { label: 'Servicios', href: '/servicios', active: false },
    { label: 'Estilistas', href: '/estilistas', active: false },
    { label: 'Portafolio', href: '/portafolio', active: false },
    { label: 'Nosotros', href: '/nosotros', active: false }
  ];

  activeRoute: string = 'inicio';
}
