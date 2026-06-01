import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estilista-agenda',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white min-h-screen">
      <!-- Header -->
      <div class="bg-red-50 px-8 py-6 border-b border-gray-200">
        <h1 class="text-2xl font-bold text-gray-800">Mi Agenda</h1>
        <p class="text-gray-600 text-sm mt-1">Gestiona tu horario semanal de citas</p>
      </div>

      <div class="px-8 py-8">
        <!-- Navegación de semanas -->
        <div class="flex items-center justify-between mb-8">
          <button class="p-2 hover:bg-gray-100 rounded-lg">
            <span class="material-symbols-outlined">chevron_left</span>
          </button>
          <h2 class="text-lg font-bold text-gray-800">Sep 18 - 22, 2023</h2>
          <button class="p-2 hover:bg-gray-100 rounded-lg">
            <span class="material-symbols-outlined">chevron_right</span>
          </button>
        </div>

        <!-- Resumen de días -->
        <div class="flex gap-4 mb-8 pb-4 border-b border-gray-200">
          <div *ngFor="let dia of citasResumenDias" class="text-center">
            <p class="text-sm font-semibold text-gray-600 mb-2">{{ dia.dia }}</p>
            <p [class]="dia.esHoy ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-800'" class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm">
              {{ dia.numero }}
            </p>
          </div>
        </div>

        <!-- Grid de horarios -->
        <div class="grid gap-1 bg-gray-100 p-4 rounded-lg overflow-x-auto">
          <!-- Encabezado -->
          <div class="flex gap-1">
            <div class="w-16 text-right py-2 pr-2 text-xs text-gray-600 font-medium"></div>
            <div *ngFor="let dia of citasResumenDias" class="flex-1 text-center py-2 font-semibold text-sm text-gray-700 min-w-24">
              {{ dia.dia }}
            </div>
          </div>

          <!-- Filas de horarios -->
          <div *ngFor="let hora of horasDisponibles" class="flex gap-1">
            <div class="w-16 text-right py-2 pr-2 text-xs text-gray-600 font-medium">{{ hora }}</div>
            <div *ngFor="let cita of [0,1,2,3,4]" class="flex-1 min-w-24">
              <div [class]="esBloqueado(cita, hora) ? 'bg-amber-50' : 'bg-white'" class="border border-gray-200 rounded p-1 text-xs h-12 relative hover:shadow-md transition">
                <div *ngIf="obtenerCitaEnHora(cita, hora)" [style.height]="obtenerAltoCita(obtenerCitaEnHora(cita, hora).duracion)" class="bg-red-100 text-red-700 rounded p-1 cursor-pointer text-xs font-semibold overflow-hidden">
                  {{ obtenerCitaEnHora(cita, hora).cliente }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de detalles de cita -->
      <div *ngIf="selectedCita" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg p-8 max-w-md w-full">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-800">Detalles de la cita</h3>
            <button (click)="cerrarCita()" class="text-gray-400 hover:text-gray-600">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="space-y-4 mb-6">
            <div>
              <p class="text-xs text-gray-600 uppercase font-semibold mb-1">Cliente</p>
              <p class="text-lg font-semibold text-gray-800">{{ selectedCita.cliente }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-600 uppercase font-semibold mb-1">Servicio</p>
              <p class="text-gray-800">{{ selectedCita.servicioCompleto }}</p>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-gray-600 uppercase font-semibold mb-1">Duración</p>
                <p class="text-gray-800">{{ selectedCita.duracionCompleta }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-600 uppercase font-semibold mb-1">Precio</p>
                <p class="text-gray-800">{{ selectedCita.precio }}</p>
              </div>
            </div>
            <div>
              <p class="text-xs text-gray-600 uppercase font-semibold mb-1">Estado</p>
              <p class="text-gray-800 font-semibold">{{ selectedCita.estado }}</p>
            </div>
          </div>
          <div class="flex gap-3">
            <button (click)="cerrarCita()" class="flex-1 border border-gray-300 text-gray-800 rounded-lg py-2 font-semibold hover:bg-gray-50 transition">
              Cerrar
            </button>
            <button (click)="marcarCompletada()" class="flex-1 bg-red-600 text-white rounded-lg py-2 font-semibold hover:bg-red-700 transition">
              Completada
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AgendaComponent {
  selectedCita: any = null;
  viewMode: 'semana' | 'dia' = 'semana';

  diasSemana = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie'];
  horasDisponibles = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00'
  ];

  citasHardcodeadas = [
    {
      dia: 0, // Lun
      horaInicio: '09:00',
      duracion: 45,
      cliente: 'Laura M.',
      servicio: 'Manicure Clasico',
      precioCompleto: 'Laura Mendez',
      servicioCompleto: 'Manicure Clasico',
      horaCompleta: '09:00',
      precio: 'L 150',
      duracionCompleta: '45 min',
      estado: 'Confirmada'
    },
    {
      dia: 1, // Mar
      horaInicio: '10:30',
      duracion: 70,
      cliente: 'Sofia T.',
      servicio: 'Nail Art',
      precioCompleto: 'Sofia Torres',
      servicioCompleto: 'Nail Art Sencillo',
      horaCompleta: '10:30',
      precio: 'L 200',
      duracionCompleta: '70 min',
      estado: 'Confirmada'
    },
    {
      dia: 2, // Mie
      horaInicio: '09:00',
      duracion: 60,
      cliente: 'Carmen R.',
      servicio: 'Manicure Gel',
      precioCompleto: 'Carmen Reyes',
      servicioCompleto: 'Manicure Gel',
      horaCompleta: '09:00',
      precio: 'L 180',
      duracionCompleta: '60 min',
      estado: 'Confirmada'
    },
    {
      dia: 2, // Mie
      horaInicio: '12:00',
      duracion: 75,
      cliente: 'Valeria C.',
      servicio: 'Pedicure Spa',
      precioCompleto: 'Valeria Cruz',
      servicioCompleto: 'Pedicure Spa',
      horaCompleta: '12:00',
      precio: 'L 220',
      duracionCompleta: '75 min',
      estado: 'Confirmada'
    },
    {
      dia: 3, // Jue
      horaInicio: '14:00',
      duracion: 70,
      cliente: 'Ana P.',
      servicio: 'Manicure premium',
      precioCompleto: 'Ana P.',
      servicioCompleto: 'Manicure premium',
      horaCompleta: '14:00',
      precio: 'L 250',
      duracionCompleta: '70 min',
      estado: 'Confirmada'
    }
  ];

  citasResumenDias = [
    { dia: 'Lun', numero: 1 },
    { dia: 'Mar', numero: 1 },
    { dia: 'Mie', numero: 2, esHoy: true },
    { dia: 'Jue', numero: 1 },
    { dia: 'Vie', numero: 0 }
  ];

  abrirCita(cita: any) {
    this.selectedCita = cita;
  }

  cerrarCita() {
    this.selectedCita = null;
  }

  marcarCompletada() {
    alert('Cita marcada como completada');
    this.cerrarCita();
  }

  cancelarCita() {
    alert('Cita cancelada');
    this.cerrarCita();
  }

  obtenerCitaEnHora(dia: number, hora: string): any {
    return this.citasHardcodeadas.find(c => c.dia === dia && c.horaInicio === hora);
  }

  obtenerAltoCita(duracion: number): string {
    return `${duracion * 0.8}px`;
  }

  esBloqueado(dia: number, hora: string): boolean {
    return dia === 4 && hora === '10:00'; // Viernes 10:00 bloqueado
  }
}


