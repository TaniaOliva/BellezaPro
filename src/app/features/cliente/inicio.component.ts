import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CitaService } from '../../core/services/cita.service';
import { ServicioService } from '../../core/services/servicio.service';
import { AuthService } from '../../core/services/auth.service';
import { BookingService } from '../../core/services/booking.service';
import { Cita, Servicio } from '../../core/models';

@Component({
  selector: 'app-cliente-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-white min-h-screen">
      <!-- Banner bienvenida -->
      <div class="bg-red-50 px-8 py-12 rounded-none">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">Bienvenida, {{ nombreUsuario }}</h1>
        <p class="text-gray-600">Que servicio te apetece hoy?</p>
      </div>

      <div class="px-8 py-8 space-y-8">
        <!-- Cards de info -->
        <div class="grid grid-cols-3 gap-6">
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <span class="material-symbols-outlined text-red-600 text-2xl">calendar_today</span>
            </div>
            <p class="text-xs text-gray-500 uppercase tracking-wider mb-2">Proxima cita</p>
            <ng-container *ngIf="proximaCita; else sinCita">
              <p class="text-2xl font-bold text-gray-800 mb-1">{{ proximaCita.fecha | date:'d MMM':'UTC' }}</p>
              <p class="text-sm text-gray-600 mb-4">
                {{ proximaCita.servicioId?.nombre ?? 'Servicio' }}
                <ng-container *ngIf="proximaCita.estilistaId?.nombre"> · {{ proximaCita.estilistaId.nombre }}</ng-container>
              </p>
            </ng-container>
            <ng-template #sinCita>
              <p class="text-2xl font-bold text-gray-800 mb-1">Sin citas próximas</p>
              <p class="text-sm text-gray-600 mb-4">¡Agenda tu próxima visita!</p>
            </ng-template>
            <a routerLink="/cliente/mis-citas" class="text-red-600 font-semibold text-sm hover:underline">Ver detalles →</a>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <span class="material-symbols-outlined text-red-600 text-2xl">content_cut</span>
            </div>
            <p class="text-xs text-gray-500 uppercase tracking-wider mb-2">Citas este mes</p>
            <p class="text-2xl font-bold text-gray-800">{{ citasEsteMes }}</p>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <span class="material-symbols-outlined text-red-600 text-2xl">star</span>
            </div>
            <p class="text-xs text-gray-500 uppercase tracking-wider mb-2">Mi calificacion</p>
            <ng-container *ngIf="calificacion > 0; else sinCalificacion">
              <div class="flex items-center gap-2">
                <p class="text-2xl font-bold text-gray-800">{{ calificacion | number:'1.1-1' }}</p>
                <div class="flex gap-0.5 text-amber-400">
                  <span *ngFor="let s of estrellasLlenas" class="material-symbols-outlined text-lg">star</span>
                  <span *ngIf="tieneMediaEstrella" class="material-symbols-outlined text-lg">star_half</span>
                </div>
              </div>
            </ng-container>
            <ng-template #sinCalificacion>
              <p class="text-2xl font-bold text-gray-800">0</p>
              <p class="text-sm text-gray-400 mt-1">Sin calificaciones aun</p>
            </ng-template>
          </div>
        </div>

        <!-- Servicios populares -->
        <div>
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Servicios populares</h2>
            <a routerLink="/cliente/servicios" class="text-red-600 font-semibold text-sm">Ver todos</a>
          </div>
          <div class="grid grid-cols-4 gap-6">
            <div *ngFor="let s of serviciosPopulares" class="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition">
              <div class="relative bg-gray-200 h-48">
                <span class="absolute top-3 left-3 bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full uppercase">Popular</span>
              </div>
              <div class="p-5">
                <p class="text-xs text-gray-500 uppercase mb-2">{{ s.categoria }}</p>
                <p class="text-lg font-bold text-gray-800 mb-2">{{ s.nombre }}</p>
                <p class="text-sm text-gray-600 mb-4">Desde L. {{ s.precioBase }}</p>
                <button (click)="agendar(s)" class="w-full text-red-600 border border-red-600 rounded-lg py-2 font-semibold hover:bg-red-50 transition">Agendar</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Mis últimas citas -->
        <div>
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Mis últimas citas</h2>
            <a routerLink="/cliente/mis-citas" class="text-red-600 font-semibold text-sm">Ver todas</a>
          </div>

          <ng-container *ngIf="ultimasCitas.length > 0; else sinHistorial">
            <div class="grid grid-cols-3 gap-6">
              <div *ngFor="let c of ultimasCitas" class="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition">
                <div class="flex justify-between items-start mb-3">
                  <p class="text-lg font-bold text-gray-800">{{ c.servicioId?.nombre ?? 'Servicio' }}</p>
                  <span [class]="badgeEstado(c.estado)">{{ c.estado }}</span>
                </div>
                <p class="text-sm text-gray-500 mb-1">
                  <span class="material-symbols-outlined text-xs align-middle mr-1">person</span>
                  {{ c.estilistaId?.nombre ?? 'Estilista' }} {{ c.estilistaId?.apellido ?? '' }}
                </p>
                <p class="text-sm text-gray-500 mb-4">
                  <span class="material-symbols-outlined text-xs align-middle mr-1">calendar_today</span>
                  {{ c.fecha | date:'d MMM yyyy':'UTC' }} · {{ c.hora }}
                </p>
                <button (click)="agendarDesdeCita(c)" class="w-full bg-red-600 text-white rounded-lg py-2 font-semibold hover:bg-red-700 transition text-sm">
                  Agendar de nuevo
                </button>
              </div>
            </div>
          </ng-container>

          <ng-template #sinHistorial>
            <div class="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
              <span class="material-symbols-outlined text-gray-300 text-5xl block mb-3">history</span>
              <p class="text-gray-500">Aun no tienes citas registradas</p>
              <a routerLink="/cliente/servicios" class="text-red-600 font-semibold text-sm mt-2 inline-block hover:underline">Agenda tu primera cita →</a>
            </div>
          </ng-template>
        </div>

        <!-- Busca algo especial -->
        <div class="bg-red-50 border-l-4 border-red-600 rounded-lg p-6">
          <div class="flex gap-4">
            <span class="material-symbols-outlined text-red-600 text-4xl flex-shrink-0">auto_awesome</span>
            <div>
              <p class="text-xl font-bold text-gray-800 mb-1">¿Buscas algo especial?</p>
              <p class="text-gray-600 mb-4">Paquetes nuevos, eventos o consultas personalizadas.</p>
              <a routerLink="/cliente/solicitud-especial" class="text-red-600 font-semibold text-sm hover:underline">Crear solicitud especial →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class InicioComponent implements OnInit {
  proximaCita: Cita | null = null;
  citasEsteMes = 0;
  ultimasCitas: Cita[] = [];
  serviciosPopulares: Servicio[] = [];
  nombreUsuario = '';
  calificacion = 0;
  estrellasLlenas: number[] = [];
  tieneMediaEstrella = false;

  constructor(
    private citaSvc: CitaService,
    private servicioSvc: ServicioService,
    private auth: AuthService,
    private bookingSvc: BookingService,
    private router: Router
  ) {}

  agendar(servicio: Servicio): void {
    this.bookingSvc.preseleccionarServicio(servicio);
    this.router.navigate(['/cliente/servicios/opciones']);
  }

  agendarDesdeCita(cita: Cita): void {
    const id = cita.servicioId?._id ?? cita.servicioId;
    this.servicioSvc.obtener(id).subscribe(servicio => {
      this.bookingSvc.preseleccionarServicio(servicio);
      this.router.navigate(['/cliente/servicios/opciones']);
    });
  }

  badgeEstado(estado: string): string {
    const base = 'text-xs font-semibold px-2 py-0.5 rounded-full';
    const colores: Record<string, string> = {
      pendiente:    `${base} bg-yellow-100 text-yellow-700`,
      confirmada:   `${base} bg-blue-100 text-blue-700`,
      en_progreso:  `${base} bg-orange-100 text-orange-700`,
      completada:   `${base} bg-green-100 text-green-700`,
      cancelada:    `${base} bg-gray-100 text-gray-500`,
    };
    return colores[estado] ?? `${base} bg-gray-100 text-gray-500`;
  }

  private actualizarEstrellas(): void {
    this.estrellasLlenas = Array(Math.floor(this.calificacion)).fill(0);
    this.tieneMediaEstrella = (this.calificacion % 1) >= 0.5;
  }

  ngOnInit(): void {
    const usuario = this.auth.getUsuario();
    this.nombreUsuario = usuario?.nombre ?? 'Cliente';

    this.auth.obtenerPerfil().subscribe(perfil => {
      this.calificacion = perfil.calificacionPromedio ?? 0;
      this.actualizarEstrellas();
      this.auth.actualizarUsuario({ calificacionPromedio: this.calificacion });
    });

    this.citaSvc.misCitas().subscribe((citas: Cita[]) => {
      const ordenadas = [...citas].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      this.ultimasCitas = ordenadas.slice(0, 3);

      const activas = citas.filter((c: Cita) => ['pendiente', 'confirmada'].includes(c.estado));
      this.proximaCita = activas.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())[0] ?? null;

      const hoy = new Date();
      this.citasEsteMes = citas.filter((c: Cita) => {
        const f = new Date(c.fecha);
        return f.getMonth() === hoy.getMonth() && f.getFullYear() === hoy.getFullYear();
      }).length;
    });

    this.servicioSvc.listarPopulares().subscribe((svcs: Servicio[]) => {
      this.serviciosPopulares = svcs;
    });
  }
}
