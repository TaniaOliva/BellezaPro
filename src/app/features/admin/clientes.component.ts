import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../core/services/usuario.service';
import { ReporteService } from '../../core/services/reporte.service';
import { Usuario, ReporteCliente } from '../../core/models';

@Component({
  selector: 'app-admin-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white min-h-screen">
      <div class="px-8 py-8">
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-3xl font-bold text-gray-800">Gestionar Clientes</h1>
        </div>

        <!-- Buscador y filtros -->
        <div class="mb-6 flex gap-4">
          <div class="flex-1 flex items-center border border-gray-300 rounded-lg px-4 py-2 bg-white">
            <span class="material-symbols-outlined text-gray-400">search</span>
            <input [(ngModel)]="busqueda" type="text" placeholder="Buscar cliente..." class="ml-2 flex-1 outline-none text-gray-700">
          </div>
          <button (click)="filtroEstado = 'activo'" [class]="filtroEstado === 'activo' ? 'px-4 py-2 bg-red-100 text-red-600 rounded-lg font-semibold' : 'px-4 py-2 border border-gray-300 text-gray-600 rounded-lg font-semibold hover:bg-gray-50'">Activos</button>
          <button (click)="filtroEstado = 'todos'" [class]="filtroEstado === 'todos' ? 'px-4 py-2 bg-red-100 text-red-600 rounded-lg font-semibold' : 'px-4 py-2 border border-gray-300 text-gray-600 rounded-lg font-semibold hover:bg-gray-50'">Todos</button>
        </div>

        <!-- Tabla de clientes -->
        <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Nombre</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Email</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Teléfono</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Estado</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Registrado</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr *ngIf="cargando">
                <td colspan="6" class="px-6 py-8 text-center text-gray-400">Cargando clientes...</td>
              </tr>
              <tr *ngIf="!cargando && clientesFiltrados.length === 0">
                <td colspan="6" class="px-6 py-8 text-center text-gray-400">Sin resultados.</td>
              </tr>
              <tr *ngFor="let c of clientesFiltrados" class="hover:bg-gray-50 transition">
                <td class="px-6 py-4"><p class="font-semibold text-gray-800">{{ c.nombre }} {{ c.apellido }}</p></td>
                <td class="px-6 py-4"><p class="text-gray-600">{{ c.email }}</p></td>
                <td class="px-6 py-4"><p class="text-gray-600">{{ c.telefono || '—' }}</p></td>
                <td class="px-6 py-4">
                  <span [class]="c.estado === 'activo' ? 'bg-green-100 text-green-700' : c.estado === 'bloqueado' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'"
                    class="text-xs font-bold px-3 py-1 rounded capitalize">
                    {{ c.estado }}
                  </span>
                </td>
                <td class="px-6 py-4"><p class="text-gray-500 text-sm">{{ c.createdAt | date:'dd/MM/yyyy' }}</p></td>
                <td class="px-6 py-4 text-center">
                  <button (click)="abrirDetalle(c)" class="text-red-600 font-semibold text-sm hover:text-red-700">Ver</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Overlay -->
    <div *ngIf="seleccionado" class="fixed inset-0 bg-black/40 z-40" (click)="seleccionado = null"></div>

    <!-- Drawer detalle cliente -->
    <div *ngIf="seleccionado" class="fixed right-0 top-0 h-full w-[480px] bg-white z-50 shadow-2xl flex flex-col">
      <div class="flex items-center justify-between px-6 py-5 border-b border-gray-200">
        <h2 class="text-xl font-bold text-gray-800">{{ seleccionado.nombre }} {{ seleccionado.apellido }}</h2>
        <button (click)="seleccionado = null" class="p-2 hover:bg-gray-100 rounded-lg">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        <!-- Info básica -->
        <div class="space-y-2 text-sm">
          <p class="text-gray-500">{{ seleccionado.email }}</p>
          <p class="text-gray-500">{{ seleccionado.telefono || 'Sin teléfono' }}</p>
          <span [class]="seleccionado.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
            class="inline-block text-xs font-bold px-3 py-1 rounded capitalize">
            {{ seleccionado.estado }}
          </span>
        </div>

        <!-- Cambiar estado -->
        <div *ngIf="mensajeEstado" class="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          {{ mensajeEstado }}
        </div>
        <div class="flex gap-2">
          <button *ngIf="seleccionado.estado !== 'activo'" (click)="cambiarEstado('activo')" [disabled]="guardando"
            class="flex-1 py-2 bg-green-600 text-white rounded-lg font-semibold text-sm hover:bg-green-700 disabled:opacity-50 transition">
            Activar
          </button>
          <button *ngIf="seleccionado.estado === 'activo'" (click)="cambiarEstado('bloqueado')" [disabled]="guardando"
            class="flex-1 py-2 bg-red-600 text-white rounded-lg font-semibold text-sm hover:bg-red-700 disabled:opacity-50 transition">
            Bloquear
          </button>
          <button *ngIf="seleccionado.estado !== 'suspendido'" (click)="cambiarEstado('suspendido')" [disabled]="guardando"
            class="flex-1 py-2 border border-yellow-500 text-yellow-600 rounded-lg font-semibold text-sm hover:bg-yellow-50 disabled:opacity-50 transition">
            Suspender
          </button>
        </div>

        <!-- Reportes del cliente -->
        <div>
          <p class="text-sm font-bold text-gray-700 mb-3">Reportes recibidos</p>
          <div *ngIf="reportesCliente.length === 0" class="text-sm text-gray-400 italic">Sin reportes.</div>
          <div class="space-y-3">
            <div *ngFor="let r of reportesCliente" class="rounded-lg border border-gray-200 p-3 text-sm">
              <div class="flex items-center justify-between mb-1">
                <p class="font-semibold text-gray-800 capitalize">{{ r.motivo }}</p>
                <span [class]="r.estado === 'resuelto' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                  class="text-xs font-bold px-2 py-0.5 rounded capitalize">{{ r.estado }}</span>
              </div>
              <p class="text-gray-500">{{ r.descripcion }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ r.creadoEn | date:'dd/MM/yyyy' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ClientesComponent implements OnInit {
  clientes: Usuario[] = [];
  seleccionado: Usuario | null = null;
  reportesCliente: ReporteCliente[] = [];
  cargando = true;
  guardando = false;
  busqueda = '';
  filtroEstado = 'activo';
  mensajeEstado = '';

  constructor(
    private usuarioSvc: UsuarioService,
    private reporteSvc: ReporteService
  ) {}

  ngOnInit(): void {
    this.usuarioSvc.listarClientes().subscribe({
      next: (data: Usuario[]) => { this.clientes = data; this.cargando = false; },
      error: () => this.cargando = false
    });
  }

  get clientesFiltrados(): Usuario[] {
    return this.clientes.filter(c => {
      const coincideBusqueda = !this.busqueda ||
        `${c.nombre} ${c.apellido} ${c.email}`.toLowerCase().includes(this.busqueda.toLowerCase());
      const coincideEstado = this.filtroEstado === 'todos' || c.estado === this.filtroEstado;
      return coincideBusqueda && coincideEstado;
    });
  }

  abrirDetalle(cliente: Usuario): void {
    this.seleccionado = cliente;
    this.mensajeEstado = '';
    this.reportesCliente = [];
    this.reporteSvc.porCliente(cliente._id).subscribe({
      next: (data: ReporteCliente[]) => this.reportesCliente = data,
      error: () => this.reportesCliente = []
    });
  }

  cambiarEstado(estado: string): void {
    if (!this.seleccionado) return;
    this.guardando = true;
    this.usuarioSvc.actualizarEstado(this.seleccionado._id, estado).subscribe({
      next: (actualizado: Usuario) => {
        this.seleccionado = actualizado;
        this.guardando = false;
        this.mensajeEstado = `Estado actualizado a ${estado}`;
        setTimeout(() => this.mensajeEstado = '', 3000);
        this.usuarioSvc.listarClientes().subscribe((data: Usuario[]) => this.clientes = data);
      },
      error: () => this.guardando = false
    });
  }
}
