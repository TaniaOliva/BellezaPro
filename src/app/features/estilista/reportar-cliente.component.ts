import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReporteService } from '../../core/services/reporte.service';
import { CitaService } from '../../core/services/cita.service';
import { Cita, ReporteCliente } from '../../core/models';

@Component({
  selector: 'app-estilista-reportar-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white min-h-screen">
      <!-- Header -->
      <div class="bg-red-50 px-8 py-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Reportar Cliente</h1>
        <p class="text-gray-600">Utiliza este formulario para reportar incidencias con clientes durante sus citas.</p>
      </div>

      <div class="px-8 py-8 space-y-8 max-w-6xl mx-auto">
        <!-- Warning Notice -->
        <div class="bg-amber-50 border border-amber-200 rounded-xl p-6 flex gap-4">
          <span class="material-symbols-outlined text-amber-600 flex-shrink-0 text-2xl">warning</span>
          <div>
            <p class="font-semibold text-amber-900 mb-1">Uso responsable</p>
            <p class="text-sm text-amber-800">
              Este formulario es para reportes legítimos. Los reportes falsos pueden resultar en sanciones.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-8">
          <!-- Columna izquierda: formulario -->
          <div class="col-span-2 space-y-8">
            <!-- Selecciona la cita -->
            <div class="bg-white rounded-xl border border-gray-200 p-6">
              <p class="font-bold text-gray-800 mb-6">Selecciona la cita relacionada</p>

              <div class="flex gap-4 overflow-x-auto pb-4">
                <div
                  *ngFor="let cita of citasRecientes"
                  (click)="seleccionarCita(cita.id)"
                  [class.border-red-600]="selectedCita === cita.id"
                  [class.bg-red-50]="selectedCita === cita.id"
                  [class.border-gray-200]="selectedCita !== cita.id"
                  [class.bg-white]="selectedCita !== cita.id"
                  class="flex-shrink-0 w-56 border rounded-xl p-4 cursor-pointer transition hover:shadow-md"
                >
                  <div class="flex items-center gap-3 mb-3">
                    <div class="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold">
                      {{ cita.avatar }}
                    </div>
                    <div class="flex-1">
                      <p class="font-semibold text-gray-800 text-sm">{{ cita.cliente }}</p>
                      <p class="text-xs text-gray-500">{{ cita.fecha }}</p>
                    </div>
                  </div>
                  <p class="text-xs text-gray-600 mb-3">{{ cita.servicio }}</p>
                  <button
                    *ngIf="selectedCita === cita.id"
                    class="w-full bg-red-600 text-white rounded-lg py-2 text-xs font-semibold"
                  >
                    ✓ Seleccionada
                  </button>
                  <button
                    *ngIf="selectedCita !== cita.id"
                    class="w-full border border-gray-300 text-gray-700 rounded-lg py-2 text-xs font-semibold hover:bg-gray-50"
                  >
                    Seleccionar
                  </button>
                </div>
              </div>

              <a href="#" class="text-red-600 text-sm font-semibold hover:underline">No encuentro la cita</a>
            </div>

            <!-- Strip de cita seleccionada -->
            <div
              *ngIf="selectedCita !== ''"
              class="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between"
            >
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-semibold">
                  {{ obtenerCitaSeleccionada()?.avatar }}
                </div>
                <div>
                  <p class="font-semibold text-gray-800">{{ obtenerCitaSeleccionada()?.cliente }}</p>
                  <p class="text-sm text-gray-600">{{ obtenerCitaSeleccionada()?.servicio }}</p>
                </div>
              </div>
              <button (click)="deseleccionarCita()" class="text-gray-400 hover:text-gray-600">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>

            <!-- Motivo del reporte -->
            <div class="bg-white rounded-xl border border-gray-200 p-6">
              <p class="font-bold text-gray-800 mb-4">Motivo del reporte</p>
              <div class="space-y-3">
                <div
                  *ngFor="let motivo of motivos"
                  class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                  (click)="selectedMotivo = motivo"
                >
                  <input
                    type="radio"
                    [value]="motivo"
                    [(ngModel)]="selectedMotivo"
                    class="w-4 h-4 text-red-600 cursor-pointer"
                  />
                  <label class="text-gray-800 text-sm font-medium cursor-pointer flex-1">{{ motivo }}</label>
                </div>
              </div>
            </div>

            <!-- Descripción detallada -->
            <div class="bg-white rounded-xl border border-gray-200 p-6">
              <label class="font-bold text-gray-800 mb-3 block">Descripción detallada</label>
              <textarea
                [(ngModel)]="descripcion"
                (input)="actualizarDescripcion()"
                rows="6"
                placeholder="Describe con detalle el incidente..."
                class="w-full border border-gray-300 rounded-lg p-4 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-red-600"
              ></textarea>
              <div class="text-right text-gray-500 text-xs mt-2">
                {{ descripcion.length }} / 500
              </div>
            </div>
          </div>

          <!-- Columna derecha: reportes anteriores -->
          <div class="col-span-1">
            <div class="bg-white rounded-xl border border-gray-200 p-6 sticky top-8">
              <p class="font-bold text-gray-800 mb-6">Reportes anteriores</p>

              <div class="space-y-4">
                <div
                  *ngFor="let reporte of reportesAnteriores"
                  class="border border-gray-200 rounded-lg p-4"
                >
                  <p class="font-semibold text-gray-800 text-sm mb-1">{{ reporte.cliente }}</p>
                  <p class="text-xs text-gray-600 mb-2">{{ reporte.motivo }}</p>
                  <div class="flex items-center justify-between">
                    <p class="text-xs text-gray-500">{{ reporte.fecha }}</p>
                    <span
                      [class]="reporte.estado === 'Resuelto' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'"
                      class="text-xs font-semibold px-2 py-1 rounded-full"
                    >
                      {{ reporte.estado }}
                    </span>
                  </div>
                </div>
              </div>

              <button
                *ngIf="reportesAnteriores.length > 0"
                class="w-full mt-6 border border-red-600 text-red-600 rounded-lg py-2 text-sm font-semibold hover:bg-red-50 transition"
              >
                Ver todos
              </button>
            </div>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="flex gap-4 justify-end pb-8">
          <button
            (click)="cancelarReporte()"
            class="px-6 py-3 border border-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            (click)="enviarReporte()"
            [disabled]="!puedeEnviar()"
            [class.opacity-50]="!puedeEnviar()"
            [class.cursor-not-allowed]="!puedeEnviar()"
            class="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:hover:bg-red-600"
          >
            Enviar Reporte
          </button>
        </div>
      </div>
    </div>
  `
})
export class ReportarClienteComponent implements OnInit {
  selectedCita = '';
  selectedMotivo = '';
  descripcion = '';
  cargando = true;
  enviando = false;
  mensaje = '';

  citasRecientes: any[] = [];
  reportesAnteriores: any[] = [];

  motivos = [
    'No asistió sin avisar',
    'Cancelaciones repetidas',
    'Mal comportamiento',
    'Problema con el pago',
    'Otro motivo'
  ];

  constructor(private citaSvc: CitaService, private reporteSvc: ReporteService) {}

  ngOnInit(): void {
    this.citaSvc.miAgenda().subscribe({
      next: (data: Cita[]) => {
        this.citasRecientes = data
          .filter((c: Cita) => c.estado === 'completada')
          .slice(0, 5)
          .map((c: Cita) => {
            const nombre = c.clienteId?.nombre ?? String(c.clienteId);
            const apellido = c.clienteId?.apellido ?? '';
            return {
              id: c._id,
              cliente: nombre + (apellido ? ' ' + apellido : ''),
              fecha: c.fecha + ' ' + c.hora,
              servicio: c.servicioId?.nombre ?? String(c.servicioId),
              avatar: (nombre.slice(0, 1) + (apellido.slice(0, 1) || nombre.slice(1, 2))).toUpperCase()
            };
          });
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
    this.reporteSvc.listarTodos().subscribe({
      next: (data: ReporteCliente[]) => {
        this.reportesAnteriores = data.slice(0, 5).map((r: ReporteCliente) => ({
          cliente: r.clienteId?.nombre ?? String(r.clienteId),
          motivo: r.motivo,
          fecha: r.creadoEn,
          estado: r.estado
        }));
      },
      error: () => {}
    });
  }

  seleccionarCita(citaId: string): void { this.selectedCita = this.selectedCita === citaId ? '' : citaId; }

  deseleccionarCita(): void { this.selectedCita = ''; }

  actualizarDescripcion(): void { if (this.descripcion.length > 500) this.descripcion = this.descripcion.substring(0, 500); }

  enviarReporte(): void {
    if (!this.puedeEnviar()) return;
    this.enviando = true;
    this.reporteSvc.crear({
      citaId: this.selectedCita,
      motivo: this.selectedMotivo,
      descripcion: this.descripcion
    } as any).subscribe({
      next: () => {
        this.mensaje = 'Reporte enviado correctamente';
        this.selectedCita = ''; this.selectedMotivo = ''; this.descripcion = '';
        this.enviando = false;
      },
      error: () => { this.mensaje = 'Error al enviar el reporte'; this.enviando = false; }
    });
  }

  cancelarReporte(): void { this.selectedCita = ''; this.selectedMotivo = ''; this.descripcion = ''; }

  puedeEnviar(): boolean { return this.selectedCita !== '' && this.selectedMotivo !== '' && this.descripcion.length >= 20; }

  obtenerCitaSeleccionada(): any { return this.citasRecientes.find(c => c.id === this.selectedCita); }
}
