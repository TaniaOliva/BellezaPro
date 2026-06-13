import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitaService } from '../../core/services/cita.service';
import { Cita } from '../../core/models';

@Component({
  selector: 'app-estilista-agenda',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white min-h-screen">
      <div class="bg-red-50 px-8 py-6 border-b border-gray-200">
        <h1 class="text-2xl font-bold text-gray-800">Mi Agenda</h1>
        <p class="text-gray-600 text-sm mt-1 capitalize">{{ hoyFormateado }}</p>
      </div>

      <div class="px-8 py-8 space-y-10">

        <!-- ── Citas de hoy ─────────────────────────────────── -->
        <section>
          <div class="flex items-center gap-3 mb-4">
            <h2 class="text-xl font-bold text-gray-800">Citas de hoy</h2>
            <span class="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{{ citasHoy.length }}</span>
          </div>

          <div *ngIf="cargando" class="text-gray-400 text-sm py-6 text-center">Cargando...</div>

          <div *ngIf="!cargando && citasHoy.length === 0" class="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-8 text-center">
            <span class="material-symbols-outlined text-gray-300 text-4xl block mb-2">event_available</span>
            <p class="text-gray-400 text-sm">No tienes citas para hoy</p>
          </div>

          <div class="space-y-3">
            <div *ngFor="let c of citasHoy" class="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between hover:shadow-sm transition">
              <div class="flex items-center gap-4">
                <div class="text-center w-14">
                  <p class="text-lg font-bold text-gray-800">{{ c.hora }}</p>
                  <p class="text-xs text-gray-400">{{ c.servicioId?.duracion ?? '-' }} min</p>
                </div>
                <div class="w-px h-10 bg-gray-200"></div>
                <div>
                  <p class="font-semibold text-gray-800">{{ c.clienteId?.nombre }} {{ c.clienteId?.apellido }}</p>
                  <p class="text-sm text-gray-500">{{ c.servicioId?.nombre }}</p>
                  <p *ngIf="c.notas" class="text-xs text-gray-400 italic mt-0.5">"{{ c.notas }}"</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span [class]="badgeEstado(c.estado)">{{ etiquetaEstado(c.estado) }}</span>
                <div class="flex gap-2">
                  <button *ngIf="c.estado === 'confirmada'"
                    (click)="cambiarEstado(c, 'en_progreso')"
                    class="text-xs font-semibold px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    En progreso
                  </button>
                  <button *ngIf="c.estado === 'en_progreso'"
                    (click)="cambiarEstado(c, 'completada')"
                    class="text-xs font-semibold px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                    Completar
                  </button>
                  <button *ngIf="c.estado === 'confirmada' || c.estado === 'en_progreso'"
                    (click)="confirmarCancelar(c)"
                    class="text-xs font-semibold px-3 py-1.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition">
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ── Próximas citas ───────────────────────────────── -->
        <section>
          <div class="flex items-center gap-3 mb-4">
            <h2 class="text-xl font-bold text-gray-800">Próximas citas</h2>
            <span class="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">{{ citasProximas.length }}</span>
          </div>

          <div *ngIf="!cargando && citasProximas.length === 0" class="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-8 text-center">
            <span class="material-symbols-outlined text-gray-300 text-4xl block mb-2">calendar_month</span>
            <p class="text-gray-400 text-sm">No tienes citas próximas agendadas</p>
          </div>

          <div class="space-y-3">
            <div *ngFor="let c of citasProximas" class="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between hover:shadow-sm transition">
              <div class="flex items-center gap-4">
                <div class="text-center w-14">
                  <p class="text-sm font-bold text-gray-500">{{ c.fecha | date:'d MMM':'UTC' }}</p>
                  <p class="text-lg font-bold text-red-600">{{ c.hora }}</p>
                </div>
                <div class="w-px h-10 bg-gray-200"></div>
                <div>
                  <p class="font-semibold text-gray-800">{{ c.clienteId?.nombre }} {{ c.clienteId?.apellido }}</p>
                  <p class="text-sm text-gray-500">{{ c.servicioId?.nombre }}</p>
                  <p class="text-xs text-gray-400">{{ c.clienteId?.telefono }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span [class]="badgeEstado(c.estado)">{{ etiquetaEstado(c.estado) }}</span>
                <button (click)="confirmarCancelar(c)"
                  class="text-xs font-semibold px-3 py-1.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- ── Canceladas hoy ───────────────────────────────── -->
        <section *ngIf="!cargando && citasCanceladasHoy.length > 0">
          <div class="flex items-center gap-3 mb-4">
            <h2 class="text-xl font-bold text-gray-800">Canceladas hoy</h2>
            <span class="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-0.5 rounded-full">{{ citasCanceladasHoy.length }}</span>
          </div>

          <div class="space-y-3">
            <div *ngFor="let c of citasCanceladasHoy" class="bg-gray-50 border border-gray-200 rounded-xl p-5 flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="text-center w-14">
                  <p class="text-lg font-bold text-gray-400">{{ c.hora }}</p>
                  <p class="text-xs text-gray-400">{{ c.servicioId?.duracion ?? '-' }} min</p>
                </div>
                <div class="w-px h-10 bg-gray-300"></div>
                <div>
                  <p class="font-semibold text-gray-500">{{ c.clienteId?.nombre }} {{ c.clienteId?.apellido }}</p>
                  <p class="text-sm text-gray-400">{{ c.servicioId?.nombre }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span [class]="badgeEstado(c.estado)">Cancelada</span>
                <button (click)="cambiarEstado(c, 'en_progreso')"
                  class="text-xs font-semibold px-3 py-1.5 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition">
                  En progreso
                </button>
                <button (click)="cambiarEstado(c, 'completada')"
                  class="text-xs font-semibold px-3 py-1.5 border border-green-300 text-green-600 rounded-lg hover:bg-green-50 transition">
                  Completada
                </button>
              </div>
            </div>
          </div>
          <p class="text-xs text-gray-400 mt-3">Las citas auto-canceladas por inactividad aparecen aquí. Puedes corregir su estado si fue un error.</p>
        </section>

      </div>

      <!-- Modal confirmar cancelación -->
      <div *ngIf="citaACancelar" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
          <h3 class="text-lg font-bold text-gray-800 mb-2">¿Cancelar cita?</h3>
          <p class="text-sm text-gray-500 mb-6">
            Se cancelará la cita de
            <strong>{{ citaACancelar.clienteId?.nombre }}</strong>
            a las <strong>{{ citaACancelar.hora }}</strong>.
          </p>
          <div class="flex gap-3">
            <button (click)="citaACancelar = null" class="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 font-semibold hover:bg-gray-50 transition">
              No, mantener
            </button>
            <button (click)="ejecutarCancelacion()" class="flex-1 bg-red-600 text-white rounded-lg py-2 font-semibold hover:bg-red-700 transition">
              Sí, cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AgendaComponent implements OnInit {
  citas: Cita[] = [];
  cargando = true;
  citaACancelar: Cita | null = null;

  citasHoy: Cita[] = [];
  citasProximas: Cita[] = [];
  citasCanceladasHoy: Cita[] = [];

  hoyFormateado = new Date().toLocaleDateString('es-HN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  constructor(private citaSvc: CitaService) {}

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.cargando = true;
    this.citaSvc.miAgenda().subscribe({
      next: (data: Cita[]) => {
        this.citas = data;
        this.clasificar();
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }

  private clasificar(): void {
    const hoyStr = new Date().toISOString().slice(0, 10);

    this.citasHoy = this.citas.filter(c =>
      c.fecha.slice(0, 10) === hoyStr && c.estado !== 'cancelada'
    );

    this.citasProximas = this.citas.filter(c =>
      c.fecha.slice(0, 10) > hoyStr && ['confirmada', 'pendiente'].includes(c.estado)
    );

    this.citasCanceladasHoy = this.citas.filter(c =>
      c.fecha.slice(0, 10) === hoyStr && c.estado === 'cancelada'
    );
  }

  cambiarEstado(cita: Cita, estado: string): void {
    this.citaSvc.actualizarEstado(cita._id, estado).subscribe(() => this.cargar());
  }

  confirmarCancelar(cita: Cita): void {
    this.citaACancelar = cita;
  }

  ejecutarCancelacion(): void {
    if (this.citaACancelar) {
      this.cambiarEstado(this.citaACancelar, 'cancelada');
      this.citaACancelar = null;
    }
  }

  badgeEstado(estado: string): string {
    const base = 'text-xs font-semibold px-2 py-0.5 rounded-full';
    const map: Record<string, string> = {
      confirmada:  `${base} bg-blue-100 text-blue-700`,
      en_progreso: `${base} bg-orange-100 text-orange-700`,
      completada:  `${base} bg-green-100 text-green-700`,
      cancelada:   `${base} bg-gray-100 text-gray-500`,
      pendiente:   `${base} bg-yellow-100 text-yellow-700`,
    };
    return map[estado] ?? `${base} bg-gray-100 text-gray-500`;
  }

  etiquetaEstado(estado: string): string {
    const map: Record<string, string> = {
      confirmada:  'Confirmada',
      en_progreso: 'En progreso',
      completada:  'Completada',
      cancelada:   'Cancelada',
      pendiente:   'Pendiente',
    };
    return map[estado] ?? estado;
  }
}
