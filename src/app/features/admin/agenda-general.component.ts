import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../core/services/usuario.service';
import { CitaService } from '../../core/services/cita.service';
import { BloqueoService } from '../../core/services/bloqueo.service';
import { Usuario, Cita, Bloqueo, ConflictoBloqueo } from '../../core/models';

type Vista = 'dia' | 'semana' | 'mes';

@Component({
  selector: 'app-admin-agenda-general',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agenda-general.component.html',
  styleUrl: './agenda-general.component.css'
})
export class AgendaGeneralComponent implements OnInit {
  estilistas: Usuario[] = [];
  citas: Cita[] = [];
  bloqueos: Bloqueo[] = [];
  cargando = true;

  vistaActual: Vista = 'semana';
  fechaBase = new Date();
  filtroEstilista = 'todas';
  mostrarModalBloqueo = false;
  mostrarGestionBloqueos = false;
  editandoBloqueoId: string | null = null;
  formBloqueo = { estilistaId: '', cierreTotalSalon: false, fechaInicio: '', fechaFin: '', razon: '' };
  conflictos: ConflictoBloqueo | null = null;
  verificandoConflictos = false;
  guardandoBloqueo = false;
  errorModal = '';

  private readonly MESES = [
    'enero','febrero','marzo','abril','mayo','junio',
    'julio','agosto','septiembre','octubre','noviembre','diciembre'
  ];
  private readonly DIAS_CORTO = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  private readonly DIAS_LARGO = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  private readonly PALETA = [
    '#ef4444','#f97316','#eab308','#22c55e',
    '#06b6d4','#3b82f6','#8b5cf6','#ec4899'
  ];

  constructor(
    private usuarioSvc: UsuarioService,
    private citaSvc: CitaService,
    private bloqueoSvc: BloqueoService
  ) {}

  ngOnInit(): void {
    this.usuarioSvc.listarTodosEstilistas().subscribe(data => { this.estilistas = data; });
    this.citaSvc.listarTodas().subscribe({
      next: data => { this.citas = data; this.cargando = false; },
      error: () => { this.cargando = false; }
    });
    this.bloqueoSvc.listarTodos().subscribe(data => { this.bloqueos = data; });
  }

  // Navegación

  irAnterior(): void {
    const d = new Date(this.fechaBase);
    if (this.vistaActual === 'dia') d.setDate(d.getDate() - 1);
    else if (this.vistaActual === 'semana') d.setDate(d.getDate() - 7);
    else d.setMonth(d.getMonth() - 1);
    this.fechaBase = d;
  }

  irSiguiente(): void {
    const d = new Date(this.fechaBase);
    if (this.vistaActual === 'dia') d.setDate(d.getDate() + 1);
    else if (this.vistaActual === 'semana') d.setDate(d.getDate() + 7);
    else d.setMonth(d.getMonth() + 1);
    this.fechaBase = d;
  }

  irHoy(): void { this.fechaBase = new Date(); }

  irADia(dia: Date): void {
    this.fechaBase = new Date(dia);
    this.vistaActual = 'dia';
  }

  // Fechas

  get tituloRango(): string {
    const f = this.fechaBase;
    const mes = this.MESES[f.getMonth()];
    const anio = f.getFullYear();
    if (this.vistaActual === 'mes') return `${mes.charAt(0).toUpperCase() + mes.slice(1)} ${anio}`;
    if (this.vistaActual === 'dia') return `${this.DIAS_LARGO[f.getDay()]}, ${f.getDate()} de ${mes} de ${anio}`;
    const dias = this.diasDeSemanaVista;
    const ini = dias[0], fin = dias[6];
    if (ini.getMonth() === fin.getMonth()) {
      return `${ini.getDate()} – ${fin.getDate()} de ${this.MESES[ini.getMonth()]} ${anio}`;
    }
    return `${ini.getDate()} ${this.MESES[ini.getMonth()]} – ${fin.getDate()} ${this.MESES[fin.getMonth()]} ${anio}`;
  }

