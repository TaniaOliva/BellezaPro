import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReporteService } from '../../core/services/reporte.service';
import { ReporteCliente } from '../../core/models';

@Component({
  selector: 'app-admin-reportes-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white min-h-screen">
      <div class="px-8 py-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Reportes de Clientes</h1>
        <p class="text-gray-600 mb-8">Gestiona los reportes presentados contra clientes</p>

        <!-- Tabs -->
        <div class="flex gap-8 border-b border-gray-200 mb-8">
          <button *ngFor="let tab of tabs" (click)="filtroTab = tab.value"
            [class]="filtroTab === tab.value
              ? 'pb-3 border-b-2 border-red-600 text-red-600 font-semibold'
              : 'pb-3 text-gray-500 font-semibold hover:text-gray-700'">
            {{ tab.label }} ({{ contarPorTab(tab.value) }})
          </button>
        </div>

        <div *ngIf="cargando" class="text-center py-12 text-gray-400">Cargando reportes...</div>
        <div *ngIf="!cargando && reportesFiltrados.length === 0" class="text-center py-12 text-gray-400">Sin reportes.</div>

        <!-- Lista de reportes -->
        <div class="space-y-4">
          <div *ngFor="let r of reportesFiltrados"
            class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
            <div class="flex items-start justify-between mb-4">
              <div>
                <p class="text-sm font-semibold uppercase"
                  [class]="r.estado === 'resuelto' ? 'text-green-600' : 'text-red-600'">
                  {{ r.motivo }}
                </p>
                <p class="text-lg font-bold text-gray-800 mt-1">
                  Reporte de {{ r.estilistaId?.nombre }} {{ r.estilistaId?.apellido }}
                </p>
              </div>
              <span [class]="r.estado === 'resuelto' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                class="text-xs font-bold px-3 py-1 rounded capitalize shrink-0">
                {{ r.estado }}
              </span>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <p class="text-xs text-gray-500 uppercase font-semibold mb-1">Cliente reportado</p>
                <p class="text-gray-800 font-semibold">
                  {{ r.clienteId?.nombre }} {{ r.clienteId?.apellido }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500 uppercase font-semibold mb-1">Fecha</p>
                <p class="text-gray-800">{{ r.creadoEn | date:'dd/MM/yyyy' }}</p>
              </div>
            </div>

            <div class="mb-4">
              <p class="text-xs text-gray-500 uppercase font-semibold mb-2">Descripción</p>
              <p class="text-gray-700 text-sm">{{ r.descripcion }}</p>
            </div>

            <div *ngIf="r.accionTomada" class="mb-4 p-3 bg-green-50 rounded-lg text-sm text-green-800">
              <span class="font-semibold">Acción tomada:</span> {{ r.accionTomada }}
            </div>

            <div *ngIf="r.estado !== 'resuelto'" class="flex gap-3">
              <button (click)="abrirResolver(r)"
                class="bg-red-600 text-white rounded-lg py-2 px-5 font-semibold hover:bg-red-700 transition text-sm">
                Resolver
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Overlay -->
    <div *ngIf="seleccionado" class="fixed inset-0 bg-black/40 z-40" (click)="seleccionado = null"></div>

    <!-- Drawer resolver -->
    <div *ngIf="seleccionado" class="fixed right-0 top-0 h-full w-[440px] bg-white z-50 shadow-2xl flex flex-col">
      <div class="flex items-center justify-between px-6 py-5 border-b border-gray-200">
        <h2 class="text-xl font-bold text-gray-800">Resolver reporte</h2>
        <button (click)="seleccionado = null" class="p-2 hover:bg-gray-100 rounded-lg">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        <div class="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
          <p class="font-semibold text-gray-800">{{ seleccionado.motivo }}</p>
          <p class="text-gray-600">{{ seleccionado.descripcion }}</p>
          <p class="text-xs text-gray-500">
            Cliente: {{ seleccionado.clienteId?.nombre }} {{ seleccionado.clienteId?.apellido }}
          </p>
        </div>

        <p class="text-sm font-semibold text-gray-700">¿Qué acción deseas tomar?</p>

        <div class="space-y-3">
          <button (click)="resolver('advertencia')" [disabled]="guardando"
            class="w-full py-3 border border-yellow-500 text-yellow-700 rounded-lg font-semibold hover:bg-yellow-50 disabled:opacity-50 transition">
            {{ guardando ? 'Procesando...' : 'Enviar advertencia al cliente' }}
          </button>
          <button (click)="resolver('bloqueo')" [disabled]="guardando"
            class="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 transition">
            {{ guardando ? 'Procesando...' : 'Bloquear cliente' }}
          </button>
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
  filtroTab = 'pendiente';

  readonly tabs = [
    { label: 'Pendientes', value: 'pendiente' },
    { label: 'Resueltos',  value: 'resuelto' },
    { label: 'Todos',      value: 'todos' },
  ];

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

  get reportesFiltrados(): ReporteCliente[] {
    if (this.filtroTab === 'todos') return this.reportes;
    return this.reportes.filter(r => r.estado === this.filtroTab);
  }

  contarPorTab(valor: string): number {
    if (valor === 'todos') return this.reportes.length;
    return this.reportes.filter(r => r.estado === valor).length;
  }

  abrirResolver(r: ReporteCliente): void {
    this.seleccionado = r;
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
