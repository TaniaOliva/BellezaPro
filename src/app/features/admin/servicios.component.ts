import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-servicios',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white min-h-screen">
      <div class="px-8 py-8">
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-3xl font-bold text-gray-800">Gestionar Servicios</h1>
          <button class="bg-pink-600 text-white rounded-lg px-6 py-3 font-semibold hover:bg-pink-700 transition flex items-center gap-2">
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
          <button class="px-4 py-2 bg-pink-100 text-pink-600 rounded-lg font-semibold">Activos</button>
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
                  <button class="text-pink-600 font-semibold text-sm hover:text-pink-700">Editar</button>
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
                  <button class="text-pink-600 font-semibold text-sm hover:text-pink-700">Editar</button>
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
                  <button class="text-pink-600 font-semibold text-sm hover:text-pink-700">Editar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class ServiciosComponent {}
