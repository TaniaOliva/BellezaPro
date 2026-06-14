import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';
import { CitaService } from '../../../core/services/cita.service';
import { BloqueoService } from '../../../core/services/bloqueo.service';

@Component({
  selector: 'app-cliente-horario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './horario.component.html',
  styleUrl: './horario.component.css'
})
export class HorarioComponent implements OnInit {
  fechaSeleccionada = '';
  horaSeleccionada = '';
  mesActual = new Date();
  diasMes: Date[] = [];
  spacers: null[] = [];
  estado: any = {};

  slotsDisponibles: string[] = [];
  cargandoSlots = false;
  mensajeBloqueo = '';

  diasBloqueados: Set<string> = new Set();
  cargandoBloqueos = false;

  constructor(
    private bookingSvc: BookingService,
    private citaSvc: CitaService,
    private bloqueoSvc: BloqueoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.estado = this.bookingSvc.getEstado();
    if (!this.estado.servicio) { this.router.navigate(['/cliente/servicios']); return; }
    this.generarDias();
    this.cargarDiasBloqueados();
  }

  generarDias(): void {
    const inicio = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth(), 1);
    const fin = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() + 1, 0);
    this.diasMes = [];
    for (let d = new Date(inicio); d <= fin; d.setDate(d.getDate() + 1)) {
      this.diasMes.push(new Date(d));
    }
    this.spacers = Array(inicio.getDay()).fill(null);
  }

  cargarDiasBloqueados(): void {
    const inicio = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth(), 1);
    const fin = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() + 1, 0);
    const inicioStr = this.getFechaStr(inicio);
    const finStr = this.getFechaStr(fin);
    const estilistaId = this.estado.estilista?._id;

    this.cargandoBloqueos = true;
    this.diasBloqueados = new Set();

    this.bloqueoSvc.listarParaCliente(inicioStr, finStr, estilistaId).subscribe({
      next: (bloqueos) => {
        const set = new Set<string>();
        for (const b of bloqueos) {
          let cur = new Date(b.fechaInicio);
          const end = new Date(b.fechaFin);
          while (cur <= end) {
            set.add(this.getFechaStr(cur));
            cur.setDate(cur.getDate() + 1);
          }
        }
        this.diasBloqueados = set;
        this.cargandoBloqueos = false;
      },
      error: () => { this.cargandoBloqueos = false; }
    });
  }

  getFechaStr(dia: Date): string {
    const y = dia.getFullYear();
    const m = String(dia.getMonth() + 1).padStart(2, '0');
    const d = String(dia.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  esPasado(dia: Date): boolean {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return dia < hoy;
  }

  esBloqueado(dia: Date): boolean {
    return this.diasBloqueados.has(this.getFechaStr(dia));
  }

  seleccionarFecha(dia: Date): void {
    if (this.esPasado(dia) || this.esBloqueado(dia)) return;
    const fechaStr = this.getFechaStr(dia);
    this.fechaSeleccionada = fechaStr;
    this.horaSeleccionada = '';
    this.slotsDisponibles = [];
    this.mensajeBloqueo = '';
    this.cargandoSlots = true;

    const duracion = this.estado.servicio?.duracion ?? 60;
    const estilistaId = this.estado.estilista?._id;

    this.citaSvc.getDisponibilidad(fechaStr, duracion, estilistaId).subscribe({
      next: (res) => {
        this.cargandoSlots = false;
        if (res.bloqueado === 'salon') {
          this.mensajeBloqueo = 'El salón está cerrado ese día.';
        } else if (res.bloqueado === 'estilista') {
          this.mensajeBloqueo = 'La estilista no está disponible ese día.';
        } else {
          this.slotsDisponibles = res.slots;
          if (res.slots.length === 0) {
            this.mensajeBloqueo = 'No hay horarios disponibles para ese día con la duración requerida del servicio.';
          }
        }
      },
      error: () => {
        this.cargandoSlots = false;
        this.mensajeBloqueo = 'No se pudo verificar la disponibilidad. Intenta nuevamente.';
      }
    });
  }

  seleccionarHora(hora: string): void {
    this.horaSeleccionada = hora;
  }

  mesSiguiente(): void {
    this.mesActual = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() + 1, 1);
    this.generarDias();
    this.fechaSeleccionada = '';
    this.horaSeleccionada = '';
    this.slotsDisponibles = [];
    this.mensajeBloqueo = '';
    this.cargarDiasBloqueados();
  }

  mesAnterior(): void {
    this.mesActual = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() - 1, 1);
    this.generarDias();
    this.fechaSeleccionada = '';
    this.horaSeleccionada = '';
    this.slotsDisponibles = [];
    this.mensajeBloqueo = '';
    this.cargarDiasBloqueados();
  }

  continuar(): void {
    if (!this.fechaSeleccionada || !this.horaSeleccionada) return;
    this.bookingSvc.setHorario(this.fechaSeleccionada, this.horaSeleccionada);
    this.router.navigate(['/cliente/servicios/confirmar']);
  }
}
