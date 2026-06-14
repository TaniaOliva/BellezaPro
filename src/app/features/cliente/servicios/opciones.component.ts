import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { BookingService } from '../../../core/services/booking.service';

interface DimConfig {
  key: string;
  label: string;
  tipo: 'chips' | 'select';
  opciones: { nombre: string; extra: number; descripcion: string }[];
}

const TIPO_META: Record<string, { label: string; tipo: 'chips' | 'select' }> = {
  servicio:   { label: 'Tipo de servicio',                    tipo: 'chips'  },
  color:      { label: 'Color',                               tipo: 'chips'  },
  nivel:      { label: 'Nivel',                               tipo: 'chips'  },
  ocasion:    { label: 'Ocasión',                             tipo: 'select' },
  largo:      { label: 'Largo',                               tipo: 'chips'  },
  acabado:    { label: 'Acabado',                             tipo: 'chips'  },
  tecnica:    { label: 'Técnica',                             tipo: 'chips'  },
  intensidad: { label: 'Intensidad',                          tipo: 'chips'  },
  decoracion: { label: 'Decoraciones (puedes elegir varias)', tipo: 'chips'  },
};

const TIPO_ORDER = ['servicio', 'color', 'nivel', 'ocasion', 'largo', 'acabado', 'tecnica', 'intensidad', 'decoracion'];

@Component({
  selector: 'app-cliente-opciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './opciones.component.html',
  styleUrl: './opciones.component.css'
})
export class OpcionesComponent implements OnInit {
  servicio: any = null;
  configs: DimConfig[] = [];
  selecciones: Record<string, string> = {};
  decoracionesActivas: string[] = [];
  precioFinal = 0;

  constructor(private bookingSvc: BookingService, private router: Router, public location: Location) {}

  ngOnInit(): void {
    const estado = this.bookingSvc.getEstado();
    if (!estado.servicio) { this.router.navigate(['/cliente/servicios']); return; }
    this.servicio = estado.servicio;
    this.precioFinal = this.servicio.precioBase;
    this.buildConfigs();
  }

  private buildConfigs(): void {
    const grupos: Record<string, { nombre: string; extra: number; descripcion: string }[]> = {};
    for (const v of this.servicio.variantes ?? []) {
      if (!grupos[v.tipo]) grupos[v.tipo] = [];
      grupos[v.tipo].push({ nombre: v.nombre, extra: v.precioExtra, descripcion: v.descripcion ?? '' });
    }
    const ordenados = TIPO_ORDER.filter(tipo => grupos[tipo])
      .map(tipo => ({ key: tipo, ...TIPO_META[tipo], opciones: grupos[tipo] }));
    const desconocidos = Object.keys(grupos)
      .filter(t => !TIPO_ORDER.includes(t))
      .map(t => ({ key: t, label: t.charAt(0).toUpperCase() + t.slice(1), tipo: 'chips' as const, opciones: grupos[t] }));
    this.configs = [...ordenados, ...desconocidos];
    this.selecciones = {};
    for (const c of this.configs) {
      if (c.key !== 'decoracion') this.selecciones[c.key] = '';
    }
    this.decoracionesActivas = [];
  }

  seleccionar(key: string, opcion: { nombre: string; extra: number }): void {
    this.selecciones = { ...this.selecciones, [key]: opcion.nombre };
    this.calcularPrecio();
  }

  seleccionarSelect(key: string, valor: string): void {
    this.selecciones = { ...this.selecciones, [key]: valor };
    this.calcularPrecio();
  }

  toggleDecoracion(opcion: { nombre: string; extra: number }): void {
    const activa = this.decoracionesActivas.includes(opcion.nombre);
    this.decoracionesActivas = activa
      ? this.decoracionesActivas.filter(d => d !== opcion.nombre)
      : [...this.decoracionesActivas, opcion.nombre];
    this.calcularPrecio();
  }

  isDecoracionActiva(nombre: string): boolean {
    return this.decoracionesActivas.includes(nombre);
  }

  private calcularPrecio(): void {
    let extras = 0;
    for (const dim of this.configs) {
      if (dim.key === 'decoracion') continue;
      const sel = this.selecciones[dim.key];
      if (sel) {
        const op = dim.opciones.find(o => o.nombre === sel);
        if (op) extras += op.extra;
      }
    }
    const decorDim = this.configs.find(c => c.key === 'decoracion');
    if (decorDim) {
      for (const nombre of this.decoracionesActivas) {
        const op = decorDim.opciones.find(o => o.nombre === nombre);
        if (op) extras += op.extra;
      }
    }
    this.precioFinal = this.servicio.precioBase + extras;
  }

  continuar(): void {
    const seleccionesFinales = { ...this.selecciones };
    if (this.decoracionesActivas.length > 0) {
      seleccionesFinales['decoracion'] = this.decoracionesActivas.join(', ');
    }
    this.bookingSvc.setServicio(this.servicio, seleccionesFinales, this.precioFinal);
    this.router.navigate(['/cliente/servicios/estilista']);
  }
}
