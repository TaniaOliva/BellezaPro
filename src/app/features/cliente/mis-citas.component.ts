import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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

        <ng-container *ngIf="activeTab === 'proximas'">
          <div class="space-y-6">
            <div class="rounded-[32px] border border-outline-variant bg-surface p-6 grid gap-6 lg:grid-cols-[auto_1fr_auto] items-center">
              <div class="rounded-[24px] bg-primary-fixed p-4 text-on-primary-container text-center">
                <p class="text-headline-md font-semibold">29</p>
                <p class="text-label-sm">ABR</p>
              </div>
              <div>
                <p class="text-headline-md font-semibold">Manicure premium</p>
                <p class="text-secondary text-sm mt-2">Estilista: Sofia R. · 10:30 AM</p>
              </div>
              <span class="inline-flex rounded-full bg-primary/10 px-4 py-2 text-primary text-sm">Confirmada</span>
            </div>

            <div class="rounded-[32px] border border-outline-variant bg-surface p-6 grid gap-6 lg:grid-cols-[auto_1fr_auto] items-center">
              <div class="rounded-[24px] bg-secondary-fixed p-4 text-on-secondary-container text-center">
                <p class="text-headline-md font-semibold">02</p>
                <p class="text-label-sm">MAY</p>
              </div>
              <div>
                <p class="text-headline-md font-semibold">Pedicure Spa</p>
                <p class="text-secondary text-sm mt-2">Estilista: María F. · 03:00 PM</p>
              </div>
              <span class="inline-flex rounded-full bg-surface-container-high px-4 py-2 text-secondary text-sm">Pendiente</span>
            </div>
          </div>
        </ng-container>

        <ng-container *ngIf="activeTab === 'historial'">
          <div class="space-y-6">
            <div class="rounded-[32px] border border-outline-variant bg-surface p-6 grid gap-6 lg:grid-cols-[auto_1fr_auto] items-center">
              <div class="rounded-[24px] bg-surface-container-low p-4 text-secondary text-center">
                <p class="text-headline-md font-semibold">15</p>
                <p class="text-label-sm">MAR</p>
              </div>
              <div>
                <p class="text-headline-md font-semibold">Peinado fiesta</p>
                <p class="text-secondary text-sm mt-2">Estilista: Ana Garcia · 11:00 AM</p>
              </div>
              <span class="inline-flex rounded-full bg-surface-container-high px-4 py-2 text-secondary text-sm">Completada</span>
            </div>

            <div class="rounded-[32px] border border-outline-variant bg-surface p-6 grid gap-6 lg:grid-cols-[auto_1fr_auto] items-center">
              <div class="rounded-[24px] bg-surface-container-low p-4 text-secondary text-center">
                <p class="text-headline-md font-semibold">08</p>
                <p class="text-label-sm">FEB</p>
              </div>
              <div>
                <p class="text-headline-md font-semibold">Masaje relajante</p>
                <p class="text-secondary text-sm mt-2">Estilista: Clara R. · 05:00 PM</p>
              </div>
              <span class="inline-flex rounded-full bg-surface-container-high px-4 py-2 text-secondary text-sm">Completada</span>
            </div>
          </div>
        </ng-container>
      </div>
    </div>
  `
})
export class MisCitasComponent {
  activeTab: string = 'proximas';
}

