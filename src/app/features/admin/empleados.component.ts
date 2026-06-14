import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../core/services/usuario.service';
import { CategoriaService } from '../../core/services/categoria.service';
import { Usuario, Categoria } from '../../core/models';

@Component({
  selector: 'app-admin-empleados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './empleados.component.html',
  styleUrl: './empleados.component.css'
})
export class EmpleadosComponent implements OnInit {
  empleados: Usuario[] = [];
  categorias: Categoria[] = [];
  cargando = true;
  mostrarDrawer = false;
  busqueda = '';
  filtroEstado = 'activo';

  seleccionado: Usuario | null = null;
  confirmandoEliminarId: string | null = null;
  form = { nombre: '', apellido: '', email: '', telefono: '', estado: 'activo' };
  especialidades: string[] = [];
  mostrarDropdownEsp = false;
  guardando = false;
  error = '';

  constructor(private usuarioSvc: UsuarioService, private categoriaSvc: CategoriaService) {}

  ngOnInit(): void {
    this.cargar();
    this.categoriaSvc.listarAdmin().subscribe(cats => this.categorias = cats);
  }

  get empleadosFiltrados(): Usuario[] {
    return this.empleados.filter(e => {
      const coincideBusqueda = !this.busqueda ||
        `${e.nombre} ${e.apellido} ${e.email}`.toLowerCase().includes(this.busqueda.toLowerCase());
      const coincideEstado = this.filtroEstado === 'todos' || e.estado === this.filtroEstado;
      return coincideBusqueda && coincideEstado;
    });
  }

  cargar(): void {
    this.usuarioSvc.listarTodosEstilistas().subscribe({
      next: (data) => { this.empleados = data; this.cargando = false; },
      error: () => this.cargando = false
    });
  }

  abrirNuevo(): void {
    this.seleccionado = null;
    this.form = { nombre: '', apellido: '', email: '', telefono: '', estado: 'activo' };
    this.especialidades = [];
    this.mostrarDropdownEsp = false;
    this.error = '';
    this.mostrarDrawer = true;
  }

  abrirEditar(e: Usuario): void {
    this.seleccionado = e;
    this.form = { nombre: e.nombre, apellido: e.apellido ?? '', email: e.email, telefono: e.telefono ?? '', estado: e.estado };
    this.especialidades = [...(e.especialidades ?? [])];
    this.mostrarDropdownEsp = false;
    this.error = '';
    this.mostrarDrawer = true;
  }

  toggleEsp(nombre: string): void {
    const idx = this.especialidades.indexOf(nombre);
    if (idx >= 0) this.especialidades.splice(idx, 1);
    else this.especialidades.push(nombre);
  }

  quitarEsp(i: number): void { this.especialidades.splice(i, 1); }

  guardar(): void {
    if (!this.form.nombre || !this.form.apellido || !this.form.email) {
      this.error = 'Nombre, apellido y correo son obligatorios';
      return;
    }
    this.guardando = true;
    this.error = '';
    const datos = { ...this.form, especialidades: this.especialidades } as any;

    const op = this.seleccionado
      ? this.usuarioSvc.actualizarEmpleado(this.seleccionado._id, datos)
      : this.usuarioSvc.crearEmpleado(datos);

    op.subscribe({
      next: () => { this.mostrarDrawer = false; this.guardando = false; this.cargar(); },
      error: (err: any) => { this.error = err.error?.mensaje || 'Error al guardar'; this.guardando = false; }
    });
  }

  toggleEstado(e: Usuario): void {
    const nuevo = e.estado === 'activo' ? 'inactivo' : 'activo';
    this.usuarioSvc.actualizarEstado(e._id, nuevo).subscribe(() => this.cargar());
  }

  eliminar(id: string): void {
    this.usuarioSvc.eliminarEmpleado(id).subscribe({
      next: () => { this.confirmandoEliminarId = null; this.cargar(); },
      error: () => { this.confirmandoEliminarId = null; }
    });
  }
}