  private getLunes(d: Date): Date {
    const dia = new Date(d);
    const dow = dia.getDay();
    dia.setDate(dia.getDate() + (dow === 0 ? -6 : 1 - dow));
    return dia;
  }

  toDateStr(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  get diasDeSemanaVista(): Date[] {
    const lunes = this.getLunes(this.fechaBase);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(lunes); d.setDate(d.getDate() + i); return d;
    });
  }

  get diasDeMesVista(): Date[] {
    const primero = new Date(this.fechaBase.getFullYear(), this.fechaBase.getMonth(), 1);
    const lunes = this.getLunes(primero);
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(lunes); d.setDate(d.getDate() + i); return d;
    });
  }

  get horasDeVista(): string[] {
    const horas: string[] = [];
    for (let h = 8; h < 20; h++) {
      horas.push(`${String(h).padStart(2, '0')}:00`);
      horas.push(`${String(h).padStart(2, '0')}:30`);
    }
    return horas;
  }

  esHoy(d: Date): boolean {
    const hoy = new Date();
    return d.getDate() === hoy.getDate() && d.getMonth() === hoy.getMonth() && d.getFullYear() === hoy.getFullYear();
  }

  esMesActual(d: Date): boolean {
    return d.getMonth() === this.fechaBase.getMonth() && d.getFullYear() === this.fechaBase.getFullYear();
  }

  formatDiaHeader(d: Date): string {
    return `${this.DIAS_CORTO[d.getDay()]} ${d.getDate()}`;
  }

  // Citas

  get citasFiltradas(): Cita[] {
    if (this.filtroEstilista === 'todas') return this.citas;
    return this.citas.filter(c => (c.estilistaId?._id ?? c.estilistaId) === this.filtroEstilista);
  }

  get citasHoy(): number {
    const hoy = new Date().toISOString().slice(0, 10);
    return this.citas.filter(c => c.fecha?.slice(0, 10) === hoy).length;
  }

  get citasPendientes(): number { return this.citas.filter(c => c.estado === 'pendiente').length; }
  get citasConfirmadas(): number { return this.citas.filter(c => c.estado === 'confirmada').length; }

  getCitasParaCelda(dia: Date, hora: string): Cita[] {
    const f = this.toDateStr(dia);
    return this.citasFiltradas.filter(c => c.fecha?.slice(0, 10) === f && c.hora === hora);
  }

  getCitasDia(dia: Date): Cita[] {
    const f = this.toDateStr(dia);
    return this.citasFiltradas.filter(c => c.fecha?.slice(0, 10) === f);
  }

  getCitaEstilista(dia: Date, hora: string, estilistaId: string): Cita | null {
    const f = this.toDateStr(dia);
    return this.citas.find(c =>
      c.fecha?.slice(0, 10) === f &&
      c.hora === hora &&
      (c.estilistaId?._id ?? c.estilistaId) === estilistaId
    ) ?? null;
  }

  get estilistasDia(): Usuario[] {
    if (this.filtroEstilista === 'todas') return this.estilistas;
    return this.estilistas.filter(e => e._id === this.filtroEstilista);
  }

  // Colores

  getColorHex(idOrIndex: string | number): string {
    if (typeof idOrIndex === 'number') return this.PALETA[idOrIndex % this.PALETA.length];
    const idx = this.estilistas.findIndex(e => e._id === idOrIndex);
    return this.PALETA[Math.max(0, idx) % this.PALETA.length];
  }

  // Bloqueos
  // Usa comparación de strings para evitar desfase de timezone UTC→local
  getBloqueoPara(dia: Date, estilistaId: string | null): Bloqueo | null {
    const dStr = this.toDateStr(dia);
    return this.bloqueos.find(b => {
      const iniStr = (b.fechaInicio as string).slice(0, 10);
      const finStr = (b.fechaFin as string).slice(0, 10);
      if (dStr < iniStr || dStr > finStr) return false;
      if (b.cierreTotalSalon) return true;
      if (estilistaId === null) return false;
      return (b.estilistaId?._id ?? b.estilistaId) === estilistaId;
    }) ?? null;
  }

  get bloqueosVigentes(): Bloqueo[] {
    const hoy = this.toDateStr(new Date());
    return this.bloqueos.filter(b => (b.fechaFin as string).slice(0, 10) >= hoy);
  }

  get hoyStr(): string { return this.toDateStr(new Date()); }

  getBloqueoDia(dia: Date): Bloqueo | null {
    return this.getBloqueoPara(dia, this.filtroEstilista === 'todas' ? null : this.filtroEstilista);
  }

  abrirModalBloqueo(): void {
    this.editandoBloqueoId = null;
    this.formBloqueo = { estilistaId: '', cierreTotalSalon: false, fechaInicio: '', fechaFin: '', razon: '' };
    this.conflictos = null;
    this.errorModal = '';
    this.mostrarModalBloqueo = true;
  }

  editarBloqueo(b: Bloqueo): void {
    this.editandoBloqueoId = b._id;
    this.formBloqueo = {
      estilistaId: b.estilistaId?._id ?? b.estilistaId ?? '',
      cierreTotalSalon: b.cierreTotalSalon,
      fechaInicio: (b.fechaInicio as string).slice(0, 10),
      fechaFin: (b.fechaFin as string).slice(0, 10),
      razon: b.razon ?? ''
    };
    this.conflictos = null;
    this.errorModal = '';
    this.mostrarModalBloqueo = true;
  }

  cerrarModalBloqueo(): void { this.mostrarModalBloqueo = false; }

  onCierreTotalChange(): void {
    this.formBloqueo.estilistaId = '';
    this.resetConflictos();
  }

  resetConflictos(): void { this.conflictos = null; this.errorModal = ''; }

  verificarConflictos(): void {
    const { estilistaId, cierreTotalSalon, fechaInicio, fechaFin } = this.formBloqueo;
    if (!fechaInicio || !fechaFin) { this.errorModal = 'Selecciona el rango de fechas.'; return; }
    if (fechaFin < fechaInicio) { this.errorModal = 'La fecha fin debe ser posterior a la fecha inicio.'; return; }
    if (!cierreTotalSalon && !estilistaId) { this.errorModal = 'Selecciona una estilista o activa el cierre total.'; return; }
    this.verificandoConflictos = true;
    this.errorModal = '';
    const datos = { fechaInicio, fechaFin, cierreTotalSalon, estilistaId: cierreTotalSalon ? undefined : estilistaId };
    this.bloqueoSvc.verificarConflictos(datos).subscribe({
      next: data => { this.conflictos = data; this.verificandoConflictos = false; },
      error: () => { this.verificandoConflictos = false; this.errorModal = 'Error al verificar conflictos.'; }
    });
  }

  confirmarBloqueo(): void {
    const { estilistaId, cierreTotalSalon, fechaInicio, fechaFin, razon } = this.formBloqueo;
    this.guardandoBloqueo = true;
    const datos = { fechaInicio, fechaFin, razon, cierreTotalSalon, estilistaId: cierreTotalSalon ? undefined : estilistaId };
    const op = this.editandoBloqueoId
      ? this.bloqueoSvc.actualizar(this.editandoBloqueoId, datos)
      : this.bloqueoSvc.crear(datos);
    op.subscribe({
      next: () => {
        this.guardandoBloqueo = false;
        this.mostrarModalBloqueo = false;
        this.editandoBloqueoId = null;
        this.bloqueoSvc.listarTodos().subscribe(data => { this.bloqueos = data; });
      },
      error: err => {
        this.guardandoBloqueo = false;
        this.errorModal = err?.error?.mensaje ?? 'Error al guardar el bloqueo.';
      }
    });
  }

  eliminarBloqueo(id: string): void {
    this.bloqueoSvc.eliminar(id).subscribe(() => {
      this.bloqueos = this.bloqueos.filter(b => b._id !== id);
    });
  }
}
