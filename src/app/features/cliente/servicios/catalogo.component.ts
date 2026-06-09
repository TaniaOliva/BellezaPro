import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ServicioService } from '../../../core/services/servicio.service';
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
        <div class="mb-8 flex gap-4 items-center">
          <div class="flex-1 flex items-center border border-gray-300 rounded-lg px-4 py-2 bg-white">
            <span class="material-symbols-outlined text-gray-400">search</span>
            <input type="text" placeholder="Buscar servicio..." class="ml-2 flex-1 outline-none text-gray-700" />
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

        <!-- Grid de servicios -->
        <div class="grid grid-cols-3 gap-6">
          <div *ngFor="let s of serviciosFiltrados" class="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition">
            <div class="bg-gray-300 h-48 relative">
              <span class="absolute top-3 right-3 bg-white text-gray-700 text-xs font-bold px-3 py-1 rounded">{{ s.categoria }}</span>
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
  categoriaActiva = 'Todos';
  cargando = true;
  categorias = ['Todos', 'Manicure', 'Pedicure', 'Cortes', 'Tintes', 'Maquillaje'];

  constructor(
    private servicioSvc: ServicioService,
    private bookingSvc: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.servicioSvc.listar().subscribe({
      next: (data: Servicio[]) => {
        this.servicios = data;
        this.serviciosFiltrados = data;
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }

  filtrar(categoria: string): void {
    this.categoriaActiva = categoria;
    this.serviciosFiltrados = categoria === 'Todos'
      ? this.servicios
      : this.servicios.filter((s: Servicio) => s.categoria === categoria);
  }

  seleccionar(servicio: Servicio): void {
    this.bookingSvc.setServicio(servicio, null, servicio.precioBase);
    this.router.navigate(['/cliente/servicios/opciones']);
  }
}

