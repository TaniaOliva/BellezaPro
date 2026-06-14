import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../core/services/usuario.service';
import { ReporteService } from '../../core/services/reporte.service';
import { Usuario, ReporteCliente } from '../../core/models';

@Component({
  selector: 'app-admin-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit {
  clientes: Usuario[] = [];
  seleccionado: Usuario | null = null;
  reportesCliente: ReporteCliente[] = [];
  cargando = true;
  guardando = false;
  busqueda = '';
  filtroEstado = 'activo';
  mensajeEstado = '';

  mostrarOpcionesSuspension = false;
  tipoSuspension: 'definida' | null = null;
  suspensionHasta = '';

  constructor(
    private usuarioSvc: UsuarioService,
    private reporteSvc: ReporteService
  ) {}

  get hoyStr(): string {
    const h = new Date();
    return `${h.getFullYear()}-${String(h.getMonth() + 1).padStart(2, '0')}-${String(h.getDate()).padStart(2, '0')}`;
  }

  ngOnInit(): void {
    this.usuarioSvc.listarClientes().subscribe({
      next: (data: Usuario[]) => { this.clientes = data; this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }

  get clientesFiltrados(): Usuario[] {
    return this.clientes.filter(c => {
      const coincideBusqueda = !this.busqueda ||
        `${c.nombre} ${c.apellido} ${c.email}`.toLowerCase().includes(this.busqueda.toLowerCase());
      const coincideEstado = this.filtroEstado === 'todos' || c.estado === this.filtroEstado;
      return coincideBusqueda && coincideEstado;
    });
  }

  badgeClase(estado: string): string {
    const mapa: Record<string, string> = {
      activo:     'bg-green-100 text-green-700',
      suspendido: 'bg-yellow-100 text-yellow-700',
      bloqueado:  'bg-red-100 text-red-700',
      inactivo:   'bg-gray-100 text-gray-600',
    };
    return mapa[estado] ?? 'bg-gray-100 text-gray-600';
  }

  abrirDetalle(cliente: Usuario): void {
    this.seleccionado = cliente;
    this.mensajeEstado = '';
    this.reportesCliente = [];
    this.mostrarOpcionesSuspension = false;
    this.tipoSuspension = null;
    this.suspensionHasta = '';
    this.reporteSvc.porCliente(cliente._id).subscribe({
      next: (data: ReporteCliente[]) => this.reportesCliente = data,
      error: () => { this.reportesCliente = []; }
    });
  }

  cerrarDetalle(): void {
    this.seleccionado = null;
    this.mostrarOpcionesSuspension = false;
    this.tipoSuspension = null;
  }

  toggleOpcionesSuspension(): void {
    this.mostrarOpcionesSuspension = !this.mostrarOpcionesSuspension;
    if (!this.mostrarOpcionesSuspension) this.tipoSuspension = null;
  }

  cambiarEstado(estado: string, suspensionFin?: string | null): void {
    if (!this.seleccionado) return;
    this.guardando = true;
    this.usuarioSvc.actualizarEstado(this.seleccionado._id, estado, suspensionFin).subscribe({
      next: (actualizado: Usuario) => {
        this.seleccionado = actualizado;
        this.guardando = false;
        this.mostrarOpcionesSuspension = false;
        this.tipoSuspension = null;
        this.mensajeEstado = estado === 'suspendido'
          ? suspensionFin
            ? `Suspendido hasta ${new Date(suspensionFin).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })}`
            : 'Suspendido indefinidamente'
          : `Estado actualizado a ${estado}`;
        setTimeout(() => { this.mensajeEstado = ''; }, 4000);
        this.usuarioSvc.listarClientes().subscribe((data: Usuario[]) => { this.clientes = data; });
      },
      error: () => { this.guardando = false; }
    });
  }

  suspenderIndefinido(): void { this.cambiarEstado('suspendido', null); }

  suspenderDefinido(): void {
    if (!this.suspensionHasta) return;
    this.cambiarEstado('suspendido', this.suspensionHasta);
  }

  suspenderRapido(dias: number): void {
    const fin = new Date();
    fin.setDate(fin.getDate() + dias);
    const finStr = `${fin.getFullYear()}-${String(fin.getMonth() + 1).padStart(2, '0')}-${String(fin.getDate()).padStart(2, '0')}`;
    this.cambiarEstado('suspendido', finStr);
  }
}
