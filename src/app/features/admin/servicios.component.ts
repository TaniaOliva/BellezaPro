import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServicioService } from '../../core/services/servicio.service';
import { CategoriaService } from '../../core/services/categoria.service';
import { Servicio, Categoria } from '../../core/models';

interface VarianteForm { tipo: string; nombre: string; precioExtra: number; descripcion: string; }
interface CatEdit { nombre: string; confirmDelete: boolean; }

@Component({
  selector: 'app-admin-servicios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css'
})
export class ServiciosComponent implements OnInit {
  servicios: Servicio[] = [];
  serviciosFiltrados: Servicio[] = [];
  categorias: Categoria[] = [];
  categoriaActiva = 'Todos';

  seleccionado: Servicio | null = null;
  mostrarDrawer = false;
  cargando = true;
  guardando = false;
  error = '';

  nuevo: Partial<Servicio> = { nombre: '', descripcion: '', categoria: '', precioBase: 0, duracion: 60, activo: true };
  variantesForm: VarianteForm[] = [];
  imagenesPreview: string[] = [];

  mostrarModalCat = false;
  tabCat: 'nueva' | 'editar' = 'nueva';
  nuevaCategoriaNombre = '';
  errorCategoria = '';
  guardandoCategoria = false;
  catEdits: Record<string, CatEdit> = {};
  guardandoCatId: string | null = null;

