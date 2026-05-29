import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cliente-opciones',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="bg-white min-h-screen">
      <div class="px-8 py-8">
        <!-- Step indicator -->
        <div class="flex items-center justify-between mb-8 max-w-2xl">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold text-sm">✓</div>
            <span class="text-sm text-gray-600">Servicio</span>
          </div>
          <div class="flex-1 h-1 bg-pink-600 mx-3"></div>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold text-sm">2</div>
            <span class="text-sm text-gray-600">Opciones</span>
          </div>
          <div class="flex-1 h-1 bg-gray-300 mx-3"></div>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold text-sm">3</div>
            <span class="text-sm text-gray-600">Estilista</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-8">
          <!-- Imagen y preview -->
          <div>
            <a href="#" class="text-pink-600 font-semibold text-sm mb-4 block">← Volver al catálogo</a>
            <div class="bg-gray-300 h-96 rounded-lg relative mb-4">
              <span class="absolute top-4 left-4 bg-white text-gray-700 text-xs font-bold px-3 py-1 rounded">MANICURE</span>
            </div>
            <div class="grid grid-cols-6 gap-2">
              <div class="w-full aspect-square bg-gray-200 rounded-lg cursor-pointer border-2 border-pink-600"></div>
              <div class="w-full aspect-square bg-gray-200 rounded-lg cursor-pointer"></div>
              <div class="w-full aspect-square bg-gray-200 rounded-lg cursor-pointer"></div>
              <div class="w-full aspect-square bg-gray-200 rounded-lg cursor-pointer"></div>
              <div class="w-full aspect-square bg-gray-200 rounded-lg cursor-pointer"></div>
              <div class="w-full aspect-square bg-gray-200 rounded-lg cursor-pointer"></div>
            </div>
          </div>

          <!-- Detalles y opciones -->
          <div>
            <h1 class="text-3xl font-bold text-gray-800 mb-2">Manicure premium</h1>
            <p class="text-2xl text-pink-600 font-bold mb-6">L 420</p>

            <!-- Tamaño -->
            <div class="mb-6">
              <p class="text-sm font-bold text-gray-800 mb-4">Largo / tamaño</p>
              <div class="grid grid-cols-4 gap-3">
                <button class="py-2 px-3 border border-gray-300 rounded-lg font-semibold text-sm hover:border-pink-600">Corta</button>
                <button class="py-2 px-3 border-2 border-pink-600 text-pink-600 rounded-lg font-semibold text-sm bg-pink-50">Mediana</button>
                <button class="py-2 px-3 border border-gray-300 rounded-lg font-semibold text-sm hover:border-pink-600">Larga</button>
                <button class="py-2 px-3 border border-gray-300 rounded-lg font-semibold text-sm hover:border-pink-600">Extra larga</button>
              </div>
            </div>

            <!-- Color -->
            <div class="mb-6">
              <p class="text-sm font-bold text-gray-800 mb-4">Color / tono</p>
              <select class="w-full p-3 border border-gray-300 rounded-lg text-gray-700">
                <option>Gel semipermanente</option>
                <option>Rojo oscuro</option>
                <option>Rosa claro</option>
                <option>Nude</option>
              </select>
            </div>

            <!-- Colores disponibles -->
            <div class="mb-8">
              <p class="text-sm font-bold text-gray-800 mb-3">Elige un tono (Opcional)</p>
              <div class="flex gap-2">
                <div class="w-8 h-8 bg-pink-300 rounded-full cursor-pointer border-2 border-gray-300 hover:border-pink-600"></div>
                <div class="w-8 h-8 bg-pink-400 rounded-full cursor-pointer border-2 border-gray-300 hover:border-pink-600"></div>
                <div class="w-8 h-8 bg-red-500 rounded-full cursor-pointer border-2 border-gray-300 hover:border-pink-600"></div>
                <div class="w-8 h-8 bg-red-700 rounded-full cursor-pointer border-2 border-gray-300 hover:border-pink-600"></div>
                <div class="w-8 h-8 bg-yellow-300 rounded-full cursor-pointer border-2 border-gray-300 hover:border-pink-600"></div>
                <div class="w-8 h-8 bg-purple-400 rounded-full cursor-pointer border-2 border-gray-300 hover:border-pink-600"></div>
                <div class="w-8 h-8 bg-blue-400 rounded-full cursor-pointer border-2 border-gray-300 hover:border-pink-600"></div>
                <div class="w-8 h-8 bg-gray-200 rounded-full cursor-pointer border-2 border-gray-300 hover:border-pink-600"></div>
              </div>
            </div>

            <!-- Botón continuar -->
            <button routerLink="/cliente/servicios/estilista" class="w-full bg-pink-600 text-white rounded-lg py-3 font-semibold hover:bg-pink-700 transition">
              Continuar con estilista
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class OpcionesComponent {}
