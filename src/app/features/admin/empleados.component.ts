import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../core/services/usuario.service';
import { Usuario } from '../../core/models';

@Component({
  selector: 'app-admin-empleados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white min-h-screen">
      <div class="px-8 py-8">
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-3xl font-bold text-gray-800">Gestionar Estilistas</h1>
          <button class="bg-red-600 text-white rounded-lg px-6 py-3 font-semibold hover:bg-red-700 transition flex items-center gap-2">
            <span class="material-symbols-outlined">add</span>
            Agregar estilista
          </button>
        </div>

        <!-- Buscador y filtros -->
        <div class="mb-6 flex gap-4">
          <div class="flex-1 flex items-center border border-gray-300 rounded-lg px-4 py-2 bg-white">
            <span class="material-symbols-outlined text-gray-400">search</span>
            <input type="text" placeholder="Buscar estilista..." class="ml-2 flex-1 outline-none text-gray-700">
          </div>
          <button class="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-semibold">Activos</button>
          <button class="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg font-semibold hover:bg-gray-50">Todos</button>
        </div>

        <!-- Tabla de estilistas -->
        <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Nombre</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Email</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Teléfono</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Especialidades</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Estado</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr class="hover:bg-gray-50 transition">
                <td class="px-6 py-4"><p class="font-semibold text-gray-800">Sofia R.</p></td>
                <td class="px-6 py-4"><p class="text-gray-600">sofia&#64;bellezapro.com</p></td>
                <td class="px-6 py-4"><p class="text-gray-600">+504 3321-1234</p></td>
                <td class="px-6 py-4"><p class="text-sm text-gray-600">Manicure, Nail Art</p></td>
                <td class="px-6 py-4"><span class="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded">Activo</span></td>
                <td class="px-6 py-4 text-center">
                  <button class="text-red-600 font-semibold text-sm hover:text-red-700">Editar</button>
                </td>
              </tr>
              <tr class="hover:bg-gray-50 transition">
                <td class="px-6 py-4"><p class="font-semibold text-gray-800">María F.</p></td>
                <td class="px-6 py-4"><p class="text-gray-600">maria&#64;bellezapro.com</p></td>
                <td class="px-6 py-4"><p class="text-gray-600">+504 3322-5678</p></td>
                <td class="px-6 py-4"><p class="text-sm text-gray-600">Pedicure, Spa</p></td>
                <td class="px-6 py-4"><span class="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded">Activo</span></td>
                <td class="px-6 py-4 text-center">
                  <button class="text-red-600 font-semibold text-sm hover:text-red-700">Editar</button>
                </td>
              </tr>
              <tr class="hover:bg-gray-50 transition">
                <td class="px-6 py-4"><p class="font-semibold text-gray-800">Ana G.</p></td>
                <td class="px-6 py-4"><p class="text-gray-600">ana&#64;bellezapro.com</p></td>
                <td class="px-6 py-4"><p class="text-gray-600">+504 3323-9999</p></td>
                <td class="px-6 py-4"><p class="text-sm text-gray-600">Cabello, Coloración</p></td>
                <td class="px-6 py-4"><span class="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded">Activo</span></td>
                <td class="px-6 py-4 text-center">
                  <button class="text-red-600 font-semibold text-sm hover:text-red-700">Editar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class EmpleadosComponent implements OnInit {
  empleados: Usuario[] = [];
  cargando = true;
  mostrarDrawer = false;
  nuevo = { nombre: '', apellido: '', email: '', telefono: '' };
  guardando = false;
  error = '';

  constructor(private usuarioSvc: UsuarioService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.usuarioSvc.listarEstilistas().subscribe({
      next: (data: Usuario[]) => { this.empleados = data; this.cargando = false; },
      error: () => this.cargando = false
    });
  }

  guardar(): void {
    if (!this.nuevo.nombre || !this.nuevo.email) {
      this.error = 'Nombre y correo son obligatorios';
      return;
    }
    this.guardando = true;
    this.usuarioSvc.crearEmpleado(this.nuevo as any).subscribe({
      next: () => {
        this.mostrarDrawer = false;
        this.nuevo = { nombre: '', apellido: '', email: '', telefono: '' };
        this.guardando = false;
        this.cargar();
      },
      error: (err: any) => {
        this.error = err.error?.mensaje || 'Error al guardar';
        this.guardando = false;
      }
    });
  }

  cambiarEstado(id: string, estado: string): void {
    this.usuarioSvc.actualizarEstado(id, estado).subscribe(() => this.cargar());
  }
}

