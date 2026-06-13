import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../core/services/usuario.service';
import { BookingService } from '../../../core/services/booking.service';
import { Usuario } from '../../../core/models';

@Component({
  selector: 'app-cliente-estilista',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white min-h-screen">
      <!-- Header -->
      <div class="bg-red-50 px-8 py-6 border-b border-gray-200">
        <h1 class="text-2xl font-bold text-gray-800">Elige tu estilista</h1>
        <p class="text-gray-600 text-sm mt-1">Selecciona al profesional para tu servicio.</p>
      </div>

      <div class="px-8 py-8 max-w-4xl mx-auto">
        <!-- Step indicator -->
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">✓</div>
            <span class="text-sm text-gray-700 font-medium">Servicio</span>
          </div>
          <div class="flex-1 h-1 bg-red-600 mx-3"></div>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">✓</div>
            <span class="text-sm text-gray-700 font-medium">Opciones</span>
          </div>
          <div class="flex-1 h-1 bg-red-600 mx-3"></div>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold text-sm">3</div>
            <span class="text-sm text-gray-500">Estilista</span>
          </div>
          <div class="flex-1 h-1 bg-gray-300 mx-3"></div>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold text-sm">4</div>
            <span class="text-sm text-gray-600">Horario</span>
          </div>
        </div>

        <h1 class="text-3xl font-bold text-gray-800 mb-2">Elige tu estilista</h1>
        <p class="text-gray-600 mb-8">Selecciona con quién deseas agendar tu cita</p>

        <div *ngIf="cargando" class="text-center py-12 text-gray-500">Cargando estilistas...</div>

        <!-- Grid de estilistas -->
        <div *ngIf="!cargando" class="grid grid-cols-3 gap-6 max-w-4xl">
          <button
            *ngFor="let e of estilistas"
            (click)="seleccionar(e)"
            [class]="seleccionada?._id === e._id ? 'bg-red-50 border-2 border-red-600' : 'bg-white border border-gray-200 hover:shadow-lg hover:border-red-600'"
            class="rounded-lg p-6 text-center transition">
            <div class="w-24 h-24 bg-gradient-to-br from-red-300 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white">
              <span class="material-symbols-outlined text-5xl">person</span>
            </div>
            <p class="font-bold text-gray-800 mb-1">{{ e.nombre }} {{ e.apellido }}</p>
            <p class="text-sm text-gray-600 mb-2">Estilista profesional</p>
            <div class="flex justify-center gap-0.5 text-amber-400 mb-2">
              <span class="material-symbols-outlined text-sm">star</span>
              <span class="material-symbols-outlined text-sm">star</span>
              <span class="material-symbols-outlined text-sm">star</span>
              <span class="material-symbols-outlined text-sm">star</span>
              <span class="material-symbols-outlined text-sm">star_half</span>
            </div>
          </button>
        </div>

        <!-- Continuar con seleccionada -->
        <div *ngIf="seleccionada" class="mt-6 max-w-4xl flex justify-end">
          <button (click)="continuar()" class="bg-red-600 text-white rounded-lg px-8 py-3 font-semibold hover:bg-red-700 transition">
            Continuar con {{ seleccionada.nombre }}
          </button>
        </div>

        <!-- Sin preferencia -->
        <div class="mt-8 max-w-4xl">
          <button (click)="sinPreferencia()" class="w-full border-2 border-dashed border-gray-300 text-gray-600 rounded-lg py-4 font-semibold hover:border-red-600 hover:text-red-600 transition">
            <span class="material-symbols-outlined text-2xl block mx-auto mb-2">help_outline</span>
            No tengo preferencia - Asignar automáticamente
          </button>
        </div>
      </div>
    </div>
  `
})
export class EstilistaComponent implements OnInit {
  estilistas: Usuario[] = [];
  seleccionada: Usuario | null = null;
  cargando = true;

  constructor(
    private usuarioSvc: UsuarioService,
    private bookingSvc: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const estado = this.bookingSvc.getEstado();
    if (!estado.servicio) { this.router.navigate(['/cliente/servicios']); return; }
    this.usuarioSvc.listarEstilistas().subscribe({
      next: (data: Usuario[]) => { this.estilistas = data; this.cargando = false; },
      error: () => this.cargando = false
    });
  }

  seleccionar(estilista: Usuario): void {
    this.seleccionada = estilista;
  }

  sinPreferencia(): void {
    this.seleccionada = null;
    this.continuar();
  }

  continuar(): void {
    this.bookingSvc.setEstilista(this.seleccionada);
    this.router.navigate(['/cliente/servicios/horario']);
  }
}
