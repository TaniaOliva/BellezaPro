import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteService } from '../../../core/services/reporte.service';
import { ReporteCliente } from '../../../core/models';

@Component({
  selector: 'app-admin-reportes-clientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes-clientes.component.html',
  styleUrl: './reportes-clientes.component.css'
})
export class ReportesClientesComponent implements OnInit {
  reportes: ReporteCliente[] = [];
  seleccionado: ReporteCliente | null = null;
  cargando = true;
  guardando = false;
  filtroTab = 'en_revision';

  readonly tabs = [
    { label: 'Pendientes', value: 'en_revision' },
    { label: 'Resueltos',  value: 'resuelto' },
    { label: 'Todos',      value: 'todos' },
  ];

  constructor(private reporteSvc: ReporteService) {}

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.reporteSvc.listarTodos().subscribe({
      next: (data: ReporteCliente[]) => { this.reportes = data; this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }

  get reportesFiltrados(): ReporteCliente[] {
    if (this.filtroTab === 'todos') return this.reportes;
    return this.reportes.filter(r => r.estado === this.filtroTab);
  }

  contarPorTab(valor: string): number {
    if (valor === 'todos') return this.reportes.length;
    return this.reportes.filter(r => r.estado === valor).length;
  }

  badgeClase(estado: string): string {
    if (estado === 'resuelto') return 'bg-green-100 text-green-700';
    return 'bg-red-100 text-red-700';
  }

  abrirResolver(r: ReporteCliente): void { this.seleccionado = r; }

  resolver(accion: string): void {
    if (!this.seleccionado) return;
    this.guardando = true;
    this.reporteSvc.resolver(this.seleccionado._id, accion).subscribe({
      next: () => { this.seleccionado = null; this.guardando = false; this.cargar(); },
      error: () => { this.guardando = false; }
    });
  }
}
