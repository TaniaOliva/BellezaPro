import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SolicitudService } from '../../core/services/solicitud.service';
import { CategoriaService } from '../../core/services/categoria.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { Usuario } from '../../core/models';

@Component({
  selector: 'app-cliente-solicitud-especial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white min-h-screen">
      <div class="max-w-2xl mx-auto px-8 py-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Solicitud Especial</h1>
        <p class="text-gray-600 mb-8">Cuéntanos qué necesitas y nos encargaremos de coordinarlo.</p>

        <!-- Pasos -->
        <div class="rounded-[32px] bg-surface p-6 mb-8">
          <div class="flex items-center gap-4 overflow-x-auto">
            <ng-container *ngFor="let step of steps; let i = index">
              <div class="flex items-center gap-4">
                <div class="grid h-10 w-10 place-items-center rounded-full border text-sm font-semibold"
                  [ngClass]="currentStep === i + 1 ? 'border-primary bg-primary-fixed/10 text-primary' : 'border-outline-variant bg-surface text-secondary'">{{ i + 1 }}</div>
                <div class="text-label-sm text-secondary">{{ step }}</div>
              </div>
              <div *ngIf="i < steps.length - 1" class="h-px flex-1 bg-outline-variant"></div>
            </ng-container>
          </div>
        </div>

        <div class="rounded-[32px] border border-outline-variant bg-surface p-8 space-y-6">

          <!-- Paso 1: Categoría -->
          <ng-container *ngIf="currentStep === 1">
            <p class="text-headline-lg font-semibold">Selecciona una categoría</p>
            <div *ngIf="cargandoCats" class="text-center py-8 text-gray-400">Cargando categorías...</div>
            <div *ngIf="!cargandoCats" class="grid grid-cols-2 gap-4">
              <button *ngFor="let cat of categorias" type="button" (click)="selectedCategory = cat"
                class="rounded-3xl border p-6 text-center transition"
                [ngClass]="selectedCategory === cat ? 'border-primary bg-secondary-fixed' : 'border-outline-variant bg-surface'">
                {{ cat }}
              </button>
              <button *ngIf="categorias.length === 0" disabled class="col-span-2 rounded-3xl border border-dashed p-6 text-gray-400 text-center">
                Sin categorías disponibles
              </button>
            </div>
            <div class="flex justify-end">
              <button type="button" [disabled]="!selectedCategory" (click)="currentStep = 2"
                class="rounded-2xl bg-primary px-6 py-3 text-on-primary font-semibold disabled:opacity-50">
                Continuar
              </button>
            </div>
          </ng-container>

          <!-- Paso 2: Descripción -->
          <ng-container *ngIf="currentStep === 2">
            <p class="text-headline-lg font-semibold">Describe tu solicitud</p>
            <textarea rows="5" [(ngModel)]="descripcion"
              class="w-full rounded-[28px] border border-outline-variant bg-surface p-5 text-body-md"
              placeholder="Describe el servicio que buscas"></textarea>
            <div class="rounded-[28px] border-2 border-dashed border-outline-variant bg-surface-container-low h-32 flex flex-col items-center justify-center gap-2 text-center text-secondary">
              <span class="material-symbols-outlined text-[32px]">upload_file</span>
              <p>Arrastra una imagen o haz clic</p>
            </div>
            <div class="space-y-3">
              <p class="text-label-sm font-semibold text-secondary">Presupuesto</p>
              <div class="flex flex-wrap gap-3">
                <button *ngFor="let budget of budgets" type="button" (click)="selectedBudget = budget"
                  class="rounded-full border px-4 py-2 text-sm transition"
                  [ngClass]="selectedBudget === budget ? 'border-primary bg-secondary-fixed text-primary' : 'border-outline-variant text-secondary'">
                  {{ budget }}
                </button>
              </div>
            </div>
            <div class="flex justify-between">
              <button type="button" (click)="currentStep = 1" class="rounded-2xl border border-outline-variant px-6 py-3 text-secondary">Volver</button>
              <button type="button" (click)="currentStep = 3" class="rounded-2xl bg-primary px-6 py-3 text-on-primary font-semibold">Continuar</button>
            </div>
          </ng-container>

          <!-- Paso 3: Estilista -->
          <ng-container *ngIf="currentStep === 3">
            <p class="text-headline-lg font-semibold">Elige un estilista</p>
            <div *ngIf="cargandoEstilistas" class="text-center py-8 text-gray-400">Cargando estilistas...</div>
            <div *ngIf="!cargandoEstilistas" class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <button type="button"
                class="rounded-[28px] border p-6 text-left transition"
                [ngClass]="selectedStylistId === '' ? 'border-primary bg-secondary-fixed' : 'border-outline-variant'"
                (click)="selectedStylistId = ''">
                <div class="flex items-center gap-4">
                  <input type="radio" class="h-4 w-4 text-primary" [checked]="selectedStylistId === ''" />
                  <div>
                    <p class="text-label-md font-semibold">Sin preferencia</p>
                    <p class="text-body-sm text-secondary mt-1">Seleccionaremos el mejor estilista para ti.</p>
                  </div>
                </div>
              </button>
              <button type="button" *ngFor="let s of estilistas"
                class="rounded-[28px] border p-6 text-left transition"
                [ngClass]="selectedStylistId === s._id ? 'border-primary bg-secondary-fixed' : 'border-outline-variant'"
                (click)="selectedStylistId = s._id">
                <div class="flex items-center gap-4">
                  <div class="flex h-12 w-12 items-center justify-center rounded-full bg-primary-fixed/10 text-primary font-semibold shrink-0">
                    {{ iniciales(s) }}
                  </div>
                  <div>
                    <p class="text-label-md font-semibold">{{ s.nombre }} {{ s.apellido }}</p>
                    <p class="text-body-sm text-secondary mt-1">
                      {{ s.especialidades && s.especialidades.length ? s.especialidades[0] : 'Estilista' }}
                    </p>
                    <div *ngIf="s.calificacionPromedio" class="flex items-center gap-1 text-secondary text-sm mt-1">
                      <span class="material-symbols-outlined text-[16px]">star</span>
                      <span>{{ s.calificacionPromedio | number:'1.1-1' }}</span>
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

          <!-- Paso 4: Resumen -->
          <ng-container *ngIf="currentStep === 4">
            <p class="text-headline-lg font-semibold">Resumen de solicitud</p>
            <div class="rounded-[28px] border border-outline-variant bg-surface p-6 space-y-4">
              <div>
                <p class="text-label-sm text-secondary">Categoría</p>
                <p class="text-label-md font-semibold">{{ selectedCategory || 'No seleccionada' }}</p>
              </div>
              <div>
                <p class="text-label-sm text-secondary">Presupuesto</p>
                <p class="text-label-md font-semibold">{{ selectedBudget || 'No seleccionado' }}</p>
              </div>
              <div>
                <p class="text-label-sm text-secondary">Estilista</p>
                <p class="text-label-md font-semibold">{{ nombreEstilistaSeleccionado }}</p>
              </div>
              <div>
                <p class="text-label-sm text-secondary">Descripción</p>
                <p class="text-body-md text-secondary">{{ descripcion || 'Sin descripción' }}</p>
              </div>
            </div>
            <div class="rounded-[28px] bg-primary-fixed/10 p-4 flex items-center gap-3 text-primary">
              <span class="material-symbols-outlined">info</span>
              <p>Respuesta en menos de 24 horas</p>
            </div>
            <p *ngIf="error" class="text-red-600 text-sm">{{ error }}</p>
            <div class="flex justify-between">
              <button type="button" (click)="currentStep = 3" class="rounded-2xl border border-outline-variant px-6 py-3 text-secondary">Volver</button>
              <button type="button" (click)="enviar()" [disabled]="enviando"
                class="rounded-2xl bg-primary px-6 py-3 text-on-primary font-semibold disabled:opacity-50">
                {{ enviando ? 'Enviando...' : 'Enviar solicitud' }}
              </button>
            </div>
          </ng-container>

        </div>
      </div>
    </div>
  `
})
export class SolicitudEspecialComponent implements OnInit {
  currentStep = 1;
  selectedCategory = '';
  selectedBudget = '';
  selectedStylistId = '';
  descripcion = '';
  enviando = false;
  error = '';

  readonly steps = ['Categoría', 'Descripción', 'Estilista', 'Confirmar'];
  readonly budgets = ['Hasta L.300', 'L.300-600', 'L.600-1000', 'Más de L.1000'];

  categorias: string[] = [];
  estilistas: Usuario[] = [];
  cargandoCats = true;
  cargandoEstilistas = true;

  constructor(
    private solicitudSvc: SolicitudService,
    private categoriaSvc: CategoriaService,
    private usuarioSvc: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoriaSvc.listar().subscribe({
      next: (cats) => { this.categorias = cats.map(c => c.nombre); this.cargandoCats = false; },
      error: () => this.cargandoCats = false
    });
    this.usuarioSvc.listarEstilistas().subscribe({
      next: (data) => { this.estilistas = data; this.cargandoEstilistas = false; },
      error: () => this.cargandoEstilistas = false
    });
  }

  iniciales(u: Usuario): string {
    return `${u.nombre?.[0] ?? ''}${u.apellido?.[0] ?? ''}`.toUpperCase();
  }

  get nombreEstilistaSeleccionado(): string {
    if (!this.selectedStylistId) return 'Sin preferencia';
    const s = this.estilistas.find(e => e._id === this.selectedStylistId);
    return s ? `${s.nombre} ${s.apellido}` : 'Sin preferencia';
  }

  enviar(): void {
    if (!this.selectedCategory || this.descripcion.length < 10) {
      this.error = 'Completa la categoría y la descripción (mínimo 10 caracteres)';
      return;
    }
    this.enviando = true;
    this.solicitudSvc.crear({
      categoria: this.selectedCategory,
      descripcion: this.descripcion,
      presupuesto: this.selectedBudget
    } as any).subscribe({
      next: () => {
        this.enviando = false;
        setTimeout(() => this.router.navigate(['/cliente/inicio']), 2000);
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al enviar';
        this.enviando = false;
      }
    });
  }
}
