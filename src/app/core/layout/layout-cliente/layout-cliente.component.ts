import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent } from '../topbar/topbar.component';
import { SidebarClienteComponent } from '../sidebar-cliente/sidebar-cliente.component';

@Component({
  selector: 'app-layout-cliente',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TopbarComponent, SidebarClienteComponent],
  templateUrl: './layout-cliente.component.html',
  styleUrls: ['./layout-cliente.component.css']
})
export class LayoutClienteComponent {
}
