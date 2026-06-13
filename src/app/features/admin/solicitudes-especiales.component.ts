import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitudService } from '../../core/services/solicitud.service';
import { SolicitudEspecial } from '../../core/models';

@Component({
  selector: 'app-admin-solicitudes-especiales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white min-h-screen">
      <div class="px-8 py-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Solicitudes Especiales</h1>
        <p class="text-gray-600 mb-8">Revisa y gestiona las solicitudes personalizadas de clientes.</p>

        <!-- Tabs -->
        <div class="flex gap-6 border-b border-gray-200 mb-6">
          <button *ngFor="let tab of tabs" (click)="filtroEstado = tab.value"
            [class]="filtroEstado === tab.value
              ? 'pb-3 border-b-2 border-red-600 text-red-600 font-semibold'
              : 'pb-3 text-gray-500 font-semibold hover:text-gray-700'">
            {{ tab.label }} ({{ contarPorEstado(tab.value) }})
          </button>
        </div>

        <div *ngIf="cargando" class="text-center py-12 text-gray-400">Cargando solicitudes...</div>
        <div *ngIf="!cargando && solicitudesFiltradas.length === 0" class="text-center py-12 text-gray-400">Sin solicitudes.</div>

        <div class="space-y-4">
          <div *ngFor="let s of solicitudesFiltradas"
            class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
            <div class="flex items-start justify-between gap-4 mb-4">
              <div>
                <p class="text-sm text-red-600 font-semibold uppercase">{{ s.categoria }}</p>
                <p class="text-lg font-bold text-gray-800 mt-1">{{ s.descripcion | slice:0:80 }}{{ s.descripcion.length > 80 ? '...' : '' }}</p>
              </div>
              <span [class]="estadoClase(s.estado)" class="text-xs font-bold px-3 py-1 rounded capitalize shrink-0">
                {{ s.estado }}
              </span>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <p class="text-xs text-gray-500 uppercase font-semibold mb-1">Presupuesto solicitado</p>
                <p class="text-gray-800 font-semibold">{{ s.presupuesto || 'No especificado' }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 uppercase font-semibold mb-1">Fecha</p>
                <p class="text-gray-800">{{ s.creadoEn | date:'dd/MM/yyyy' }}</p>
              </div>
              <div *ngIf="s.precioEstimado">
                <p class="text-xs text-gray-500 uppercase font-semibold mb-1">Precio estimado</p>
                <p class="text-gray-800 font-semibold">L. {{ s.precioEstimado }}</p>
              </div>
              <div *ngIf="s.respuesta">
                <p class="text-xs text-gray-500 uppercase font-semibold mb-1">Respuesta enviada</p>
                <p class="text-gray-600 text-sm">{{ s.respuesta | slice:0:60 }}...</p>
              </div>
            </div>

            <div *ngIf="s.estado === 'pending'" class="flex gap-3">
              <button (click)="abrir(s)"
                class="bg-red-600 text-white rounded-lg py-2 px-5 font-semibold hover:bg-red-700 transition text-sm">
                Responder
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Overlay -->
    <div *ngIf="seleccionada" class="fixed inset-0 bg-black/40 z-40" (click)="seleccionada = null"></div>

    <!-- Drawer responder -->
    <div *ngIf="seleccionada" class="fixed right-0 top-0 h-full w-[480px] bg-white z-50 shadow-2xl flex flex-col">
      <div class="flex items-center justify-between px-6 py-5 border-b border-gray-200">
        <h2 class="text-xl font-bold text-gray-800">Responder solicitud</h2>
        <button (click)="seleccionada = null" class="p-2 hover:bg-gray-100 rounded-lg">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        <div class="bg-gray-50 rounded-lg p-4 text-sm">
          <p class="font-semibold text-gray-800 mb-1">{{ seleccionada.categoria }}</p>
          <p class="text-gray-600">{{ seleccionada.descripcion }}</p>
          <p class="text-xs text-gray-400 mt-2">Presupuesto: {{ seleccionada.presupuesto || 'No especificado' }}</p>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Respuesta para el cliente *</label>
          <textarea [(ngModel)]="respuesta" rows="4" placeholder="Escribe la respuesta al cliente..."
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 resize-none text-sm"></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Precio estimado (L.)</label>
            <input [(ngModel)]="precio" type="number" min="0"
              class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500">
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Duración estimada (min)</label>
            <input [(ngModel)]="duracion" type="number" min="0" step="15"
              class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500">
          </div>
        </div>
      </div>

      <div class="px-6 py-4 border-t border-gray-200 flex gap-3">
        <button (click)="rechazar()" [disabled]="guardando || !respuesta"
          class="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 transition">
          {{ guardando ? '...' : 'Rechazar' }}
        </button>
        <button (click)="aprobar()" [disabled]="guardando || !respuesta"
          class="flex-1 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 transition">
          {{ guardando ? 'Guardando...' : 'Aprobar' }}
        </button>
      </div>
    </div>
  `
})
export class SolicitudesEspecialesComponent implements OnInit {
  solicitudes: SolicitudEspecial[] = [];
  seleccionada: SolicitudEspecial | null = null;
  cargando = true;
  precio = 0;
  duracion = 0;
  respuesta = '';
  guardando = false;
  filtroEstado = 'pending';

  readonly tabs = [
    { label: 'Pendientes', value: 'pending' },
    { label: 'Aprobadas',  value: 'aprobada' },
    { label: 'Rechazadas', value: 'rechazada' },
  ];

  constructor(private solicitudSvc: SolicitudService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.solicitudSvc.listarTodas().subscribe({
      next: (data: SolicitudEspecial[]) => { this.solicitudes = data; this.cargando = false; },
      error: () => this.cargando = false
    });
  }

  get solicitudesFiltradas(): SolicitudEspecial[] {
    return this.solicitudes.filter(s => s.estado === this.filtroEstado);
  }

  contarPorEstado(estado: string): number {
    return this.solicitudes.filter(s => s.estado === estado).length;
  }

  estadoClase(estado: string): string {
    if (estado === 'aprobada') return 'bg-green-100 text-green-700';
    if (estado === 'rechazada') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  }

  abrir(s: SolicitudEspecial): void {
    this.seleccionada = s;
    this.precio = s.precioEstimado ?? 0;
    this.duracion = s.duracionEstimada ?? 0;
    this.respuesta = s.respuesta ?? '';
  }

  aprobar(): void {
    if (!this.seleccionada) return;
    this.guardando = true;
    this.solicitudSvc.responder(this.seleccionada._id, {
      estado: 'aprobada', respuesta: this.respuesta,
      precioEstimado: this.precio, duracionEstimada: this.duracion
    }).subscribe({
      next: () => { this.seleccionada = null; this.guardando = false; this.cargar(); },
      error: () => this.guardando = false
    });
  }

  rechazar(): void {
    if (!this.seleccionada) return;
    this.guardando = true;
    this.solicitudSvc.responder(this.seleccionada._id, {
      estado: 'rechazada', respuesta: this.respuesta
    }).subscribe({
      next: () => { this.seleccionada = null; this.guardando = false; this.cargar(); },
      error: () => this.guardando = false
    });
  }
}
