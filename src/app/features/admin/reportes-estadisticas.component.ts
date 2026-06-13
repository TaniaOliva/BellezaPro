import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CitaService } from '../../core/services/cita.service';
import { UsuarioService } from '../../core/services/usuario.service';

interface KpiCard { label: string; valor: string; sub: string; icon: string; bg: string; color: string; }
interface BarMes { mes: string; count: number; pct: number; }
interface ServicioBar { nombre: string; count: number; pct: number; color: string; }
interface EstilistaRow { nombre: string; citas: number; calificacion: number; pct: number; }
interface ClienteRow { nombre: string; visitas: number; gasto: number; iniciales: string; }

const COLORES = ['#dc2626','#7c3aed','#2563eb','#059669','#d97706','#db2777'];
const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

@Component({
  selector: 'app-admin-reportes-estadisticas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white min-h-screen">
      <div class="px-8 py-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Reportes y Estadísticas</h1>
        <p class="text-gray-500 text-sm mb-8">Basado en todas las citas registradas en el sistema.</p>

        <!-- KPI Cards -->
        <div class="grid grid-cols-4 gap-5 mb-8">
          <div *ngFor="let k of kpis" class="bg-white border border-gray-200 rounded-xl p-5">
            <div class="flex items-center justify-between mb-3">
              <span class="text-gray-500 text-xs uppercase font-bold tracking-wide">{{ k.label }}</span>
              <div [class]="k.bg + ' rounded-lg p-2.5'">
                <span [class]="'material-symbols-outlined ' + k.color + ' text-xl'">{{ k.icon }}</span>
              </div>
            </div>
            <p class="text-3xl font-bold text-gray-800 mb-1">{{ k.valor }}</p>
            <p [class]="'text-xs font-semibold ' + k.color">{{ k.sub }}</p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-6 mb-6">

          <!-- Citas por mes (últimos 6 meses) -->
          <div class="col-span-2 bg-white border border-gray-200 rounded-xl p-6">
            <h3 class="text-base font-bold text-gray-800 mb-5">Citas por mes</h3>
            <div *ngIf="cargando" class="text-center py-8 text-gray-400 text-sm">Cargando...</div>
            <div *ngIf="!cargando && barMeses.length === 0" class="text-center py-8 text-gray-400 text-sm italic">Sin citas registradas.</div>
            <div *ngIf="!cargando && barMeses.length > 0">
              <div class="flex items-end gap-3 h-40 mb-2">
                <div *ngFor="let b of barMeses" class="flex-1 flex flex-col items-center gap-1">
                  <span class="text-xs font-bold text-gray-600">{{ b.count }}</span>
                  <div class="w-full bg-red-600 rounded-t transition-all"
                    [style.height.%]="b.pct || 4"
                    style="min-height:4px; max-height:100%"></div>
                </div>
              </div>
              <div class="flex gap-3">
                <div *ngFor="let b of barMeses" class="flex-1 text-center text-xs text-gray-400 font-medium">{{ b.mes }}</div>
              </div>
            </div>
          </div>

          <!-- Servicios más reservados -->
          <div class="bg-white border border-gray-200 rounded-xl p-6">
            <h3 class="text-base font-bold text-gray-800 mb-5">Servicios más reservados</h3>
            <div *ngIf="cargando" class="text-center py-8 text-gray-400 text-sm">Cargando...</div>
            <div *ngIf="!cargando && serviciosBar.length === 0" class="text-center py-8 text-gray-400 text-sm italic">Sin datos.</div>
            <div class="space-y-3">
              <div *ngFor="let s of serviciosBar; let i = index">
                <div class="flex justify-between text-xs mb-1">
                  <span class="font-semibold text-gray-700 truncate flex-1 mr-2">{{ s.nombre }}</span>
                  <span class="text-gray-500 shrink-0">{{ s.pct }}% · {{ s.count }} citas</span>
                </div>
                <div class="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div class="h-full rounded-full" [style.width.%]="s.pct" [style.background]="s.color"></div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div class="grid grid-cols-2 gap-6">

          <!-- Desempeño de estilistas -->
          <div class="bg-white border border-gray-200 rounded-xl p-6">
            <h3 class="text-base font-bold text-gray-800 mb-5">Desempeño de estilistas</h3>
            <div *ngIf="cargando" class="text-center py-8 text-gray-400 text-sm">Cargando...</div>
            <div *ngIf="!cargando && estilistas.length === 0" class="text-center py-8 text-gray-400 text-sm italic">Sin datos de estilistas.</div>
            <div class="space-y-4">
              <div *ngFor="let e of estilistas">
                <div class="flex items-baseline justify-between mb-1">
                  <span class="text-sm font-semibold text-gray-800 truncate flex-1 mr-2">{{ e.nombre }}</span>
                  <div class="flex items-center gap-3 shrink-0">
                    <span class="text-xs text-gray-400">{{ e.citas }} citas</span>
                    <span *ngIf="e.calificacion > 0" class="text-xs text-amber-500 font-bold flex items-center gap-0.5">
                      <span class="material-symbols-outlined text-xs">star</span>{{ e.calificacion | number:'1.1-1' }}
                    </span>
                  </div>
                </div>
                <div class="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                  <div class="h-full bg-red-600 rounded-full" [style.width.%]="e.pct"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Clientes principales -->
          <div class="bg-white border border-gray-200 rounded-xl p-6">
            <h3 class="text-base font-bold text-gray-800 mb-5">Clientes principales</h3>
            <div *ngIf="cargando" class="text-center py-8 text-gray-400 text-sm">Cargando...</div>
            <div *ngIf="!cargando && clientes.length === 0" class="text-center py-8 text-gray-400 text-sm italic">Sin clientes con reservas.</div>
            <div class="space-y-3">
              <div *ngFor="let c of clientes; let i = index"
                class="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                    [style.background]="COLORES[i % COLORES.length] + '22'"
                    [style.color]="COLORES[i % COLORES.length]">
                    {{ c.iniciales }}
                  </div>
                  <div>
                    <p class="font-semibold text-gray-800 text-sm">{{ c.nombre }}</p>
                    <p class="text-xs text-gray-400">{{ c.visitas }} visita{{ c.visitas !== 1 ? 's' : '' }}</p>
                  </div>
                </div>
                <span *ngIf="c.gasto > 0" class="text-red-600 font-bold text-sm">L. {{ c.gasto | number:'1.0-0' }}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class ReportesEstadisticasComponent implements OnInit {
  cargando = true;
  kpis: KpiCard[] = [];
  barMeses: BarMes[] = [];
  serviciosBar: ServicioBar[] = [];
  estilistas: EstilistaRow[] = [];
  clientes: ClienteRow[] = [];
  readonly COLORES = COLORES;

  constructor(
    private citaSvc: CitaService,
    private usuarioSvc: UsuarioService
  ) {}

  ngOnInit(): void {
    forkJoin({
      citas:      this.citaSvc.listarTodas().pipe(catchError(() => of([]))),
      estilistas: this.usuarioSvc.listarTodosEstilistas().pipe(catchError(() => of([]))),
    }).subscribe(({ citas, estilistas }) => {
      const all = citas as any[];
      const ests = estilistas as any[];
      this.calcularKpis(all, ests);
      this.calcularBarMeses(all);
      this.calcularServicios(all);
      this.calcularEstilistas(all, ests);
      this.calcularClientes(all);
      this.cargando = false;
    });
  }

  private calcularKpis(citas: any[], ests: any[]): void {
    const completadas = citas.filter(c => c.estado === 'completada');
    const ingresos = completadas.reduce((sum, c) => sum + (c.precioFinal ?? c.servicioId?.precioBase ?? 0), 0);
    const clientesUnicos = new Set(citas.map(c => typeof c.clienteId === 'object' ? c.clienteId?._id : c.clienteId)).size;
    const califs = ests.filter(e => e.calificacionPromedio > 0).map(e => e.calificacionPromedio);
    const promCalif = califs.length ? califs.reduce((s, v) => s + v, 0) / califs.length : 0;

    this.kpis = [
      {
        label: 'Ingresos totales',
        valor: ingresos > 0 ? `L. ${ingresos.toLocaleString('es-HN', { maximumFractionDigits: 0 })}` : 'L. 0',
        sub: `${completadas.length} citas completadas`,
        icon: 'trending_up', bg: 'bg-green-100', color: 'text-green-600'
      },
      {
        label: 'Citas completadas',
        valor: completadas.length.toString(),
        sub: `de ${citas.length} en total`,
        icon: 'check_circle', bg: 'bg-blue-100', color: 'text-blue-600'
      },
      {
        label: 'Clientes activos',
        valor: clientesUnicos.toString(),
        sub: 'con al menos 1 reserva',
        icon: 'group', bg: 'bg-purple-100', color: 'text-purple-600'
      },
      {
        label: 'Calificación promedio',
        valor: promCalif > 0 ? promCalif.toFixed(1) : '—',
        sub: califs.length > 0 ? `${califs.length} estilista${califs.length !== 1 ? 's' : ''} calificada${califs.length !== 1 ? 's' : ''}` : 'Sin calificaciones aún',
        icon: 'star', bg: 'bg-amber-100', color: 'text-amber-600'
      },
    ];
  }

  private calcularBarMeses(citas: any[]): void {
    const ahora = new Date();
    const meses: BarMes[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
      meses.push({ mes: MESES[d.getMonth()], count: 0, pct: 0 });
    }
    for (const c of citas) {
      const fecha = new Date(c.creadoEn || c.fecha);
      const diff = (ahora.getFullYear() - fecha.getFullYear()) * 12 + (ahora.getMonth() - fecha.getMonth());
      if (diff >= 0 && diff < 6) meses[5 - diff].count++;
    }
    const max = Math.max(...meses.map(m => m.count), 1);
    meses.forEach(m => m.pct = Math.round(m.count / max * 100));
    this.barMeses = meses;
  }

  private calcularServicios(citas: any[]): void {
    const map = new Map<string, number>();
    for (const c of citas) {
      const nombre = c.servicioId?.nombre ?? 'Sin servicio';
      map.set(nombre, (map.get(nombre) ?? 0) + 1);
    }
    const total = citas.length || 1;
    this.serviciosBar = Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([nombre, count], i) => ({
        nombre, count,
        pct: Math.round(count / total * 100),
        color: COLORES[i % COLORES.length]
      }));
  }

  private calcularEstilistas(citas: any[], ests: any[]): void {
    const map = new Map<string, number>();
    for (const c of citas) {
      const id = typeof c.estilistaId === 'object' ? c.estilistaId?._id : c.estilistaId;
      if (id) map.set(id, (map.get(id) ?? 0) + 1);
    }
    const maxCitas = Math.max(...Array.from(map.values()), 1);
    this.estilistas = ests
      .filter(e => map.has(e._id))
      .map(e => ({
        nombre: `${e.nombre} ${e.apellido ?? ''}`.trim(),
        citas: map.get(e._id) ?? 0,
        calificacion: e.calificacionPromedio ?? 0,
        pct: Math.round((map.get(e._id) ?? 0) / maxCitas * 100)
      }))
      .sort((a, b) => b.citas - a.citas)
      .slice(0, 5);
  }

  private calcularClientes(citas: any[]): void {
    const map = new Map<string, { nombre: string; visitas: number; gasto: number }>();
    for (const c of citas) {
      if (!c.clienteId) continue;
      const id = typeof c.clienteId === 'object' ? c.clienteId._id : c.clienteId;
      const nombre = typeof c.clienteId === 'object'
        ? `${c.clienteId.nombre} ${c.clienteId.apellido ?? ''}`.trim()
        : 'Cliente';
      const entry = map.get(id) ?? { nombre, visitas: 0, gasto: 0 };
      entry.visitas++;
      entry.gasto += c.precioFinal ?? c.servicioId?.precioBase ?? 0;
      map.set(id, entry);
    }
    this.clientes = Array.from(map.values())
      .sort((a, b) => b.visitas - a.visitas)
      .slice(0, 5)
      .map(c => ({
        nombre: c.nombre,
        visitas: c.visitas,
        gasto: c.gasto,
        iniciales: c.nombre.split(' ').slice(0, 2).map((p: string) => p[0]?.toUpperCase() ?? '').join('')
      }));
  }
}
