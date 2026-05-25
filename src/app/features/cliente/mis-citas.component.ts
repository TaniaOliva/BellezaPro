import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mis-citas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8 space-y-8">
      <div class="flex flex-wrap items-center gap-4">
        <button type="button" (click)="activeTab = 'proximas'" class="rounded-full px-5 py-2 font-semibold transition text-sm" [ngClass]="activeTab === 'proximas' ? 'border-b-2 border-primary text-primary' : 'border border-outline-variant text-secondary'">Proximas</button>
        <button type="button" (click)="activeTab = 'historial'" class="rounded-full px-5 py-2 font-semibold transition text-sm" [ngClass]="activeTab === 'historial' ? 'border-b-2 border-primary text-primary' : 'border border-outline-variant text-secondary'">Historial</button>
      </div>

      <ng-container *ngIf="activeTab === 'proximas'">
        <div class="space-y-6">
          <div>
            <p class="text-label-sm uppercase text-secondary">Hoy</p>
          </div>

          <div class="rounded-[28px] border-l-[3px] border-primary bg-surface p-6 grid grid-cols-[auto_1fr_auto] gap-4 items-center">
            <div class="rounded-[24px] bg-primary-fixed p-4 text-on-primary-container text-center">
              <p class="text-headline-md font-semibold">29</p>
              <p class="text-label-sm">ABR</p>
            </div>
            <div class="space-y-3">
              <p class="text-headline-md font-semibold">Manicure premium</p>
              <div class="flex flex-wrap items-center gap-3 text-secondary text-sm">
                <span class="material-symbols-outlined">person_outline</span>
                <span>Sofia Gomez</span>
              </div>
              <div class="flex flex-wrap items-center gap-3 text-secondary text-sm">
                <span class="material-symbols-outlined">schedule</span>
                <span>10:00 AM</span>
              </div>
            </div>
            <div class="text-right space-y-3">
              <span class="inline-flex rounded-full bg-surface-container-high px-3 py-1 text-sm">Confirmada</span>
              <a class="text-primary font-semibold">Ver detalles</a>
            </div>
          </div>

          <div>
            <p class="text-label-sm uppercase text-secondary">Esta semana</p>
          </div>

          <div class="rounded-[28px] border border-outline-variant bg-surface p-6 grid grid-cols-[auto_1fr_auto] gap-4 items-center">
            <div class="rounded-[24px] bg-secondary-fixed p-4 text-on-secondary-container text-center">
              <p class="text-headline-md font-semibold">02</p>
              <p class="text-label-sm">MAY</p>
            </div>
            <div class="space-y-3">
              <p class="text-headline-md font-semibold">Pedicure Spa</p>
              <div class="flex flex-wrap items-center gap-3 text-secondary text-sm">
                <span class="material-symbols-outlined">person_outline</span>
                <span>Maria F.</span>
              </div>
              <div class="flex flex-wrap items-center gap-3 text-secondary text-sm">
                <span class="material-symbols-outlined">schedule</span>
                <span>03:00 PM</span>
              </div>
            </div>
            <div class="text-right space-y-3">
              <span class="inline-flex rounded-full bg-surface-container-high px-3 py-1 text-sm">Pendiente</span>
              <a class="text-primary font-semibold">Ver detalles</a>
            </div>
          </div>

          <div class="rounded-[28px] border-2 border-dashed border-outline-variant bg-surface p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="flex items-center gap-4">
              <div class="rounded-full bg-primary-fixed/10 p-4 text-primary-fixed">
                <span class="material-symbols-outlined">spa</span>
              </div>
              <div>
                <p class="text-headline-md font-semibold">Lista para tu proximo servicio?</p>
                <p class="text-secondary text-body-sm">Encuentra el momento perfecto para tu siguiente cita.</p>
              </div>
            </div>
            <button type="button" class="rounded-2xl bg-primary px-6 py-3 text-on-primary font-semibold">Agendar cita</button>
          </div>
        </div>
      </ng-container>

      <ng-container *ngIf="activeTab === 'historial'">
        <div class="space-y-6">
          <div class="rounded-[28px] border border-outline-variant bg-surface p-6 grid grid-cols-[auto_1fr_auto] gap-4 items-center">
            <div class="rounded-[24px] bg-surface-container-low p-4 text-secondary text-center">
              <p class="text-headline-md font-semibold">15</p>
              <p class="text-label-sm">MAR</p>
            </div>
            <div class="space-y-3">
              <p class="text-headline-md font-semibold">Peinado fiesta</p>
              <div class="flex flex-wrap items-center gap-3 text-secondary text-sm">
                <span class="material-symbols-outlined">person_outline</span>
                <span>Ana Garcia</span>
              </div>
              <div class="flex flex-wrap items-center gap-3 text-secondary text-sm">
                <span class="material-symbols-outlined">schedule</span>
                <span>11:00 AM</span>
              </div>
            </div>
            <div class="text-right space-y-3">
              <span class="inline-flex rounded-full bg-surface-container-highest px-3 py-1 text-secondary">Completada</span>
              <a class="text-primary font-semibold">Calificar</a>
            </div>
          </div>

          <div class="rounded-[28px] border border-outline-variant bg-surface p-6 grid grid-cols-[auto_1fr_auto] gap-4 items-center">
            <div class="rounded-[24px] bg-surface-container-low p-4 text-secondary text-center">
              <p class="text-headline-md font-semibold">08</p>
              <p class="text-label-sm">FEB</p>
            </div>
            <div class="space-y-3">
              <p class="text-headline-md font-semibold">Masaje relajante</p>
              <div class="flex flex-wrap items-center gap-3 text-secondary text-sm">
                <span class="material-symbols-outlined">person_outline</span>
                <span>Clara R.</span>
              </div>
              <div class="flex flex-wrap items-center gap-3 text-secondary text-sm">
                <span class="material-symbols-outlined">schedule</span>
                <span>05:00 PM</span>
              </div>
            </div>
            <div class="text-right space-y-3">
              <span class="inline-flex rounded-full bg-surface-container-highest px-3 py-1 text-secondary">Completada</span>
              <a class="text-primary font-semibold">Calificar</a>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `
})
export class MisCitasComponent {
  activeTab: string = 'proximas';
}
