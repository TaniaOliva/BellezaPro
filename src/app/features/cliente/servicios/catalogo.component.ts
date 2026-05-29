import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cliente-catalogo',
  standalone: true,
  imports: [CommonModule, RouterLink],
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
          <button class="px-4 py-2 bg-pink-100 text-pink-600 rounded-full font-semibold text-sm">Todos</button>
          <button class="px-4 py-2 text-gray-600 rounded-full font-semibold text-sm border border-gray-300">Manicure</button>
          <button class="px-4 py-2 text-gray-600 rounded-full font-semibold text-sm border border-gray-300">Pedicure</button>
          <button class="px-4 py-2 text-gray-600 rounded-full font-semibold text-sm border border-gray-300">Cabello</button>
          <button class="px-4 py-2 text-gray-600 rounded-full font-semibold text-sm border border-gray-300">Maquillaje</button>
        </div>

        <!-- Grid de servicios -->
        <div class="grid grid-cols-3 gap-6">
          <div class="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition">
            <div class="bg-gray-300 h-48 relative">
              <span class="absolute top-3 right-3 bg-white text-gray-700 text-xs font-bold px-3 py-1 rounded">Manicure</span>
            </div>
            <div class="p-5">
              <h3 class="text-lg font-bold text-gray-800 mb-2">Manicure Clásico</h3>
              <p class="text-sm text-gray-600 mb-2">Cuidado esencial de las manos, incluyendo limpieza, limado, hidratación...</p>
              <p class="text-pink-600 font-bold mb-4">Desde L. 200</p>
              <button routerLink="/cliente/servicios/opciones" class="w-full bg-pink-600 text-white rounded-lg py-2 font-semibold hover:bg-pink-700 transition">Seleccionar</button>
            </div>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition">
            <div class="bg-gray-300 h-48 relative">
              <span class="absolute top-3 right-3 bg-white text-gray-700 text-xs font-bold px-3 py-1 rounded">Manicure</span>
            </div>
            <div class="p-5">
              <h3 class="text-lg font-bold text-gray-800 mb-2">Manicure Gel</h3>
              <p class="text-sm text-gray-600 mb-2">Aplicación de esmalte en gel de larga duración con curado UV. Acabado...</p>
              <p class="text-pink-600 font-bold mb-4">Desde L. 350</p>
              <button routerLink="/cliente/servicios/opciones" class="w-full bg-pink-600 text-white rounded-lg py-2 font-semibold hover:bg-pink-700 transition">Seleccionar</button>
            </div>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition">
            <div class="bg-gray-300 h-48 relative">
              <span class="absolute top-3 right-3 bg-white text-gray-700 text-xs font-bold px-3 py-1 rounded">Uñas</span>
            </div>
            <div class="p-5">
              <h3 class="text-lg font-bold text-gray-800 mb-2">Nail Art Sencillo</h3>
              <p class="text-sm text-gray-600 mb-2">Diseños minimalistas y elegantes aplicados sobre la base preferido...</p>
              <p class="text-pink-600 font-bold mb-4">Desde L. 420</p>
              <button routerLink="/cliente/servicios/opciones" class="w-full bg-pink-600 text-white rounded-lg py-2 font-semibold hover:bg-pink-700 transition">Seleccionar</button>
            </div>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition">
            <div class="bg-gray-300 h-48 relative">
              <span class="absolute top-3 right-3 bg-white text-gray-700 text-xs font-bold px-3 py-1 rounded">Pedicure</span>
            </div>
            <div class="p-5">
              <h3 class="text-lg font-bold text-gray-800 mb-2">Pedicure Spa</h3>
              <p class="text-sm text-gray-600 mb-2">Tratamiento completo para pies cansados. Incluye exfoliación con sales...</p>
              <p class="text-pink-600 font-bold mb-4">Desde L. 300</p>
              <button routerLink="/cliente/servicios/opciones" class="w-full bg-pink-600 text-white rounded-lg py-2 font-semibold hover:bg-pink-700 transition">Seleccionar</button>
            </div>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition">
            <div class="bg-gray-300 h-48 relative">
              <span class="absolute top-3 right-3 bg-white text-gray-700 text-xs font-bold px-3 py-1 rounded">Cabello</span>
            </div>
            <div class="p-5">
              <h3 class="text-lg font-bold text-gray-800 mb-2">Corte Clásico</h3>
              <p class="text-sm text-gray-600 mb-2">Diseño de corte personalizado según tu tipo de rostro y textura cabello. Incluye...</p>
              <p class="text-pink-600 font-bold mb-4">Desde L. 250</p>
              <button routerLink="/cliente/servicios/opciones" class="w-full bg-pink-600 text-white rounded-lg py-2 font-semibold hover:bg-pink-700 transition">Seleccionar</button>
            </div>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition">
            <div class="bg-gray-300 h-48 relative">
              <span class="absolute top-3 right-3 bg-white text-gray-700 text-xs font-bold px-3 py-1 rounded">Cabello</span>
            </div>
            <div class="p-5">
              <h3 class="text-lg font-bold text-gray-800 mb-2">Tinte Completo</h3>
              <p class="text-sm text-gray-600 mb-2">Coloración total con productos de alta gama que protegen la fibra capilar...</p>
              <p class="text-pink-600 font-bold mb-4">Desde L. 600</p>
              <button routerLink="/cliente/servicios/opciones" class="w-full bg-pink-600 text-white rounded-lg py-2 font-semibold hover:bg-pink-700 transition">Seleccionar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CatalogoComponent {}
