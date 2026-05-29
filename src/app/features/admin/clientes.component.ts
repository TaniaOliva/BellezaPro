import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-clientes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white min-h-screen">
      <div class="px-8 py-8">
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-3xl font-bold text-gray-800">Gestionar Clientes</h1>
          <button class="bg-pink-600 text-white rounded-lg px-6 py-3 font-semibold hover:bg-pink-700 transition flex items-center gap-2">
            <span class="material-symbols-outlined">download</span>
            Exportar
          </button>
        </div>

        <!-- Buscador y filtros -->
        <div class="mb-6 flex gap-4">
          <div class="flex-1 flex items-center border border-gray-300 rounded-lg px-4 py-2 bg-white">
            <span class="material-symbols-outlined text-gray-400">search</span>
            <input type="text" placeholder="Buscar cliente..." class="ml-2 flex-1 outline-none text-gray-700">
          </div>
          <button class="px-4 py-2 bg-pink-100 text-pink-600 rounded-lg font-semibold">Activos</button>
          <button class="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg font-semibold hover:bg-gray-50">Todos</button>
        </div>

        <!-- Tabla de clientes -->
        <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Nombre</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Email</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Teléfono</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Visitas</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Gasto Total</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Calificación</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr class="hover:bg-gray-50 transition">
                <td class="px-6 py-4"><p class="font-semibold text-gray-800">María Garcia</p></td>
                <td class="px-6 py-4"><p class="text-gray-600">maria.garcia&#64;email.com</p></td>
                <td class="px-6 py-4"><p class="text-gray-600">+504 9988-7766</p></td>
                <td class="px-6 py-4"><p class="text-gray-600">12</p></td>
                <td class="px-6 py-4"><p class="font-semibold text-gray-800">L. 4,200</p></td>
                <td class="px-6 py-4"><span class="text-amber-400">★★★★★</span></td>
                <td class="px-6 py-4 text-center">
                  <button class="text-pink-600 font-semibold text-sm hover:text-pink-700">Ver</button>
                </td>
              </tr>
              <tr class="hover:bg-gray-50 transition">
                <td class="px-6 py-4"><p class="font-semibold text-gray-800">Jessica López</p></td>
                <td class="px-6 py-4"><p class="text-gray-600">jessica.lopez&#64;email.com</p></td>
                <td class="px-6 py-4"><p class="text-gray-600">+504 3333-4455</p></td>
                <td class="px-6 py-4"><p class="text-gray-600">8</p></td>
                <td class="px-6 py-4"><p class="font-semibold text-gray-800">L. 2,800</p></td>
                <td class="px-6 py-4"><span class="text-amber-400">★★★★☆</span></td>
                <td class="px-6 py-4 text-center">
                  <button class="text-pink-600 font-semibold text-sm hover:text-pink-700">Ver</button>
                </td>
              </tr>
              <tr class="hover:bg-gray-50 transition">
                <td class="px-6 py-4"><p class="font-semibold text-gray-800">Carmen Rodríguez</p></td>
                <td class="px-6 py-4"><p class="text-gray-600">carmen.rodriguez&#64;email.com</p></td>
                <td class="px-6 py-4"><p class="text-gray-600">+504 2222-3333</p></td>
                <td class="px-6 py-4"><p class="text-gray-600">5</p></td>
                <td class="px-6 py-4"><p class="font-semibold text-gray-800">L. 1,800</p></td>
                <td class="px-6 py-4"><span class="text-amber-400">★★★★★</span></td>
                <td class="px-6 py-4 text-center">
                  <button class="text-pink-600 font-semibold text-sm hover:text-pink-700">Ver</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class ClientesComponent {}
