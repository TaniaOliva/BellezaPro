import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { BookingService } from '../../../core/services/booking.service';

interface DimConfig {
  key: string;
  label: string;
  tipo: 'chips' | 'select';
  opciones: { nombre: string; extra: number; descripcion: string }[];
}

const TIPO_META: Record<string, { label: string; tipo: 'chips' | 'select' }> = {
  servicio:   { label: 'Tipo de servicio',                    tipo: 'chips'  },
  color:      { label: 'Color',                               tipo: 'chips'  },
  nivel:      { label: 'Nivel',                               tipo: 'chips'  },
  ocasion:    { label: 'Ocasión',                             tipo: 'select' },
  largo:      { label: 'Largo',                               tipo: 'chips'  },
  acabado:    { label: 'Acabado',                             tipo: 'chips'  },
  tecnica:    { label: 'Técnica',                             tipo: 'chips'  },
  intensidad: { label: 'Intensidad',                          tipo: 'chips'  },
  decoracion: { label: 'Decoraciones (puedes elegir varias)', tipo: 'chips'  },
};

const TIPO_ORDER = ['servicio', 'color', 'nivel', 'ocasion', 'largo', 'acabado', 'tecnica', 'intensidad', 'decoracion'];

@Component({
  selector: 'app-cliente-opciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white min-h-screen">
      <div class="px-8 py-8">
        <!-- Step indicator -->
        <div class="flex items-center justify-between mb-8 max-w-2xl">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">✓</div>
            <span class="text-sm text-gray-600">Servicio</span>
          </div>
          <div class="flex-1 h-1 bg-red-600 mx-3"></div>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold text-sm">2</div>
            <span class="text-sm text-gray-600">Opciones</span>
          </div>
          <div class="flex-1 h-1 bg-gray-300 mx-3"></div>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold text-sm">3</div>
            <span class="text-sm text-gray-600">Estilista</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-8">
          <!-- Imagen del servicio (estática) -->
          <div>
            <button (click)="location.back()" class="text-red-600 font-semibold text-sm mb-4 block">← Atrás</button>
            <div class="h-96 rounded-lg bg-gray-200 relative">
              <span class="absolute top-4 left-4 bg-white text-gray-700 text-xs font-bold px-3 py-1 rounded shadow-sm">
                {{ servicio?.categoria | uppercase }}
              </span>
            </div>
          </div>

          <!-- Detalles y opciones -->
          <div>
            <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ servicio?.nombre }}</h1>
            <p class="text-2xl text-red-600 font-bold mb-6">L {{ precioFinal }}</p>

            <div *ngIf="configs.length === 0" class="mb-6 text-gray-500 text-sm">
              Este servicio no tiene opciones adicionales.
            </div>

            <div *ngFor="let dim of configs" class="mb-6">
              <p class="text-sm font-bold text-gray-800 mb-3">{{ dim.label }}</p>

              <!-- Tarjetas tipo servicio -->
              <div *ngIf="dim.key === 'servicio'" class="grid grid-cols-3 gap-3">
                <button *ngFor="let op of dim.opciones" type="button" (click)="seleccionar(dim.key, op)"
                  [class]="selecciones[dim.key] === op.nombre
                    ? 'flex flex-col items-start p-4 border-2 border-red-600 rounded-xl bg-red-50 text-left transition'
                    : 'flex flex-col items-start p-4 border border-gray-200 rounded-xl text-left hover:border-red-400 hover:bg-red-50 transition'">
                  <span class="font-bold text-gray-800 text-sm mb-1">{{ op.nombre }}</span>
                  <span [class]="selecciones[dim.key] === op.nombre ? 'text-xs font-bold text-red-600 mt-auto' : 'text-xs font-semibold text-gray-400 mt-auto'">
                    {{ op.extra > 0 ? '+L.' + op.extra : 'Precio base' }}
                  </span>
                </button>
              </div>

              <!-- Lista de colores -->
              <div *ngIf="dim.key === 'color'" class="flex flex-col gap-2">
                <button *ngFor="let op of dim.opciones" type="button" (click)="seleccionar(dim.key, op)"
                  [class]="selecciones[dim.key] === op.nombre
                    ? 'flex items-center gap-3 p-3 border-2 border-red-600 rounded-xl bg-red-50 text-left transition'
                    : 'flex items-center gap-3 p-3 border border-gray-200 rounded-xl text-left hover:border-red-400 hover:bg-red-50 transition'">
                  <div class="w-7 h-7 rounded-full shadow-sm shrink-0 border-2 border-white"
                    [style.background-color]="op.descripcion"></div>
                  <span class="flex-1 font-semibold text-gray-800 text-sm">{{ op.nombre }}</span>
                  <span *ngIf="selecciones[dim.key] === op.nombre" class="text-red-600 font-bold text-base">✓</span>
                </button>
              </div>

              <!-- Chips regulares -->
              <div *ngIf="dim.key !== 'servicio' && dim.key !== 'color' && dim.key !== 'decoracion' && dim.tipo === 'chips'"
                class="flex flex-wrap gap-3">
                <button *ngFor="let op of dim.opciones" type="button" (click)="seleccionar(dim.key, op)"
                  [class]="selecciones[dim.key] === op.nombre
                    ? 'py-2 px-4 border-2 border-red-600 text-red-600 rounded-lg font-semibold text-sm bg-red-50'
                    : 'py-2 px-4 border border-gray-300 rounded-lg font-semibold text-sm hover:border-red-600 hover:bg-red-50 transition'">
                  {{ op.nombre }}{{ op.extra > 0 ? ' (+L.' + op.extra + ')' : '' }}
                </button>
              </div>

              <!-- Decoraciones multi-selección -->
              <div *ngIf="dim.key === 'decoracion'" class="grid grid-cols-2 gap-3">
                <button *ngFor="let op of dim.opciones" type="button" (click)="toggleDecoracion(op)"
                  [class]="isDecoracionActiva(op.nombre)
                    ? 'flex items-center gap-3 p-3 border-2 border-red-600 rounded-xl bg-red-50 text-left transition'
                    : 'flex items-center gap-3 p-3 border border-gray-200 rounded-xl text-left hover:border-red-400 hover:bg-red-50 transition'">
                  <span class="text-2xl leading-none">{{ op.descripcion }}</span>
                  <div class="flex-1 min-w-0">
                    <span class="block font-semibold text-gray-800 text-sm truncate">{{ op.nombre }}</span>
                    <span [class]="isDecoracionActiva(op.nombre) ? 'text-xs font-bold text-red-600' : 'text-xs text-gray-400'">
                      +L. {{ op.extra }}
                    </span>
                  </div>
                  <span *ngIf="isDecoracionActiva(op.nombre)" class="text-red-600 font-bold text-lg">✓</span>
                  <span *ngIf="!isDecoracionActiva(op.nombre)" class="text-gray-300 font-bold text-lg">+</span>
                </button>
              </div>

              <!-- Select -->
              <select *ngIf="dim.tipo === 'select'"
                [ngModel]="selecciones[dim.key]"
                (ngModelChange)="seleccionarSelect(dim.key, $event)"
                class="w-full p-3 border border-gray-300 rounded-lg text-gray-700">
                <option value="">Seleccionar...</option>
                <option *ngFor="let op of dim.opciones" [value]="op.nombre">{{ op.nombre }}</option>
              </select>
            </div>

            <button (click)="continuar()"
              class="w-full bg-red-600 text-white rounded-lg py-3 font-semibold hover:bg-red-700 transition">
              Continuar con estilista
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class OpcionesComponent implements OnInit {
  servicio: any = null;
  configs: DimConfig[] = [];
  selecciones: Record<string, string> = {};
  decoracionesActivas: string[] = [];
  precioFinal = 0;

  constructor(private bookingSvc: BookingService, private router: Router, public location: Location) {}

  ngOnInit(): void {
    const estado = this.bookingSvc.getEstado();
    if (!estado.servicio) { this.router.navigate(['/cliente/servicios']); return; }
    this.servicio = estado.servicio;
    this.precioFinal = this.servicio.precioBase;
    this.buildConfigs();
  }

  private buildConfigs(): void {
    const grupos: Record<string, { nombre: string; extra: number; descripcion: string }[]> = {};
    for (const v of this.servicio.variantes ?? []) {
      if (!grupos[v.tipo]) grupos[v.tipo] = [];
      grupos[v.tipo].push({ nombre: v.nombre, extra: v.precioExtra, descripcion: v.descripcion ?? '' });
    }
    const ordenados = TIPO_ORDER.filter(tipo => grupos[tipo])
      .map(tipo => ({ key: tipo, ...TIPO_META[tipo], opciones: grupos[tipo] }));
    const desconocidos = Object.keys(grupos)
      .filter(t => !TIPO_ORDER.includes(t))
      .map(t => ({ key: t, label: t.charAt(0).toUpperCase() + t.slice(1), tipo: 'chips' as const, opciones: grupos[t] }));
    this.configs = [...ordenados, ...desconocidos];
    this.selecciones = {};
    for (const c of this.configs) {
      if (c.key !== 'decoracion') this.selecciones[c.key] = '';
    }
    this.decoracionesActivas = [];
  }

  seleccionar(key: string, opcion: { nombre: string; extra: number }): void {
    this.selecciones = { ...this.selecciones, [key]: opcion.nombre };
    this.calcularPrecio();
  }

  seleccionarSelect(key: string, valor: string): void {
    this.selecciones = { ...this.selecciones, [key]: valor };
    this.calcularPrecio();
  }

  toggleDecoracion(opcion: { nombre: string; extra: number }): void {
    const activa = this.decoracionesActivas.includes(opcion.nombre);
    this.decoracionesActivas = activa
      ? this.decoracionesActivas.filter(d => d !== opcion.nombre)
      : [...this.decoracionesActivas, opcion.nombre];
    this.calcularPrecio();
  }

  isDecoracionActiva(nombre: string): boolean {
    return this.decoracionesActivas.includes(nombre);
  }

  private calcularPrecio(): void {
    let extras = 0;
    for (const dim of this.configs) {
      if (dim.key === 'decoracion') continue;
      const sel = this.selecciones[dim.key];
      if (sel) {
        const op = dim.opciones.find(o => o.nombre === sel);
        if (op) extras += op.extra;
      }
    }
    const decorDim = this.configs.find(c => c.key === 'decoracion');
    if (decorDim) {
      for (const nombre of this.decoracionesActivas) {
        const op = decorDim.opciones.find(o => o.nombre === nombre);
        if (op) extras += op.extra;
      }
    }
    this.precioFinal = this.servicio.precioBase + extras;
  }

  continuar(): void {
    const seleccionesFinales = { ...this.selecciones };
    if (this.decoracionesActivas.length > 0) {
      seleccionesFinales['decoracion'] = this.decoracionesActivas.join(', ');
    }
    this.bookingSvc.setServicio(this.servicio, seleccionesFinales, this.precioFinal);
    this.router.navigate(['/cliente/servicios/estilista']);
  }
}
