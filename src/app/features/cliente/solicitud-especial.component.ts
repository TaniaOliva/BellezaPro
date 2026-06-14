import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitudService } from '../../core/services/solicitud.service';
import { CategoriaService } from '../../core/services/categoria.service';
import { UsuarioService } from '../../core/services/usuario.service';
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
  imagenBase64 = '';
  imagenNombre = '';
  enviando = false;
  errorForm = '';
  exitoEnvio = false;

  readonly steps = ['Categoría', 'Descripción', 'Estilista', 'Confirmar'];

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

  readonly HORAS = [
    '09:00','09:30','10:00','10:30','11:00','11:30',
    '12:00','12:30','14:00','14:30','15:00','15:30',
    '16:00','16:30','17:00','17:30'
  ];

  constructor(
    private solicitudSvc: SolicitudService,
    private categoriaSvc: CategoriaService,
    private usuarioSvc: UsuarioService
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
      imagenUrl: this.imagenBase64 || undefined
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

  // Acciones del cliente sobre propuestas
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

  estadoLabel(estado: string): string {
    const map: Record<string, string> = {
      pendiente: 'Pendiente', propuesta: 'Propuesta del salón',
      contraoferta: 'Contraoferta enviada', aceptada: 'Aceptada', rechazada: 'Rechazada'
    };
    return map[estado] ?? estado;
  }

  estadoClase(estado: string): string {
    const map: Record<string, string> = {
      pendiente: 'bg-yellow-100 text-yellow-700',
      propuesta: 'bg-blue-100 text-blue-700',
      contraoferta: 'bg-orange-100 text-orange-700',
      aceptada: 'bg-green-100 text-green-700',
      rechazada: 'bg-red-100 text-red-700'
    };
    return map[estado] ?? 'bg-gray-100 text-gray-700';
  }

  get solicitudesConAccion(): SolicitudEspecial[] {
    return this.solicitudes.filter(s => s.estado === 'propuesta');
  }
}
