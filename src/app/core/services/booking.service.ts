import { Injectable } from '@angular/core';

export interface BookingState {
  servicio: any;
  variantes: any;
  precioFinal: number;
  estilista: any;
  fecha: string;
  hora: string;
  notas: string;
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private estado: Partial<BookingState> = {};

  setServicio(servicio: any, variantes: any, precioFinal: number): void {
    this.estado = { servicio, variantes, precioFinal };
  }

  setEstilista(estilista: any): void {
    this.estado.estilista = estilista;
  }

  setHorario(fecha: string, hora: string): void {
    this.estado.fecha = fecha;
    this.estado.hora = hora;
  }

  setNotas(notas: string): void {
    this.estado.notas = notas;
  }

  getEstado(): Partial<BookingState> {
    return this.estado;
  }

  limpiar(): void {
    this.estado = {};
  }
}
