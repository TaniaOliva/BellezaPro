import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estilista-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  citas = [
    {
      hora: '09:00',
      cliente: 'Laura Mendez',
      servicio: 'Manicure Clasico',
      estado: 'Completada'
    },
    {
      hora: '10:30',
      cliente: 'Sofia Torres',
      servicio: 'Nail Art Sencillo',
      estado: 'En progreso'
    },
    {
      hora: '12:00',
      cliente: 'Carmen Reyes',
      servicio: 'Manicure Gel',
      estado: 'Confirmada'
    },
    {
      hora: '14:00',
      cliente: 'Valeria Cruz',
      servicio: 'Pedicure Spa',
      estado: 'Pendiente'
    }
  ];

  diasSemana = ['L', 'M', 'X', 'J', 'V', 'S'];
  alturasBarra = [45, 60, 80, 50, 65, 30];
}
