import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar-estilista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar-estilista.component.html',
  styleUrls: ['./sidebar-estilista.component.css']
})
export class SidebarEstilistaComponent {
  @Input() activeRoute: string = '';
}
