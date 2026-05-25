import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-8 space-y-8">
      <div class="rounded-[32px] bg-gradient-to-r from-primary-fixed to-secondary-fixed min-h-[120px] p-6 flex items-center justify-between overflow-hidden">
        <div>
          <p class="text-headline-xl font-semibold text-on-primary-fixed mb-2">Bienvenida, Maria</p>
          <p class="text-body-lg text-on-primary-fixed-variant">Que servicio te apetece hoy?</p>
        </div>
        <span class="material-symbols-outlined text-[120px] text-on-primary-fixed/15">content_cut</span>
      </div>

      <div class="grid grid-cols-3 gap-stack_md">
        <div class="rounded-[28px] border border-outline-variant bg-surface p-6 space-y-4">
          <div class="flex items-center justify-between">
            <div class="rounded-3xl bg-primary-fixed/10 p-3 text-primary-fixed">
              <span class="material-symbols-outlined">calendar_today</span>
            </div>
          </div>
          <p class="text-label-sm text-secondary">Proxima cita</p>
          <p class="text-headline-xl font-semibold">15 de Octubre</p>
          <p class="text-body-md text-secondary">Estilista Sofia Gomez</p>
          <a routerLink="/cliente/mis-citas" class="text-primary font-semibold">Ver detalles</a>
        </div>

        <div class="rounded-[28px] border border-outline-variant bg-surface p-6 space-y-4">
          <div class="flex items-center justify-between">
            <div class="rounded-3xl bg-secondary-fixed/10 p-3 text-secondary-fixed">
              <span class="material-symbols-outlined">content_cut</span>
            </div>
          </div>
          <p class="text-label-sm text-secondary">Citas este mes</p>
          <p class="text-headline-xl font-semibold">3</p>
        </div>

        <div class="rounded-[28px] border border-outline-variant bg-surface p-6 space-y-4">
          <div class="flex items-center justify-between">
            <div class="rounded-3xl bg-tertiary-fixed/10 p-3 text-tertiary-fixed">
              <span class="material-symbols-outlined">star</span>
            </div>
          </div>
          <p class="text-label-sm text-secondary">Mi calificacion</p>
          <div class="flex items-center gap-2">
            <p class="text-headline-xl font-semibold">4.8</p>
            <div class="flex items-center gap-1 text-primary">
              <span class="material-symbols-outlined text-base">star</span>
              <span class="material-symbols-outlined text-base">star</span>
              <span class="material-symbols-outlined text-base">star</span>
              <span class="material-symbols-outlined text-base">star</span>
              <span class="material-symbols-outlined text-base">star_half</span>
            </div>
          </div>
        </div>
      </div>

      <section class="space-y-4">
        <div class="flex items-center justify-between gap-4">
          <p class="text-headline-lg font-semibold">Servicios populares</p>
          <a routerLink="/cliente/servicios" class="text-primary font-semibold">Ver todos</a>
        </div>
        <div class="flex gap-4 overflow-x-auto pb-2">
          <div class="min-w-[280px] rounded-[28px] border border-outline-variant bg-surface p-5">
            <div class="relative mb-4">
              <div class="bg-surface-container-low h-[160px] rounded-[24px]"></div>
              <span class="absolute top-4 left-4 rounded-full bg-pink-100 px-3 py-1 text-[11px] font-semibold text-pink-600 uppercase tracking-[0.16em]">Popular</span>
            </div>
            <p class="text-label-sm text-tertiary">Cabello</p>
            <p class="text-label-md font-semibold mt-2">Corte degradado</p>
            <p class="text-body-sm text-secondary mt-1">Desde L. 350</p>
            <button routerLink="/cliente/servicios" class="mt-5 w-full rounded-2xl border border-primary text-primary py-3 hover:bg-primary-fixed">Agendar</button>
          </div>
          <div class="min-w-[280px] rounded-[28px] border border-outline-variant bg-surface p-5">
            <div class="relative mb-4">
              <div class="bg-surface-container-low h-[160px] rounded-[24px]"></div>
              <span class="absolute top-4 left-4 rounded-full bg-pink-100 px-3 py-1 text-[11px] font-semibold text-pink-600 uppercase tracking-[0.16em]">Popular</span>
            </div>
            <p class="text-label-sm text-tertiary">Uñas</p>
            <p class="text-label-md font-semibold mt-2">Manicure deluxe</p>
            <p class="text-body-sm text-secondary mt-1">Desde L. 220</p>
            <button routerLink="/cliente/servicios" class="mt-5 w-full rounded-2xl border border-primary text-primary py-3 hover:bg-primary-fixed">Agendar</button>
          </div>
          <div class="min-w-[280px] rounded-[28px] border border-outline-variant bg-surface p-5">
            <div class="relative mb-4">
              <div class="bg-surface-container-low h-[160px] rounded-[24px]"></div>
              <span class="absolute top-4 left-4 rounded-full bg-pink-100 px-3 py-1 text-[11px] font-semibold text-pink-600 uppercase tracking-[0.16em]">Popular</span>
            </div>
            <p class="text-label-sm text-tertiary">Facial</p>
            <p class="text-label-md font-semibold mt-2">Limpieza facial</p>
            <p class="text-body-sm text-secondary mt-1">Desde L. 480</p>
            <button routerLink="/cliente/servicios" class="mt-5 w-full rounded-2xl border border-primary text-primary py-3 hover:bg-primary-fixed">Agendar</button>
          </div>
          <div class="min-w-[280px] rounded-[28px] border border-outline-variant bg-surface p-5">
            <div class="relative mb-4">
              <div class="bg-surface-container-low h-[160px] rounded-[24px]"></div>
              <span class="absolute top-4 left-4 rounded-full bg-pink-100 px-3 py-1 text-[11px] font-semibold text-pink-600 uppercase tracking-[0.16em]">Popular</span>
            </div>
            <p class="text-label-sm text-tertiary">Maquillaje</p>
            <p class="text-label-md font-semibold mt-2">Look de noche</p>
            <p class="text-body-sm text-secondary mt-1">Desde L. 650</p>
            <button routerLink="/cliente/servicios" class="mt-5 w-full rounded-2xl border border-primary text-primary py-3 hover:bg-primary-fixed">Agendar</button>
          </div>
        </div>
      </section>

      <section class="space-y-4">
        <p class="text-headline-lg font-semibold">Explora por categoria</p>
        <div class="grid grid-cols-5 gap-4">
          <div class="rounded-[24px] bg-surface p-6 text-center hover:bg-surface-container-low transition">
            <span class="material-symbols-outlined text-[36px] text-primary">face</span>
            <p class="text-label-md font-semibold mt-4">Cabello</p>
            <p class="text-label-sm text-secondary mt-1">Cortes y estilo</p>
          </div>
          <div class="rounded-[24px] bg-surface p-6 text-center hover:bg-surface-container-low transition">
            <span class="material-symbols-outlined text-[36px] text-primary">back_hand</span>
            <p class="text-label-md font-semibold mt-4">Uñas</p>
            <p class="text-label-sm text-secondary mt-1">Manicure y pedicure</p>
          </div>
          <div class="rounded-[24px] bg-surface p-6 text-center hover:bg-surface-container-low transition">
            <span class="material-symbols-outlined text-[36px] text-primary">spa</span>
            <p class="text-label-md font-semibold mt-4">Facial</p>
            <p class="text-label-sm text-secondary mt-1">Cuidado de piel</p>
          </div>
          <div class="rounded-[24px] bg-surface p-6 text-center hover:bg-surface-container-low transition">
            <span class="material-symbols-outlined text-[36px] text-primary">brush</span>
            <p class="text-label-md font-semibold mt-4">Maquillaje</p>
            <p class="text-label-sm text-secondary mt-1">Look profesional</p>
          </div>
          <div class="rounded-[24px] bg-surface p-6 text-center hover:bg-surface-container-low transition">
            <span class="material-symbols-outlined text-[36px] text-primary">more_horiz</span>
            <p class="text-label-md font-semibold mt-4">Mas</p>
            <p class="text-label-sm text-secondary mt-1">Otros servicios</p>
          </div>
        </div>
      </section>

      <div class="rounded-[28px] border-l-[4px] border-primary bg-surface p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-4">
          <div class="rounded-full bg-primary-fixed/10 p-4 text-primary-fixed">
            <span class="material-symbols-outlined">auto_awesome</span>
          </div>
          <div>
            <p class="text-headline-md font-semibold">Buscas algo especial?</p>
            <p class="text-body-md text-secondary">Cuéntanos que necesitas y te ayudamos a coordinarlo.</p>
          </div>
        </div>
        <a routerLink="/cliente/solicitud-especial" class="rounded-2xl bg-primary px-6 py-3 text-on-primary text-center font-semibold">Solicitar ahora</a>
      </div>
    </div>
  `
})
export class InicioComponent {}
