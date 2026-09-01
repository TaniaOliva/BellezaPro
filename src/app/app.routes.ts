import { Routes } from '@angular/router';
import { LayoutClienteComponent } from './core/layout/layout-cliente.component';
import { LayoutBookingComponent } from './core/layout/layout-booking.component';
import { LayoutEstilistaComponent } from './core/layout/layout-estilista.component';
import { LayoutAdminComponent } from './core/layout/layout-admin.component';
import { LoginComponent } from './features/auth/login.component';
import { RegistroComponent } from './features/auth/registro.component';
import { RecuperarPasswordComponent } from './features/auth/recuperar-password.component';
import { rolGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'recuperar-password', component: RecuperarPasswordComponent },

  {
    path: 'cliente',
    component: LayoutClienteComponent,
    canActivate: [rolGuard(['cliente'])],
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio',              loadComponent: () => import('./features/cliente/inicio.component').then(m => m.InicioComponent) },
      { path: 'mis-citas',           loadComponent: () => import('./features/cliente/mis-citas.component').then(m => m.MisCitasComponent) },
      { path: 'solicitud-especial',  loadComponent: () => import('./features/cliente/solicitud-especial.component').then(m => m.SolicitudEspecialComponent) },
      { path: 'perfil',              loadComponent: () => import('./features/cliente/perfil.component').then(m => m.PerfilComponent) },
      { path: 'notificaciones',      loadComponent: () => import('./features/cliente/notificaciones.component').then(m => m.NotificacionesComponent) },
    ]
  },

  {
    path: 'cliente/servicios',
    component: LayoutBookingComponent,
    canActivate: [rolGuard(['cliente'])],
    children: [
      { path: '',    loadComponent: () => import('./features/cliente/servicios/catalogo.component').then(m => m.CatalogoComponent) },
      { path: 'opciones',   loadComponent: () => import('./features/cliente/servicios/opciones.component').then(m => m.OpcionesComponent) },
      { path: 'estilista',  loadComponent: () => import('./features/cliente/servicios/estilista.component').then(m => m.EstilistaComponent) },
      { path: 'horario',    loadComponent: () => import('./features/cliente/servicios/horario.component').then(m => m.HorarioComponent) },
      { path: 'confirmar',  loadComponent: () => import('./features/cliente/servicios/confirmar.component').then(m => m.ConfirmarComponent) },
    ]
  },

  {
    path: 'estilista',
    component: LayoutEstilistaComponent,
    canActivate: [rolGuard(['estilista'])],
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio',           loadComponent: () => import('./features/estilista/inicio.component').then(m => m.InicioComponent) },
      { path: 'agenda',           loadComponent: () => import('./features/estilista/agenda.component').then(m => m.AgendaComponent) },
      { path: 'mis-clientes',     loadComponent: () => import('./features/estilista/mis-clientes.component').then(m => m.MisClientesComponent) },
      { path: 'reportar-cliente', loadComponent: () => import('./features/estilista/reportar-cliente.component').then(m => m.ReportarClienteComponent) },
      { path: 'perfil',           loadComponent: () => import('./features/estilista/perfil.component').then(m => m.PerfilComponent) },
      { path: 'notificaciones',   loadComponent: () => import('./features/estilista/notificaciones.component').then(m => m.NotificacionesComponent) },
    ]
  },

  {
    path: 'admin',
    component: LayoutAdminComponent,
    canActivate: [rolGuard(['admin'])],
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio',                  loadComponent: () => import('./features/auth/admin/inicio.component').then(m => m.InicioComponent) },
      { path: 'agenda-general',          loadComponent: () => import('./features/auth/admin/agenda-general.component').then(m => m.AgendaGeneralComponent) },
      { path: 'empleados',               loadComponent: () => import('./features/auth/admin/empleados.component').then(m => m.EmpleadosComponent) },
      { path: 'servicios',               loadComponent: () => import('./features/auth/admin/servicios.component').then(m => m.ServiciosComponent) },
      { path: 'clientes',                loadComponent: () => import('./features/auth/admin/clientes.component').then(m => m.ClientesComponent) },
      { path: 'solicitudes-especiales',  loadComponent: () => import('./features/auth/admin/solicitudes-especiales.component').then(m => m.SolicitudesEspecialesComponent) },
      { path: 'reportes-clientes',       loadComponent: () => import('./features/auth/admin/reportes-clientes.component').then(m => m.ReportesClientesComponent) },
      { path: 'reportes-estadisticas',   loadComponent: () => import('./features/auth/admin/reportes-estadisticas.component').then(m => m.ReportesEstadisticasComponent) },
      { path: 'configuracion',    loadComponent: () => import('./features/auth/admin/configuracion.component').then(m => m.ConfiguracionComponent) },
      { path: 'notificaciones',   loadComponent: () => import('./features/auth/admin/notificaciones.component').then(m => m.NotificacionesAdminComponent) },
    ]
  },

  { path: '**', redirectTo: 'login' }
];
