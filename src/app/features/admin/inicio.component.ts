import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-inicio',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white min-h-screen">
      <div class="px-8 py-8">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-800">Panel de administración</h1>
            <p class="text-gray-600 mt-2">Resumen rápido de la operación y métricas clave.</p>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div class="bg-red-50 border border-red-100 rounded-lg p-4 text-center">
              <p class="text-xs uppercase text-gray-500 font-semibold">Citas hoy</p>
              <p class="text-2xl font-bold text-gray-800 mt-2">12</p>
            </div>
            <div class="bg-red-50 border border-red-100 rounded-lg p-4 text-center">
              <p class="text-xs uppercase text-gray-500 font-semibold">Ingresos</p>
              <p class="text-2xl font-bold text-gray-800 mt-2">L. 45,320</p>
            </div>
            <div class="bg-red-50 border border-red-100 rounded-lg p-4 text-center">
              <p class="text-xs uppercase text-gray-500 font-semibold">Clientes</p>
              <p class="text-2xl font-bold text-gray-800 mt-2">128</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-6 mb-8">
          <div class="col-span-2 bg-white border border-gray-200 rounded-lg p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Actividad reciente</h2>
            <div class="space-y-4">
              <div class="flex items-center justify-between gap-4 rounded-lg border border-gray-100 p-4">
                <div>
                  <p class="text-sm text-gray-500">Nueva cita</p>
                  <p class="font-semibold text-gray-800">María García reservó Manicure Premium</p>
                </div>
                <span class="text-xs uppercase text-red-600 font-semibold">Hace 10 min</span>
              </div>
              <div class="flex items-center justify-between gap-4 rounded-lg border border-gray-100 p-4">
                <div>
                  <p class="text-sm text-gray-500">Reporte enviado</p>
                  <p class="font-semibold text-gray-800">Sofia R. reportó comportamiento inapropiado</p>
                </div>
                <span class="text-xs uppercase text-yellow-600 font-semibold">Hace 1 h</span>
              </div>
              <div class="flex items-center justify-between gap-4 rounded-lg border border-gray-100 p-4">
                <div>
                  <p class="text-sm text-gray-500">Nuevo cliente</p>
                  <p class="font-semibold text-gray-800">Jessica López se registró en la app</p>
                </div>
                <span class="text-xs uppercase text-green-600 font-semibold">Hace 2 h</span>
              </div>
            </div>
          </div>
          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Próximas tareas</h2>
            <div class="space-y-4">
              <div class="rounded-lg bg-red-50 p-4">
                <p class="text-sm text-gray-600">Revisar reportes pendientes</p>
              </div>
              <div class="rounded-lg bg-red-50 p-4">
                <p class="text-sm text-gray-600">Aprobar horario de Ana G.</p>
              </div>
              <div class="rounded-lg bg-red-50 p-4">
                <p class="text-sm text-gray-600">Actualizar servicio de coloración</p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-6">
          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <p class="text-sm uppercase text-gray-500 mb-3">Utilización por estilista</p>
            <div class="space-y-3">
              <div class="text-sm font-semibold text-gray-800">Sofia R.</div>
              <div class="h-3 rounded-full bg-gray-200 overflow-hidden"><div class="h-full w-4/5 bg-red-600"></div></div>
            </div>
            <div class="space-y-3 mt-4">
              <div class="text-sm font-semibold text-gray-800">María F.</div>
              <div class="h-3 rounded-full bg-gray-200 overflow-hidden"><div class="h-full w-3/4 bg-red-600"></div></div>
            </div>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <p class="text-sm uppercase text-gray-500 mb-3">Servicios más reservados</p>
            <div class="space-y-3 text-sm text-gray-700">
              <p>Manicure Premium</p>
              <p>Pedicure Spa</p>
              <p>Maquillaje de evento</p>
            </div>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <p class="text-sm uppercase text-gray-500 mb-3">Clientes VIP</p>
            <div class="space-y-3 text-sm text-gray-700">
              <p>María Garcia</p>
              <p>Jessica López</p>
              <p>Carmen Rodríguez</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class InicioComponent {}

