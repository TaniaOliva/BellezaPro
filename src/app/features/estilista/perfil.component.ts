import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-estilista-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {
  especialidades = [
    { nombre: 'Manicure', activa: true },
    { nombre: 'Nail Art', activa: true },
    { nombre: 'Pedicure', activa: true },
    { nombre: 'Cortes', activa: false },
    { nombre: 'Tintes', activa: false },
    { nombre: 'Maquillaje', activa: false },
    { nombre: 'Cejas', activa: false }
  ];

  horario = [
    { dia: 'Lunes', activo: true, inicio: '09:00', fin: '18:00' },
    { dia: 'Martes', activo: true, inicio: '09:00', fin: '18:00' },
    { dia: 'Miercoles', activo: true, inicio: '09:00', fin: '18:00' },
    { dia: 'Jueves', activo: true, inicio: '09:00', fin: '18:00' },
    { dia: 'Viernes', activo: true, inicio: '09:00', fin: '18:00' },
    { dia: 'Sabado', activo: false, inicio: '', fin: '' },
    { dia: 'Domingo', activo: false, inicio: '', fin: '' }
  ];

  toggleEspecialidad(index: number) {
    this.especialidades[index].activa = !this.especialidades[index].activa;
  }

  toggleHorario(index: number) {
    this.horario[index].activo = !this.horario[index].activo;
    if (!this.horario[index].activo) {
      this.horario[index].inicio = '';
      this.horario[index].fin = '';
    } else {
      this.horario[index].inicio = '09:00';
      this.horario[index].fin = '18:00';
    }
  }

  guardarEspecialidades() {
    alert('Especialidades guardadas');
  }

  guardarHorario() {
    alert('Horario guardado');
  }
}

