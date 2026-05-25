import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-estilista-reportar-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportar-cliente.component.html',
  styleUrls: ['./reportar-cliente.component.css']
})
export class ReportarClienteComponent {
  selectedCita: string = '';
  selectedMotivo: string = '';
  descripcion: string = '';

  citasRecientes = [
    {
      id: '1',
      cliente: 'Sofia Torres',
      servicio: 'Nail Art',
      fecha: 'hoy 10:30',
      avatar: 'ST'
    },
    {
      id: '2',
      cliente: 'Valeria Cruz',
      servicio: 'Pedicure Spa',
      fecha: 'ayer 14:00',
      avatar: 'VC'
    },
    {
      id: '3',
      cliente: 'Laura Mendez',
      servicio: 'Manicure Clasico',
      fecha: '27 Abr',
      avatar: 'LM'
    },
    {
      id: '4',
      cliente: 'Carmen Reyes',
      servicio: 'Manicure Gel',
      fecha: '25 Abr',
      avatar: 'CR'
    },
    {
      id: '5',
      cliente: 'Ana P.',
      servicio: 'Manicure premium',
      fecha: '24 Abr',
      avatar: 'AP'
    }
  ];

  motivos = [
    'No asistio sin avisar',
    'Cancelaciones repetidas',
    'Mal comportamiento',
    'Problema con el pago',
    'Otro motivo'
  ];

  reportesAnteriores = [
    {
      cliente: 'Valeria Cruz',
      motivo: 'Cancelaciones repetidas',
      fecha: '20 Abr',
      estado: 'En revision',
      estadoBg: 'bg-[#FFF3E0]',
      estadoText: 'text-[#E65100]'
    },
    {
      cliente: 'Ana P.',
      motivo: 'No asistio sin avisar',
      fecha: '15 Abr',
      estado: 'Resuelto',
      estadoBg: 'bg-[#E8F5E9]',
      estadoText: 'text-[#2E7D32]'
    }
  ];

  seleccionarCita(citaId: string) {
    this.selectedCita = this.selectedCita === citaId ? '' : citaId;
  }

  deseleccionarCita() {
    this.selectedCita = '';
  }

  actualizarDescripcion() {
    if (this.descripcion.length > 500) {
      this.descripcion = this.descripcion.substring(0, 500);
    }
  }

  enviarReporte() {
    alert('Reporte enviado correctamente');
    this.selectedCita = '';
    this.selectedMotivo = '';
    this.descripcion = '';
  }

  puedeEnviar(): boolean {
    return this.selectedCita !== '' && this.selectedMotivo !== '';
  }

  obtenerCitaSeleccionada(): any {
    return this.citasRecientes.find(c => c.id === this.selectedCita);
  }
}

