import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar-cliente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar-cliente.component.html',
  styleUrls: ['./sidebar-cliente.component.css']
})
export class SidebarClienteComponent {
  @Input() activeRoute: string = '';
}
