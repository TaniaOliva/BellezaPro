import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitaService } from '../../core/services/cita.service';
import { Cita } from '../../core/models';

@Component({
  selector: 'app-cliente-mis-citas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white min-h-screen">
      <div class="max-w-6xl mx-auto px-8 py-8 space-y-8">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Mis Citas</h1>
            <p class="text-gray-600 mt-2">Administra tus próximas citas y revisa tu historial.</p>
          </div>
          <div class="flex flex-wrap gap-3">
            <button type="button" (click)="activeTab = 'proximas'" [ngClass]="activeTab === 'proximas' ? 'bg-primary text-white' : 'bg-surface border border-outline-variant text-secondary'" class="rounded-full px-5 py-3 text-sm font-semibold">Próximas</button>
            <button type="button" (click)="activeTab = 'historial'" [ngClass]="activeTab === 'historial' ? 'bg-primary text-white' : 'bg-surface border border-outline-variant text-secondary'" class="rounded-full px-5 py-3 text-sm font-semibold">Historial</button>
          </div>
        </div>

        <div *ngIf="cargando" class="text-center py-16 text-gray-400">Cargando citas...</div>

        <ng-container *ngIf="activeTab === 'proximas' && !cargando">
          <div *ngIf="proximas.length === 0" class="text-center py-16 text-gray-400">No tienes citas próximas.</div>
          <div class="space-y-6">
            <div *ngFor="let cita of proximas"
                 class="rounded-[32px] border border-outline-variant bg-surface p-6 grid gap-6 lg:grid-cols-[auto_1fr_auto] items-center">
              <div class="rounded-[24px] bg-primary-fixed p-4 text-on-primary-container text-center min-w-[64px]">
                <p class="text-headline-md font-semibold">{{ cita.fecha | date:'dd':'UTC' }}</p>
                <p class="text-label-sm">{{ cita.fecha | date:'MMM':'UTC' | uppercase }}</p>
              </div>
              <div>
                <p class="text-headline-md font-semibold">{{ cita.servicioId?.nombre ?? 'Servicio' }}</p>
                <p class="text-secondary text-sm mt-2">
                  Estilista: {{ cita.estilistaId?.nombre ?? 'Sin asignar' }}
                  {{ cita.estilistaId?.apellido ? ' ' + cita.estilistaId.apellido : '' }}
                  · {{ cita.hora }}
                </p>
              </div>
              <span [ngClass]="{
                'bg-primary/10 text-primary': cita.estado === 'confirmada',
                'bg-yellow-100 text-yellow-700': cita.estado === 'pendiente',
                'bg-blue-100 text-blue-700': cita.estado === 'en_progreso'
              }" class="inline-flex rounded-full px-4 py-2 text-sm capitalize">
                {{ cita.estado }}
              </span>
            </div>
          </div>
        </ng-container>

        <ng-container *ngIf="activeTab === 'historial' && !cargando">
          <div *ngIf="historial.length === 0" class="text-center py-16 text-gray-400">No hay citas en el historial.</div>
          <div class="space-y-6">
            <div *ngFor="let cita of historial"
                 class="rounded-[32px] border border-outline-variant bg-surface p-6 grid gap-6 lg:grid-cols-[auto_1fr_auto] items-center">
              <div class="rounded-[24px] bg-surface-container-low p-4 text-secondary text-center min-w-[64px]">
                <p class="text-headline-md font-semibold">{{ cita.fecha | date:'dd':'UTC' }}</p>
                <p class="text-label-sm">{{ cita.fecha | date:'MMM':'UTC' | uppercase }}</p>
              </div>
              <div>
                <p class="text-headline-md font-semibold">{{ cita.servicioId?.nombre ?? 'Servicio' }}</p>
                <p class="text-secondary text-sm mt-2">
                  Estilista: {{ cita.estilistaId?.nombre ?? 'Sin asignar' }}
                  {{ cita.estilistaId?.apellido ? ' ' + cita.estilistaId.apellido : '' }}
                  · {{ cita.hora }}
                </p>
              </div>
              <span [ngClass]="{
                'bg-green-100 text-green-700': cita.estado === 'completada',
                'bg-red-100 text-red-700': cita.estado === 'cancelada'
              }" class="inline-flex rounded-full px-4 py-2 text-sm capitalize">
                {{ cita.estado }}
              </span>
            </div>
          </div>
        </ng-container>
      </div>
    </div>
  `
})
export class MisCitasComponent implements OnInit {
  citas: Cita[] = [];
  proximas: Cita[] = [];
  historial: Cita[] = [];
  activeTab = 'proximas';
  cargando = true;

  constructor(private citaSvc: CitaService) {}

  ngOnInit(): void {
    this.citaSvc.misCitas().subscribe({
      next: (data: Cita[]) => {
        this.citas = data;

        const hoy = new Date();
        const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;

        this.proximas = data
          .filter((c: Cita) => {
            const fechaStr = c.fecha.substring(0, 10);
            return ['confirmada', 'pendiente', 'en_progreso'].includes(c.estado)
              && fechaStr >= hoyStr;
          })
          .sort((a: Cita, b: Cita) =>
            new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
          );

        this.historial = data
          .filter((c: Cita) => {
            const fechaStr = c.fecha.substring(0, 10);
            return c.estado === 'completada'
              || c.estado === 'cancelada'
              || fechaStr < hoyStr;
          })
          .sort((a: Cita, b: Cita) =>
            new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
          );

        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }
}

