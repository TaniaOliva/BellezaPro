import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estilista-inicio',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white min-h-screen">
      <!-- Header -->
      <div class="bg-red-50 px-8 py-6 border-b border-gray-200">
        <h1 class="text-2xl font-bold text-gray-800">Mi Dashboard</h1>
        <p class="text-gray-600 text-sm mt-1">Resumen de tu desempeño de hoy</p>
      </div>

      <div class="px-8 py-8">
        <!-- Métricas -->
        <div class="grid grid-cols-4 gap-6 mb-8">
          <div class="bg-white border border-gray-200 rounded-lg p-4">
            <p class="text-xs text-gray-600 uppercase font-semibold">Citas hoy</p>
            <p class="text-3xl font-bold text-gray-800 mt-2">4</p>
          </div>
          <div class="bg-white border border-gray-200 rounded-lg p-4">
            <p class="text-xs text-gray-600 uppercase font-semibold">Ingresos</p>
            <p class="text-3xl font-bold text-gray-800 mt-2">L. 1,200</p>
          </div>
          <div class="bg-white border border-gray-200 rounded-lg p-4">
            <p class="text-xs text-gray-600 uppercase font-semibold">Calificación</p>
            <p class="text-3xl font-bold text-red-600 mt-2">4.8/5</p>
          </div>
          <div class="bg-white border border-gray-200 rounded-lg p-4">
            <p class="text-xs text-gray-600 uppercase font-semibold">Clientes nuevos</p>
            <p class="text-3xl font-bold text-gray-800 mt-2">2</p>
          </div>
        </div>

        <!-- Citas de hoy -->
        <div class="grid grid-cols-3 gap-6">
          <div class="col-span-2">
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h2 class="text-xl font-bold text-gray-800 mb-4">Citas de hoy</h2>
              <div class="space-y-3">
                <div *ngFor="let cita of citas" [class]="cita.estado === 'En progreso' ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'" class="border rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p class="text-sm text-gray-600">{{ cita.hora }}</p>
                    <p class="font-semibold text-gray-800">{{ cita.cliente }}</p>
                    <p class="text-xs text-gray-600">{{ cita.servicio }}</p>
                  </div>
                  <span [class]="cita.estado === 'Completada' ? 'bg-green-100 text-green-700' : cita.estado === 'En progreso' ? 'bg-red-100 text-red-700' : cita.estado === 'Confirmada' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'" class="px-3 py-1 rounded-full text-xs font-semibold">
                    {{ cita.estado }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Gráfico semanal -->
          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Actividad semana</h2>
            <div class="flex items-end justify-between gap-2 h-32">
              <div *ngFor="let altura of alturasBarra; let i = index" class="flex flex-col items-center gap-2 flex-1">
                <div [style.height.%]="altura" class="w-full bg-red-600 rounded-t-lg hover:bg-red-700 transition"></div>
                <p class="text-xs text-gray-600 font-semibold">{{ diasSemana[i] }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class InicioComponent {
  citas = [
    {
      hora: '09:00',
      cliente: 'Laura Mendez',
      servicio: 'Manicure Clasico',
      estado: 'Completada'
    },
    {
      hora: '10:30',
      cliente: 'Sofia Torres',
      servicio: 'Nail Art Sencillo',
      estado: 'En progreso'
    },
    {
      hora: '12:00',
      cliente: 'Carmen Reyes',
      servicio: 'Manicure Gel',
      estado: 'Confirmada'
    },
    {
      hora: '14:00',
      cliente: 'Valeria Cruz',
      servicio: 'Pedicure Spa',
      estado: 'Pendiente'
    }
  ];

  diasSemana = ['L', 'M', 'X', 'J', 'V', 'S'];
  alturasBarra = [45, 60, 80, 50, 65, 30];
}

