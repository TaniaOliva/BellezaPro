import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CitaService } from '../../../core/services/cita.service';
import { UsuarioService } from '../../../core/services/usuario.service';

interface KpiCard { label: string; valor: string; sub: string; icon: string; bg: string; color: string; }
interface BarMes { mes: string; count: number; pct: number; }
interface ServicioBar { nombre: string; count: number; pct: number; color: string; }
interface EstilistaRow { nombre: string; citas: number; calificacion: number; pct: number; }
interface ClienteRow { nombre: string; visitas: number; gasto: number; iniciales: string; }

const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

@Component({
  selector: 'app-admin-reportes-estadisticas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes-estadisticas.component.html',
  styleUrl: './reportes-estadisticas.component.css'
})
export class ReportesEstadisticasComponent implements OnInit {
  cargando = true;
  kpis: KpiCard[] = [];
  barMeses: BarMes[] = [];
  serviciosBar: ServicioBar[] = [];
  estilistas: EstilistaRow[] = [];
  clientes: ClienteRow[] = [];

  readonly COLORES = ['#dc2626','#7c3aed','#2563eb','#059669','#d97706','#db2777'];

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
    const completadas = citas.filter(c => c.estado === 'terminada');
    const ingresos = completadas.reduce((sum, c) => sum + (c.precioFinal ?? c.servicioId?.precioBase ?? 0), 0);
    const clientesUnicos = new Set(citas.map(c => typeof c.clienteId === 'object' ? c.clienteId?._id : c.clienteId)).size;
    const califs = ests.filter(e => e.calificacionPromedio > 0).map(e => e.calificacionPromedio);
    const promCalif = califs.length ? califs.reduce((s, v) => s + v, 0) / califs.length : 0;

    this.kpis = [
      {
        label: 'Ingresos totales',
        valor: ingresos > 0 ? `L. ${ingresos.toLocaleString('es-HN', { maximumFractionDigits: 0 })}` : 'L. 0',
        sub: `${completadas.length} citas terminadas`,
        icon: 'trending_up', bg: 'bg-green-100', color: 'text-green-600'
      },
      {
        label: 'Citas terminadas',
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
    // Se agrupa por mes calendario en UTC (así el bucket no se corre por la
    // diferencia horaria de Honduras). Campo: createdAt, con fecha como respaldo.
    const ahora = new Date();
    const anioAhora = ahora.getUTCFullYear();
    const mesAhora = ahora.getUTCMonth();
    const meses: BarMes[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(Date.UTC(anioAhora, mesAhora - i, 1));
      meses.push({ mes: MESES[d.getUTCMonth()], count: 0, pct: 0 });
    }
    for (const c of citas) {
      const fecha = new Date(c.createdAt ?? c.fecha);
      const diff = (anioAhora - fecha.getUTCFullYear()) * 12 + (mesAhora - fecha.getUTCMonth());
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
        color: this.COLORES[i % this.COLORES.length]
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
