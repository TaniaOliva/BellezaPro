import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitaService } from '../../core/services/cita.service';
import { AuthService } from '../../core/services/auth.service';
import { CalificacionService } from '../../core/services/calificacion.service';
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
  nombreEstilista = '';
  cargando = true;
  calificacionPromedio = 0;
  calificacionTotal = 0;

  diasSemana = ['L', 'M', 'X', 'J', 'V', 'S'];
  citasPorDia = [0, 0, 0, 0, 0, 0];
  alturasBarra = [0, 0, 0, 0, 0, 0];

  constructor(
    private citaSvc: CitaService,
    private auth: AuthService,
    private calificacionSvc: CalificacionService
  ) {}

  ngOnInit(): void {
    const usuario = this.auth.getUsuario();
    this.nombreEstilista = usuario?.nombre ?? 'Estilista';

    this.citaSvc.miAgenda().subscribe({
      next: (citas: Cita[]) => {
        const ahora = new Date();
        const hoyStr = this.toDateStr(ahora);

        this.citasHoy = citas.filter(c => c.fecha.substring(0, 10) === hoyStr && c.estado === 'confirmada');
        this.calcularActividadSemanal(citas, ahora);
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });

    const estilistaId = usuario?._id ?? usuario?.id;
    if (estilistaId) {
      this.calificacionSvc.getPromedio(estilistaId).subscribe({
        next: res => {
          this.calificacionPromedio = res.promedio ?? 0;
          this.calificacionTotal = res.total ?? 0;
        },
        error: () => {}
      });
    }
  }

  private toDateStr(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  private calcularActividadSemanal(citas: Cita[], hoy: Date): void {
    // Calcular lunes de la semana actual como string para evitar problemas de timezone
    const diaSemana = hoy.getDay(); // 0=Dom, 1=Lun...6=Sab
    const diffLunes = diaSemana === 0 ? -6 : 1 - diaSemana;
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() + diffLunes);
    const lunesStr = this.toDateStr(lunes);
    const sabado = new Date(lunes);
    sabado.setDate(lunes.getDate() + 5);
    const sabadoStr = this.toDateStr(sabado);

    const conteos = [0, 0, 0, 0, 0, 0];

    for (const cita of citas) {
      if (cita.estado !== 'terminada') continue;
      const fechaStr = cita.fecha.slice(0, 10);
      if (fechaStr < lunesStr || fechaStr > sabadoStr) continue;
      // Parsear fecha local para evitar desfase de timezone
      const [y, m, d] = fechaStr.split('-').map(Number);
      const dow = new Date(y, m - 1, d).getDay(); // 0=Dom...6=Sab
      const idx = dow === 0 ? -1 : dow - 1;       // L=0 M=1 X=2 J=3 V=4 S=5
      if (idx >= 0 && idx <= 5) conteos[idx]++;
    }

    this.citasPorDia = conteos;
    const max = Math.max(...conteos);
    this.alturasBarra = conteos.map(n =>
      max === 0 ? 0 : Math.max(Math.round((n / max) * 100), n > 0 ? 10 : 0)
    );
  }

  completar(id: string): void {
    this.citaSvc.actualizarEstado(id, 'terminada').subscribe(() => {
      this.citasHoy = this.citasHoy.filter(c => c._id !== id);
    });
  }

  get estrellasMostrar(): number {
    return Math.round(this.calificacionPromedio);
  }

  get sinActividadSemanal(): boolean {
    return this.citasPorDia.every(n => n === 0);
  }
}
