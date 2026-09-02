import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ReporteService } from '../../core/services/reporte.service';
import { CitaService } from '../../core/services/cita.service';
import { Cita } from '../../core/models';

interface CitaReporte {
  id: string;
  clienteId: string;
  cliente: string;
  hora: string;
  servicio: string;
  estado: string;
  avatar: string;
}

interface ReporteEnviado {
  cliente: string;
  avatar: string;
  motivo: string;
  hora: string;
}

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
  mensajeError = '';

  citasHoy: CitaReporte[] = [];
  citasReportadas = new Set<string>();
  reportesEnviados: ReporteEnviado[] = [];

  motivos = [
    'Llegó tarde',
    'Cancelaciones repetidas',
    'Mal comportamiento',
    'Problema con el pago',
    'Otro motivo'
  ];

  constructor(private citaSvc: CitaService, private reporteSvc: ReporteService) {}

  ngOnInit(): void {
    const hoyStr = new Date().toISOString().slice(0, 10);

    forkJoin({
      agenda: this.citaSvc.miAgenda(),
      reportes: this.reporteSvc.listarMios()
    }).subscribe({
      next: ({ agenda, reportes }) => {
        // Construir citas de hoy reportables
        this.citasHoy = agenda
          .filter((c: Cita) =>
            c.fecha.slice(0, 10) === hoyStr &&
            (c.estado === 'terminada' || c.estado === 'cancelada' || c.estado === 'no_asistio')
          )
          .map((c: Cita) => {
            const nombre = c.clienteId?.nombre ?? '';
            const apellido = c.clienteId?.apellido ?? '';
            const i1 = nombre.slice(0, 1).toUpperCase();
            const i2 = (apellido.slice(0, 1) || nombre.slice(1, 2)).toUpperCase();
            return {
              id: c._id,
              clienteId: c.clienteId?._id ?? String(c.clienteId),
              cliente: `${nombre} ${apellido}`.trim(),
              hora: c.hora,
              servicio: c.servicioId?.nombre ?? '',
              estado: c.estado,
              avatar: i1 + i2
            };
          });

        // Cruzar con reportes ya guardados en BD
        for (const r of reportes) {
          const citaIdReporte = String(r.citaId?._id ?? r.citaId);
          const citaHoy = this.citasHoy.find(c => c.id === citaIdReporte);
          if (citaHoy && !this.citasReportadas.has(citaIdReporte)) {
            this.citasReportadas.add(citaIdReporte);
            this.reportesEnviados.push({
              cliente: citaHoy.cliente,
              avatar: citaHoy.avatar,
              motivo: r.motivo,
              hora: citaHoy.hora
            });
          }
        }

        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  estaReportada(citaId: string): boolean {
    return this.citasReportadas.has(citaId);
  }

  seleccionarCita(citaId: string): void {
    if (this.estaReportada(citaId)) return;
    this.selectedCita = this.selectedCita === citaId ? '' : citaId;
  }

  actualizarDescripcion(): void {
    if (this.descripcion.length > 500) this.descripcion = this.descripcion.substring(0, 500);
  }

  enviarReporte(): void {
    if (!this.puedeEnviar()) return;
    this.enviando = true;
    this.mensajeError = '';
    const cita = this.obtenerCitaSeleccionada();
    const citaId = this.selectedCita;

    this.reporteSvc.crear({
      citaId,
      clienteId: cita?.clienteId,
      motivo: this.selectedMotivo,
      descripcion: this.descripcion
    } as any).subscribe({
      next: () => {
        this.citasReportadas.add(citaId);
        this.reportesEnviados.push({
          cliente: cita?.cliente ?? '',
          avatar: cita?.avatar ?? '',
          motivo: this.selectedMotivo,
          hora: cita?.hora ?? ''
        });
        this.selectedCita = '';
        this.selectedMotivo = '';
        this.descripcion = '';
        this.enviando = false;
      },
      error: () => {
        this.mensajeError = 'Error al enviar el reporte. Intenta de nuevo.';
        this.enviando = false;
      }
    });
  }

  cancelarReporte(): void {
    this.selectedCita = '';
    this.selectedMotivo = '';
    this.descripcion = '';
    this.mensajeError = '';
  }

  puedeEnviar(): boolean {
    return (
      this.selectedCita !== '' &&
      !this.estaReportada(this.selectedCita) &&
      this.selectedMotivo !== '' &&
      this.descripcion.trim().length > 0
    );
  }

  obtenerCitaSeleccionada(): CitaReporte | undefined {
    return this.citasHoy.find(c => c.id === this.selectedCita);
  }
}
