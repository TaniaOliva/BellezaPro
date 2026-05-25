import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar-cliente',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar-cliente.component.html',
  styleUrls: ['./sidebar-cliente.component.css']
})
export class SidebarClienteComponent {
}
