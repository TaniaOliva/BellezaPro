import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent } from '../topbar/topbar.component';
import { SidebarEstilistaComponent } from '../sidebar-estilista/sidebar-estilista.component';

@Component({
  selector: 'app-layout-estilista',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TopbarComponent, SidebarEstilistaComponent],
  templateUrl: './layout-estilista.component.html',
  styleUrls: ['./layout-estilista.component.css']
})
export class LayoutEstilistaComponent {
}
