import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CitaService } from '../../core/services/cita.service';
import { ServicioService } from '../../core/services/servicio.service';
import { AuthService } from '../../core/services/auth.service';
import { Cita, Servicio } from '../../core/models';

@Component({
  selector: 'app-cliente-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-white min-h-screen">
      <!-- Banner bienvenida -->
      <div class="bg-red-50 px-8 py-12 rounded-none">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">Bienvenida, María</h1>
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
            <p class="text-2xl font-bold text-gray-800 mb-1">15 de Octubre</p>
            <p class="text-sm text-gray-600 mb-4">Estilista: Sofia Gomez</p>
            <a routerLink="/cliente/mis-citas" class="text-red-600 font-semibold text-sm hover:underline">Ver detalles →</a>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <span class="material-symbols-outlined text-red-600 text-2xl">content_cut</span>
            </div>
            <p class="text-xs text-gray-500 uppercase tracking-wider mb-2">Citas este mes</p>
            <p class="text-2xl font-bold text-gray-800">3</p>
          </div>

          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <span class="material-symbols-outlined text-red-600 text-2xl">star</span>
            </div>
            <p class="text-xs text-gray-500 uppercase tracking-wider mb-2">Mi calificacion</p>
            <div class="flex items-center gap-2">
              <p class="text-2xl font-bold text-gray-800">4.8</p>
              <div class="flex gap-0.5 text-amber-400">
                <span class="material-symbols-outlined text-lg">star</span>
                <span class="material-symbols-outlined text-lg">star</span>
                <span class="material-symbols-outlined text-lg">star</span>
                <span class="material-symbols-outlined text-lg">star</span>
                <span class="material-symbols-outlined text-lg">star_half</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Servicios populares -->
        <div>
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Servicios populares</h2>
            <a routerLink="/cliente/servicios" class="text-red-600 font-semibold text-sm">Ver todos</a>
          </div>
          <div class="grid grid-cols-4 gap-6">
            <div class="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition">
              <div class="relative bg-gray-200 h-48">
                <span class="absolute top-3 left-3 bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full uppercase">Popular</span>
              </div>
              <div class="p-5">
                <p class="text-xs text-gray-500 uppercase mb-2">Cabello</p>
                <p class="text-lg font-bold text-gray-800 mb-2">Corte y Secado Premium</p>
                <p class="text-sm text-gray-600 mb-4">Desde L. 250</p>
                <button routerLink="/cliente/servicios" class="w-full text-red-600 border border-red-600 rounded-lg py-2 font-semibold hover:bg-red-50 transition">Agendar</button>
              </div>
            </div>

            <div class="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition">
              <div class="relative bg-gray-200 h-48">
                <span class="absolute top-3 left-3 bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full uppercase">Popular</span>
              </div>
              <div class="p-5">
                <p class="text-xs text-gray-500 uppercase mb-2">Uñas</p>
                <p class="text-lg font-bold text-gray-800 mb-2">Manicure Spa Completa</p>
                <p class="text-sm text-gray-600 mb-4">Desde L. 350</p>
                <button routerLink="/cliente/servicios" class="w-full text-red-600 border border-red-600 rounded-lg py-2 font-semibold hover:bg-red-50 transition">Agendar</button>
              </div>
            </div>

            <div class="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition">
              <div class="relative bg-gray-200 h-48">
                <span class="absolute top-3 left-3 bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full uppercase">Popular</span>
              </div>
              <div class="p-5">
                <p class="text-xs text-gray-500 uppercase mb-2">Facial</p>
                <p class="text-lg font-bold text-gray-800 mb-2">Limpieza Facial Profunda</p>
                <p class="text-sm text-gray-600 mb-4">Desde L. 600</p>
                <button routerLink="/cliente/servicios" class="w-full text-red-600 border border-red-600 rounded-lg py-2 font-semibold hover:bg-red-50 transition">Agendar</button>
              </div>
            </div>

            <div class="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition">
              <div class="relative bg-gray-200 h-48">
                <span class="absolute top-3 left-3 bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full uppercase">Popular</span>
              </div>
              <div class="p-5">
                <p class="text-xs text-gray-500 uppercase mb-2">Maquillaje</p>
                <p class="text-lg font-bold text-gray-800 mb-2">Maquillaje de Noche</p>
                <p class="text-sm text-gray-600 mb-4">Desde L. 600</p>
                <button routerLink="/cliente/servicios" class="w-full text-red-600 border border-red-600 rounded-lg py-2 font-semibold hover:bg-red-50 transition">Agendar</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Explora por categoría -->
        <div>
          <h2 class="text-2xl font-bold text-gray-800 mb-6">Explora por categoria</h2>
          <div class="grid grid-cols-5 gap-4">
            <div class="bg-white rounded-lg border border-gray-200 p-6 text-center hover:bg-gray-50 transition cursor-pointer">
              <span class="material-symbols-outlined text-red-600 text-4xl mx-auto block">content_cut</span>
              <p class="font-bold text-gray-800 mt-4">Cabello</p>
              <p class="text-xs text-gray-500 mt-1">Cortes y estilo</p>
            </div>
            <div class="bg-white rounded-lg border border-gray-200 p-6 text-center hover:bg-gray-50 transition cursor-pointer">
              <span class="material-symbols-outlined text-red-600 text-4xl mx-auto block">back_hand</span>
              <p class="font-bold text-gray-800 mt-4">Uñas</p>
              <p class="text-xs text-gray-500 mt-1">Manicure y pedicure</p>
            </div>
            <div class="bg-white rounded-lg border border-gray-200 p-6 text-center hover:bg-gray-50 transition cursor-pointer">
              <span class="material-symbols-outlined text-red-600 text-4xl mx-auto block">face</span>
              <p class="font-bold text-gray-800 mt-4">Facial</p>
              <p class="text-xs text-gray-500 mt-1">Limpieza y mascarilla</p>
            </div>
            <div class="bg-white rounded-lg border border-gray-200 p-6 text-center hover:bg-gray-50 transition cursor-pointer">
              <span class="material-symbols-outlined text-red-600 text-4xl mx-auto block">brush</span>
              <p class="font-bold text-gray-800 mt-4">Maquillaje</p>
              <p class="text-xs text-gray-500 mt-1">Diario y eventos</p>
            </div>
            <div class="bg-white rounded-lg border border-gray-200 p-6 text-center hover:bg-gray-50 transition cursor-pointer">
              <span class="material-symbols-outlined text-red-600 text-4xl mx-auto block">more_horiz</span>
              <p class="font-bold text-gray-800 mt-4">Mas</p>
              <p class="text-xs text-gray-500 mt-1">Otros servicios</p>
            </div>
          </div>
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
  serviciosPopulares: Servicio[] = [];
  nombreUsuario = '';

  constructor(
    private citaSvc: CitaService,
    private servicioSvc: ServicioService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const usuario = this.auth.getUsuario();
    this.nombreUsuario = usuario?.nombre ?? 'Cliente';

    this.citaSvc.misCitas().subscribe((citas: Cita[]) => {
      const activas = citas.filter((c: Cita) => ['pendiente','confirmada'].includes(c.estado));
      this.proximaCita = activas.sort((a: Cita,b: Cita) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())[0] ?? null;
      const hoy = new Date();
      this.citasEsteMes = citas.filter((c: Cita) => {
        const f = new Date(c.fecha);
        return f.getMonth() === hoy.getMonth() && f.getFullYear() === hoy.getFullYear();
      }).length;
    });

    this.servicioSvc.listar().subscribe((svcs: Servicio[]) => {
      this.serviciosPopulares = svcs.slice(0, 4);
    });
  }
}

