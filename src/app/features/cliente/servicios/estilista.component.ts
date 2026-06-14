import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../core/services/usuario.service';
import { BookingService } from '../../../core/services/booking.service';
import { Usuario } from '../../../core/models';

@Component({
  selector: 'app-cliente-estilista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estilista.component.html',
  styleUrl: './estilista.component.css'
})
export class EstilistaComponent implements OnInit {
  estilistas: Usuario[] = [];
  seleccionada: Usuario | null = null;
  cargando = true;
  categoriaServicio = '';

  constructor(
    private usuarioSvc: UsuarioService,
    private bookingSvc: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const estado = this.bookingSvc.getEstado();
    if (!estado.servicio) { this.router.navigate(['/cliente/servicios']); return; }
    this.categoriaServicio = estado.servicio.categoria ?? '';
    this.usuarioSvc.listarEstilistas().subscribe({
      next: (data: Usuario[]) => {
        this.estilistas = this.categoriaServicio
          ? data.filter(e => e.especialidades?.some(
              esp => esp.toLowerCase() === this.categoriaServicio.toLowerCase()
            ))
          : data;
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }

  seleccionar(estilista: Usuario): void {
    this.seleccionada = estilista;
  }

  sinPreferencia(): void {
    this.seleccionada = null;
    this.continuar();
  }

  continuar(): void {
    this.bookingSvc.setEstilista(this.seleccionada);
    this.router.navigate(['/cliente/servicios/horario']);
  }
}
