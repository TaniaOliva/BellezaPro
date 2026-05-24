import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent } from '../topbar/topbar.component';
import { SidebarClienteComponent } from '../sidebar-cliente/sidebar-cliente.component';

@Component({
  selector: 'app-layout-booking',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TopbarComponent, SidebarClienteComponent],
  templateUrl: './layout-booking.component.html',
  styleUrls: ['./layout-booking.component.css']
})
export class LayoutBookingComponent {
  @Input() currentStep: number = 1;

  steps = [
    { number: 1, label: 'Servicio' },
    { number: 2, label: 'Opciones' },
    { number: 3, label: 'Estilista' },
    { number: 4, label: 'Horario' },
    { number: 5, label: 'Confirmar' }
  ];
}
