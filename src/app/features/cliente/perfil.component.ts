import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8 space-y-8">
      <div class="rounded-[32px] border border-outline-variant bg-surface p-8 flex flex-col xl:flex-row items-start gap-8">
        <div class="relative">
          <div class="w-24 h-24 rounded-full border-4 border-primary-fixed overflow-hidden bg-surface flex items-center justify-center text-primary text-[56px]">
            <span class="material-symbols-outlined">account_circle</span>
          </div>
          <button class="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-on-primary grid place-items-center shadow-sm">
            <span class="material-symbols-outlined text-[18px]">photo_camera</span>
          </button>
        </div>
        <div class="flex-1 space-y-3">
          <div class="flex flex-wrap items-center gap-3">
            <p class="text-headline-xl font-semibold text-primary">Maria Garcia</p>
            <span class="rounded-full bg-secondary-container px-3 py-1 text-sm text-on-secondary-container">Cliente</span>
          </div>
          <p class="text-label-sm text-secondary">Miembro desde Enero 2025</p>
        </div>
        <div class="grid grid-cols-2 gap-4 w-full xl:w-auto">
          <div class="rounded-[28px] bg-surface-container-low p-4 text-center">
            <p class="text-label-sm uppercase text-secondary">Visitas</p>
            <p class="text-headline-md font-semibold">12</p>
          </div>
          <div class="rounded-[28px] bg-surface-container-low p-4 text-center">
            <p class="text-label-sm uppercase text-secondary">Citas mes</p>
            <p class="text-headline-md font-semibold">3</p>
          </div>
          <div class="rounded-[28px] bg-surface-container-low p-4 text-center">
            <p class="text-label-sm uppercase text-secondary">Calificacion</p>
            <p class="text-headline-md font-semibold">4.8</p>
          </div>
          <div class="rounded-[28px] bg-surface-container-low p-4 text-center">
            <p class="text-label-sm uppercase text-secondary">Ultimo servicio</p>
            <p class="text-headline-md font-semibold">hace 5 dias</p>
          </div>
        </div>
      </div>

      <div class="rounded-[32px] border border-outline-variant bg-surface p-8 space-y-6">
        <div class="flex items-center justify-between">
          <p class="text-headline-md font-semibold">Informacion personal</p>
          <button type="button" class="text-secondary flex items-center gap-2 font-semibold">
            <span class="material-symbols-outlined">edit</span>
            Editar
          </button>
        </div>
        <div class="grid grid-cols-2 gap-stack_md">
          <div>
            <label class="text-label-sm text-secondary">Nombre</label>
            <input class="mt-2 w-full rounded-3xl border border-outline-variant bg-surface p-4 text-body-md" value="Maria" />
          </div>
          <div>
            <label class="text-label-sm text-secondary">Apellido</label>
            <input class="mt-2 w-full rounded-3xl border border-outline-variant bg-surface p-4 text-body-md" value="Garcia" />
          </div>
          <div>
            <label class="text-label-sm text-secondary">Correo</label>
            <input class="mt-2 w-full rounded-3xl border border-outline-variant bg-surface-variant p-4 text-body-md" value="maria.garcia@example.com" readonly />
          </div>
          <div>
            <label class="text-label-sm text-secondary">Telefono</label>
            <input class="mt-2 w-full rounded-3xl border border-outline-variant bg-surface p-4 text-body-md" value="+504 9999-0000" />
          </div>
          <div>
            <label class="text-label-sm text-secondary">Fecha nacimiento</label>
            <input type="date" class="mt-2 w-full rounded-3xl border border-outline-variant bg-surface p-4 text-body-md" value="1990-06-10" />
          </div>
        </div>
        <div class="float-right">
          <button type="button" class="rounded-2xl bg-primary px-6 py-2 text-on-primary font-semibold">Guardar cambios</button>
        </div>
      </div>

      <div class="rounded-[32px] border border-outline-variant bg-surface p-8 space-y-6">
        <div class="flex items-center justify-between">
          <p class="text-headline-md font-semibold">Seguridad</p>
        </div>
        <div class="grid grid-cols-1 gap-4">
          <div class="relative">
            <label class="text-label-sm text-secondary">Contrasena actual</label>
            <input type="password" class="mt-2 w-full rounded-3xl border border-outline-variant bg-surface p-4 text-body-md pr-12" value="password123" />
            <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-secondary">visibility</span>
          </div>
          <div class="relative">
            <label class="text-label-sm text-secondary">Nueva contrasena</label>
            <input type="password" class="mt-2 w-full rounded-3xl border border-outline-variant bg-surface p-4 text-body-md pr-12" value="" />
            <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-secondary">visibility</span>
          </div>
          <div class="relative">
            <label class="text-label-sm text-secondary">Confirmar contrasena</label>
            <input type="password" class="mt-2 w-full rounded-3xl border border-outline-variant bg-surface p-4 text-body-md pr-12" value="" />
            <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-secondary">visibility</span>
          </div>
        </div>
        <div class="float-right">
          <button type="button" class="rounded-2xl border border-primary px-6 py-2 text-primary font-semibold">Actualizar contrasena</button>
        </div>
      </div>

      <div class="rounded-[32px] border border-outline-variant bg-surface p-8 space-y-6">
        <div class="flex items-center justify-between">
          <p class="text-headline-md font-semibold">Solicitudes especiales</p>
          <button type="button" class="rounded-2xl bg-primary px-5 py-2 text-on-primary font-semibold">Nueva solicitud</button>
        </div>
        <div class="space-y-4">
          <div class="rounded-[24px] bg-surface p-5 flex items-center justify-between gap-4">
            <div>
              <p class="text-label-md font-semibold">Prueba peinado novia</p>
              <p class="text-body-sm text-secondary mt-1">12 Oct 2024</p>
            </div>
            <span class="rounded-full bg-surface-variant px-3 py-1 text-on-surface-variant">Pendiente</span>
          </div>
          <div class="rounded-[24px] bg-surface p-5 flex items-center justify-between gap-4">
            <div>
              <p class="text-label-md font-semibold">Keratina organica</p>
              <p class="text-body-sm text-secondary mt-1">05 Sep 2024</p>
            </div>
            <span class="rounded-full bg-secondary-fixed px-3 py-1 text-on-secondary-fixed-variant">Aprobada</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PerfilComponent {}
