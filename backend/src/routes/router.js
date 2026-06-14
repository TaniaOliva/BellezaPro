const express = require('express');
const router = express.Router();

const { verificarToken } = require('../middleware/auth.middleware');
const { soloRol } = require('../middleware/role.middleware');

const authController = require('../controllers/auth.controller');
const usuarioController = require('../controllers/usuario.controller');
const servicioController = require('../controllers/servicio.controller');
const categoriaController = require('../controllers/categoria.controller');
const citaController = require('../controllers/cita.controller');
const calificacionController = require('../controllers/calificacion.controller');
const solicitudController = require('../controllers/solicitudEspecial.controller');
const reporteController = require('../controllers/reporteCliente.controller');
const bloqueoController = require('../controllers/bloqueo.controller');
const notificacionController = require('../controllers/notificacion.controller');

// Auth
router.post('/api/auth/setup-admin',      authController.setupAdmin);
router.post('/api/auth/registrar',        authController.registrar);
router.post('/api/auth/login',            authController.login);
router.post('/api/auth/recuperar',        authController.solicitarRecuperacion);
router.post('/api/auth/verificar-codigo', authController.verificarCodigo);
router.post('/api/auth/nueva-password',   authController.nuevaPassword);

// Usuarios
router.get('/api/usuarios/estilistas/admin', verificarToken, soloRol('admin'),    usuarioController.listarTodosEstilistas);
router.get('/api/usuarios/estilistas',                                             usuarioController.listarEstilistas);
router.get('/api/usuarios/clientes',         verificarToken, soloRol('admin'),    usuarioController.listarClientes);
router.get('/api/usuarios/perfil',           verificarToken,                      usuarioController.obtenerPerfil);
router.put('/api/usuarios/perfil',           verificarToken,                      usuarioController.actualizarPerfil);
router.put('/api/usuarios/perfil/password',  verificarToken,                      usuarioController.cambiarPassword);
router.patch('/api/usuarios/:id/estado',     verificarToken, soloRol('admin'),    usuarioController.actualizarEstado);
router.post('/api/usuarios/empleados',       verificarToken, soloRol('admin'),    usuarioController.crearEmpleado);
router.put('/api/usuarios/empleados/:id',    verificarToken, soloRol('admin'),    usuarioController.actualizarEmpleado);
router.delete('/api/usuarios/empleados/:id', verificarToken, soloRol('admin'),    usuarioController.eliminarEmpleado);

// Categorías
router.get('/api/categorias',            categoriaController.listar);
router.get('/api/categorias/admin',      verificarToken, soloRol('admin'), categoriaController.listarAdmin);
router.post('/api/categorias',           verificarToken, soloRol('admin'), categoriaController.crear);
router.put('/api/categorias/:id',        verificarToken, soloRol('admin'), categoriaController.actualizar);
router.delete('/api/categorias/:id',     verificarToken, soloRol('admin'), categoriaController.eliminar);

// Servicios
router.get('/api/servicios',             servicioController.listar);
router.get('/api/servicios/populares',   servicioController.listarPopulares);
router.get('/api/servicios/admin',  verificarToken, soloRol('admin'), servicioController.listarAdmin);
router.get('/api/servicios/:id',         servicioController.obtener);
router.post('/api/servicios',       verificarToken, soloRol('admin'), servicioController.crear);
router.put('/api/servicios/:id',    verificarToken, soloRol('admin'), servicioController.actualizar);

// Citas
router.get('/api/citas',                    verificarToken, soloRol('admin'),    citaController.listarTodas);
router.get('/api/citas/mis-citas',          verificarToken, soloRol('cliente'),  citaController.listarPorCliente);
router.get('/api/citas/mi-agenda',          verificarToken, soloRol('estilista'),citaController.listarPorEstilista);
router.get('/api/citas/disponibilidad',     verificarToken,                      citaController.verificarSlotsDisponibles);
router.post('/api/citas',                   verificarToken, soloRol('cliente'),  citaController.crear);
router.patch('/api/citas/:id/estado',           verificarToken,                      citaController.actualizarEstado);
router.patch('/api/citas/:id/cancelar-cliente', verificarToken, soloRol('cliente'),  citaController.cancelarPorCliente);
router.patch('/api/citas/:id/reagendar',        verificarToken, soloRol('cliente'),  citaController.reagendar);

// Calificaciones
router.post('/api/calificaciones',                               verificarToken, soloRol('cliente'),  calificacionController.crear);
router.get('/api/calificaciones/estilista/:estilistaId/promedio',                                     calificacionController.promedioEstilista);
router.get('/api/calificaciones/estilista/:estilistaId',         verificarToken,                      calificacionController.listarPorEstilista);

// Solicitudes especiales
router.post('/api/solicitudes',                        verificarToken, soloRol('cliente'), solicitudController.crear);
router.get('/api/solicitudes/mis',                     verificarToken, soloRol('cliente'), solicitudController.listarPorCliente);
router.get('/api/solicitudes/pendientes',              verificarToken, soloRol('admin'),   solicitudController.listarPendientes);
router.get('/api/solicitudes',                         verificarToken, soloRol('admin'),   solicitudController.listarTodas);
router.patch('/api/solicitudes/:id',                   verificarToken, soloRol('admin'),   solicitudController.responder);
router.patch('/api/solicitudes/:id/aceptar-contrao',   verificarToken, soloRol('admin'),   solicitudController.aceptarContraoferta);
router.patch('/api/solicitudes/:id/aceptar',           verificarToken, soloRol('cliente'), solicitudController.aceptarPropuesta);
router.patch('/api/solicitudes/:id/contraoferta',      verificarToken, soloRol('cliente'), solicitudController.contraproponer);

// Reportes de clientes
router.post('/api/reportes',                    verificarToken, soloRol('estilista'), reporteController.crear);
router.get('/api/reportes/pendientes',          verificarToken, soloRol('admin'),     reporteController.listarPendientes);
router.get('/api/reportes',                     verificarToken, soloRol('admin'),     reporteController.listarTodos);
router.patch('/api/reportes/:id/resolver',      verificarToken, soloRol('admin'),     reporteController.resolver);
router.get('/api/reportes/cliente/:clienteId',  verificarToken, soloRol('admin'),     reporteController.listarPorCliente);

// Notificaciones
router.get('/api/notificaciones',                      verificarToken, notificacionController.listar);
router.patch('/api/notificaciones/marcar-todas',       verificarToken, notificacionController.marcarTodas);
router.patch('/api/notificaciones/:id/leida',          verificarToken, notificacionController.marcarLeida);

// Bloqueos
router.get('/api/bloqueos',                        verificarToken, soloRol('admin'), bloqueoController.listarTodos);
router.get('/api/bloqueos/rango',                  verificarToken, soloRol('admin'), bloqueoController.listarEnRango);
router.get('/api/bloqueos/disponibles',            verificarToken,                   bloqueoController.listarParaCliente);
router.post('/api/bloqueos',                       verificarToken, soloRol('admin'), bloqueoController.crear);
router.post('/api/bloqueos/conflictos',            verificarToken, soloRol('admin'), bloqueoController.verificarConflictos);
router.get('/api/bloqueos/estilista/:estilistaId', verificarToken,                   bloqueoController.listarPorEstilista);
router.put('/api/bloqueos/:id',                    verificarToken, soloRol('admin'), bloqueoController.actualizar);
router.delete('/api/bloqueos/:id',                 verificarToken, soloRol('admin'), bloqueoController.eliminar);

module.exports = router;
