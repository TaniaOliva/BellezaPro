import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitaService } from '../../core/services/cita.service';
import { AuthService } from '../../core/services/auth.service';
import { Cita } from '../../core/models';

@Component({
  selector: 'app-estilista-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit {
  citasHoy: Cita[] = [];
  citasEsteMes: Cita[] = [];
  nombreEstilista = '';
  cargando = true;
  citas: Cita[] = [];
  diasSemana = ['L', 'M', 'X', 'J', 'V', 'S'];
  alturasBarra = [45, 60, 80, 50, 65, 30];

  constructor(private citaSvc: CitaService, private auth: AuthService) {}

  ngOnInit(): void {
    this.nombreEstilista = this.auth.getUsuario()?.nombre ?? 'Estilista';
    this.citaSvc.miAgenda().subscribe({
      next: (citas: Cita[]) => {
        const ahora = new Date();
        const hoyStr = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}-${String(ahora.getDate()).padStart(2, '0')}`;
        this.citasHoy = citas.filter((c: Cita) => c.fecha.substring(0, 10) === hoyStr);
        this.citas = this.citasHoy;
        this.citasEsteMes = citas.filter((c: Cita) => {
          const f = new Date(c.fecha);
          return f.getMonth() === ahora.getMonth() && f.getFullYear() === ahora.getFullYear();
        });
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }

  completar(id: string): void {
    this.citaSvc.actualizarEstado(id, 'completada').subscribe((citaActualizada: Cita) => {
      const idx = this.citasHoy.findIndex((c: Cita) => c._id === id);
      if (idx !== -1) this.citasHoy[idx] = citaActualizada;
    });
  }
}

