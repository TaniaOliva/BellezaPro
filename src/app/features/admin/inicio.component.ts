import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UsuarioService } from '../../core/services/usuario.service';
import { ServicioService } from '../../core/services/servicio.service';
import { CitaService } from '../../core/services/cita.service';
import { SolicitudService } from '../../core/services/solicitud.service';
import { ReporteService } from '../../core/services/reporte.service';
import { Servicio, SolicitudEspecial, ReporteCliente } from '../../core/models';

interface Tarea { tipo: 'solicitud' | 'reporte'; texto: string; fecha: string; }
interface EstilistaUso { nombre: string; reservas: number; porcentaje: number; }
interface ClienteFrecuente { nombre: string; reservas: number; }
interface ActividadItem { tipo: string; texto: string; hora: string; color: string; }

@Component({
  selector: 'app-admin-inicio',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white min-h-screen">
      <div class="px-8 py-8">

        <!-- Header + métricas -->
        <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-800">Panel de administración</h1>
            <p class="text-gray-600 mt-2">Resumen rápido de la operación y métricas clave.</p>
          </div>
          <div class="grid grid-cols-5 gap-4">
            <div class="bg-red-50 border border-red-100 rounded-lg p-4 text-center">
              <p class="text-xs uppercase text-gray-500 font-semibold">Empleadas</p>
              <p class="text-2xl font-bold text-gray-800 mt-2">{{ totalEmpleadas }}</p>
            </div>
            <div class="bg-red-50 border border-red-100 rounded-lg p-4 text-center">
              <p class="text-xs uppercase text-gray-500 font-semibold">Clientes</p>
              <p class="text-2xl font-bold text-gray-800 mt-2">{{ totalClientes }}</p>
            </div>
            <div class="bg-red-50 border border-red-100 rounded-lg p-4 text-center">
              <p class="text-xs uppercase text-gray-500 font-semibold">Servicios</p>
              <p class="text-2xl font-bold text-gray-800 mt-2">{{ totalServicios }}</p>
            </div>
            <div class="bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-center">
              <p class="text-xs uppercase text-gray-500 font-semibold">Solicitudes</p>
              <p class="text-2xl font-bold text-yellow-700 mt-2">{{ solicitudesPendientes }}</p>
            </div>
            <div class="bg-orange-50 border border-orange-100 rounded-lg p-4 text-center">
              <p class="text-xs uppercase text-gray-500 font-semibold">Reportes</p>
              <p class="text-2xl font-bold text-orange-700 mt-2">{{ reportesPendientes }}</p>
            </div>
          </div>
        </div>

        <!-- Fila media: actividad + próximas tareas -->
        <div class="grid grid-cols-3 gap-6 mb-6">

          <!-- Actividad reciente (citas) -->
          <div class="col-span-2 bg-white border border-gray-200 rounded-lg p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Actividad reciente</h2>

            <div *ngIf="cargando" class="text-sm text-gray-400 text-center py-6">Cargando...</div>

            <div *ngIf="!cargando && actividadReciente.length === 0"
              class="text-sm text-gray-400 italic text-center py-6">
              Sin actividad reciente.
            </div>

            <div class="space-y-3">
              <div *ngFor="let a of actividadReciente"
                class="flex items-center justify-between gap-4 rounded-lg border border-gray-100 p-4">
                <div>
                  <p class="text-xs text-gray-400 uppercase font-semibold mb-0.5">{{ a.tipo }}</p>
                  <p class="font-semibold text-gray-800 text-sm">{{ a.texto }}</p>
                </div>
                <span [class]="a.color" class="text-xs uppercase font-semibold whitespace-nowrap">{{ a.hora }}</span>
              </div>
            </div>
          </div>

          <!-- Próximas tareas: solicitudes + reportes pendientes (máx 4) -->
          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Próximas tareas</h2>

            <div *ngIf="cargando" class="text-sm text-gray-400 text-center py-6">Cargando...</div>

            <div *ngIf="!cargando && proximasTareas.length === 0"
              class="text-sm text-gray-400 italic text-center py-6">
              Sin tareas pendientes.
            </div>

            <div class="space-y-3">
              <div *ngFor="let t of proximasTareas"
                [class]="t.tipo === 'solicitud' ? 'rounded-lg bg-yellow-50 border border-yellow-100 p-4' : 'rounded-lg bg-orange-50 border border-orange-100 p-4'">
                <div class="flex items-start gap-2">
                  <span class="material-symbols-outlined text-base mt-0.5"
                    [class]="t.tipo === 'solicitud' ? 'text-yellow-600' : 'text-orange-600'">
                    {{ t.tipo === 'solicitud' ? 'star' : 'flag' }}
                  </span>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-bold uppercase mb-0.5"
                      [class]="t.tipo === 'solicitud' ? 'text-yellow-600' : 'text-orange-600'">
                      {{ t.tipo === 'solicitud' ? 'Solicitud especial' : 'Reporte' }}
                    </p>
                    <p class="text-sm text-gray-700 leading-snug line-clamp-2">{{ t.texto }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Fila inferior: utilización · servicios · clientes frecuentes -->
        <div class="grid grid-cols-3 gap-6">

          <!-- Estilistas más reservadas (% del total de citas) -->
          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <p class="text-sm uppercase text-gray-500 font-semibold mb-4">Estilistas más reservadas</p>

            <div *ngIf="cargando" class="text-sm text-gray-400 text-center py-4">Cargando...</div>

            <div *ngIf="!cargando && estilistaUso.length === 0"
              class="text-sm text-gray-400 italic text-center py-4">
              Sin reservas registradas.
            </div>

            <div class="space-y-4">
              <div *ngFor="let e of estilistaUso">
                <div class="flex justify-between items-baseline mb-1">
                  <span class="text-sm font-semibold text-gray-800 truncate flex-1 mr-2">{{ e.nombre }}</span>
                  <span class="text-xs text-gray-500 shrink-0">{{ e.porcentaje }}%</span>
                </div>
                <div class="h-2.5 rounded-full bg-gray-200 overflow-hidden">
                  <div class="h-full bg-red-600 rounded-full transition-all duration-500"
                    [style.width.%]="e.porcentaje"></div>
                </div>
                <p class="text-xs text-gray-400 mt-0.5">{{ e.reservas }} reserva{{ e.reservas !== 1 ? 's' : '' }}</p>
              </div>
            </div>
          </div>

          <!-- Servicios más reservados -->
          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <p class="text-sm uppercase text-gray-500 font-semibold mb-4">Servicios más reservados</p>

            <div *ngIf="cargando" class="text-sm text-gray-400 text-center py-4">Cargando...</div>

            <div *ngIf="!cargando && serviciosPopulares.length === 0"
              class="text-sm text-gray-400 italic text-center py-4">
              Sin datos de servicios aún.
            </div>

            <div class="space-y-3">
              <div *ngFor="let s of serviciosPopulares; let i = index"
                class="flex items-center gap-3">
                <span class="w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center shrink-0">
                  {{ i + 1 }}
                </span>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-800 truncate">{{ s.nombre }}</p>
                  <p class="text-xs text-gray-400">{{ s.categoria }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Clientes frecuentes -->
          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <p class="text-sm uppercase text-gray-500 font-semibold mb-4">Clientes frecuentes</p>

            <div *ngIf="cargando" class="text-sm text-gray-400 text-center py-4">Cargando...</div>

            <div *ngIf="!cargando && clientesFrecuentes.length === 0"
              class="text-sm text-gray-400 italic text-center py-4">
              Sin reservas de clientes aún.
            </div>

            <div class="space-y-3">
              <div *ngFor="let c of clientesFrecuentes; let i = index"
                class="flex items-center gap-3">
                <span class="w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center shrink-0">
                  {{ iniciales(c.nombre) }}
                </span>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-800 truncate">{{ c.nombre }}</p>
                  <p class="text-xs text-gray-400">{{ c.reservas }} reserva{{ c.reservas !== 1 ? 's' : '' }}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class InicioComponent implements OnInit {
  totalEmpleadas = 0;
  totalClientes = 0;
  totalServicios = 0;
  solicitudesPendientes = 0;
  reportesPendientes = 0;
  cargando = true;

  actividadReciente: ActividadItem[] = [];
  proximasTareas: Tarea[] = [];
  estilistaUso: EstilistaUso[] = [];
  clientesFrecuentes: ClienteFrecuente[] = [];
  serviciosPopulares: Servicio[] = [];

  constructor(
    private usuarioSvc: UsuarioService,
    private servicioSvc: ServicioService,
    private citaSvc: CitaService,
    private solicitudSvc: SolicitudService,
    private reporteSvc: ReporteService
  ) {}

  ngOnInit(): void {
    forkJoin({
      citas:      this.citaSvc.listarTodas().pipe(catchError(() => of([]))),
      solicitudes: this.solicitudSvc.listarPendientes().pipe(catchError(() => of([]))),
      reportes:   this.reporteSvc.listarPendientes().pipe(catchError(() => of([]))),
      servicios:  this.servicioSvc.listarPopulares().pipe(catchError(() => of([]))),
      estilistas: this.usuarioSvc.listarTodosEstilistas().pipe(catchError(() => of([]))),
      clientes:   this.usuarioSvc.listarClientes().pipe(catchError(() => of([]))),
      todosServ:  this.servicioSvc.listarAdmin().pipe(catchError(() => of([]))),
    }).subscribe(({ citas, solicitudes, reportes, servicios, estilistas, clientes, todosServ }) => {

      this.totalEmpleadas = estilistas.length;
      this.totalClientes  = clientes.length;
      this.totalServicios = todosServ.length;
      this.solicitudesPendientes = (solicitudes as SolicitudEspecial[]).length;
      this.reportesPendientes    = (reportes as ReporteCliente[]).length;

      // ── Actividad reciente: últimas 4 citas ─────────────────
      this.actividadReciente = (citas as any[]).slice(0, 4).map(c => {
        const cliente   = c.clienteId?.nombre  ? `${c.clienteId.nombre} ${c.clienteId.apellido ?? ''}`.trim() : 'Cliente';
        const servicio  = c.servicioId?.nombre ?? 'servicio';
        const estilista = c.estilistaId?.nombre ? `${c.estilistaId.nombre} ${c.estilistaId.apellido ?? ''}`.trim() : '';
        const estadoColor: Record<string, string> = {
          pendiente:   'text-yellow-600',
          confirmada:  'text-green-600',
          cancelada:   'text-red-600',
          completada:  'text-gray-500',
        };
        return {
          tipo: 'Nueva cita',
          texto: `${cliente} reservó ${servicio}${estilista ? ' con ' + estilista : ''}`,
          hora: this.tiempoRelativo(c.creadoEn),
          color: estadoColor[c.estado] ?? 'text-gray-500',
        };
      });

      // ── Próximas tareas: solicitudes + reportes pendientes (máx 4) ──
      const tareasS: Tarea[] = (solicitudes as SolicitudEspecial[]).map(s => ({
        tipo: 'solicitud' as const,
        texto: s.descripcion || s.categoria || 'Solicitud especial sin descripción',
        fecha: s.creadoEn,
      }));
      const tareasR: Tarea[] = (reportes as ReporteCliente[]).map(r => ({
        tipo: 'reporte' as const,
        texto: r.motivo || r.descripcion || 'Reporte sin detalle',
        fecha: r.creadoEn,
      }));
      this.proximasTareas = [...tareasS, ...tareasR]
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
        .slice(0, 4);

      // ── Estilistas más reservadas (% del total de citas) ────
      const usoPorEst = new Map<string, { nombre: string; count: number }>();
      for (const c of citas as any[]) {
        if (!c.estilistaId) continue;
        const id     = typeof c.estilistaId === 'string' ? c.estilistaId : c.estilistaId._id;
        const nombre = typeof c.estilistaId === 'object'
          ? `${c.estilistaId.nombre} ${c.estilistaId.apellido ?? ''}`.trim()
          : 'Estilista';
        const entry  = usoPorEst.get(id) ?? { nombre, count: 0 };
        entry.count++;
        usoPorEst.set(id, entry);
      }
      const totalCitas = (citas as any[]).length || 1;
      this.estilistaUso = Array.from(usoPorEst.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .map(e => ({ nombre: e.nombre, reservas: e.count, porcentaje: Math.round(e.count / totalCitas * 100) }));

      // ── Clientes frecuentes (top 4 por reservas) ────────────
      const usoPorCli = new Map<string, { nombre: string; count: number }>();
      for (const c of citas as any[]) {
        if (!c.clienteId) continue;
        const id     = typeof c.clienteId === 'string' ? c.clienteId : c.clienteId._id;
        const nombre = typeof c.clienteId === 'object'
          ? `${c.clienteId.nombre} ${c.clienteId.apellido ?? ''}`.trim()
          : 'Cliente';
        const entry  = usoPorCli.get(id) ?? { nombre, count: 0 };
        entry.count++;
        usoPorCli.set(id, entry);
      }
      this.clientesFrecuentes = Array.from(usoPorCli.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 4)
        .map(e => ({ nombre: e.nombre, reservas: e.count }));

      // ── Servicios populares ──────────────────────────────────
      this.serviciosPopulares = (servicios as Servicio[]).slice(0, 4);

      this.cargando = false;
    });
  }

  iniciales(nombre: string): string {
    return nombre.split(' ').slice(0, 2).map(p => p[0]?.toUpperCase() ?? '').join('');
  }

  tiempoRelativo(fecha: string): string {
    const diff = Date.now() - new Date(fecha).getTime();
    const min  = Math.floor(diff / 60000);
    if (min < 1)   return 'Ahora';
    if (min < 60)  return `Hace ${min} min`;
    const h = Math.floor(min / 60);
    if (h < 24)    return `Hace ${h} h`;
    const d = Math.floor(h / 24);
    return `Hace ${d} día${d !== 1 ? 's' : ''}`;
  }
}
