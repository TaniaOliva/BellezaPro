import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estilista-agenda',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent {
  selectedCita: any = null;
  viewMode: 'semana' | 'dia' = 'semana';

  diasSemana = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie'];
  horasDisponibles = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00'
  ];

  citasHardcodeadas = [
    {
      dia: 0, // Lun
      horaInicio: '09:00',
      duracion: 45,
      cliente: 'Laura M.',
      servicio: 'Manicure Clasico',
      precioCompleto: 'Laura Mendez',
      servicioCompleto: 'Manicure Clasico',
      horaCompleta: '09:00',
      precio: 'L 150',
      duracionCompleta: '45 min',
      estado: 'Confirmada'
    },
    {
      dia: 1, // Mar
      horaInicio: '10:30',
      duracion: 70,
      cliente: 'Sofia T.',
      servicio: 'Nail Art',
      precioCompleto: 'Sofia Torres',
      servicioCompleto: 'Nail Art Sencillo',
      horaCompleta: '10:30',
      precio: 'L 200',
      duracionCompleta: '70 min',
      estado: 'Confirmada'
    },
    {
      dia: 2, // Mie
      horaInicio: '09:00',
      duracion: 60,
      cliente: 'Carmen R.',
      servicio: 'Manicure Gel',
      precioCompleto: 'Carmen Reyes',
      servicioCompleto: 'Manicure Gel',
      horaCompleta: '09:00',
      precio: 'L 180',
      duracionCompleta: '60 min',
      estado: 'Confirmada'
    },
    {
      dia: 2, // Mie
      horaInicio: '12:00',
      duracion: 75,
      cliente: 'Valeria C.',
      servicio: 'Pedicure Spa',
      precioCompleto: 'Valeria Cruz',
      servicioCompleto: 'Pedicure Spa',
      horaCompleta: '12:00',
      precio: 'L 220',
      duracionCompleta: '75 min',
      estado: 'Confirmada'
    },
    {
      dia: 3, // Jue
      horaInicio: '14:00',
      duracion: 70,
      cliente: 'Ana P.',
      servicio: 'Manicure premium',
      precioCompleto: 'Ana P.',
      servicioCompleto: 'Manicure premium',
      horaCompleta: '14:00',
      precio: 'L 250',
      duracionCompleta: '70 min',
      estado: 'Confirmada'
    }
  ];

  citasResumenDias = [
    { dia: 'Lun', numero: 1 },
    { dia: 'Mar', numero: 1 },
    { dia: 'Mie', numero: 2, esHoy: true },
    { dia: 'Jue', numero: 1 },
    { dia: 'Vie', numero: 0 }
  ];

  abrirCita(cita: any) {
    this.selectedCita = cita;
  }

  cerrarCita() {
    this.selectedCita = null;
  }

  marcarCompletada() {
    alert('Cita marcada como completada');
    this.cerrarCita();
  }

  cancelarCita() {
    alert('Cita cancelada');
    this.cerrarCita();
  }

  obtenerCitaEnHora(dia: number, hora: string): any {
    return this.citasHardcodeadas.find(c => c.dia === dia && c.horaInicio === hora);
  }

  obtenerAltoCita(duracion: number): string {
    return `${duracion * 0.8}px`;
  }

  esBloqueado(dia: number, hora: string): boolean {
    return dia === 4 && hora === '10:00'; // Viernes 10:00 bloqueado
  }
}

