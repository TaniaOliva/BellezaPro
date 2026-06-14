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
  template: `
    <div class="bg-white min-h-screen">
      <div class="px-8 py-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Catálogo de Servicios</h1>
        <p class="text-gray-600 mb-8">Selecciona el servicio que deseas agendar hoy.</p>

        <!-- Buscador y filtros -->
        <div class="mb-8 flex gap-4 items-center flex-wrap">
          <div class="flex-1 min-w-60 flex items-center border border-gray-300 rounded-lg px-4 py-2 bg-white">
            <span class="material-symbols-outlined text-gray-400">search</span>
            <input
              type="text"
              placeholder="Buscar servicio..."
              class="ml-2 flex-1 outline-none text-gray-700"
              [value]="busqueda"
              (input)="buscar($any($event.target).value)" />
          </div>
          <button
            *ngFor="let cat of categorias"
            (click)="filtrar(cat)"
            [class]="categoriaActiva === cat
              ? 'px-4 py-2 bg-red-100 text-red-600 rounded-full font-semibold text-sm'
              : 'px-4 py-2 text-gray-600 rounded-full font-semibold text-sm border border-gray-300 hover:bg-gray-50'">
            {{ cat }}
          </button>
        </div>

        <!-- Cargando -->
        <div *ngIf="cargando" class="text-center py-16 text-gray-500">Cargando servicios...</div>

        <!-- Sin resultados -->
        <div *ngIf="!cargando && serviciosFiltrados.length === 0" class="text-center py-16">
          <span class="material-symbols-outlined text-gray-300 text-5xl block mb-3">search_off</span>
          <p class="text-gray-500">No se encontraron servicios para "{{ busqueda }}"</p>
          <button (click)="limpiarBusqueda()" class="text-red-600 font-semibold text-sm mt-2 hover:underline">Limpiar búsqueda</button>
        </div>

        <!-- Grid de servicios -->
        <div *ngIf="!cargando && serviciosFiltrados.length > 0" class="grid grid-cols-3 gap-6">
          <div *ngFor="let s of serviciosFiltrados" class="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition">
            <div class="h-48 relative bg-gray-100 overflow-hidden">
              <img *ngIf="s.imagenes?.length" [src]="s.imagenes![0]" [alt]="s.nombre"
                class="w-full h-full object-cover">
              <div *ngIf="!s.imagenes?.length"
                class="w-full h-full flex items-center justify-center">
                <span class="material-symbols-outlined text-gray-300 text-5xl">spa</span>
              </div>
              <span class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-bold px-3 py-1 rounded shadow-sm">{{ s.categoria }}</span>
            </div>
            <div class="p-5">
              <h3 class="text-lg font-bold text-gray-800 mb-2">{{ s.nombre }}</h3>
              <p class="text-sm text-gray-600 mb-2">{{ s.descripcion }}</p>
              <p class="text-red-600 font-bold mb-4">Desde L. {{ s.precioBase }}</p>
              <button (click)="seleccionar(s)" class="w-full bg-red-600 text-white rounded-lg py-2 font-semibold hover:bg-red-700 transition">Seleccionar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
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
