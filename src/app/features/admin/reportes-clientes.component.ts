import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteService } from '../../core/services/reporte.service';
import { ReporteCliente } from '../../core/models';

@Component({
  selector: 'app-admin-reportes-clientes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white min-h-screen">
      <div class="px-8 py-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Reportes de Clientes</h1>
        <p class="text-gray-600 mb-8">Gestiona los reportes presentados contra clientes</p>

        <!-- Tabs -->
        <div class="flex gap-8 border-b border-gray-200 mb-8">
          <button class="pb-3 border-b-2 border-red-600 text-red-600 font-semibold">Pendientes (3)</button>
          <button class="pb-3 text-gray-600 font-semibold hover:text-gray-800">Resueltos</button>
          <button class="pb-3 text-gray-600 font-semibold hover:text-gray-800">Todos</button>
        </div>

        <!-- Lista de reportes -->
        <div class="space-y-4">
          <!-- Reporte 1 -->
          <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
            <div class="flex items-start justify-between mb-4">
              <div>
                <p class="text-sm text-red-600 font-semibold uppercase">Comportamiento inapropiado</p>
                <p class="text-lg font-bold text-gray-800 mt-1">Reporte de Sofia R.</p>
              </div>
              <span class="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded">Pendiente</span>
            </div>

            <div class="grid grid-cols-2 gap-6 mb-4">
              <div>
                <p class="text-xs text-gray-600 uppercase font-semibold mb-1">Cliente reportada</p>
                <p class="text-gray-800 font-semibold">Ana Morales</p>
              </div>
              <div>
                <p class="text-xs text-gray-600 uppercase font-semibold mb-1">Estilista</p>
                <p class="text-gray-800 font-semibold">Sofia R.</p>
              </div>
            </div>

            <div>
              <p class="text-xs text-gray-600 uppercase font-semibold mb-2">Descripción</p>
              <p class="text-gray-700">"La cliente llegó 15 minutos tarde y cuando le cobré la tarifa de llega tarde se mostró muy agresiva. Empezó a gritar y amenazó con darme una mala reseña."</p>
            </div>

            <div class="mt-4 flex gap-3">
              <button class="flex-1 text-red-600 border border-red-600 rounded-lg py-2 font-semibold hover:bg-red-50">
                <span class="material-symbols-outlined text-sm align-middle">more_vert</span> Ver más
              </button>
              <button class="flex-1 bg-gray-200 text-gray-700 rounded-lg py-2 font-semibold hover:bg-gray-300">Descartar</button>
              <button class="flex-1 bg-red-600 text-white rounded-lg py-2 font-semibold hover:bg-red-700">Revisar</button>
            </div>
          </div>

          <!-- Reporte 2 -->
          <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
            <div class="flex items-start justify-between mb-4">
              <div>
                <p class="text-sm text-yellow-600 font-semibold uppercase">No respetó politica de cancelación</p>
                <p class="text-lg font-bold text-gray-800 mt-1">Reporte de María F.</p>
              </div>
              <span class="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded">En revisión</span>
            </div>

            <div class="grid grid-cols-2 gap-6 mb-4">
              <div>
                <p class="text-xs text-gray-600 uppercase font-semibold mb-1">Cliente reportada</p>
                <p class="text-gray-800 font-semibold">Jessica López</p>
              </div>
              <div>
                <p class="text-xs text-gray-600 uppercase font-semibold mb-1">Estilista</p>
                <p class="text-gray-800 font-semibold">María F.</p>
              </div>
            </div>

            <div>
              <p class="text-xs text-gray-600 uppercase font-semibold mb-2">Descripción</p>
              <p class="text-gray-700">"La cliente canceló su cita 2 horas antes pero no notificó. Al llegar le pedí que pagara la tarifa de no-show según nuestra política."</p>
            </div>

            <div class="mt-4 flex gap-3">
              <button class="flex-1 text-red-600 border border-red-600 rounded-lg py-2 font-semibold hover:bg-red-50">
                <span class="material-symbols-outlined text-sm align-middle">more_vert</span> Ver más
              </button>
              <button class="flex-1 bg-gray-200 text-gray-700 rounded-lg py-2 font-semibold hover:bg-gray-300">Descartar</button>
              <button class="flex-1 bg-red-600 text-white rounded-lg py-2 font-semibold hover:bg-red-700">Revisar</button>
            </div>
          </div>

          <!-- Reporte 3 -->
          <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
            <div class="flex items-start justify-between mb-4">
              <div>
                <p class="text-sm text-purple-600 font-semibold uppercase">Falta de respeto</p>
                <p class="text-lg font-bold text-gray-800 mt-1">Reporte de Ana G.</p>
              </div>
              <span class="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded">Pendiente</span>
            </div>

            <div class="grid grid-cols-2 gap-6 mb-4">
              <div>
                <p class="text-xs text-gray-600 uppercase font-semibold mb-1">Cliente reportada</p>
                <p class="text-gray-800 font-semibold">Carmen Rodríguez</p>
              </div>
              <div>
                <p class="text-xs text-gray-600 uppercase font-semibold mb-1">Estilista</p>
                <p class="text-gray-800 font-semibold">Ana G.</p>
              </div>
            </div>

            <div>
              <p class="text-xs text-gray-600 uppercase font-semibold mb-2">Descripción</p>
              <p class="text-gray-700">"La cliente continuamente me cuestionaba mi trabajo durante toda la sesión. Cuando terminé, dijo que lo había hecho mal y pidió descuento."</p>
            </div>

            <div class="mt-4 flex gap-3">
              <button class="flex-1 text-red-600 border border-red-600 rounded-lg py-2 font-semibold hover:bg-red-50">
                <span class="material-symbols-outlined text-sm align-middle">more_vert</span> Ver más
              </button>
              <button class="flex-1 bg-gray-200 text-gray-700 rounded-lg py-2 font-semibold hover:bg-gray-300">Descartar</button>
              <button class="flex-1 bg-red-600 text-white rounded-lg py-2 font-semibold hover:bg-red-700">Revisar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ReportesClientesComponent implements OnInit {
  reportes: ReporteCliente[] = [];
  seleccionado: ReporteCliente | null = null;
  cargando = true;
  guardando = false;

  constructor(private reporteSvc: ReporteService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.reporteSvc.listarTodos().subscribe({
      next: (data: ReporteCliente[]) => { this.reportes = data; this.cargando = false; },
      error: () => this.cargando = false
    });
  }

  resolver(accion: 'advertencia' | 'bloqueo'): void {
    if (!this.seleccionado) return;
    this.guardando = true;
    this.reporteSvc.resolver(this.seleccionado._id, accion).subscribe({
      next: () => { this.seleccionado = null; this.guardando = false; this.cargar(); },
      error: () => this.guardando = false
    });
  }
}

