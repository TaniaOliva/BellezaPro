import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cliente-horario',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-white min-h-screen">
      <!-- Header -->
      <div class="bg-red-50 px-8 py-6 border-b border-gray-200">
        <h1 class="text-2xl font-bold text-gray-800">Selecciona tu horario</h1>
        <p class="text-gray-600 text-sm mt-1">Elige la fecha y hora que mejor se adapte a tu agenda.</p>
      </div>

      <div class="px-8 py-8">
        <!-- Step indicator -->
        <div class="flex items-center justify-between mb-8 max-w-3xl mx-auto">
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
            <div class="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold text-sm">4</div>
            <span class="text-sm text-gray-500">Horario</span>
          </div>
        </div>

        <h1 class="text-3xl font-bold text-gray-800 mb-2">Selecciona fecha y hora</h1>
        <p class="text-gray-600 mb-8">Elige la fecha y hora que mejor se adapte a tu agenda</p>

        <div class="grid grid-cols-3 gap-8 max-w-5xl">
          <!-- Calendario -->
          <div class="col-span-2">
            <h3 class="text-lg font-bold text-gray-800 mb-4">Abril 2024</h3>
            <div class="grid grid-cols-7 gap-2 mb-8">
              <span class="text-xs font-semibold text-gray-600 text-center py-2">D</span>
              <span class="text-xs font-semibold text-gray-600 text-center py-2">L</span>
              <span class="text-xs font-semibold text-gray-600 text-center py-2">M</span>
              <span class="text-xs font-semibold text-gray-600 text-center py-2">M</span>
              <span class="text-xs font-semibold text-gray-600 text-center py-2">J</span>
              <span class="text-xs font-semibold text-gray-600 text-center py-2">V</span>
              <span class="text-xs font-semibold text-gray-600 text-center py-2">S</span>

              <button class="p-2 text-gray-400 text-sm">28</button>
              <button class="p-2 text-gray-400 text-sm">29</button>
              <button class="p-2 text-gray-400 text-sm">30</button>
              <button class="p-2 text-gray-600 text-sm hover:bg-gray-100 rounded">1</button>
              <button class="p-2 text-gray-600 text-sm hover:bg-gray-100 rounded">2</button>
              <button class="p-2 text-gray-600 text-sm hover:bg-gray-100 rounded">3</button>
              <button class="p-2 text-gray-600 text-sm hover:bg-gray-100 rounded">4</button>
              <button class="p-2 text-gray-600 text-sm hover:bg-gray-100 rounded">5</button>
              <button class="p-2 text-gray-600 text-sm hover:bg-gray-100 rounded">6</button>
              <button class="p-2 text-gray-600 text-sm hover:bg-gray-100 rounded">7</button>
              <button class="p-2 text-gray-600 text-sm hover:bg-gray-100 rounded">8</button>
              <button class="p-2 text-gray-600 text-sm hover:bg-gray-100 rounded">9</button>
              <button class="p-2 text-gray-600 text-sm hover:bg-gray-100 rounded">10</button>
              <button class="p-2 text-gray-600 text-sm hover:bg-gray-100 rounded">11</button>
              <button class="p-2 bg-red-100 text-red-600 text-sm font-bold rounded border-2 border-red-600">29</button>
              <button class="p-2 text-gray-600 text-sm hover:bg-gray-100 rounded">30</button>
              <button class="p-2 text-gray-400 text-sm">1</button>
              <button class="p-2 text-gray-400 text-sm">2</button>
              <button class="p-2 text-gray-400 text-sm">3</button>
              <button class="p-2 text-gray-400 text-sm">4</button>
              <button class="p-2 text-gray-400 text-sm">5</button>
            </div>

            <h3 class="text-lg font-bold text-gray-800 mb-4">Horarios disponibles - Martes, 29 de Abril</h3>
            <div class="grid grid-cols-4 gap-3">
              <button class="p-3 border border-gray-300 rounded-lg text-sm font-semibold hover:border-red-600 hover:bg-red-50">08:00 AM</button>
              <button class="p-3 border border-gray-300 rounded-lg text-sm font-semibold hover:border-red-600 hover:bg-red-50">09:30 AM</button>
              <button class="p-3 border border-gray-300 rounded-lg text-sm font-semibold hover:border-red-600 hover:bg-red-50">10:00 AM</button>
              <button class="p-3 border-2 border-red-600 bg-red-50 text-red-600 rounded-lg text-sm font-semibold">11:00 AM</button>
              <button class="p-3 border border-gray-300 rounded-lg text-sm font-semibold hover:border-red-600 hover:bg-red-50">11:30 AM</button>
              <button class="p-3 border border-gray-300 rounded-lg text-sm font-semibold hover:border-red-600 hover:bg-red-50">12:30 PM</button>
              <button class="p-3 border border-gray-300 rounded-lg text-sm font-semibold hover:border-red-600 hover:bg-red-50 opacity-50 cursor-not-allowed">03:00 PM</button>
              <button class="p-3 border border-gray-300 rounded-lg text-sm font-semibold hover:border-red-600 hover:bg-red-50">04:30 PM</button>
            </div>
          </div>

          <!-- Resumen lateral -->
          <div>
            <div class="bg-white border border-gray-200 rounded-lg p-6 sticky top-8">
              <h4 class="font-bold text-gray-800 mb-4">Resumen de la cita</h4>
              
              <div class="space-y-3 pb-4 border-b border-gray-200">
                <div>
                  <p class="text-xs text-gray-600 uppercase font-semibold">Servicio</p>
                  <p class="text-sm font-semibold text-gray-800">Corte y Secado</p>
                </div>
              </div>

              <div class="space-y-3 pb-4 border-b border-gray-200">
                <div>
                  <p class="text-xs text-gray-600 uppercase font-semibold">Estilista</p>
                  <p class="text-sm font-semibold text-gray-800">Ana García</p>
                </div>
              </div>

              <div class="space-y-3 pb-4">
                <div>
                  <p class="text-xs text-gray-600 uppercase font-semibold">Fecha y hora</p>
                  <p class="text-sm font-semibold text-gray-800">Martes, 29 de Abril</p>
                  <p class="text-sm font-semibold text-red-600">11:00 AM</p>
                </div>
              </div>

              <button routerLink="/cliente/servicios/confirmar" class="w-full bg-red-600 text-white rounded-lg py-3 font-semibold hover:bg-red-700 transition">
                Continuar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HorarioComponent {}

