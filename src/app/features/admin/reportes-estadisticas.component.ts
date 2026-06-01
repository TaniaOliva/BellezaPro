import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-reportes-estadisticas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white min-h-screen">
      <div class="px-8 py-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-8">Reportes y Estadísticas</h1>

        <!-- KPI Cards -->
        <div class="grid grid-cols-4 gap-6 mb-8">
          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <span class="text-gray-500 text-sm uppercase font-semibold">Ingresos Totales</span>
              <div class="bg-green-100 rounded-lg p-3 text-green-600">
                <span class="material-symbols-outlined">trending_up</span>
              </div>
            </div>
            <p class="text-3xl font-bold text-gray-800 mb-2">L. 45,320</p>
            <p class="text-sm text-green-600 font-semibold">↑ 12% vs mes anterior</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <span class="text-gray-500 text-sm uppercase font-semibold">Citas Completadas</span>
              <div class="bg-blue-100 rounded-lg p-3 text-blue-600">
                <span class="material-symbols-outlined">check_circle</span>
              </div>
            </div>
            <p class="text-3xl font-bold text-gray-800 mb-2">284</p>
            <p class="text-sm text-blue-600 font-semibold">↑ 8% vs mes anterior</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <span class="text-gray-500 text-sm uppercase font-semibold">Clientes Activos</span>
              <div class="bg-purple-100 rounded-lg p-3 text-purple-600">
                <span class="material-symbols-outlined">group</span>
              </div>
            </div>
            <p class="text-3xl font-bold text-gray-800 mb-2">128</p>
            <p class="text-sm text-purple-600 font-semibold">↑ 5% vs mes anterior</p>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <span class="text-gray-500 text-sm uppercase font-semibold">Calificación Promedio</span>
              <div class="bg-amber-100 rounded-lg p-3 text-amber-600">
                <span class="material-symbols-outlined">star</span>
              </div>
            </div>
            <p class="text-3xl font-bold text-gray-800 mb-2">4.7</p>
            <p class="text-sm text-amber-600 font-semibold">Basado en 320 opiniones</p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-8 mb-8">
          <!-- Gráfico de líneas (Ingresos) -->
          <div class="col-span-2 bg-white border border-gray-200 rounded-lg p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4">Ingresos por mes</h3>
            <div class="bg-gray-100 rounded-lg p-6 h-48 flex items-end justify-around gap-2">
              <div class="w-8 bg-red-600 rounded-t" style="height: 40%;"></div>
              <div class="w-8 bg-red-600 rounded-t" style="height: 60%;"></div>
              <div class="w-8 bg-red-600 rounded-t" style="height: 45%;"></div>
              <div class="w-8 bg-red-600 rounded-t" style="height: 75%;"></div>
              <div class="w-8 bg-red-600 rounded-t" style="height: 85%;"></div>
              <div class="w-8 bg-red-600 rounded-t" style="height: 90%;"></div>
            </div>
            <p class="text-xs text-gray-500 text-center mt-2">Ene - Feb - Mar - Abr - May - Jun</p>
          </div>

          <!-- Gráfico de pastel (Servicios) -->
          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4">Servicios más vendidos</h3>
            <div class="flex items-center justify-center h-48">
              <div class="relative w-32 h-32">
                <div class="absolute inset-0 rounded-full" style="background: conic-gradient(#EC4899 0% 35%, #8B5CF6 35% 65%, #3B82F6 65% 100%);"></div>
              </div>
            </div>
            <div class="space-y-2 mt-4 text-xs">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-red-600"></div>
                <span class="text-gray-600">Manicure (35%)</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-purple-600"></div>
                <span class="text-gray-600">Pedicure (30%)</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-blue-600"></div>
                <span class="text-gray-600">Otros (35%)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabla de desempeño y clientes principales -->
        <div class="grid grid-cols-2 gap-8">
          <!-- Desempeño por estilista -->
          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4">Desempeño de estilistas</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-gray-700 font-semibold">Sofia R.</span>
                <div class="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                  <div class="bg-red-600 h-2 rounded-full" style="width: 90%;"></div>
                </div>
                <span class="text-gray-600 text-sm">90%</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-700 font-semibold">María F.</span>
                <div class="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                  <div class="bg-purple-600 h-2 rounded-full" style="width: 85%;"></div>
                </div>
                <span class="text-gray-600 text-sm">85%</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-700 font-semibold">Ana G.</span>
                <div class="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                  <div class="bg-blue-600 h-2 rounded-full" style="width: 78%;"></div>
                </div>
                <span class="text-gray-600 text-sm">78%</span>
              </div>
            </div>
          </div>

          <!-- Clientes principales -->
          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4">Clientes principales</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">MG</div>
                  <div>
                    <p class="font-semibold text-gray-800">María Garcia</p>
                    <p class="text-xs text-gray-600">12 visitas</p>
                  </div>
                </div>
                <span class="text-red-600 font-semibold">L. 4,200</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-600 font-bold">JL</div>
                  <div>
                    <p class="font-semibold text-gray-800">Jessica López</p>
                    <p class="text-xs text-gray-600">8 visitas</p>
                  </div>
                </div>
                <span class="text-gray-600 font-semibold">L. 2,800</span>
              </div>
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 font-bold">CM</div>
                  <div>
                    <p class="font-semibold text-gray-800">Carmen Martínez</p>
                    <p class="text-xs text-gray-600">5 visitas</p>
                  </div>
                </div>
                <span class="text-gray-600 font-semibold">L. 1,800</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ReportesEstadisticasComponent {}

