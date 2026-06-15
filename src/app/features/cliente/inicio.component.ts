import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CitaService } from '../../core/services/cita.service';
import { ServicioService } from '../../core/services/servicio.service';
import { AuthService } from '../../core/services/auth.service';
import { BookingService } from '../../core/services/booking.service';
import { Cita, Servicio } from '../../core/models';

@Component({
  selector: 'app-cliente-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit {
  proximaCita: Cita | null = null;
  citasEsteMes = 0;
  ultimasCitas: Cita[] = [];
  serviciosPopulares: Servicio[] = [];
  nombreUsuario = '';
  calificacion = 0;
  estrellasLlenas: number[] = [];
  tieneMediaEstrella = false;

  constructor(
    private citaSvc: CitaService,
    private servicioSvc: ServicioService,
    private auth: AuthService,
    private bookingSvc: BookingService,
    private router: Router
  ) {}

  agendar(servicio: Servicio): void {
    this.bookingSvc.preseleccionarServicio(servicio);
    this.router.navigate(['/cliente/servicios/opciones']);
  }

  agendarDesdeCita(cita: Cita): void {
    const id = cita.servicioId?._id ?? cita.servicioId;
    this.servicioSvc.obtener(id).subscribe(servicio => {
      this.bookingSvc.preseleccionarServicio(servicio);
      this.router.navigate(['/cliente/servicios/opciones']);
    });
  }

  labelEstado(estado: string): string {
    const map: Record<string, string> = {
      confirmada: 'Confirmada',
      terminada:  'Completada',
      cancelada:  'Cancelada',
      pendiente:  'Pendiente',
    };
    return map[estado] ?? estado;
  }

  badgeEstado(estado: string): string {
    const base = 'text-xs font-semibold px-2 py-0.5 rounded-full';
    const colores: Record<string, string> = {
      confirmada: `${base} bg-blue-100 text-blue-700`,
      terminada:  `${base} bg-green-100 text-green-700`,
      cancelada:  `${base} bg-gray-100 text-gray-500`,
      pendiente:  `${base} bg-yellow-100 text-yellow-700`,
    };
    return colores[estado] ?? `${base} bg-gray-100 text-gray-500`;
  }

  private actualizarEstrellas(): void {
    this.estrellasLlenas = Array(Math.floor(this.calificacion)).fill(0);
    this.tieneMediaEstrella = (this.calificacion % 1) >= 0.5;
  }

  ngOnInit(): void {
    const usuario = this.auth.getUsuario();
    this.nombreUsuario = usuario?.nombre ?? 'Cliente';

    this.auth.obtenerPerfil().subscribe(perfil => {
      this.calificacion = perfil.calificacionPromedio ?? 0;
      this.actualizarEstrellas();
      this.auth.actualizarUsuario({ calificacionPromedio: this.calificacion });
    });

    this.citaSvc.misCitas().subscribe((citas: Cita[]) => {
      const validas = citas.filter((c: Cita) => ['confirmada', 'terminada', 'cancelada'].includes(c.estado));

      const terminadas = validas.filter((c: Cita) => c.estado === 'terminada');
      const ordenadas = [...terminadas].sort((a, b) => (b._id > a._id ? 1 : -1));
      this.ultimasCitas = ordenadas.slice(0, 3);

      const hoyDate = new Date();
      const hoyStr = hoyDate.toISOString().slice(0, 10);
      const activas = validas.filter((c: Cita) => c.estado === 'confirmada' && c.fecha.slice(0, 10) >= hoyStr);
      this.proximaCita = activas.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())[0] ?? null;

      this.citasEsteMes = validas.filter((c: Cita) => {
        if (c.estado === 'cancelada') return false;
        const f = new Date(c.fecha);
        return f.getMonth() === hoyDate.getMonth() && f.getFullYear() === hoyDate.getFullYear();
      }).length;
    });

    this.servicioSvc.listarPopulares().subscribe((svcs: Servicio[]) => {
      this.serviciosPopulares = svcs;
    });
  }
}
