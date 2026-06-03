import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServicioService } from '../../core/services/servicio.service';
import { Servicio } from '../../core/models';

@Component({
  selector: 'app-admin-servicios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white min-h-screen">
      <div class="px-8 py-8">
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-3xl font-bold text-gray-800">Gestionar Servicios</h1>
          <button class="bg-red-600 text-white rounded-lg px-6 py-3 font-semibold hover:bg-red-700 transition flex items-center gap-2">
            <span class="material-symbols-outlined">add</span>
            Agregar servicio
          </button>
        </div>

        <!-- Buscador y filtros -->
        <div class="mb-6 flex gap-4">
          <div class="flex-1 flex items-center border border-gray-300 rounded-lg px-4 py-2 bg-white">
            <span class="material-symbols-outlined text-gray-400">search</span>
            <input type="text" placeholder="Buscar servicio..." class="ml-2 flex-1 outline-none text-gray-700">
          </div>
          <button class="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-semibold">Activos</button>
          <button class="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg font-semibold hover:bg-gray-50">Todos</button>
        </div>

        <!-- Tabla de servicios -->
        <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Nombre</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Categoría</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Precio</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Duración</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Citas/mes</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Estado</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr class="hover:bg-gray-50 transition">
                <td class="px-6 py-4"><p class="font-semibold text-gray-800">Manicure Premium</p></td>
                <td class="px-6 py-4"><p class="text-gray-600">Manicure</p></td>
                <td class="px-6 py-4"><p class="font-semibold text-gray-800">L. 350</p></td>
                <td class="px-6 py-4"><p class="text-gray-600">1:30 h</p></td>
                <td class="px-6 py-4"><p class="font-semibold text-gray-800">45</p></td>
                <td class="px-6 py-4"><span class="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded">Activo</span></td>
                <td class="px-6 py-4 text-center">
                  <button class="text-red-600 font-semibold text-sm hover:text-red-700">Editar</button>
                </td>
              </tr>
              <tr class="hover:bg-gray-50 transition">
                <td class="px-6 py-4"><p class="font-semibold text-gray-800">Pedicure Spa</p></td>
                <td class="px-6 py-4"><p class="text-gray-600">Pedicure</p></td>
                <td class="px-6 py-4"><p class="font-semibold text-gray-800">L. 420</p></td>
                <td class="px-6 py-4"><p class="text-gray-600">2 h</p></td>
                <td class="px-6 py-4"><p class="font-semibold text-gray-800">32</p></td>
                <td class="px-6 py-4"><span class="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded">Activo</span></td>
                <td class="px-6 py-4 text-center">
                  <button class="text-red-600 font-semibold text-sm hover:text-red-700">Editar</button>
                </td>
              </tr>
              <tr class="hover:bg-gray-50 transition">
                <td class="px-6 py-4"><p class="font-semibold text-gray-800">Corte y Secado</p></td>
                <td class="px-6 py-4"><p class="text-gray-600">Cabello</p></td>
                <td class="px-6 py-4"><p class="font-semibold text-gray-800">L. 250</p></td>
                <td class="px-6 py-4"><p class="text-gray-600">1 h</p></td>
                <td class="px-6 py-4"><p class="font-semibold text-gray-800">28</p></td>
                <td class="px-6 py-4"><span class="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded">Activo</span></td>
                <td class="px-6 py-4 text-center">
                  <button class="text-red-600 font-semibold text-sm hover:text-red-700">Editar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class ServiciosComponent implements OnInit {
  servicios: Servicio[] = [];
  seleccionado: Servicio | null = null;
  mostrarDrawer = false;
  cargando = true;
  guardando = false;
  error = '';

  nuevo: Partial<Servicio> = {
    nombre: '', descripcion: '', categoria: 'Manicure',
    precioBase: 0, duracion: 60, activo: true, variantes: []
  };

  categorias = ['Manicure', 'Pedicure', 'Cortes', 'Tintes', 'Maquillaje'];

  constructor(private servicioSvc: ServicioService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.servicioSvc.listar().subscribe({
      next: (data: Servicio[]) => { this.servicios = data; this.cargando = false; },
      error: () => this.cargando = false
    });
  }

  abrirNuevo(): void {
    this.seleccionado = null;
    this.nuevo = { nombre: '', descripcion: '', categoria: 'Manicure', precioBase: 0, duracion: 60, activo: true, variantes: [] };
    this.mostrarDrawer = true;
  }

  abrirEditar(s: Servicio): void {
    this.seleccionado = s;
    this.nuevo = { ...s };
    this.mostrarDrawer = true;
  }

  guardar(): void {
    if (!this.nuevo.nombre || !this.nuevo.precioBase) {
      this.error = 'Nombre y precio son obligatorios';
      return;
    }
    this.guardando = true;
    const op = this.seleccionado
      ? this.servicioSvc.actualizar(this.seleccionado._id, this.nuevo)
      : this.servicioSvc.crear(this.nuevo);
    op.subscribe({
      next: () => { this.mostrarDrawer = false; this.guardando = false; this.error = ''; this.cargar(); },
      error: (err: any) => { this.error = err.error?.mensaje || 'Error al guardar'; this.guardando = false; }
    });
  }

  toggleActivo(s: Servicio): void {
    this.servicioSvc.actualizar(s._id, { activo: !s.activo }).subscribe(() => this.cargar());
  }
}
