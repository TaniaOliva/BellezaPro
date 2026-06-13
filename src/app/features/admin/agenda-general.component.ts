import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../core/services/usuario.service';
import { CitaService } from '../../core/services/cita.service';
import { Usuario, Cita } from '../../core/models';

@Component({
  selector: 'app-admin-agenda-general',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white min-h-screen">
      <div class="px-8 py-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-8">Agenda General</h1>

        <!-- KPIs reales -->
        <div class="grid grid-cols-4 gap-6 mb-8">
          <div class="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <p class="text-xs text-gray-600 uppercase font-semibold">Citas hoy</p>
            <p class="text-3xl font-bold text-gray-800 mt-2">{{ citasHoy }}</p>
          </div>
          <div class="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <p class="text-xs text-gray-600 uppercase font-semibold">Pendientes</p>
            <p class="text-3xl font-bold text-yellow-600 mt-2">{{ citasPendientes }}</p>
          </div>
          <div class="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <p class="text-xs text-gray-600 uppercase font-semibold">Confirmadas</p>
            <p class="text-3xl font-bold text-green-600 mt-2">{{ citasConfirmadas }}</p>
          </div>
          <div class="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <p class="text-xs text-gray-600 uppercase font-semibold">Total citas</p>
            <p class="text-3xl font-bold text-gray-800 mt-2">{{ citas.length }}</p>
          </div>
        </div>

        <!-- Filtros -->
        <div class="mb-6 flex gap-4 items-center">
          <select [(ngModel)]="filtroEstilista" class="p-3 border border-gray-300 rounded-lg text-gray-700">
            <option value="todas">Todas las estilistas</option>
            <option *ngFor="let e of estilistas" [value]="e._id">{{ e.nombre }} {{ e.apellido }}</option>
          </select>
          <select [(ngModel)]="filtroEstado" class="p-3 border border-gray-300 rounded-lg text-gray-700">
            <option value="todos">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="en_progreso">En progreso</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>

        <!-- Tabla -->
        <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Fecha</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Hora</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Cliente</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Estilista</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Servicio</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Duración</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Estado</th>
                  <th class="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase">Acción</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr *ngIf="cargando">
                  <td colspan="8" class="px-6 py-8 text-center text-gray-400">Cargando citas...</td>
                </tr>
                <tr *ngIf="!cargando && citasFiltradas.length === 0">
                  <td colspan="8" class="px-6 py-8 text-center text-gray-400">Sin citas con los filtros seleccionados.</td>
                </tr>
                <tr *ngFor="let c of citasFiltradas" class="hover:bg-gray-50">
                  <td class="px-6 py-4"><p class="text-gray-700">{{ c.fecha | date:'dd/MM/yyyy':'UTC' }}</p></td>
                  <td class="px-6 py-4"><p class="font-semibold text-gray-800">{{ c.hora }}</p></td>
                  <td class="px-6 py-4"><p class="text-gray-700">{{ c.clienteId?.nombre }} {{ c.clienteId?.apellido }}</p></td>
                  <td class="px-6 py-4"><p class="text-gray-700">{{ c.estilistaId?.nombre }} {{ c.estilistaId?.apellido }}</p></td>
                  <td class="px-6 py-4"><p class="text-gray-700">{{ c.servicioId?.nombre }}</p></td>
                  <td class="px-6 py-4"><p class="text-gray-600">{{ c.duracion }} min</p></td>
                  <td class="px-6 py-4">
                    <span [class]="estadoClase(c.estado)" class="text-xs font-bold px-2 py-1 rounded capitalize">
                      {{ c.estado }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <select *ngIf="c.estado !== 'completada' && c.estado !== 'cancelada'"
                      (change)="cambiarEstado(c._id, $any($event.target).value)"
                      [value]="c.estado"
                      class="text-xs border border-gray-300 rounded p-1 focus:outline-none focus:border-red-500">
                      <option value="pendiente">Pendiente</option>
                      <option value="confirmada">Confirmada</option>
                      <option value="en_progreso">En progreso</option>
                      <option value="completada">Completada</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                    <span *ngIf="c.estado === 'completada' || c.estado === 'cancelada'"
                      class="text-xs text-gray-400">—</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AgendaGeneralComponent implements OnInit {
  estilistas: Usuario[] = [];
  citas: Cita[] = [];
  filtroEstilista = 'todas';
  filtroEstado = 'todos';
  cargando = true;

  constructor(
    private usuarioSvc: UsuarioService,
    private citaSvc: CitaService
  ) {}

  ngOnInit(): void {
    this.usuarioSvc.listarEstilistas().subscribe((data: Usuario[]) => {
      this.estilistas = data;
    });
    this.citaSvc.listarTodas().subscribe({
      next: (data: Cita[]) => { this.citas = data; this.cargando = false; },
      error: () => this.cargando = false
    });
  }

  get citasFiltradas(): Cita[] {
    return this.citas.filter(c => {
      const coincideEstilista = this.filtroEstilista === 'todas' ||
        (c.estilistaId?._id ?? c.estilistaId) === this.filtroEstilista;
      const coincideEstado = this.filtroEstado === 'todos' || c.estado === this.filtroEstado;
      return coincideEstilista && coincideEstado;
    });
  }

  get citasHoy(): number {
    const hoy = new Date().toISOString().slice(0, 10);
    return this.citas.filter(c => c.fecha?.slice(0, 10) === hoy).length;
  }

  get citasPendientes(): number {
    return this.citas.filter(c => c.estado === 'pendiente').length;
  }

  get citasConfirmadas(): number {
    return this.citas.filter(c => c.estado === 'confirmada').length;
  }

  estadoClase(estado: string): string {
    const mapa: Record<string, string> = {
      pendiente: 'bg-yellow-100 text-yellow-700',
      confirmada: 'bg-green-100 text-green-700',
      en_progreso: 'bg-blue-100 text-blue-700',
      completada: 'bg-gray-100 text-gray-600',
      cancelada: 'bg-red-100 text-red-700',
    };
    return mapa[estado] ?? 'bg-gray-100 text-gray-600';
  }

  cambiarEstado(id: string, estado: string): void {
    this.citaSvc.actualizarEstado(id, estado).subscribe((actualizada: Cita) => {
      this.citas = this.citas.map(c => c._id === id ? { ...c, estado: actualizada.estado } : c);
    });
  }
}
