import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-estilista-mis-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white min-h-screen">
      <!-- Header -->
      <div class="bg-red-50 px-8 py-6 border-b border-gray-200">
        <h1 class="text-2xl font-bold text-gray-800">Mis Clientes</h1>
        <p class="text-gray-600 text-sm mt-1">Gestiona tu lista de clientes habituales</p>
      </div>

      <div class="px-8 py-8">
        <!-- Filtros y búsqueda -->
        <div class="mb-6 flex gap-4 items-center">
          <div class="flex-1 flex items-center border border-gray-300 rounded-lg px-4 py-2 bg-white">
            <span class="material-symbols-outlined text-gray-400">search</span>
            <input 
              [(ngModel)]="busqueda"
              type="text" 
              placeholder="Buscar cliente..." 
              class="ml-2 flex-1 outline-none text-gray-700">
          </div>
          <button 
            (click)="activeFilter = 'todas'"
            [class]="activeFilter === 'todas' ? 'bg-red-100 text-red-600' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'"
            class="px-4 py-2 rounded-lg font-semibold">
            Todos
          </button>
          <button 
            (click)="activeFilter = 'vip'"
            [class]="activeFilter === 'vip' ? 'bg-red-100 text-red-600' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'"
            class="px-4 py-2 rounded-lg font-semibold">
            VIP
          </button>
        </div>

        <!-- Lista de clientes -->
        <div class="grid grid-cols-2 gap-6">
          <div *ngFor="let cliente of clientes" class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
            <!-- Encabezado con avatar y nombre -->
            <div class="flex items-start gap-4 mb-4">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-red-300 to-red-500 flex items-center justify-center text-white font-bold text-lg">
                {{ cliente.iniciales }}
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <h3 class="font-semibold text-gray-800">{{ cliente.nombre }}</h3>
                  <span *ngIf="cliente.vip" class="material-symbols-outlined text-amber-400 text-lg">star</span>
                </div>
                <p class="text-sm text-gray-600">{{ cliente.visitas }} visitas</p>
              </div>
            </div>

            <!-- Información de servicios -->
            <div class="space-y-2 pb-4 border-b border-gray-200 mb-4">
              <div>
                <p class="text-xs text-gray-600 uppercase font-semibold">Último servicio</p>
                <p class="text-sm text-gray-800">{{ cliente.servicioUltimo }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-600 uppercase font-semibold">Hace</p>
                <p class="text-sm text-gray-800">{{ cliente.hace }}</p>
              </div>
            </div>

            <!-- Calificación -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex gap-0.5">
                <span *ngFor="let star of getEstrellas(cliente.estrellas)" class="material-symbols-outlined text-sm text-amber-400">star</span>
                <span *ngFor="let star of getEstrellasVacias(cliente.estrellas)" class="material-symbols-outlined text-sm text-gray-300">star</span>
              </div>
              <p class="text-sm text-gray-600">{{ cliente.estrellas }}/5</p>
            </div>

            <!-- Acciones -->
            <div class="flex gap-2">
              <button class="flex-1 border border-gray-300 text-gray-600 rounded-lg py-2 font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-base">phone</span>
              </button>
              <button class="flex-1 bg-red-600 text-white rounded-lg py-2 font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-base">edit</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MisClientesComponent {
  activeFilter: string = 'todas';
  busqueda: string = '';

  clientes = [
    {
      iniciales: 'LM',
      nombre: 'Laura Mendez',
      visitas: 8,
      servicioUltimo: 'Manicure Clasico',
      hace: '2 dias',
      estrellas: 5,
      vip: false
    },
    {
      iniciales: 'ST',
      nombre: 'Sofia Torres',
      visitas: 3,
      servicioUltimo: 'Nail Art',
      hace: '5 dias',
      estrellas: 4,
      vip: false
    },
    {
      iniciales: 'CR',
      nombre: 'Carmen Reyes',
      visitas: 12,
      servicioUltimo: 'Manicure Gel',
      hace: '1 semana',
      estrellas: 5,
      vip: true
    },
    {
      iniciales: 'VC',
      nombre: 'Valeria Cruz',
      visitas: 1,
      servicioUltimo: 'Pedicure Spa',
      hace: '2 semanas',
      estrellas: 4,
      vip: false
    }
  ];

  getEstrellas(cantidad: number): number[] {
    return Array(cantidad).fill(0);
  }

  getEstrellasVacias(cantidad: number): number[] {
    return Array(5 - cantidad).fill(0);
  }
}


