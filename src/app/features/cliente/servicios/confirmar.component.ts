import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cliente-confirmar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white min-h-screen">
      <div class="max-w-2xl mx-auto px-8 py-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Confirmar Reserva</h1>
        <p class="text-gray-600 mb-8">Revisa los detalles antes de finalizar</p>

        <!-- Step indicator -->
        <div class="flex items-center justify-center gap-2 mb-8">
          <div class="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs">✓</div>
          <div class="w-12 h-1 bg-red-600"></div>
          <div class="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs">✓</div>
          <div class="w-12 h-1 bg-red-600"></div>
          <div class="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs">✓</div>
          <div class="w-12 h-1 bg-red-600"></div>
          <div class="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs">4</div>
          <div class="w-12 h-1 bg-gray-300"></div>
          <div class="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold text-xs">5</div>
        </div>

        <!-- Resumen -->
        <div class="bg-red-50 rounded-lg p-6 mb-8 border-l-4 border-red-600">
          <h2 class="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span class="material-symbols-outlined text-red-600">receipt</span>
            Resumen de tu reserva
          </h2>

          <div class="space-y-4 pb-4 border-b border-red-200">
            <div class="flex justify-between">
              <span class="text-sm uppercase text-gray-600 font-semibold">Servicio</span>
              <span class="text-sm text-gray-800">L 350</span>
            </div>
            <div>
              <p class="text-gray-800 font-semibold">Manicure premium</p>
              <p class="text-xs text-gray-600">Mediana, Rosa claro</p>
            </div>
          </div>

          <div class="py-4 border-b border-red-200 space-y-2">
            <div class="text-sm uppercase text-gray-600 font-semibold">Estilista</div>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold">AG</div>
              <p class="text-gray-800 font-semibold">Ana Garcia</p>
            </div>
          </div>

          <div class="py-4 space-y-2">
            <div class="text-sm uppercase text-gray-600 font-semibold">Cita</div>
            <div class="flex items-center gap-2 text-gray-800">
              <span class="material-symbols-outlined text-sm">calendar_today</span>
              <span>Jueves, 24 Octubre 2024</span>
            </div>
            <div class="flex items-center gap-2 text-gray-800">
              <span class="material-symbols-outlined text-sm">schedule</span>
              <span>10:00 AM (1 hr 30 min)</span>
            </div>
          </div>
        </div>

        <!-- Total -->
        <div class="flex justify-between items-center mb-8">
          <span class="text-gray-600 font-semibold">Total estimado</span>
          <span class="text-3xl font-bold text-red-600">L 480</span>
        </div>

        <!-- Notas -->
        <div class="mb-8">
          <label class="block text-sm font-bold text-gray-800 mb-3">Notas adicionales para la estilista (Opcional)</label>
          <textarea rows="4" class="w-full p-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400" placeholder="Ej. Tengo sensibilidad en las cutículas..."></textarea>
        </div>

        <!-- Confirmación -->
        <div class="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
          <span class="material-symbols-outlined text-green-600 flex-shrink-0">check_circle</span>
          <p class="text-sm text-green-800">Recibirás un mensaje de confirmación por WhatsApp una vez que la reserva sea aprobada.</p>
        </div>

        <!-- Botones -->
        <div class="flex gap-4">
          <button class="flex-1 border border-gray-300 text-gray-800 rounded-lg py-3 font-semibold hover:bg-gray-50 transition">
            Modificar reserva
          </button>
          <button class="flex-1 bg-red-600 text-white rounded-lg py-3 font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2">
            <span class="material-symbols-outlined">check_circle</span>
            Confirmar reserva
          </button>
        </div>
      </div>
    </div>
  `
})
export class ConfirmarComponent {}

