import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../core/services/usuario.service';
import { CategoriaService } from '../../core/services/categoria.service';
import { Usuario, Categoria } from '../../core/models';

@Component({
  selector: 'app-admin-empleados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white min-h-screen">
      <div class="px-8 py-8">
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-3xl font-bold text-gray-800">Gestionar Estilistas</h1>
          <button (click)="abrirNuevo()" class="bg-red-600 text-white rounded-lg px-6 py-3 font-semibold hover:bg-red-700 transition flex items-center gap-2">
            <span class="material-symbols-outlined">add</span>
            Agregar estilista
          </button>
        </div>

        <!-- Buscador y filtros -->
        <div class="mb-6 flex gap-4">
          <div class="flex-1 flex items-center border border-gray-300 rounded-lg px-4 py-2 bg-white">
            <span class="material-symbols-outlined text-gray-400">search</span>
            <input [(ngModel)]="busqueda" type="text" placeholder="Buscar estilista..."
              class="ml-2 flex-1 outline-none text-gray-700">
          </div>
          <button (click)="filtroEstado = 'activo'"
            [class]="filtroEstado === 'activo' ? 'px-4 py-2 bg-red-100 text-red-600 rounded-lg font-semibold' : 'px-4 py-2 border border-gray-300 text-gray-600 rounded-lg font-semibold hover:bg-gray-50'">
            Activos
          </button>
          <button (click)="filtroEstado = 'todos'"
            [class]="filtroEstado === 'todos' ? 'px-4 py-2 bg-red-100 text-red-600 rounded-lg font-semibold' : 'px-4 py-2 border border-gray-300 text-gray-600 rounded-lg font-semibold hover:bg-gray-50'">
            Todos
          </button>
        </div>

        <!-- Tabla -->
        <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Nombre</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Email</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Teléfono</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Especialidades</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Estado</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr *ngIf="cargando">
                <td colspan="6" class="px-6 py-8 text-center text-gray-400">Cargando estilistas...</td>
              </tr>
              <tr *ngIf="!cargando && empleadosFiltrados.length === 0">
                <td colspan="6" class="px-6 py-8 text-center text-gray-400">Sin resultados.</td>
              </tr>
              <tr *ngFor="let e of empleadosFiltrados" class="hover:bg-gray-50 transition">
                <td class="px-6 py-4">
                  <p class="font-semibold text-gray-800">{{ e.nombre }} {{ e.apellido }}</p>
                </td>
                <td class="px-6 py-4"><p class="text-gray-600 text-sm">{{ e.email }}</p></td>
                <td class="px-6 py-4"><p class="text-gray-600 text-sm">{{ e.telefono || '—' }}</p></td>
                <td class="px-6 py-4">
                  <div *ngIf="e.especialidades?.length; else sinEsp" class="flex flex-wrap gap-1">
                    <span *ngFor="let esp of e.especialidades"
                      class="bg-red-50 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">{{ esp }}</span>
                  </div>
                  <ng-template #sinEsp><span class="text-gray-400 text-sm">—</span></ng-template>
                </td>
                <td class="px-6 py-4">
                  <span [class]="e.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
                    class="text-xs font-bold px-3 py-1 rounded-full capitalize">
                    {{ e.estado }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div *ngIf="confirmandoEliminarId !== e._id; else confirmElim" class="flex justify-center gap-3">
                    <button (click)="abrirEditar(e)" class="text-blue-600 font-semibold text-sm hover:text-blue-700">
                      Editar
                    </button>
                    <button (click)="toggleEstado(e)"
                      [class]="e.estado === 'activo' ? 'text-gray-500 font-semibold text-sm hover:text-gray-700' : 'text-green-600 font-semibold text-sm hover:text-green-700'">
                      {{ e.estado === 'activo' ? 'Desactivar' : 'Activar' }}
                    </button>
                    <button (click)="confirmandoEliminarId = e._id" class="text-red-500 font-semibold text-sm hover:text-red-700">
                      Eliminar
                    </button>
                  </div>
                  <ng-template #confirmElim>
                    <div class="flex items-center justify-center gap-3">
                      <span class="text-xs text-gray-600 font-semibold">¿Eliminar?</span>
                      <button (click)="eliminar(e._id)" class="text-red-600 font-bold text-xs hover:text-red-800">Sí</button>
                      <button (click)="confirmandoEliminarId = null" class="text-gray-400 font-bold text-xs hover:text-gray-600">No</button>
                    </div>
                  </ng-template>
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
    <div *ngIf="mostrarDrawer" class="fixed right-0 top-0 h-full w-[480px] bg-white z-50 shadow-2xl flex flex-col">
      <div class="flex items-center justify-between px-6 py-5 border-b border-gray-200">
        <h2 class="text-xl font-bold text-gray-800">{{ seleccionado ? 'Editar estilista' : 'Nuevo estilista' }}</h2>
        <button (click)="mostrarDrawer = false" class="p-2 hover:bg-gray-100 rounded-lg">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        <div *ngIf="error" class="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{{ error }}</div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre *</label>
            <input [(ngModel)]="form.nombre" type="text"
              class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500">
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Apellido *</label>
            <input [(ngModel)]="form.apellido" type="text"
              class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500">
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Correo electrónico *</label>
          <input [(ngModel)]="form.email" type="email"
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500">
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
          <input [(ngModel)]="form.telefono" type="tel" placeholder="+504 0000-0000"
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500">
        </div>

        <!-- Especialidades desde categorías -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Especialidades</label>

          <!-- Tags seleccionadas -->
          <div *ngIf="especialidades.length > 0" class="flex flex-wrap gap-2 mb-3">
            <span *ngFor="let esp of especialidades; let i = index"
              class="bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
              {{ esp }}
              <button (click)="quitarEsp(i)" type="button" class="hover:text-red-900 ml-1">
                <span class="material-symbols-outlined text-sm">close</span>
              </button>
            </span>
          </div>

          <!-- Botón disparador del dropdown -->
          <button type="button" (click)="mostrarDropdownEsp = !mostrarDropdownEsp"
            class="w-full p-3 border border-gray-300 rounded-lg text-left flex items-center justify-between text-sm hover:border-red-400 focus:outline-none transition"
            [class.border-red-500]="mostrarDropdownEsp">
            <span class="text-gray-400">
              {{ especialidades.length ? 'Agregar otra categoría...' : 'Seleccionar categorías...' }}
            </span>
            <span class="material-symbols-outlined text-gray-400 text-base">
              {{ mostrarDropdownEsp ? 'expand_less' : 'expand_more' }}
            </span>
          </button>

          <!-- Panel de opciones (inline, sin z-index) -->
          <div *ngIf="mostrarDropdownEsp"
            class="border border-gray-200 border-t-0 rounded-b-lg max-h-48 overflow-y-auto bg-white shadow-inner">
            <div *ngIf="categorias.length === 0" class="p-4 text-sm text-gray-400 text-center">
              No hay categorías. Créalas en Gestión de Servicios.
            </div>
            <label *ngFor="let cat of categorias"
              class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 select-none"
              [class.opacity-50]="!cat.activo">
              <input type="checkbox"
                [checked]="especialidades.includes(cat.nombre)"
                (change)="toggleEsp(cat.nombre)"
                class="w-4 h-4 accent-red-600 shrink-0">
              <span class="text-sm text-gray-700 flex-1">{{ cat.nombre }}</span>
              <span *ngIf="!cat.activo" class="text-xs text-gray-400">(inactiva)</span>
            </label>
          </div>

          <p class="text-xs text-gray-400 mt-1.5">
            {{ especialidades.length === 0 ? 'Sin especialidades asignadas.' : especialidades.length + ' especialidad(es) seleccionada(s).' }}
          </p>
        </div>

        <div *ngIf="seleccionado">
          <label class="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
          <select [(ngModel)]="form.estado"
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 bg-white">
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>

        <p *ngIf="!seleccionado" class="text-xs text-gray-500 pt-2">
          La contraseña inicial será <strong>12345678</strong>. El estilista deberá cambiarla en su primer inicio de sesión.
        </p>
      </div>

      <div class="px-6 py-4 border-t border-gray-200 flex gap-3">
        <button (click)="mostrarDrawer = false"
          class="flex-1 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition">
          Cancelar
        </button>
        <button (click)="guardar()" [disabled]="guardando"
          class="flex-1 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 transition">
          {{ guardando ? 'Guardando...' : (seleccionado ? 'Actualizar' : 'Crear estilista') }}
        </button>
      </div>
    </div>
  `
})
export class EmpleadosComponent implements OnInit {
  empleados: Usuario[] = [];
  categorias: Categoria[] = [];
  cargando = true;
  mostrarDrawer = false;
  busqueda = '';
  filtroEstado = 'activo';

  seleccionado: Usuario | null = null;
  confirmandoEliminarId: string | null = null;
  form = { nombre: '', apellido: '', email: '', telefono: '', estado: 'activo' };
  especialidades: string[] = [];
  mostrarDropdownEsp = false;
  guardando = false;
  error = '';

  constructor(private usuarioSvc: UsuarioService, private categoriaSvc: CategoriaService) {}

  ngOnInit(): void { this.cargar(); this.categoriaSvc.listarAdmin().subscribe(cats => this.categorias = cats); }

  get empleadosFiltrados(): Usuario[] {
    return this.empleados.filter(e => {
      const coincideBusqueda = !this.busqueda ||
        `${e.nombre} ${e.apellido} ${e.email}`.toLowerCase().includes(this.busqueda.toLowerCase());
      const coincideEstado = this.filtroEstado === 'todos' || e.estado === this.filtroEstado;
      return coincideBusqueda && coincideEstado;
    });
  }

  cargar(): void {
    this.usuarioSvc.listarTodosEstilistas().subscribe({
      next: (data) => { this.empleados = data; this.cargando = false; },
      error: () => this.cargando = false
    });
  }

  abrirNuevo(): void {
    this.seleccionado = null;
    this.form = { nombre: '', apellido: '', email: '', telefono: '', estado: 'activo' };
    this.especialidades = [];
    this.mostrarDropdownEsp = false;
    this.error = '';
    this.mostrarDrawer = true;
  }

  abrirEditar(e: Usuario): void {
    this.seleccionado = e;
    this.form = { nombre: e.nombre, apellido: e.apellido ?? '', email: e.email, telefono: e.telefono ?? '', estado: e.estado };
    this.especialidades = [...(e.especialidades ?? [])];
    this.mostrarDropdownEsp = false;
    this.error = '';
    this.mostrarDrawer = true;
  }

  toggleEsp(nombre: string): void {
    const idx = this.especialidades.indexOf(nombre);
    if (idx >= 0) this.especialidades.splice(idx, 1);
    else this.especialidades.push(nombre);
  }

  quitarEsp(i: number): void {
    this.especialidades.splice(i, 1);
  }

  guardar(): void {
    if (!this.form.nombre || !this.form.apellido || !this.form.email) {
      this.error = 'Nombre, apellido y correo son obligatorios';
      return;
    }
    this.guardando = true;
    this.error = '';
    const datos = { ...this.form, especialidades: this.especialidades } as any;

    const op = this.seleccionado
      ? this.usuarioSvc.actualizarEmpleado(this.seleccionado._id, datos)
      : this.usuarioSvc.crearEmpleado(datos);

    op.subscribe({
      next: () => {
        this.mostrarDrawer = false;
        this.guardando = false;
        this.cargar();
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al guardar';
        this.guardando = false;
      }
    });
  }

  toggleEstado(e: Usuario): void {
    const nuevo = e.estado === 'activo' ? 'inactivo' : 'activo';
    this.usuarioSvc.actualizarEstado(e._id, nuevo).subscribe(() => this.cargar());
  }

  eliminar(id: string): void {
    this.usuarioSvc.eliminarEmpleado(id).subscribe({
      next: () => { this.confirmandoEliminarId = null; this.cargar(); },
      error: () => { this.confirmandoEliminarId = null; }
    });
  }
}
