import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cliente-solicitud-especial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white min-h-screen">
      <div class="max-w-2xl mx-auto px-8 py-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Solicitud Especial</h1>
        <p class="text-gray-600 mb-8">Cuéntanos qué necesitas y nos encargaremos de coordinarlo.</p>

        <div class="rounded-[32px] bg-surface p-6 mb-8">
          <div class="flex items-center gap-4 overflow-x-auto">
            <ng-container *ngFor="let step of steps; let i = index">
              <div class="flex items-center gap-4">
                <div class="grid h-10 w-10 place-items-center rounded-full border text-sm font-semibold" [ngClass]="currentStep === i + 1 ? 'border-primary bg-primary-fixed/10 text-primary' : 'border-outline-variant bg-surface text-secondary'">{{ i + 1 }}</div>
                <div class="text-label-sm text-secondary">{{ step }}</div>
              </div>
              <div *ngIf="i < steps.length - 1" class="h-px flex-1 bg-outline-variant"></div>
            </ng-container>
          </div>
        </div>

        <div class="rounded-[32px] border border-outline-variant bg-surface p-8 space-y-6">
          <ng-container *ngIf="currentStep === 1">
            <p class="text-headline-lg font-semibold">Selecciona una categoria</p>
            <div class="grid grid-cols-2 gap-4">
              <button *ngFor="let category of categories" type="button" (click)="selectedCategory = category" class="rounded-3xl border p-6 text-center transition" [ngClass]="selectedCategory === category ? 'border-primary bg-secondary-fixed' : 'border-outline-variant bg-surface'">{{ category }}</button>
            </div>
            <div class="flex justify-end">
              <button type="button" [disabled]="!selectedCategory" (click)="currentStep = 2" class="rounded-2xl bg-primary px-6 py-3 text-on-primary font-semibold disabled:opacity-50">Continuar</button>
            </div>
          </ng-container>

          <ng-container *ngIf="currentStep === 2">
            <p class="text-headline-lg font-semibold">Describe tu solicitud</p>
            <textarea rows="5" class="w-full rounded-[28px] border border-outline-variant bg-surface p-5 text-body-md" placeholder="Describe el servicio que buscas"></textarea>
            <div class="rounded-[28px] border-2 border-dashed border-outline-variant bg-surface-container-low h-32 flex flex-col items-center justify-center gap-2 text-center text-secondary">
              <span class="material-symbols-outlined text-[32px]">upload_file</span>
              <p>Arrastra una imagen o haz clic</p>
            </div>
            <div class="space-y-3">
              <p class="text-label-sm font-semibold text-secondary">Presupuesto</p>
              <div class="flex flex-wrap gap-3">
                <button *ngFor="let budget of budgets" type="button" (click)="selectedBudget = budget" class="rounded-full border px-4 py-2 text-sm transition" [ngClass]="selectedBudget === budget ? 'border-primary bg-secondary-fixed text-primary' : 'border-outline-variant text-secondary'">{{ budget }}</button>
              </div>
            </div>
            <div class="flex justify-between">
              <button type="button" (click)="currentStep = 1" class="rounded-2xl border border-outline-variant px-6 py-3 text-secondary">Volver</button>
              <button type="button" (click)="currentStep = 3" class="rounded-2xl bg-primary px-6 py-3 text-on-primary font-semibold">Continuar</button>
            </div>
          </ng-container>

          <ng-container *ngIf="currentStep === 3">
            <p class="text-headline-lg font-semibold">Elige un estilista</p>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
              <button type="button" class="rounded-[28px] border border-dashed border-outline-variant p-6 text-left" [ngClass]="selectedStylist === 'Sin preferencia' ? 'border-primary bg-secondary-fixed' : ''" (click)="selectedStylist = 'Sin preferencia'">
                <div class="flex items-center gap-4">
                  <input type="radio" class="h-4 w-4 text-primary" [checked]="selectedStylist === 'Sin preferencia'" />
                  <div>
                    <p class="text-label-md font-semibold">Sin preferencia</p>
                    <p class="text-body-sm text-secondary mt-1">Seleccionaremos el mejor estilista para ti.</p>
                  </div>
                </div>
              </button>
              <button type="button" *ngFor="let stylist of stylists" class="rounded-[28px] border border-outline-variant p-6 text-left transition" [ngClass]="selectedStylist === stylist.name ? 'border-primary bg-secondary-fixed' : ''" (click)="selectedStylist = stylist.name">
                <div class="flex items-center gap-4">
                  <div class="flex h-12 w-12 items-center justify-center rounded-full bg-primary-fixed/10 text-primary-fixed font-semibold">{{ stylist.initials }}</div>
                  <div>
                    <p class="text-label-md font-semibold">{{ stylist.name }}</p>
                    <p class="text-body-sm text-secondary mt-1">{{ stylist.specialty }}</p>
                    <div class="flex items-center gap-1 text-secondary text-sm mt-2">
                      <span class="material-symbols-outlined text-[18px]">star</span>
                      <span>{{ stylist.rating }}</span>
                    </div>
                  </div>
                </div>
              </button>
            </div>
            <div class="flex justify-between">
              <button type="button" (click)="currentStep = 2" class="rounded-2xl border border-outline-variant px-6 py-3 text-secondary">Volver</button>
              <button type="button" (click)="currentStep = 4" class="rounded-2xl bg-primary px-6 py-3 text-on-primary font-semibold">Continuar</button>
            </div>
          </ng-container>

          <ng-container *ngIf="currentStep === 4">
            <p class="text-headline-lg font-semibold">Resumen de solicitud</p>
            <div class="rounded-[28px] border border-outline-variant bg-surface p-6 space-y-4">
              <div>
                <p class="text-label-sm text-secondary">Categoria</p>
                <p class="text-label-md font-semibold">{{ selectedCategory || 'No seleccionada' }}</p>
              </div>
              <div>
                <p class="text-label-sm text-secondary">Presupuesto</p>
                <p class="text-label-md font-semibold">{{ selectedBudget || 'No seleccionado' }}</p>
              </div>
              <div>
                <p class="text-label-sm text-secondary">Estilista</p>
                <p class="text-label-md font-semibold">{{ selectedStylist || 'Sin preferencia' }}</p>
              </div>
              <div>
                <p class="text-label-sm text-secondary">Descripcion</p>
                <p class="text-body-md text-secondary">Quiero un servicio con detalles suaves y un estilo elegante para un evento especial.</p>
              </div>
            </div>
            <div class="rounded-[28px] bg-primary-fixed/10 p-4 flex items-center gap-3 text-primary">
              <span class="material-symbols-outlined">info</span>
              <p>Respuesta en menos de 24 horas</p>
            </div>
            <div class="flex justify-between">
              <button type="button" (click)="currentStep = 3" class="rounded-2xl border border-outline-variant px-6 py-3 text-secondary">Volver</button>
              <button type="button" class="rounded-2xl bg-primary px-6 py-3 text-on-primary font-semibold">Enviar solicitud</button>
            </div>
          </ng-container>
        </div>
      </div>
    </div>
  `
})
export class SolicitudEspecialComponent {
  currentStep: number = 1;
  selectedCategory: string = '';
  selectedBudget: string = '';
  selectedStylist: string = '';

  steps = ['Categoria', 'Descripcion', 'Estilista', 'Confirmar'];
  categories = ['Uñas', 'Cabello', 'Maquillaje', 'Cejas', 'Tratamiento', 'Otro'];
  budgets = ['Hasta L.300', 'L.300-600', 'L.600-1000', 'Mas de L.1000'];
  stylists = [
    { name: 'Ana Garcia', initials: 'AG', specialty: 'Uñas y belleza', rating: '4.9' },
    { name: 'Lina Torres', initials: 'LT', specialty: 'Cabello y color', rating: '4.8' }
  ];
}
