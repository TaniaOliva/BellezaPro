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
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
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

      this.serviciosPopulares = (servicios as Servicio[]).filter(s => (s.contadorSemana ?? 0) > 0).slice(0, 4);

      this.cargando = false;
    });
  }

  iniciales(nombre: string): string {
    return nombre.split(' ').slice(0, 2).map(p => p[0]?.toUpperCase() ?? '').join('');
  }

  tiempoRelativo(fecha: string): string {
    const diff = Date.now() - new Date(fecha).getTime();
    const min  = Math.floor(diff / 60000);
    if (min < 1)  return 'Ahora';
    if (min < 60) return `Hace ${min} min`;
    const h = Math.floor(min / 60);
    if (h < 24)   return `Hace ${h} h`;
    const d = Math.floor(h / 24);
    return `Hace ${d} día${d !== 1 ? 's' : ''}`;
  }
}
