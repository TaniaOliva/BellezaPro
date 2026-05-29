import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white min-h-screen">
      <div class="px-8 py-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-8">Configuración del Negocio</h1>

        <div class="max-w-2xl">
          <form class="space-y-8">
            <!-- Logo -->
            <div>
              <label class="block text-sm font-bold text-gray-800 mb-4">Logo del Negocio</label>
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <span class="material-symbols-outlined text-4xl text-gray-400 block mb-2">image</span>
                <p class="text-gray-600 font-semibold mb-2">Arrastra tu logo aquí o haz clic</p>
                <input type="file" accept="image/*" class="hidden">
                <button type="button" class="text-pink-600 font-semibold text-sm">Seleccionar imagen</button>
              </div>
            </div>

            <!-- Información básica -->
            <div class="bg-gray-50 rounded-lg p-6 space-y-6">
              <h3 class="text-lg font-bold text-gray-800">Información Básica</h3>
              
              <div>
                <label class="block text-sm font-semibold text-gray-800 mb-2">Nombre del negocio</label>
                <input type="text" value="BellezaPro Salon" class="w-full p-3 border border-gray-300 rounded-lg">
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-800 mb-2">Teléfono</label>
                  <input type="tel" value="+504 9999-8888" class="w-full p-3 border border-gray-300 rounded-lg">
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-800 mb-2">Correo</label>
                  <input type="email" value="info&#64;bellezapro.com" class="w-full p-3 border border-gray-300 rounded-lg">
                </div>
              </div>
            </div>

            <!-- Ubicación -->
            <div class="bg-gray-50 rounded-lg p-6 space-y-6">
              <h3 class="text-lg font-bold text-gray-800">Ubicación</h3>
              
              <div>
                <label class="block text-sm font-semibold text-gray-800 mb-2">Dirección</label>
                <input type="text" value="Calle Principal 123, Centro Comercial Bellas Artes" class="w-full p-3 border border-gray-300 rounded-lg">
              </div>

              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-800 mb-2">Ciudad</label>
                  <input type="text" value="Tegucigalpa" class="w-full p-3 border border-gray-300 rounded-lg">
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-800 mb-2">Departamento</label>
                  <input type="text" value="Francisco Morazán" class="w-full p-3 border border-gray-300 rounded-lg">
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-800 mb-2">Código Postal</label>
                  <input type="text" value="12101" class="w-full p-3 border border-gray-300 rounded-lg">
                </div>
              </div>
            </div>

            <!-- Horario de atención -->
            <div class="bg-gray-50 rounded-lg p-6 space-y-6">
              <h3 class="text-lg font-bold text-gray-800">Horario de Atención</h3>
              
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-gray-700 font-semibold">Lunes - Viernes</span>
                  <div class="flex gap-2 items-center">
                    <input type="time" value="09:00" class="p-2 border border-gray-300 rounded">
                    <span class="text-gray-600">-</span>
                    <input type="time" value="18:00" class="p-2 border border-gray-300 rounded">
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-700 font-semibold">Sábado</span>
                  <div class="flex gap-2 items-center">
                    <input type="time" value="10:00" class="p-2 border border-gray-300 rounded">
                    <span class="text-gray-600">-</span>
                    <input type="time" value="14:00" class="p-2 border border-gray-300 rounded">
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-700 font-semibold">Domingo</span>
                  <div class="flex gap-2 items-center">
                    <span class="text-gray-500 italic">Cerrado</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Botones -->
            <div class="flex gap-4 pt-6">
              <button type="button" class="flex-1 border border-gray-300 text-gray-800 rounded-lg py-3 font-semibold hover:bg-gray-50">Cancelar</button>
              <button type="submit" class="flex-1 bg-pink-600 text-white rounded-lg py-3 font-semibold hover:bg-pink-700 transition flex items-center justify-center gap-2">
                <span class="material-symbols-outlined">save</span>
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class ConfiguracionComponent {}
