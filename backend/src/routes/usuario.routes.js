const router = require('express').Router();
const { listarEstilistas, listarClientes, obtenerPerfil, actualizarPerfil, cambiarPassword, actualizarEstado, crearEmpleado } = require('../controllers/usuario.controller');
const { verificarToken } = require('../middleware/auth.middleware');
const { soloRol } = require('../middleware/role.middleware');

router.get('/estilistas',        listarEstilistas);
router.get('/clientes',          verificarToken, soloRol('admin'), listarClientes);
router.get('/perfil',            verificarToken, obtenerPerfil);
router.put('/perfil',            verificarToken, actualizarPerfil);
router.put('/perfil/password',   verificarToken, cambiarPassword);
router.patch('/:id/estado',      verificarToken, soloRol('admin'), actualizarEstado);
router.post('/empleados',        verificarToken, soloRol('admin'), crearEmpleado);

module.exports = router;
