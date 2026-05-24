import { Routes } from '@angular/router';
import { LayoutClienteComponent } from './core/layout/layout-cliente/layout-cliente.component';
import { LayoutBookingComponent } from './core/layout/layout-booking/layout-booking.component';
import { LayoutEstilistaComponent } from './core/layout/layout-estilista/layout-estilista.component';
import { LayoutAdminComponent } from './core/layout/layout-admin/layout-admin.component';

export const routes: Routes = [
  { path: '', redirectTo: 'cliente/inicio', pathMatch: 'full' },

  {
    path: 'cliente',
    component: LayoutClienteComponent,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio',              loadComponent: () => import('./features/cliente/inicio/inicio.component').then(m => m.InicioComponent) },
      { path: 'mis-citas',           loadComponent: () => import('./features/cliente/mis-citas/mis-citas.component').then(m => m.MisCitasComponent) },
      { path: 'solicitud-especial',  loadComponent: () => import('./features/cliente/solicitud-especial/solicitud-especial.component').then(m => m.SolicitudEspecialComponent) },
      { path: 'perfil',              loadComponent: () => import('./features/cliente/perfil/perfil.component').then(m => m.PerfilComponent) },
      { path: 'notificaciones',      loadComponent: () => import('./features/cliente/notificaciones/notificaciones.component').then(m => m.NotificacionesComponent) },
    ]
  },

  {
    path: 'cliente/servicios',
    component: LayoutBookingComponent,
    children: [
      { path: '',    loadComponent: () => import('./features/cliente/servicios/catalogo/catalogo.component').then(m => m.CatalogoComponent) },
      { path: 'opciones',   loadComponent: () => import('./features/cliente/servicios/opciones/opciones.component').then(m => m.OpcionesComponent) },
      { path: 'estilista',  loadComponent: () => import('./features/cliente/servicios/estilista/estilista.component').then(m => m.EstilistaComponent) },
      { path: 'horario',    loadComponent: () => import('./features/cliente/servicios/horario/horario.component').then(m => m.HorarioComponent) },
      { path: 'confirmar',  loadComponent: () => import('./features/cliente/servicios/confirmar/confirmar.component').then(m => m.ConfirmarComponent) },
    ]
  },

  {
    path: 'estilista',
    component: LayoutEstilistaComponent,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio',           loadComponent: () => import('./features/estilista/inicio/inicio.component').then(m => m.InicioComponent) },
      { path: 'agenda',           loadComponent: () => import('./features/estilista/agenda/agenda.component').then(m => m.AgendaComponent) },
      { path: 'mis-clientes',     loadComponent: () => import('./features/estilista/mis-clientes/mis-clientes.component').then(m => m.MisClientesComponent) },
      { path: 'reportar-cliente', loadComponent: () => import('./features/estilista/reportar-cliente/reportar-cliente.component').then(m => m.ReportarClienteComponent) },
      { path: 'perfil',           loadComponent: () => import('./features/estilista/perfil/perfil.component').then(m => m.PerfilComponent) },
      { path: 'notificaciones',   loadComponent: () => import('./features/estilista/notificaciones/notificaciones.component').then(m => m.NotificacionesComponent) },
    ]
  },

  {
    path: 'admin',
    component: LayoutAdminComponent,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio',                  loadComponent: () => import('./features/admin/inicio/inicio.component').then(m => m.InicioComponent) },
      { path: 'agenda-general',          loadComponent: () => import('./features/admin/agenda-general/agenda-general.component').then(m => m.AgendaGeneralComponent) },
      { path: 'empleados',               loadComponent: () => import('./features/admin/empleados/empleados.component').then(m => m.EmpleadosComponent) },
      { path: 'servicios',               loadComponent: () => import('./features/admin/servicios/servicios.component').then(m => m.ServiciosComponent) },
      { path: 'clientes',                loadComponent: () => import('./features/admin/clientes/clientes.component').then(m => m.ClientesComponent) },
      { path: 'solicitudes-especiales',  loadComponent: () => import('./features/admin/solicitudes-especiales/solicitudes-especiales.component').then(m => m.SolicitudesEspecialesComponent) },
      { path: 'reportes-clientes',       loadComponent: () => import('./features/admin/reportes-clientes/reportes-clientes.component').then(m => m.ReportesClientesComponent) },
      { path: 'reportes-estadisticas',   loadComponent: () => import('./features/admin/reportes-estadisticas/reportes-estadisticas.component').then(m => m.ReportesEstadisticasComponent) },
      { path: 'configuracion',           loadComponent: () => import('./features/admin/configuracion/configuracion.component').then(m => m.ConfiguracionComponent) },
    ]
  },

  { path: '**', redirectTo: 'cliente/inicio' }
];
