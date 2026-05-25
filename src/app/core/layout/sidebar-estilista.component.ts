import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar-estilista',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar-estilista.component.html',
  styleUrls: ['./sidebar-estilista.component.css']
})
export class SidebarEstilistaComponent {
}
