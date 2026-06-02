const router = require('express').Router();
const { listarPorCliente, listarPorEstilista, crear, actualizarEstado } = require('../controllers/cita.controller');
const { verificarToken } = require('../middleware/auth.middleware');
const { soloRol } = require('../middleware/role.middleware');

router.get('/mis-citas',    verificarToken, soloRol('cliente'), listarPorCliente);
router.get('/mi-agenda',    verificarToken, soloRol('estilista'), listarPorEstilista);
router.post('/',            verificarToken, soloRol('cliente'), crear);
router.patch('/:id/estado', verificarToken, actualizarEstado);

module.exports = router;
