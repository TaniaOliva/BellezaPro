import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServicioService } from '../../core/services/servicio.service';
import { Servicio } from '../../core/models';

@Component({
  selector: 'app-admin-servicios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white min-h-screen">
      <div class="px-8 py-8">
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-3xl font-bold text-gray-800">Gestionar Servicios</h1>
          <button (click)="abrirNuevo()" class="bg-red-600 text-white rounded-lg px-6 py-3 font-semibold hover:bg-red-700 transition flex items-center gap-2">
            <span class="material-symbols-outlined">add</span>
            Agregar servicio
          </button>
        </div>

        <!-- Tabla de servicios -->
        <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Nombre</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Categoría</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Precio base</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Duración</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Variantes</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Estado</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr *ngIf="cargando">
                <td colspan="7" class="px-6 py-8 text-center text-gray-400">Cargando servicios...</td>
              </tr>
              <tr *ngIf="!cargando && servicios.length === 0">
                <td colspan="7" class="px-6 py-8 text-center text-gray-400">No hay servicios registrados.</td>
              </tr>
              <tr *ngFor="let s of servicios" class="hover:bg-gray-50 transition">
                <td class="px-6 py-4">
                  <p class="font-semibold text-gray-800">{{ s.nombre }}</p>
                  <p *ngIf="s.descripcion" class="text-xs text-gray-500 mt-0.5">{{ s.descripcion }}</p>
                </td>
                <td class="px-6 py-4"><p class="text-gray-600">{{ s.categoria }}</p></td>
                <td class="px-6 py-4"><p class="font-semibold text-gray-800">L. {{ s.precioBase }}</p></td>
                <td class="px-6 py-4"><p class="text-gray-600">{{ s.duracion }} min</p></td>
                <td class="px-6 py-4"><p class="text-gray-500 text-sm">{{ s.variantes?.length ?? 0 }} opciones</p></td>
                <td class="px-6 py-4">
                  <button (click)="toggleActivo(s)" [class]="s.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'" class="text-xs font-bold px-3 py-1 rounded-full">
                    {{ s.activo ? 'Activo' : 'Inactivo' }}
                  </button>
                </td>
                <td class="px-6 py-4 text-center">
                  <button (click)="abrirEditar(s)" class="text-red-600 font-semibold text-sm hover:text-red-700">Editar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Overlay -->
    <div *ngIf="mostrarDrawer" class="fixed inset-0 bg-black/40 z-40" (click)="mostrarDrawer = false"></div>

    <!-- Drawer -->
    <div *ngIf="mostrarDrawer" class="fixed right-0 top-0 h-full w-[500px] bg-white z-50 shadow-2xl flex flex-col">
      <div class="flex items-center justify-between px-6 py-5 border-b border-gray-200">
        <h2 class="text-xl font-bold text-gray-800">{{ seleccionado ? 'Editar servicio' : 'Nuevo servicio' }}</h2>
        <button (click)="mostrarDrawer = false" class="p-2 hover:bg-gray-100 rounded-lg transition">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        <div *ngIf="error" class="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{{ error }}</div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre *</label>
          <input [(ngModel)]="nuevo.nombre" type="text" placeholder="Ej. Manicure Gel"
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500">
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
          <textarea [(ngModel)]="nuevo.descripcion" rows="2" placeholder="Descripción opcional..."
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 resize-none"></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Categoría *</label>
            <select [(ngModel)]="nuevo.categoria" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500">
              <option *ngFor="let cat of categorias" [value]="cat">{{ cat }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
            <select [(ngModel)]="nuevo.activo" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500">
              <option [ngValue]="true">Activo</option>
              <option [ngValue]="false">Inactivo</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Precio base (L.) *</label>
            <input [(ngModel)]="nuevo.precioBase" type="number" min="0"
              class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500">
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Duración (min) *</label>
            <input [(ngModel)]="nuevo.duracion" type="number" min="15" step="15"
              class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500">
          </div>
        </div>

        <!-- Variantes -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <label class="text-sm font-semibold text-gray-700">Variantes</label>
            <button (click)="agregarVariante()" type="button"
              class="flex items-center gap-1 text-red-600 text-sm font-semibold hover:text-red-700 transition">
              <span class="material-symbols-outlined text-base">add_circle</span>
              Agregar
            </button>
          </div>

          <div *ngIf="variantesForm.length === 0"
            class="text-sm text-gray-400 italic py-4 text-center border border-dashed border-gray-200 rounded-lg">
            Sin variantes. Haz clic en "Agregar" para añadir opciones.
          </div>

          <div class="space-y-2">
            <div *ngFor="let v of variantesForm; let i = index"
              class="flex gap-2 items-center bg-gray-50 rounded-lg p-3 border border-gray-200">
              <select [(ngModel)]="v.tipo"
                class="w-32 p-2 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:border-red-500">
                <option value="">Tipo...</option>
                <option *ngFor="let t of tiposVariante" [value]="t">{{ t }}</option>
              </select>
              <input [(ngModel)]="v.nombre" type="text" placeholder="Nombre opción"
                class="flex-1 p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-red-500">
              <div class="flex items-center gap-1 shrink-0">
                <span class="text-xs text-gray-500">+L.</span>
                <input [(ngModel)]="v.precioExtra" type="number" min="0" placeholder="0"
                  class="w-16 p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-red-500">
              </div>
              <button (click)="quitarVariante(i)" type="button" class="p-1 text-gray-400 hover:text-red-600 transition">
                <span class="material-symbols-outlined text-base">delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="px-6 py-4 border-t border-gray-200 flex gap-3">
        <button (click)="mostrarDrawer = false"
          class="flex-1 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition">
          Cancelar
        </button>
        <button (click)="guardar()" [disabled]="guardando"
          class="flex-1 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 transition">
          {{ guardando ? 'Guardando...' : (seleccionado ? 'Actualizar' : 'Crear servicio') }}
        </button>
      </div>
    </div>
  `
})
export class ServiciosComponent implements OnInit {
  servicios: Servicio[] = [];
  seleccionado: Servicio | null = null;
  mostrarDrawer = false;
  cargando = true;
  guardando = false;
  error = '';

  nuevo: Partial<Servicio> = {
    nombre: '', descripcion: '', categoria: 'Manicure',
    precioBase: 0, duracion: 60, activo: true
  };
  variantesForm: { tipo: string; nombre: string; precioExtra: number }[] = [];

  categorias = ['Manicure', 'Pedicure', 'Cortes', 'Tintes', 'Maquillaje'];
  tiposVariante = ['nivel', 'largo', 'acabado', 'tecnica', 'ocasion', 'intensidad'];

  constructor(private servicioSvc: ServicioService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.servicioSvc.listar().subscribe({
      next: (data: Servicio[]) => { this.servicios = data; this.cargando = false; },
      error: () => this.cargando = false
    });
  }

  abrirNuevo(): void {
    this.seleccionado = null;
    this.nuevo = { nombre: '', descripcion: '', categoria: 'Manicure', precioBase: 0, duracion: 60, activo: true };
    this.variantesForm = [];
    this.error = '';
    this.mostrarDrawer = true;
  }

  abrirEditar(s: Servicio): void {
    this.seleccionado = s;
    this.nuevo = { nombre: s.nombre, descripcion: s.descripcion, categoria: s.categoria, precioBase: s.precioBase, duracion: s.duracion, activo: s.activo };
    this.variantesForm = (s.variantes ?? []).map(v => ({ tipo: v.tipo, nombre: v.nombre, precioExtra: v.precioExtra }));
    this.error = '';
    this.mostrarDrawer = true;
  }

  agregarVariante(): void {
    this.variantesForm.push({ tipo: '', nombre: '', precioExtra: 0 });
  }

  quitarVariante(i: number): void {
    this.variantesForm.splice(i, 1);
  }

  guardar(): void {
    if (!this.nuevo.nombre || !this.nuevo.precioBase) {
      this.error = 'Nombre y precio son obligatorios';
      return;
    }
    this.guardando = true;
    this.error = '';
    const body = { ...this.nuevo, variantes: this.variantesForm.filter(v => v.tipo && v.nombre) };
    const op = this.seleccionado
      ? this.servicioSvc.actualizar(this.seleccionado._id, body)
      : this.servicioSvc.crear(body);
    op.subscribe({
      next: () => { this.mostrarDrawer = false; this.guardando = false; this.cargar(); },
      error: (err: any) => { this.error = err.error?.mensaje || 'Error al guardar'; this.guardando = false; }
    });
  }

  toggleActivo(s: Servicio): void {
    this.servicioSvc.actualizar(s._id, { activo: !s.activo }).subscribe(() => this.cargar());
  }
}
