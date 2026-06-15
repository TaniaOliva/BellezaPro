import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitudService } from '../../core/services/solicitud.service';
import { CategoriaService } from '../../core/services/categoria.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { BloqueoService } from '../../core/services/bloqueo.service';
import { CitaService } from '../../core/services/cita.service';
import { SolicitudEspecial, Usuario } from '../../core/models';

@Component({
  selector: 'app-cliente-solicitud-especial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitud-especial.component.html',
  styleUrl: './solicitud-especial.component.css'
})
export class SolicitudEspecialComponent implements OnInit {
  vistaActual: 'mis' | 'nueva' = 'mis';

  // Nueva solicitud
  currentStep = 1;
  selectedCategory = '';
  presupuesto = '';
  selectedStylistId = '';
  descripcion = '';
  fechaSugerida = '';
  horaSugerida = '';
  imagenBase64 = '';
  imagenNombre = '';
  enviando = false;
  errorForm = '';
  exitoEnvio = false;

  readonly steps = ['Categoría', 'Descripción', 'Fecha', 'Estilista', 'Confirmar'];

  categorias: string[] = [];
  todosEstilistas: Usuario[] = [];
  cargandoCats = true;
  cargandoEstilistas = true;

  get estilistas(): Usuario[] {
    if (!this.selectedCategory) return this.todosEstilistas;
    return this.todosEstilistas.filter(e =>
      e.especialidades?.some(esp => esp.toLowerCase() === this.selectedCategory.toLowerCase())
    );
  }

  // Mis solicitudes
  solicitudes: SolicitudEspecial[] = [];
  cargandoSolicitudes = true;

  // Contraoferta
  solicitudContraoferta: SolicitudEspecial | null = null;
  contraFecha = '';
  contraHora = '';
  contraEstilistaId = '';
  contraMensaje = '';
  enviandoContra = false;
  errorContra = '';

  // Calendario contraoferta
  contraCalMes = new Date();
  contraDiasMes: Date[] = [];
  contraSpacers: null[] = [];
  contraDiasBloqueadosSet: Set<string> = new Set();
  contraRazonesBloqueo: Map<string, string> = new Map();

  // Slots contraoferta
  contraSlots: { hora: string; disponible: boolean }[] = [];
  contraCargandoSlots = false;
  contraMensajeBloqueo = '';

  bloqueos: { fechaInicio: string; fechaFin: string; cierreTotalSalon: boolean; razon?: string }[] = [];

  get hoy(): string {
    return new Date().toISOString().slice(0, 10);
  }

  get fechaSugeridaBloqueada(): boolean {
    if (!this.fechaSugerida) return false;
    const d = new Date(this.fechaSugerida + 'T12:00:00').getTime();
    return this.bloqueos.some(b => {
      const ini = new Date(b.fechaInicio.slice(0, 10) + 'T12:00:00').getTime();
      const fin = new Date(b.fechaFin.slice(0, 10) + 'T12:00:00').getTime();
      if (d < ini || d > fin) return false;
      return b.cierreTotalSalon;
    });
  }

  readonly HORAS = [
    '09:00','09:30','10:00','10:30','11:00','11:30',
    '12:00','12:30','14:00','14:30','15:00','15:30',
    '16:00','16:30','17:00','17:30'
  ];

  // Confirm cancel solicitud
  solicitudACancelar: SolicitudEspecial | null = null;
  cancelandoSolicitud = false;

  constructor(
    private solicitudSvc: SolicitudService,
    private categoriaSvc: CategoriaService,
    private usuarioSvc: UsuarioService,
    private bloqueoSvc: BloqueoService,
    private citaSvc: CitaService
  ) {}

