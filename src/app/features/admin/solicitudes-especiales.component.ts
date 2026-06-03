import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitudService } from '../../core/services/solicitud.service';
import { SolicitudEspecial } from '../../core/models';

@Component({
  selector: 'app-admin-solicitudes-especiales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white min-h-screen">
      <div class="px-8 py-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Solicitudes Especiales</h1>
        <p class="text-gray-600 mb-8">Revisa y gestiona las solicitudes personalizadas de clientes.</p>

        <div class="space-y-4">
          <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
            <div class="flex items-start justify-between gap-4 mb-4">
              <div>
                <p class="text-sm text-red-600 font-semibold uppercase">Evento especial</p>
                <h2 class="text-xl font-bold text-gray-800 mt-2">Solicitud para boda de cliente</h2>
              </div>
              <span class="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded">Nueva</span>
            </div>

            <div class="grid grid-cols-2 gap-6 mb-4">
              <div>
                <p class="text-xs text-gray-600 uppercase font-semibold mb-1">Cliente</p>
                <p class="text-gray-800 font-semibold">María Garcia</p>
              </div>
              <div>
                <p class="text-xs text-gray-600 uppercase font-semibold mb-1">Presupuesto</p>
                <p class="text-gray-800 font-semibold">L. 1,200</p>
              </div>
            </div>

            <p class="text-gray-700 mb-4">"Estoy buscando un paquete completo para novia con manicure, pedicure y maquillaje profesional para 15 personas. Fecha tentativa: 10 de mayo."</p>

            <div class="flex gap-3">
              <button class="bg-red-600 text-white rounded-lg py-3 px-5 font-semibold hover:bg-red-700 transition">Ver detalles</button>
              <button class="border border-gray-300 text-gray-700 rounded-lg py-3 px-5 font-semibold hover:bg-gray-100 transition">Archivar</button>
            </div>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
            <div class="flex items-start justify-between gap-4 mb-4">
              <div>
                <p class="text-sm text-red-600 font-semibold uppercase">Paquete personalizado</p>
                <h2 class="text-xl font-bold text-gray-800 mt-2">Solicitud de paquete spa</h2>
              </div>
              <span class="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded">Revisión</span>
            </div>

            <div class="grid grid-cols-2 gap-6 mb-4">
              <div>
                <p class="text-xs text-gray-600 uppercase font-semibold mb-1">Cliente</p>
                <p class="text-gray-800 font-semibold">Jessica López</p>
              </div>
              <div>
                <p class="text-xs text-gray-600 uppercase font-semibold mb-1">Presupuesto</p>
                <p class="text-gray-800 font-semibold">L. 980</p>
              </div>
            </div>

            <p class="text-gray-700 mb-4">"Paquete de relajación con masaje de aromaterapia y tratamiento facial hidratante para celebración de cumpleaños."</p>

            <div class="flex gap-3">
              <button class="bg-red-600 text-white rounded-lg py-3 px-5 font-semibold hover:bg-red-700 transition">Ver detalles</button>
              <button class="border border-gray-300 text-gray-700 rounded-lg py-3 px-5 font-semibold hover:bg-gray-100 transition">Archivar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SolicitudesEspecialesComponent implements OnInit {
  solicitudes: SolicitudEspecial[] = [];
  seleccionada: SolicitudEspecial | null = null;
  cargando = true;
  precio = 0;
  duracion = 0;
  respuesta = '';
  guardando = false;

  constructor(private solicitudSvc: SolicitudService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.solicitudSvc.listarTodas().subscribe({
      next: (data: SolicitudEspecial[]) => { this.solicitudes = data; this.cargando = false; },
      error: () => this.cargando = false
    });
  }

  abrir(s: SolicitudEspecial): void {
    this.seleccionada = s;
    this.precio = s.precioEstimado ?? 0;
    this.duracion = s.duracionEstimada ?? 0;
    this.respuesta = s.respuesta ?? '';
  }

  aprobar(): void {
    if (!this.seleccionada) return;
    this.guardando = true;
    this.solicitudSvc.responder(this.seleccionada._id, {
      estado: 'aprobada', respuesta: this.respuesta,
      precioEstimado: this.precio, duracionEstimada: this.duracion
    }).subscribe({
      next: () => { this.seleccionada = null; this.guardando = false; this.cargar(); },
      error: () => this.guardando = false
    });
  }

  rechazar(): void {
    if (!this.seleccionada) return;
    this.guardando = true;
    this.solicitudSvc.responder(this.seleccionada._id, {
      estado: 'rechazada', respuesta: this.respuesta
    }).subscribe({
      next: () => { this.seleccionada = null; this.guardando = false; this.cargar(); },
      error: () => this.guardando = false
    });
  }
}

