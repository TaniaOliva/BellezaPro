const router = require('express').Router();
const { crear, listarPendientes, listarTodos, resolver, listarPorCliente } = require('../controllers/reporteCliente.controller');
const { verificarToken } = require('../middleware/auth.middleware');
const { soloRol } = require('../middleware/role.middleware');

router.post('/',                       verificarToken, soloRol('estilista'), crear);
router.get('/pendientes',              verificarToken, soloRol('admin'), listarPendientes);
router.get('/',                        verificarToken, soloRol('admin'), listarTodos);
router.patch('/:id/resolver',          verificarToken, soloRol('admin'), resolver);
router.get('/cliente/:clienteId',      verificarToken, soloRol('admin'), listarPorCliente);

module.exports = router;