  ngOnInit(): void {
    this.cargarSolicitudes();
    this.categoriaSvc.listar().subscribe({
      next: (cats) => { this.categorias = cats.map(c => c.nombre); this.cargandoCats = false; },
      error: () => this.cargandoCats = false
    });
    this.usuarioSvc.listarEstilistas().subscribe({
      next: (data) => { this.todosEstilistas = data; this.cargandoEstilistas = false; },
      error: () => this.cargandoEstilistas = false
    });
    const hoy = new Date().toISOString().slice(0, 10);
    const finAnio = new Date(new Date().getFullYear() + 1, 11, 31).toISOString().slice(0, 10);
    this.bloqueoSvc.listarParaCliente(hoy, finAnio).subscribe({
      next: (data) => { this.bloqueos = data; },
      error: () => {}
    });
  }

  cargarSolicitudes(): void {
    this.cargandoSolicitudes = true;
    this.solicitudSvc.misSolicitudes().subscribe({
      next: (data) => { this.solicitudes = data; this.cargandoSolicitudes = false; },
      error: () => this.cargandoSolicitudes = false
    });
  }

  iniciales(u: Usuario): string {
    return `${u.nombre?.[0] ?? ''}${u.apellido?.[0] ?? ''}`.toUpperCase();
  }

  get nombreEstilistaSeleccionado(): string {
    if (!this.selectedStylistId) return 'Sin preferencia';
    const s = this.estilistas.find(e => e._id === this.selectedStylistId);
    return s ? `${s.nombre} ${s.apellido}` : 'Sin preferencia';
  }

  onImagenSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    if (file.size > 5 * 1024 * 1024) { this.errorForm = 'La imagen no puede superar 5 MB.'; return; }
    this.imagenNombre = file.name;
    const reader = new FileReader();
    reader.onload = () => { this.imagenBase64 = reader.result as string; };
    reader.readAsDataURL(file);
  }

  quitarImagen(): void {
    this.imagenBase64 = '';
    this.imagenNombre = '';
  }

  enviar(): void {
    if (!this.selectedCategory || this.descripcion.length < 10) {
      this.errorForm = 'Completa la categoría y la descripción (mínimo 10 caracteres)';
      return;
    }
    this.enviando = true;
    this.errorForm = '';
    const datos: any = {
      categoria: this.selectedCategory,
      descripcion: this.descripcion,
      presupuesto: this.presupuesto || undefined,
      estilistaPreferida: this.selectedStylistId || undefined,
      imagenUrl: this.imagenBase64 || undefined,
      fechaSugerida: this.fechaSugerida || undefined,
      horaSugerida: this.horaSugerida || undefined
    };
    this.solicitudSvc.crear(datos).subscribe({
      next: () => {
        this.enviando = false;
        this.exitoEnvio = true;
        this.currentStep = 1;
        this.selectedCategory = '';
        this.presupuesto = '';
        this.selectedStylistId = '';
        this.descripcion = '';
        this.fechaSugerida = '';
        this.horaSugerida = '';
        this.imagenBase64 = '';
        this.imagenNombre = '';
        setTimeout(() => {
          this.exitoEnvio = false;
          this.vistaActual = 'mis';
          this.cargarSolicitudes();
        }, 2000);
      },
      error: (err: any) => {
        this.errorForm = err.error?.mensaje || 'Error al enviar';
        this.enviando = false;
      }
    });
  }

  // ── Acciones sobre propuestas ────────────────────────────────────────────────

  aceptar(sol: SolicitudEspecial): void {
    this.solicitudSvc.aceptarPropuesta(sol._id).subscribe({
      next: () => this.cargarSolicitudes(),
      error: (err: any) => alert(err.error?.mensaje || 'Error al aceptar')
    });
  }

  abrirContraoferta(sol: SolicitudEspecial): void {
    this.solicitudContraoferta = sol;
    this.contraFecha = '';
    this.contraHora = '';
    this.contraEstilistaId = sol.estilistaAsignada?._id ?? '';
    this.contraMensaje = '';
    this.errorContra = '';
    this.contraSlots = [];
    this.contraMensajeBloqueo = '';

    this.contraCalMes = new Date();
    this.contraGenerarDias();
    this.contraCargarBloqueosMes();
  }

  enviarContraoferta(): void {
    if (!this.contraFecha || !this.contraHora) { this.errorContra = 'Selecciona fecha y hora'; return; }
    if (!this.solicitudContraoferta) return;
    this.enviandoContra = true;
    this.errorContra = '';
    this.solicitudSvc.contraproponer(this.solicitudContraoferta._id, {
      fechaContraoferta: this.contraFecha,
      horaContraoferta: this.contraHora,
      estilistaContraoferta: this.contraEstilistaId || undefined,
      mensajeContraoferta: this.contraMensaje || undefined
    }).subscribe({
      next: () => {
        this.enviandoContra = false;
        this.solicitudContraoferta = null;
        this.cargarSolicitudes();
      },
      error: (err: any) => {
        this.errorContra = err.error?.mensaje || 'Error al enviar';
        this.enviandoContra = false;
      }
    });
  }

  // ── Calendario contraoferta ──────────────────────────────────────────────────

  contraGenerarDias(): void {
    const inicio = new Date(this.contraCalMes.getFullYear(), this.contraCalMes.getMonth(), 1);
    const fin = new Date(this.contraCalMes.getFullYear(), this.contraCalMes.getMonth() + 1, 0);
    this.contraDiasMes = [];
    for (let d = new Date(inicio); d <= fin; d.setDate(d.getDate() + 1)) {
      this.contraDiasMes.push(new Date(d));
    }
    this.contraSpacers = Array(inicio.getDay()).fill(null);
  }

  contraGetFechaStr(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  }

  contraEsPasado(dia: Date): boolean {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return dia < hoy;
  }

  contraEsBloqueado(dia: Date): boolean {
    return this.contraDiasBloqueadosSet.has(this.contraGetFechaStr(dia));
  }

  contraCargarBloqueosMes(): void {
    const inicio = new Date(this.contraCalMes.getFullYear(), this.contraCalMes.getMonth(), 1);
    const fin = new Date(this.contraCalMes.getFullYear(), this.contraCalMes.getMonth() + 1, 0);
    const inicioStr = this.contraGetFechaStr(inicio);
    const finStr = this.contraGetFechaStr(fin);
    const estilistaId = this.contraEstilistaId || undefined;

    this.bloqueoSvc.listarParaCliente(inicioStr, finStr, estilistaId).subscribe({
      next: (bloqueos) => {
        const set = new Set<string>();
        const reasons = new Map<string, string>();
        for (const b of bloqueos) {
          const cur = new Date(b.fechaInicio.slice(0, 10) + 'T12:00:00');
          const end = new Date(b.fechaFin.slice(0, 10) + 'T12:00:00');
          const razon = (b as any).razon
            || (b.cierreTotalSalon ? 'El salón está cerrado este período.' : 'La estilista no está disponible.');
          while (cur <= end) {
            const key = this.contraGetFechaStr(cur);
            set.add(key);
            reasons.set(key, razon);
            cur.setDate(cur.getDate() + 1);
          }
        }
        this.contraDiasBloqueadosSet = set;
        this.contraRazonesBloqueo = reasons;
      },
      error: () => {}
    });
  }

  contraMesSiguiente(): void {
    this.contraCalMes = new Date(this.contraCalMes.getFullYear(), this.contraCalMes.getMonth() + 1, 1);
    this.contraGenerarDias();
    this.contraCargarBloqueosMes();
  }

  contraMesAnterior(): void {
    this.contraCalMes = new Date(this.contraCalMes.getFullYear(), this.contraCalMes.getMonth() - 1, 1);
    this.contraGenerarDias();
    this.contraCargarBloqueosMes();
  }

  contraSeleccionarFecha(dia: Date): void {
    if (this.contraEsPasado(dia)) return;
    const fechaStr = this.contraGetFechaStr(dia);
    this.contraFecha = fechaStr;
    this.contraHora = '';
    this.contraSlots = [];
    this.contraMensajeBloqueo = '';

    if (this.contraEsBloqueado(dia)) {
      this.contraMensajeBloqueo = this.contraRazonesBloqueo.get(fechaStr) || 'Este día no está disponible.';
      return;
    }

    const duracion = this.solicitudContraoferta?.duracionEstimada ?? 0;
    if (duracion > 0) this.contraCargarSlots();
  }

  contraSeleccionarHora(slot: { hora: string; disponible: boolean }): void {
    if (!slot.disponible) return;
    this.contraHora = slot.hora;
  }

  contraCargarSlots(): void {
    const duracion = this.solicitudContraoferta?.duracionEstimada ?? 0;
    if (!this.contraFecha || duracion <= 0) return;
    this.contraCargandoSlots = true;
    this.contraSlots = [];
    const estilistaId = this.contraEstilistaId || undefined;
    this.citaSvc.getDisponibilidad(this.contraFecha, duracion, estilistaId).subscribe({
      next: (res) => {
        this.contraCargandoSlots = false;
        if (res.bloqueado === 'salon') {
          this.contraMensajeBloqueo = 'El salón está cerrado ese día.';
        } else if (res.bloqueado === 'estilista') {
          this.contraMensajeBloqueo = 'La estilista no está disponible ese día.';
        } else {
          this.contraSlots = res.todos;
        }
      },
      error: () => { this.contraCargandoSlots = false; }
    });
  }

  contraOnEstilistaChange(): void {
    this.contraHora = '';
    this.contraSlots = [];
    this.contraMensajeBloqueo = '';
    this.contraCargarBloqueosMes();
    if (this.contraFecha) this.contraCargarSlots();
  }

  get contraSinDisponibles(): boolean {
    return this.contraSlots.length > 0 && this.contraSlots.every(s => !s.disponible);
  }

  // ── Cancelar solicitud ───────────────────────────────────────────────────────

  abrirCancelarSolicitud(s: SolicitudEspecial): void {
    this.solicitudACancelar = s;
  }

  confirmarCancelarSolicitud(): void {
    if (!this.solicitudACancelar) return;
    this.cancelandoSolicitud = true;
    this.solicitudSvc.cancelar(this.solicitudACancelar._id).subscribe({
      next: () => { this.cancelandoSolicitud = false; this.solicitudACancelar = null; this.cargarSolicitudes(); },
      error: () => { this.cancelandoSolicitud = false; this.solicitudACancelar = null; }
    });
  }

  // ── Labels ───────────────────────────────────────────────────────────────────

  estadoLabel(estado: string): string {
    const map: Record<string, string> = {
      pendiente: 'Pendiente', propuesta: 'Propuesta del salón',
      contraoferta: 'Contraoferta enviada', aceptada: 'Aceptada',
      rechazada: 'Rechazada', cancelada: 'Cancelada'
    };
    return map[estado] ?? estado;
  }

  estadoClase(estado: string): string {
    const map: Record<string, string> = {
      pendiente: 'bg-yellow-100 text-yellow-700',
      propuesta: 'bg-blue-100 text-blue-700',
      contraoferta: 'bg-orange-100 text-orange-700',
      aceptada: 'bg-green-100 text-green-700',
      rechazada: 'bg-red-100 text-red-700',
      cancelada: 'bg-gray-100 text-gray-500'
    };
    return map[estado] ?? 'bg-gray-100 text-gray-700';
  }

  get solicitudesConAccion(): SolicitudEspecial[] {
    return this.solicitudes.filter(s => s.estado === 'propuesta');
  }

  get solicitudesVisibles(): SolicitudEspecial[] {
    return this.solicitudes.filter(s => s.estado !== 'aceptada');
  }
}
