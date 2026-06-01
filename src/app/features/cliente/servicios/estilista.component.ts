import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cliente-estilista',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-white min-h-screen">
      <!-- Header -->
      <div class="bg-red-50 px-8 py-6 border-b border-gray-200">
        <h1 class="text-2xl font-bold text-gray-800">Elige tu estilista</h1>
        <p class="text-gray-600 text-sm mt-1">Selecciona al profesional para tu servicio de Corte de Cabello.</p>
      </div>

      <div class="px-8 py-8 max-w-4xl mx-auto">
        <!-- Step indicator -->
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">✓</div>
            <span class="text-sm text-gray-700 font-medium">Servicio</span>
          </div>
          <div class="flex-1 h-1 bg-red-600 mx-3"></div>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">✓</div>
            <span class="text-sm text-gray-700 font-medium">Estilista</span>
          </div>
          <div class="flex-1 h-1 bg-red-600 mx-3"></div>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold text-sm">3</div>
            <span class="text-sm text-gray-500">Horario</span>
          </div>
          <div class="flex-1 h-1 bg-gray-300 mx-3"></div>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold text-sm">4</div>
            <span class="text-sm text-gray-600">Horario</span>
          </div>
        </div>

        <h1 class="text-3xl font-bold text-gray-800 mb-2">Elige tu estilista</h1>
        <p class="text-gray-600 mb-8">Selecciona con quién deseas agendar tu cita</p>

        <!-- Grid de estilistas -->
        <div class="grid grid-cols-3 gap-6 max-w-4xl">
          <button routerLink="/cliente/servicios/horario" class="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition hover:border-red-600">
            <div class="w-24 h-24 bg-gradient-to-br from-red-300 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white">
              <span class="material-symbols-outlined text-5xl">person</span>
            </div>
            <p class="font-bold text-gray-800 mb-1">Sofia R.</p>
            <p class="text-sm text-gray-600 mb-2">Especialista en manicure</p>
            <div class="flex justify-center gap-0.5 text-amber-400 mb-2">
              <span class="material-symbols-outlined text-sm">star</span>
              <span class="material-symbols-outlined text-sm">star</span>
              <span class="material-symbols-outlined text-sm">star</span>
              <span class="material-symbols-outlined text-sm">star</span>
              <span class="material-symbols-outlined text-sm">star_half</span>
            </div>
            <p class="text-xs text-gray-500">120 opiniones</p>
          </button>

          <button routerLink="/cliente/servicios/horario" class="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition hover:border-red-600">
            <div class="w-24 h-24 bg-gradient-to-br from-purple-300 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white">
              <span class="material-symbols-outlined text-5xl">person</span>
            </div>
            <p class="font-bold text-gray-800 mb-1">María F.</p>
            <p class="text-sm text-gray-600 mb-2">Pedicure premium</p>
            <div class="flex justify-center gap-0.5 text-amber-400 mb-2">
              <span class="material-symbols-outlined text-sm">star</span>
              <span class="material-symbols-outlined text-sm">star</span>
              <span class="material-symbols-outlined text-sm">star</span>
              <span class="material-symbols-outlined text-sm">star</span>
              <span class="material-symbols-outlined text-sm">star</span>
            </div>
            <p class="text-xs text-gray-500">95 opiniones</p>
          </button>

          <button routerLink="/cliente/servicios/horario" class="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition hover:border-red-600">
            <div class="w-24 h-24 bg-gradient-to-br from-red-300 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white">
              <span class="material-symbols-outlined text-5xl">person</span>
            </div>
            <p class="font-bold text-gray-800 mb-1">Ana G.</p>
            <p class="text-sm text-gray-600 mb-2">Coloración capilar</p>
            <div class="flex justify-center gap-0.5 text-amber-400 mb-2">
              <span class="material-symbols-outlined text-sm">star</span>
              <span class="material-symbols-outlined text-sm">star</span>
              <span class="material-symbols-outlined text-sm">star</span>
              <span class="material-symbols-outlined text-sm">star</span>
              <span class="material-symbols-outlined text-sm">star_half</span>
            </div>
            <p class="text-xs text-gray-500">110 opiniones</p>
          </button>
        </div>

        <!-- Sin preferencia -->
        <div class="mt-8 max-w-4xl">
          <button class="w-full border-2 border-dashed border-gray-300 text-gray-600 rounded-lg py-4 font-semibold hover:border-red-600 hover:text-red-600 transition">
            <span class="material-symbols-outlined text-2xl block mx-auto mb-2">help_outline</span>
            No tengo preferencia - Asignar automáticamente
          </button>
        </div>
      </div>
    </div>
  `
})
export class EstilistaComponent {}

