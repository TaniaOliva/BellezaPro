import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReporteService } from '../../core/services/reporte.service';
import { CitaService } from '../../core/services/cita.service';
import { Cita, ReporteCliente } from '../../core/models';

@Component({
  selector: 'app-estilista-reportar-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportar-cliente.component.html',
  styleUrl: './reportar-cliente.component.css'
})
export class ReportarClienteComponent implements OnInit {
  selectedCita = '';
  selectedMotivo = '';
  descripcion = '';
  cargando = true;
  enviando = false;
  mensaje = '';

  citasRecientes: any[] = [];
  reportesAnteriores: any[] = [];

  motivos = [
    'No asistió sin avisar',
    'Cancelaciones repetidas',
    'Mal comportamiento',
    'Problema con el pago',
    'Otro motivo'
  ];

  constructor(private citaSvc: CitaService, private reporteSvc: ReporteService) {}

  ngOnInit(): void {
    this.citaSvc.miAgenda().subscribe({
      next: (data: Cita[]) => {
        this.citasRecientes = data
          .filter((c: Cita) => c.estado === 'completada')
          .slice(0, 5)
          .map((c: Cita) => {
            const nombre = c.clienteId?.nombre ?? String(c.clienteId);
            const apellido = c.clienteId?.apellido ?? '';
            return {
              id: c._id,
              cliente: nombre + (apellido ? ' ' + apellido : ''),
              fecha: c.fecha + ' ' + c.hora,
              servicio: c.servicioId?.nombre ?? String(c.servicioId),
              avatar: (nombre.slice(0, 1) + (apellido.slice(0, 1) || nombre.slice(1, 2))).toUpperCase()
            };
          });
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
    this.reporteSvc.listarTodos().subscribe({
      next: (data: ReporteCliente[]) => {
        this.reportesAnteriores = data.slice(0, 5).map((r: ReporteCliente) => ({
          cliente: r.clienteId?.nombre ?? String(r.clienteId),
          motivo: r.motivo,
          fecha: r.creadoEn,
          estado: r.estado
        }));
      },
      error: () => {}
    });
  }

  seleccionarCita(citaId: string): void { this.selectedCita = this.selectedCita === citaId ? '' : citaId; }

  deseleccionarCita(): void { this.selectedCita = ''; }

  actualizarDescripcion(): void { if (this.descripcion.length > 500) this.descripcion = this.descripcion.substring(0, 500); }

  enviarReporte(): void {
    if (!this.puedeEnviar()) return;
    this.enviando = true;
    this.reporteSvc.crear({
      citaId: this.selectedCita,
      motivo: this.selectedMotivo,
      descripcion: this.descripcion
    } as any).subscribe({
      next: () => {
        this.mensaje = 'Reporte enviado correctamente';
        this.selectedCita = ''; this.selectedMotivo = ''; this.descripcion = '';
        this.enviando = false;
      },
      error: () => { this.mensaje = 'Error al enviar el reporte'; this.enviando = false; }
    });
  }

  cancelarReporte(): void { this.selectedCita = ''; this.selectedMotivo = ''; this.descripcion = ''; }

  puedeEnviar(): boolean { return this.selectedCita !== '' && this.selectedMotivo !== '' && this.descripcion.length >= 20; }

  obtenerCitaSeleccionada(): any { return this.citasRecientes.find(c => c.id === this.selectedCita); }
}
