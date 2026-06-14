import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ServicioService } from '../../../core/services/servicio.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { BookingService } from '../../../core/services/booking.service';
import { Servicio } from '../../../core/models';

@Component({
  selector: 'app-cliente-catalogo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css'
})
export class CatalogoComponent implements OnInit {
  servicios: Servicio[] = [];
  serviciosFiltrados: Servicio[] = [];
  categorias: string[] = ['Todos'];
  categoriaActiva = 'Todos';
  busqueda = '';
  cargando = true;

  constructor(
    private servicioSvc: ServicioService,
    private categoriaSvc: CategoriaService,
    private bookingSvc: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoriaSvc.listar().subscribe({
      next: (cats) => {
        this.categorias = ['Todos', ...cats.map(c => c.nombre)];
      }
    });
    this.servicioSvc.listar().subscribe({
      next: (data: Servicio[]) => {
        this.servicios = data;
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }

  filtrar(categoria: string): void {
    this.categoriaActiva = categoria;
    this.aplicarFiltros();
  }

  buscar(texto: string): void {
    this.busqueda = texto;
    this.aplicarFiltros();
  }

  limpiarBusqueda(): void {
    this.busqueda = '';
    this.aplicarFiltros();
  }

  private normalizar(texto: string): string {
    return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s]/gi, '').toLowerCase().trim();
  }

  private aplicarFiltros(): void {
    let resultado = this.categoriaActiva === 'Todos'
      ? this.servicios
      : this.servicios.filter(s => s.categoria === this.categoriaActiva);

    const termino = this.normalizar(this.busqueda);
    if (termino) {
      resultado = resultado.filter(s =>
        this.normalizar(s.nombre).includes(termino) ||
        this.normalizar(s.descripcion ?? '').includes(termino)
      );
    }

    this.serviciosFiltrados = resultado;
  }

  seleccionar(servicio: Servicio): void {
    this.bookingSvc.setServicio(servicio, null, servicio.precioBase);
    this.router.navigate(['/cliente/servicios/opciones']);
  }
}
