import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-estilista-mis-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mis-clientes.component.html',
  styleUrls: ['./mis-clientes.component.css']
})
export class MisClientesComponent {
  activeFilter: string = 'todas';
  busqueda: string = '';

  clientes = [
    {
      iniciales: 'LM',
      nombre: 'Laura Mendez',
      visitas: 8,
      servicioUltimo: 'Manicure Clasico',
      hace: '2 dias',
      estrellas: 5,
      vip: false
    },
    {
      iniciales: 'ST',
      nombre: 'Sofia Torres',
      visitas: 3,
      servicioUltimo: 'Nail Art',
      hace: '5 dias',
      estrellas: 4,
      vip: false
    },
    {
      iniciales: 'CR',
      nombre: 'Carmen Reyes',
      visitas: 12,
      servicioUltimo: 'Manicure Gel',
      hace: '1 semana',
      estrellas: 5,
      vip: true
    },
    {
      iniciales: 'VC',
      nombre: 'Valeria Cruz',
      visitas: 1,
      servicioUltimo: 'Pedicure Spa',
      hace: '2 semanas',
      estrellas: 4,
      vip: false
    }
  ];

  getEstrellas(cantidad: number): number[] {
    return Array(cantidad).fill(0);
  }

  getEstrellasVacias(cantidad: number): number[] {
    return Array(5 - cantidad).fill(0);
  }
}

