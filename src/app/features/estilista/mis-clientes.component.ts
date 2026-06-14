import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CitaService } from '../../core/services/cita.service';
import { Cita } from '../../core/models';

@Component({
  selector: 'app-estilista-mis-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mis-clientes.component.html',
  styleUrl: './mis-clientes.component.css'
})
export class MisClientesComponent implements OnInit {
  activeFilter = 'todas';
  busqueda = '';
  cargando = true;
  clientes: any[] = [];

  constructor(private citaSvc: CitaService) {}

  ngOnInit(): void {
    this.citaSvc.miAgenda().subscribe({
      next: (data: Cita[]) => {
        const mapaClientes = new Map<string, any>();
        data.forEach((c: Cita) => {
          if (c.clienteId && c.clienteId._id) {
            const existing = mapaClientes.get(c.clienteId._id);
            const nombre = c.clienteId.nombre ?? '';
            const apellido = c.clienteId.apellido ?? '';
            const iniciales = (nombre + ' ' + apellido).trim()
              .split(' ').map((n: string) => n[0] ?? '').slice(0, 2).join('').toUpperCase();
            const visitas = (existing?.visitas ?? 0) + 1;
            mapaClientes.set(c.clienteId._id, {
              _id: c.clienteId._id,
              nombre: nombre + (apellido ? ' ' + apellido : ''),
              iniciales,
              visitas,
              servicioUltimo: c.servicioId?.nombre ?? '',
              hace: c.fecha,
              estrellas: 5,
              vip: visitas >= 5
            });
          }
        });
        this.clientes = Array.from(mapaClientes.values());
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }

  getEstrellas(cantidad: number): number[] { return Array(cantidad).fill(0); }
  getEstrellasVacias(cantidad: number): number[] { return Array(5 - cantidad).fill(0); }
}
