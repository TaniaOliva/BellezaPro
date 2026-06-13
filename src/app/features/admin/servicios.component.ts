import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServicioService } from '../../core/services/servicio.service';
import { CategoriaService } from '../../core/services/categoria.service';
import { Servicio, Categoria } from '../../core/models';

interface VarianteForm { tipo: string; nombre: string; precioExtra: number; descripcion: string; }
interface CatEdit { nombre: string; confirmDelete: boolean; }

@Component({
  selector: 'app-admin-servicios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white min-h-screen">
      <div class="px-8 py-8">

        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-800">Gestión de Servicios</h1>
            <p class="text-gray-500 text-sm mt-1">{{ servicios.length }} servicios · {{ categorias.length }} categorías</p>
          </div>
          <div class="flex gap-3">
            <button (click)="abrirModalCategorias()" class="border border-gray-300 text-gray-700 rounded-lg px-5 py-2.5 font-semibold hover:bg-gray-50 transition flex items-center gap-2 text-sm">
              <span class="material-symbols-outlined text-base">folder_open</span>
              Editar categorías
            </button>
            <button (click)="abrirNuevo()" class="bg-red-600 text-white rounded-lg px-5 py-2.5 font-semibold hover:bg-red-700 transition flex items-center gap-2 text-sm">
              <span class="material-symbols-outlined text-base">add</span>
              Agregar servicio
            </button>
          </div>
        </div>

        <!-- Filtros por categoría: activas primero, luego inactivas grises al final -->
        <div class="flex gap-3 flex-wrap mb-8">
          <button (click)="filtrar('Todos')"
            [class]="categoriaActiva === 'Todos' ? 'px-4 py-2 bg-red-100 text-red-600 rounded-full font-semibold text-sm' : 'px-4 py-2 text-gray-600 rounded-full font-semibold text-sm border border-gray-300 hover:bg-gray-50'">
            Todos
          </button>
          <button *ngFor="let cat of categoriasSorted" (click)="filtrar(cat.nombre)"
            [class]="cat.activo
              ? (categoriaActiva === cat.nombre ? 'px-4 py-2 bg-red-100 text-red-600 rounded-full font-semibold text-sm' : 'px-4 py-2 text-gray-600 rounded-full font-semibold text-sm border border-gray-300 hover:bg-gray-50')
              : 'px-4 py-2 text-gray-400 rounded-full font-semibold text-sm border border-gray-200 bg-gray-50 opacity-70'">
            {{ cat.nombre }}
            <span *ngIf="!cat.activo" class="ml-1 text-xs">(inactiva)</span>
          </button>
        </div>

        <!-- Cargando -->
        <div *ngIf="cargando" class="text-center py-16 text-gray-400">Cargando servicios...</div>

        <!-- Sin servicios -->
        <div *ngIf="!cargando && serviciosFiltrados.length === 0" class="text-center py-16">
          <span class="material-symbols-outlined text-gray-300 text-5xl block mb-3">content_cut</span>
          <p class="text-gray-400 mb-1">No hay servicios en esta categoría.</p>
          <button (click)="abrirNuevo()" class="text-red-600 font-semibold text-sm hover:underline">Agregar el primero →</button>
        </div>

        <!-- Grid de tarjetas -->
        <div *ngIf="!cargando && serviciosFiltrados.length > 0" class="grid grid-cols-3 gap-6">
          <div *ngFor="let s of serviciosFiltrados"
            [class]="categoriaInactiva(s.categoria) ? 'bg-white rounded-lg border border-gray-200 overflow-hidden opacity-55 grayscale' : 'bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition'">
            <div class="bg-gray-200 h-48 relative">
              <span class="absolute top-3 right-3 bg-white text-gray-700 text-xs font-bold px-3 py-1 rounded shadow-sm">{{ s.categoria }}</span>
              <span *ngIf="categoriaInactiva(s.categoria)"
                class="absolute bottom-3 left-3 bg-gray-700 text-white text-xs font-bold px-2 py-1 rounded-full">
                Cat. inactiva
              </span>
              <span *ngIf="!categoriaInactiva(s.categoria)" class="absolute top-3 left-3"
                [class]="s.activo ? 'bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full' : 'bg-gray-100 text-gray-500 text-xs font-bold px-2 py-1 rounded-full'">
                {{ s.activo ? 'Activo' : 'Inactivo' }}
              </span>
            </div>
            <div class="p-5">
              <h3 class="text-lg font-bold text-gray-800 mb-1">{{ s.nombre }}</h3>
              <p class="text-sm text-gray-500 mb-2 line-clamp-2">{{ s.descripcion }}</p>
              <p class="text-red-600 font-bold mb-4">Desde L. {{ s.precioBase }}</p>
              <div class="flex gap-2">
                <button (click)="abrirEditar(s)" class="flex-1 border border-red-600 text-red-600 rounded-lg py-2 font-semibold hover:bg-red-50 transition text-sm">
                  Editar
                </button>
                <button (click)="toggleActivo(s)" [disabled]="categoriaInactiva(s.categoria)"
                  title="{{ s.activo ? 'Desactivar' : 'Activar' }}"
                  class="px-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-500 disabled:opacity-40">
                  <span class="material-symbols-outlined text-base">{{ s.activo ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- ── Modal Gestión de Categorías ────────────────────── -->
    <div *ngIf="mostrarModalCat" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      (click)="mostrarModalCat = false">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 flex flex-col max-h-[85vh]"
        (click)="$event.stopPropagation()">

        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
          <h3 class="text-lg font-bold text-gray-800">Gestión de Categorías</h3>
          <button (click)="mostrarModalCat = false" class="p-1 hover:bg-gray-100 rounded-lg">
            <span class="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <!-- Tabs -->
        <div class="flex border-b border-gray-200 shrink-0">
          <button (click)="tabCat = 'nueva'"
            [class]="tabCat === 'nueva' ? 'flex-1 py-3 text-sm font-bold text-red-600 border-b-2 border-red-600' : 'flex-1 py-3 text-sm font-semibold text-gray-500 hover:text-gray-700'">
            Agregar categoría
          </button>
          <button (click)="tabCat = 'editar'; initCatEdits()"
            [class]="tabCat === 'editar' ? 'flex-1 py-3 text-sm font-bold text-red-600 border-b-2 border-red-600' : 'flex-1 py-3 text-sm font-semibold text-gray-500 hover:text-gray-700'">
            Editar categorías
          </button>
        </div>

        <!-- Tab: Nueva categoría -->
        <div *ngIf="tabCat === 'nueva'" class="p-6">
          <p class="text-sm text-gray-500 mb-4">La categoría aparecerá en el catálogo de clientes.</p>
          <input [(ngModel)]="nuevaCategoriaNombre" type="text" placeholder="Nombre de la categoría"
            (keyup.enter)="guardarCategoria()"
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 mb-3">
          <p *ngIf="errorCategoria" class="text-red-600 text-sm mb-3">{{ errorCategoria }}</p>
          <div class="flex gap-3">
            <button (click)="mostrarModalCat = false"
              class="flex-1 py-2.5 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button (click)="guardarCategoria()" [disabled]="guardandoCategoria"
              class="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50">
              {{ guardandoCategoria ? 'Creando...' : 'Crear' }}
            </button>
          </div>
        </div>

        <!-- Tab: Editar categorías -->
        <div *ngIf="tabCat === 'editar'" class="flex-1 overflow-y-auto">
          <div *ngIf="categorias.length === 0" class="p-6 text-center text-gray-400 text-sm">
            No hay categorías. Crea la primera en la otra pestaña.
          </div>

          <div *ngFor="let cat of categoriasSorted" class="border-b border-gray-100 last:border-b-0">
            <!-- Fila normal -->
            <div *ngIf="!catEdits[cat._id]?.confirmDelete" class="px-5 py-4">
              <div class="flex items-center gap-3 mb-2">
                <!-- Input nombre -->
                <input [(ngModel)]="catEdits[cat._id].nombre" type="text"
                  class="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-red-500">
                <!-- Guardar nombre -->
                <button (click)="guardarCatEdit(cat)"
                  [disabled]="catEdits[cat._id].nombre === cat.nombre || guardandoCatId === cat._id"
                  class="px-3 py-2 bg-gray-800 text-white rounded-lg text-xs font-semibold disabled:opacity-30 hover:bg-gray-700">
                  Guardar
                </button>
              </div>
              <div class="flex items-center gap-2">
                <!-- Badge estado + toggle -->
                <button (click)="toggleCatActivo(cat)"
                  [class]="cat.activo
                    ? 'text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-700 hover:bg-green-200'
                    : 'text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200'">
                  {{ cat.activo ? 'Activa' : 'Inactiva' }}
                </button>
                <span class="text-gray-300 text-xs">·</span>
                <span *ngIf="!cat.activo" class="text-xs text-gray-400">No visible para clientes</span>
                <span *ngIf="cat.activo" class="text-xs text-gray-400">Visible para clientes</span>
                <div class="flex-1"></div>
                <!-- Eliminar -->
                <button (click)="catEdits[cat._id].confirmDelete = true"
                  class="text-xs text-red-500 font-semibold hover:text-red-700">
                  Eliminar
                </button>
              </div>
            </div>

            <!-- Confirmación de eliminación -->
            <div *ngIf="catEdits[cat._id]?.confirmDelete" class="px-5 py-4 bg-red-50">
              <p class="text-sm font-semibold text-red-700 mb-1">¿Eliminar "{{ cat.nombre }}"?</p>
              <p class="text-xs text-red-500 mb-3">Se eliminarán también todos sus servicios. Esta acción no se puede deshacer.</p>
              <div class="flex gap-2">
                <button (click)="catEdits[cat._id].confirmDelete = false"
                  class="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">
                  Cancelar
                </button>
                <button (click)="eliminarCategoria(cat)"
                  class="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700">
                  Sí, eliminar todo
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- ── Overlay drawer ──────────────────────────────────── -->
    <div *ngIf="mostrarDrawer" class="fixed inset-0 bg-black/40 z-40" (click)="mostrarDrawer = false"></div>

    <!-- ── Drawer servicio ─────────────────────────────────── -->
    <div *ngIf="mostrarDrawer" class="fixed right-0 top-0 h-full w-[520px] bg-white z-50 shadow-2xl flex flex-col">
      <div class="flex items-center justify-between px-6 py-5 border-b border-gray-200">
        <h2 class="text-xl font-bold text-gray-800">{{ seleccionado ? 'Editar servicio' : 'Nuevo servicio' }}</h2>
        <button (click)="mostrarDrawer = false" class="p-2 hover:bg-gray-100 rounded-lg transition">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        <p *ngIf="error" class="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{{ error }}</p>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre *</label>
          <input [(ngModel)]="nuevo.nombre" type="text" placeholder="Ej. Manicure Clásico"
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500">
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
          <textarea [(ngModel)]="nuevo.descripcion" rows="2" placeholder="Descripción breve del servicio..."
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 resize-none"></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Categoría *
              <span *ngIf="!nuevo.categoria" class="ml-1 text-xs font-normal text-red-500">— requerida</span>
            </label>
            <select [(ngModel)]="nuevo.categoria"
              [class]="!nuevo.categoria
                ? 'w-full p-3 border-2 border-red-300 rounded-lg focus:outline-none focus:border-red-500 bg-white text-gray-400'
                : 'w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 bg-white'">
              <option value="">Elegir categoría...</option>
              <option *ngFor="let cat of categorias" [value]="cat.nombre">{{ cat.nombre }}</option>
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
            <label class="text-sm font-semibold text-gray-700">Variantes / Opciones</label>
            <button (click)="agregarVariante()" type="button"
              class="flex items-center gap-1 text-red-600 text-sm font-semibold hover:text-red-700">
              <span class="material-symbols-outlined text-base">add_circle</span> Agregar
            </button>
          </div>

          <div *ngIf="variantesForm.length === 0"
            class="text-sm text-gray-400 italic py-4 text-center border border-dashed border-gray-200 rounded-lg">
            Sin variantes. Haz clic en "Agregar" para añadir opciones.
          </div>

          <div class="space-y-2">
            <ng-container *ngFor="let v of variantesForm; let i = index">
              <div *ngIf="i > 0 && variantesForm[i-1].tipo && v.tipo && variantesForm[i-1].tipo !== v.tipo"
                class="flex items-center gap-2 py-1">
                <div class="flex-1 border-t-2 border-dashed border-gray-300"></div>
                <span class="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">{{ v.tipo }}</span>
                <div class="flex-1 border-t-2 border-dashed border-gray-300"></div>
              </div>
              <div class="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div class="flex gap-2 items-center">
                  <input [(ngModel)]="v.tipo" type="text" list="tipos-usados-dl"
                    placeholder="Tipo (ej: color, nivel...)"
                    class="w-36 p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-red-500 shrink-0">
                  <input [(ngModel)]="v.nombre" type="text" [attr.list]="'nombres-dl-' + i"
                    placeholder="Nombre de la opción"
                    class="flex-1 p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-red-500 min-w-0">
                  <div class="flex items-center gap-1 shrink-0">
                    <span class="text-xs text-gray-500">+L.</span>
                    <input [(ngModel)]="v.precioExtra" type="number" min="0" placeholder="0"
                      class="w-16 p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-red-500">
                  </div>
                  <button (click)="agregarOpcion(i)" type="button" title="Agregar otra opción del mismo tipo"
                    class="p-1 text-green-600 hover:text-green-700 shrink-0">
                    <span class="material-symbols-outlined text-base">add_circle</span>
                  </button>
                  <button (click)="quitarVariante(i)" type="button" class="p-1 text-gray-400 hover:text-red-600 shrink-0">
                    <span class="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
                <input *ngIf="v.tipo === 'servicio' || v.tipo === 'decoracion' || v.tipo === 'color'" [(ngModel)]="v.descripcion"
                  type="text"
                  [placeholder]="v.tipo === 'color' ? 'Color hex (ej: #dc2626)' : v.tipo === 'decoracion' ? 'Emoji (ej: 💎)' : '¿Qué incluye este nivel?'"
                  class="mt-2 w-full p-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-red-500 bg-white placeholder-gray-400">
              </div>
              <!-- Datalist de nombres para este tipo -->
              <datalist [id]="'nombres-dl-' + i">
                <option *ngFor="let n of nombresParaTipo(v.tipo)" [value]="n"></option>
              </datalist>
            </ng-container>
          </div>
          <!-- Datalist global de tipos usados -->
          <datalist id="tipos-usados-dl">
            <option *ngFor="let t of tiposUsados" [value]="t"></option>
          </datalist>
        </div>
      </div>

      <div class="px-6 py-4 border-t border-gray-200 flex gap-3">
        <button (click)="mostrarDrawer = false"
          class="flex-1 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50">
          Cancelar
        </button>
        <button (click)="guardar()" [disabled]="guardando"
          class="flex-1 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50">
          {{ guardando ? 'Guardando...' : (seleccionado ? 'Actualizar' : 'Crear servicio') }}
        </button>
      </div>
    </div>
  `
})
export class ServiciosComponent implements OnInit {
  servicios: Servicio[] = [];
  serviciosFiltrados: Servicio[] = [];
  categorias: Categoria[] = [];
  categoriaActiva = 'Todos';

  seleccionado: Servicio | null = null;
  mostrarDrawer = false;
  cargando = true;
  guardando = false;
  error = '';

  nuevo: Partial<Servicio> = { nombre: '', descripcion: '', categoria: '', precioBase: 0, duracion: 60, activo: true };
  variantesForm: VarianteForm[] = [];

  mostrarModalCat = false;
  tabCat: 'nueva' | 'editar' = 'nueva';
  nuevaCategoriaNombre = '';
  errorCategoria = '';
  guardandoCategoria = false;
  catEdits: Record<string, CatEdit> = {};
  guardandoCatId: string | null = null;

  constructor(
    private servicioSvc: ServicioService,
    private categoriaSvc: CategoriaService
  ) {}

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.cargando = true;
    this.categoriaSvc.listarAdmin().subscribe({ next: cats => { this.categorias = cats; this.initCatEdits(); } });
    this.servicioSvc.listarAdmin().subscribe({
      next: (data) => { this.servicios = data; this.aplicarFiltro(); this.cargando = false; },
      error: () => this.cargando = false
    });
  }

  filtrar(cat: string): void { this.categoriaActiva = cat; this.aplicarFiltro(); }

  private aplicarFiltro(): void {
    this.serviciosFiltrados = this.categoriaActiva === 'Todos'
      ? this.servicios
      : this.servicios.filter(s => s.categoria === this.categoriaActiva);
  }

  get categoriasSorted(): Categoria[] {
    return [
      ...this.categorias.filter(c => c.activo),
      ...this.categorias.filter(c => !c.activo)
    ];
  }

  categoriaInactiva(nombre: string): boolean {
    const cat = this.categorias.find(c => c.nombre === nombre);
    return cat ? !cat.activo : false;
  }

  // ── Modal Categorías ──────────────────────────────────────
  abrirModalCategorias(tab: 'nueva' | 'editar' = 'nueva'): void {
    this.tabCat = tab;
    this.nuevaCategoriaNombre = '';
    this.errorCategoria = '';
    this.initCatEdits();
    this.mostrarModalCat = true;
  }

  initCatEdits(): void {
    for (const cat of this.categorias) {
      if (!this.catEdits[cat._id]) {
        this.catEdits[cat._id] = { nombre: cat.nombre, confirmDelete: false };
      } else {
        this.catEdits[cat._id].nombre = cat.nombre;
        this.catEdits[cat._id].confirmDelete = false;
      }
    }
  }

  guardarCategoria(): void {
    const nombre = this.nuevaCategoriaNombre.trim();
    if (!nombre) { this.errorCategoria = 'El nombre es obligatorio'; return; }
    this.guardandoCategoria = true;
    this.errorCategoria = '';
    this.categoriaSvc.crear(nombre).subscribe({
      next: () => { this.guardandoCategoria = false; this.nuevaCategoriaNombre = ''; this.cargar(); this.tabCat = 'editar'; },
      error: (err: any) => { this.errorCategoria = err.error?.mensaje || 'Error al crear'; this.guardandoCategoria = false; }
    });
  }

  guardarCatEdit(cat: Categoria): void {
    const nombre = this.catEdits[cat._id]?.nombre?.trim();
    if (!nombre || nombre === cat.nombre) return;
    this.guardandoCatId = cat._id;
    this.categoriaSvc.actualizar(cat._id, { nombre }).subscribe({
      next: () => { this.guardandoCatId = null; this.cargar(); },
      error: () => { this.guardandoCatId = null; }
    });
  }

  toggleCatActivo(cat: Categoria): void {
    this.categoriaSvc.actualizar(cat._id, { activo: !cat.activo } as any).subscribe({ next: () => this.cargar() });
  }

  eliminarCategoria(cat: Categoria): void {
    this.categoriaSvc.eliminar(cat._id).subscribe({
      next: () => { delete this.catEdits[cat._id]; this.cargar(); }
    });
  }

  // ── Sugerencias de variantes ─────────────────────────────
  get tiposUsados(): string[] {
    const tipos = new Set<string>();
    for (const s of this.servicios) for (const v of s.variantes ?? []) if (v.tipo) tipos.add(v.tipo);
    return Array.from(tipos).sort();
  }

  nombresParaTipo(tipo: string): string[] {
    if (!tipo) return [];
    const nombres = new Set<string>();
    for (const s of this.servicios) for (const v of s.variantes ?? []) if (v.tipo === tipo && v.nombre) nombres.add(v.nombre);
    return Array.from(nombres).sort();
  }

  // ── Servicio ──────────────────────────────────────────────
  abrirNuevo(): void {
    this.seleccionado = null;
    const catDefault = this.categoriaActiva !== 'Todos' ? this.categoriaActiva : '';
    this.nuevo = { nombre: '', descripcion: '', categoria: catDefault, precioBase: 0, duracion: 60, activo: true };
    this.variantesForm = [];
    this.error = '';
    this.mostrarDrawer = true;
  }

  abrirEditar(s: Servicio): void {
    this.seleccionado = s;
    this.nuevo = { nombre: s.nombre, descripcion: s.descripcion, categoria: s.categoria, precioBase: s.precioBase, duracion: s.duracion, activo: s.activo };
    this.variantesForm = (s.variantes ?? []).map(v => ({ tipo: v.tipo, nombre: v.nombre, precioExtra: v.precioExtra, descripcion: v.descripcion ?? '' }));
    this.error = '';
    this.mostrarDrawer = true;
  }

  agregarVariante(): void {
    this.variantesForm.push({ tipo: '', nombre: '', precioExtra: 0, descripcion: '' });
  }

  agregarOpcion(i: number): void {
    this.variantesForm.splice(i + 1, 0, { tipo: this.variantesForm[i].tipo, nombre: '', precioExtra: 0, descripcion: '' });
  }

  quitarVariante(i: number): void {
    this.variantesForm.splice(i, 1);
  }

  guardar(): void {
    if (!this.nuevo.nombre?.trim() || !this.nuevo.precioBase) { this.error = 'Nombre y precio son obligatorios'; return; }
    if (!this.nuevo.categoria) { this.error = 'Selecciona una categoría'; return; }
    this.guardando = true;
    this.error = '';
    const body = { ...this.nuevo, variantes: this.variantesForm.filter(v => v.tipo && v.nombre) };
    const op = this.seleccionado ? this.servicioSvc.actualizar(this.seleccionado._id, body) : this.servicioSvc.crear(body);
    op.subscribe({
      next: () => { this.mostrarDrawer = false; this.guardando = false; this.cargar(); },
      error: (err: any) => { this.error = err.error?.mensaje || 'Error al guardar'; this.guardando = false; }
    });
  }

  toggleActivo(s: Servicio): void {
    this.servicioSvc.actualizar(s._id, { activo: !s.activo }).subscribe(() => this.cargar());
  }
}