  constructor(
    private servicioSvc: ServicioService,
    private categoriaSvc: CategoriaService
  ) {}

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.cargando = true;
    this.categoriaSvc.listarAdmin().subscribe({ next: cats => { this.categorias = cats; this.initCatEdits(); } });
    this.servicioSvc.listarAdmin().subscribe({
      next: (data) => { this.servicios = data; this.aplicarFiltro(); this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }

  filtrar(cat: string): void { this.categoriaActiva = cat; this.aplicarFiltro(); }

  private aplicarFiltro(): void {
    this.serviciosFiltrados = this.categoriaActiva === 'Todos'
      ? this.servicios
      : this.servicios.filter(s => s.categoria === this.categoriaActiva);
  }

  get categoriasSorted(): Categoria[] {
    return [...this.categorias.filter(c => c.activo), ...this.categorias.filter(c => !c.activo)];
  }

  categoriaInactiva(nombre: string): boolean {
    const cat = this.categorias.find(c => c.nombre === nombre);
    return cat ? !cat.activo : false;
  }

  agregarImagenes(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (!files) return;
    for (const file of Array.from(files)) {
      const reader = new FileReader();
      reader.onload = (e) => { this.imagenesPreview.push(e.target!.result as string); };
      reader.readAsDataURL(file);
    }
    (event.target as HTMLInputElement).value = '';
  }

  quitarImagen(i: number): void { this.imagenesPreview.splice(i, 1); }

  abrirModalCategorias(tab: 'nueva' | 'editar' = 'nueva'): void {
    this.tabCat = tab;
    this.nuevaCategoriaNombre = '';
    this.errorCategoria = '';
    this.initCatEdits();
    this.mostrarModalCat = true;
  }

  initCatEdits(): void {
    for (const cat of this.categorias) {
      if (!this.catEdits[cat._id]) {
        this.catEdits[cat._id] = { nombre: cat.nombre, confirmDelete: false };
      } else {
        this.catEdits[cat._id].nombre = cat.nombre;
        this.catEdits[cat._id].confirmDelete = false;
      }
    }
  }

  guardarCategoria(): void {
    const nombre = this.nuevaCategoriaNombre.trim();
    if (!nombre) { this.errorCategoria = 'El nombre es obligatorio'; return; }
    this.guardandoCategoria = true;
    this.errorCategoria = '';
    this.categoriaSvc.crear(nombre).subscribe({
      next: () => { this.guardandoCategoria = false; this.nuevaCategoriaNombre = ''; this.cargar(); this.tabCat = 'editar'; },
      error: (err: any) => { this.errorCategoria = err.error?.mensaje || 'Error al crear'; this.guardandoCategoria = false; }
    });
  }

  guardarCatEdit(cat: Categoria): void {
    const nombre = this.catEdits[cat._id]?.nombre?.trim();
    if (!nombre || nombre === cat.nombre) return;
    this.guardandoCatId = cat._id;
    this.categoriaSvc.actualizar(cat._id, { nombre }).subscribe({
      next: () => { this.guardandoCatId = null; this.cargar(); },
      error: () => { this.guardandoCatId = null; }
    });
  }

  toggleCatActivo(cat: Categoria): void {
    this.categoriaSvc.actualizar(cat._id, { activo: !cat.activo } as any).subscribe({ next: () => this.cargar() });
  }

  eliminarCategoria(cat: Categoria): void {
    this.categoriaSvc.eliminar(cat._id).subscribe({
      next: () => { delete this.catEdits[cat._id]; this.cargar(); }
    });
  }

  get tiposUsados(): string[] {
    const tipos = new Set<string>();
    for (const s of this.servicios) for (const v of s.variantes ?? []) if (v.tipo) tipos.add(v.tipo);
    return Array.from(tipos).sort();
  }

  nombresParaTipo(tipo: string): string[] {
    if (!tipo) return [];
    const nombres = new Set<string>();
    for (const s of this.servicios) for (const v of s.variantes ?? []) if (v.tipo === tipo && v.nombre) nombres.add(v.nombre);
    return Array.from(nombres).sort();
  }

  abrirNuevo(): void {
    this.seleccionado = null;
    const catDefault = this.categoriaActiva !== 'Todos' ? this.categoriaActiva : '';
    this.nuevo = { nombre: '', descripcion: '', categoria: catDefault, precioBase: 0, duracion: 60, activo: true };
    this.variantesForm = [];
    this.imagenesPreview = [];
    this.error = '';
    this.mostrarDrawer = true;
  }

  abrirEditar(s: Servicio): void {
    this.seleccionado = s;
    this.nuevo = { nombre: s.nombre, descripcion: s.descripcion, categoria: s.categoria, precioBase: s.precioBase, duracion: s.duracion, activo: s.activo };
    this.variantesForm = (s.variantes ?? []).map(v => ({ tipo: v.tipo, nombre: v.nombre, precioExtra: v.precioExtra, descripcion: v.descripcion ?? '' }));
    this.imagenesPreview = [...(s.imagenes ?? [])];
    this.error = '';
    this.mostrarDrawer = true;
  }

  agregarVariante(): void { this.variantesForm.push({ tipo: '', nombre: '', precioExtra: 0, descripcion: '' }); }

  agregarOpcion(i: number): void {
    this.variantesForm.splice(i + 1, 0, { tipo: this.variantesForm[i].tipo, nombre: '', precioExtra: 0, descripcion: '' });
  }

  quitarVariante(i: number): void { this.variantesForm.splice(i, 1); }

  guardar(): void {
    if (!this.nuevo.nombre?.trim() || !this.nuevo.precioBase) { this.error = 'Nombre y precio son obligatorios'; return; }
    if (!this.nuevo.categoria) { this.error = 'Selecciona una categoría'; return; }
    this.guardando = true;
    this.error = '';
    const body = {
      ...this.nuevo,
      variantes: this.variantesForm.filter(v => v.tipo && v.nombre),
      imagenes: this.imagenesPreview
    };
    const op = this.seleccionado ? this.servicioSvc.actualizar(this.seleccionado._id, body) : this.servicioSvc.crear(body);
    op.subscribe({
      next: () => { this.mostrarDrawer = false; this.guardando = false; this.cargar(); },
      error: (err: any) => { this.error = err.error?.mensaje || 'Error al guardar'; this.guardando = false; }
    });
  }

  toggleActivo(s: Servicio): void {
    this.servicioSvc.actualizar(s._id, { activo: !s.activo }).subscribe(() => this.cargar());
  }
}
