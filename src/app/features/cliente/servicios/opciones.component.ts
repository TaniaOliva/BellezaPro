import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';

interface DimConfig {
  key: string;
  label: string;
  tipo: 'chips' | 'select';
  opciones: { nombre: string; extra: number }[];
}

const TIPO_META: Record<string, { label: string; tipo: 'chips' | 'select' }> = {
  nivel:      { label: 'Nivel de servicio', tipo: 'chips'  },
  ocasion:    { label: 'Ocasión',           tipo: 'select' },
  largo:      { label: 'Largo',             tipo: 'chips'  },
  acabado:    { label: 'Acabado',           tipo: 'chips'  },
  tecnica:    { label: 'Técnica',           tipo: 'chips'  },
  intensidad: { label: 'Intensidad',        tipo: 'chips'  },
};

const TIPO_ORDER = ['nivel', 'ocasion', 'largo', 'acabado', 'tecnica', 'intensidad'];

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
          <!-- Imagen y preview -->
          <div>
            <a href="/cliente/servicios" class="text-red-600 font-semibold text-sm mb-4 block">← Volver al catálogo</a>
            <div class="bg-gray-300 h-96 rounded-lg relative mb-4">
              <span class="absolute top-4 left-4 bg-white text-gray-700 text-xs font-bold px-3 py-1 rounded">{{ servicio?.categoria | uppercase }}</span>
            </div>
          </div>

          <!-- Detalles y opciones -->
          <div>
            <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ servicio?.nombre }}</h1>
            <p class="text-2xl text-red-600 font-bold mb-6">L {{ precioFinal }}</p>

            <!-- Sin variantes -->
            <div *ngIf="configs.length === 0" class="mb-6 text-gray-500 text-sm">
              Este servicio no tiene opciones adicionales.
            </div>

            <!-- Dimensiones dinámicas -->
            <div *ngFor="let dim of configs" class="mb-6">
              <p class="text-sm font-bold text-gray-800 mb-3">{{ dim.label }}</p>

              <!-- Chips -->
              <div *ngIf="dim.tipo === 'chips'" class="flex flex-wrap gap-3">
                <button
                  *ngFor="let op of dim.opciones"
                  type="button"
                  (click)="seleccionar(dim.key, op)"
                  [class]="selecciones[dim.key] === op.nombre
                    ? 'py-2 px-4 border-2 border-red-600 text-red-600 rounded-lg font-semibold text-sm bg-red-50'
                    : 'py-2 px-4 border border-gray-300 rounded-lg font-semibold text-sm hover:border-red-600 hover:bg-red-50 transition'">
                  {{ op.nombre }}{{ op.extra > 0 ? ' (+L.' + op.extra + ')' : '' }}
                </button>
              </div>

              <!-- Select -->
              <select
                *ngIf="dim.tipo === 'select'"
                [ngModel]="selecciones[dim.key]"
                (ngModelChange)="seleccionarSelect(dim.key, $event)"
                class="w-full p-3 border border-gray-300 rounded-lg text-gray-700">
                <option value="">Seleccionar...</option>
                <option *ngFor="let op of dim.opciones" [value]="op.nombre">{{ op.nombre }}</option>
              </select>
            </div>

            <!-- Botón continuar -->
            <button
              (click)="continuar()"
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
  precioFinal = 0;

  constructor(private bookingSvc: BookingService, private router: Router) {}

  ngOnInit(): void {
    const estado = this.bookingSvc.getEstado();
    if (!estado.servicio) { this.router.navigate(['/cliente/servicios']); return; }
    this.servicio = estado.servicio;
    this.precioFinal = this.servicio.precioBase;
    this.buildConfigs();
  }

  private buildConfigs(): void {
    const grupos: Record<string, { nombre: string; extra: number }[]> = {};
    for (const v of this.servicio.variantes ?? []) {
      if (!grupos[v.tipo]) grupos[v.tipo] = [];
      grupos[v.tipo].push({ nombre: v.nombre, extra: v.precioExtra });
    }
    this.configs = TIPO_ORDER
      .filter(tipo => grupos[tipo])
      .map(tipo => ({ key: tipo, ...TIPO_META[tipo], opciones: grupos[tipo] }));
    this.selecciones = {};
    for (const c of this.configs) { this.selecciones[c.key] = ''; }
  }

  seleccionar(key: string, opcion: { nombre: string; extra: number }): void {
    this.selecciones[key] = opcion.nombre;
    this.calcularPrecio();
  }

  seleccionarSelect(key: string, valor: string): void {
    this.selecciones[key] = valor;
    this.calcularPrecio();
  }

  private calcularPrecio(): void {
    let extras = 0;
    for (const dim of this.configs) {
      const sel = this.selecciones[dim.key];
      if (sel) {
        const op = dim.opciones.find(o => o.nombre === sel);
        if (op) extras += op.extra;
      }
    }
    this.precioFinal = this.servicio.precioBase + extras;
  }

  continuar(): void {
    this.bookingSvc.setServicio(this.servicio, { ...this.selecciones }, this.precioFinal);
    this.router.navigate(['/cliente/servicios/estilista']);
  }
}
