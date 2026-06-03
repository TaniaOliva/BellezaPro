import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../core/services/usuario.service';
import { CitaService } from '../../core/services/cita.service';
import { Usuario, Cita } from '../../core/models';

@Component({
  selector: 'app-admin-agenda-general',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white min-h-screen">
      <div class="px-8 py-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-8">Agenda General</h1>

        <div class="grid grid-cols-4 gap-6 mb-8">
          <div class="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <p class="text-xs text-gray-600 uppercase font-semibold">Citas hoy</p>
            <p class="text-3xl font-bold text-gray-800 mt-2">12</p>
          </div>
          <div class="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <p class="text-xs text-gray-600 uppercase font-semibold">Citas esta semana</p>
            <p class="text-3xl font-bold text-gray-800 mt-2">67</p>
          </div>
          <div class="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <p class="text-xs text-gray-600 uppercase font-semibold">Capacidad</p>
            <p class="text-3xl font-bold text-red-600 mt-2">78%</p>
          </div>
          <div class="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <p class="text-xs text-gray-600 uppercase font-semibold">Ausencias</p>
            <p class="text-3xl font-bold text-red-600 mt-2">3</p>
          </div>
        </div>

        <!-- Selector de estilista -->
        <div class="mb-6 flex gap-4 items-center">
          <select class="p-3 border border-gray-300 rounded-lg text-gray-700">
            <option>Todas las estilistas</option>
            <option>Sofia R.</option>
            <option>María F.</option>
            <option>Ana G.</option>
          </select>
          <select class="p-3 border border-gray-300 rounded-lg text-gray-700">
            <option>Ver semana</option>
            <option>Ver día</option>
            <option>Ver mes</option>
          </select>
        </div>

        <!-- Agenda en tabla -->
        <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Hora</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Cliente</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Estilista</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Servicio</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Duración</th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4"><p class="font-semibold">09:00 AM</p></td>
                  <td class="px-6 py-4"><p class="text-gray-700">María Garcia</p></td>
                  <td class="px-6 py-4"><p class="text-gray-700">Sofia R.</p></td>
                  <td class="px-6 py-4"><p class="text-gray-700">Manicure</p></td>
                  <td class="px-6 py-4"><p class="text-gray-700">1:30 h</p></td>
                  <td class="px-6 py-4"><span class="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">Confirmada</span></td>
                </tr>
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4"><p class="font-semibold">10:45 AM</p></td>
                  <td class="px-6 py-4"><p class="text-gray-700">Jessica López</p></td>
                  <td class="px-6 py-4"><p class="text-gray-700">María F.</p></td>
                  <td class="px-6 py-4"><p class="text-gray-700">Pedicure Spa</p></td>
                  <td class="px-6 py-4"><p class="text-gray-700">2 h</p></td>
                  <td class="px-6 py-4"><span class="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">En curso</span></td>
                </tr>
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4"><p class="font-semibold">02:00 PM</p></td>
                  <td class="px-6 py-4"><p class="text-gray-700">Carmen Rodríguez</p></td>
                  <td class="px-6 py-4"><p class="text-gray-700">Ana G.</p></td>
                  <td class="px-6 py-4"><p class="text-gray-700">Coloración</p></td>
                  <td class="px-6 py-4"><p class="text-gray-700">2:30 h</p></td>
                  <td class="px-6 py-4"><span class="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded">Pendiente</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AgendaGeneralComponent implements OnInit {
  estilistas: Usuario[] = [];
  citas: Cita[] = [];
  filtroEstilista = 'todas';
  cargando = true;
  mostrarModalBloqueo = false;
  bloqueo = { estilistaId: '', fechaInicio: '', fechaFin: '', motivo: '' };

  constructor(
    private usuarioSvc: UsuarioService,
    private citaSvc: CitaService
  ) {}

  ngOnInit(): void {
    this.usuarioSvc.listarEstilistas().subscribe((data: Usuario[]) => {
      this.estilistas = data;
    });
    this.citaSvc.miAgenda().subscribe({
      next: (data: Cita[]) => { this.citas = data; this.cargando = false; },
      error: () => this.cargando = false
    });
  }

  get citasFiltradas(): Cita[] {
    if (this.filtroEstilista === 'todas') return this.citas;
    return this.citas.filter((c: Cita) => {
      const id = c.estilistaId?._id ?? c.estilistaId;
      return id === this.filtroEstilista;
    });
  }

  cambiarEstado(id: string, estado: string): void {
    this.citaSvc.actualizarEstado(id, estado).subscribe((actualizada: Cita) => {
      this.citas = this.citas.map((c: Cita) => c._id === id ? actualizada : c);
    });
  }
}
