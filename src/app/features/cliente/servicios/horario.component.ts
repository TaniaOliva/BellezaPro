import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';

@Component({
  selector: 'app-cliente-horario',
  standalone: true,
  imports: [CommonModule],
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
            <div class="flex items-center justify-between mb-4">
              <button (click)="mesAnterior()" class="p-2 hover:bg-gray-100 rounded-lg">
                <span class="material-symbols-outlined">chevron_left</span>
              </button>
              <h3 class="text-lg font-bold text-gray-800">{{ mesActual | date:'MMMM yyyy' }}</h3>
              <button (click)="mesSiguiente()" class="p-2 hover:bg-gray-100 rounded-lg">
                <span class="material-symbols-outlined">chevron_right</span>
              </button>
            </div>

            <div class="grid grid-cols-7 gap-2 mb-4">
              <span class="text-xs font-semibold text-gray-600 text-center py-2">D</span>
              <span class="text-xs font-semibold text-gray-600 text-center py-2">L</span>
              <span class="text-xs font-semibold text-gray-600 text-center py-2">M</span>
              <span class="text-xs font-semibold text-gray-600 text-center py-2">M</span>
              <span class="text-xs font-semibold text-gray-600 text-center py-2">J</span>
              <span class="text-xs font-semibold text-gray-600 text-center py-2">V</span>
              <span class="text-xs font-semibold text-gray-600 text-center py-2">S</span>

              <!-- Espacios iniciales -->
              <div *ngFor="let s of spacers"></div>

              <!-- Días del mes -->
              <button
                *ngFor="let dia of diasMes"
                (click)="seleccionarFecha(dia)"
                [disabled]="esPasado(dia)"
                [class]="getFechaStr(dia) === fechaSeleccionada
                  ? 'p-2 bg-red-100 text-red-600 text-sm font-bold rounded border-2 border-red-600'
                  : esPasado(dia)
                    ? 'p-2 text-gray-300 text-sm cursor-not-allowed'
                    : 'p-2 text-gray-600 text-sm hover:bg-gray-100 rounded'">
                {{ dia.getDate() }}
              </button>
            </div>

            <!-- Slots de hora -->
            <div *ngIf="fechaSeleccionada">
              <h3 class="text-lg font-bold text-gray-800 mb-4">Horarios disponibles</h3>
              <div class="grid grid-cols-4 gap-3">
                <button
                  *ngFor="let slot of slots"
                  (click)="seleccionarHora(slot)"
                  [class]="horaSeleccionada === slot
                    ? 'p-3 border-2 border-red-600 bg-red-50 text-red-600 rounded-lg text-sm font-semibold'
                    : 'p-3 border border-gray-300 rounded-lg text-sm font-semibold hover:border-red-600 hover:bg-red-50'">
                  {{ slot }}
                </button>
              </div>
            </div>
          </div>

          <!-- Resumen lateral -->
          <div>
            <div class="bg-white border border-gray-200 rounded-lg p-6 sticky top-8">
              <h4 class="font-bold text-gray-800 mb-4">Resumen de la cita</h4>

              <div class="space-y-3 pb-4 border-b border-gray-200">
                <div>
                  <p class="text-xs text-gray-600 uppercase font-semibold">Servicio</p>
                  <p class="text-sm font-semibold text-gray-800">{{ estado.servicio?.nombre }}</p>
                </div>
              </div>

              <div class="space-y-3 py-4 border-b border-gray-200">
                <div>
                  <p class="text-xs text-gray-600 uppercase font-semibold">Estilista</p>
                  <p class="text-sm font-semibold text-gray-800">
                    {{ estado.estilista ? (estado.estilista.nombre + ' ' + estado.estilista.apellido) : 'Sin preferencia' }}
                  </p>
                </div>
              </div>

              <div class="space-y-3 py-4">
                <div>
                  <p class="text-xs text-gray-600 uppercase font-semibold">Fecha y hora</p>
                  <p class="text-sm font-semibold text-gray-800">{{ fechaSeleccionada || 'No seleccionada' }}</p>
                  <p *ngIf="horaSeleccionada" class="text-sm font-semibold text-red-600">{{ horaSeleccionada }}</p>
                </div>
              </div>

              <button
                (click)="continuar()"
                [disabled]="!fechaSeleccionada || !horaSeleccionada"
                class="w-full bg-red-600 text-white rounded-lg py-3 font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                Continuar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HorarioComponent implements OnInit {
  fechaSeleccionada = '';
  horaSeleccionada = '';
  mesActual = new Date();
  diasMes: Date[] = [];
  spacers: null[] = [];
  estado: any = {};

  slots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  constructor(private bookingSvc: BookingService, private router: Router) {}

  ngOnInit(): void {
    this.estado = this.bookingSvc.getEstado();
    if (!this.estado.servicio) { this.router.navigate(['/cliente/servicios']); return; }
    this.generarDias();
  }

  generarDias(): void {
    const inicio = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth(), 1);
    const fin = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() + 1, 0);
    this.diasMes = [];
    for (let d = new Date(inicio); d <= fin; d.setDate(d.getDate() + 1)) {
      this.diasMes.push(new Date(d));
    }
    // Spacers para alinear el día 1 con el día de la semana correcto (0=Dom)
    this.spacers = Array(inicio.getDay()).fill(null);
  }

  getFechaStr(dia: Date): string {
    const y = dia.getFullYear();
    const m = String(dia.getMonth() + 1).padStart(2, '0');
    const d = String(dia.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  esPasado(dia: Date): boolean {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return dia < hoy;
  }

  seleccionarFecha(dia: Date): void {
    if (this.esPasado(dia)) return;
    const y = dia.getFullYear();
    const m = String(dia.getMonth() + 1).padStart(2, '0');
    const d = String(dia.getDate()).padStart(2, '0');
    this.fechaSeleccionada = `${y}-${m}-${d}`;
    this.horaSeleccionada = '';
  }

  seleccionarHora(hora: string): void {
    this.horaSeleccionada = hora;
  }

  mesSiguiente(): void {
    this.mesActual = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() + 1, 1);
    this.generarDias();
  }

  mesAnterior(): void {
    this.mesActual = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() - 1, 1);
    this.generarDias();
  }

  continuar(): void {
    if (!this.fechaSeleccionada || !this.horaSeleccionada) return;
    this.bookingSvc.setHorario(this.fechaSeleccionada, this.horaSeleccionada);
    this.router.navigate(['/cliente/servicios/confirmar']);
  }
}
