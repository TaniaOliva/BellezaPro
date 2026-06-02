const router = require('express').Router();
const { crear, listarPorCliente, listarPendientes, listarTodas, responder } = require('../controllers/solicitudEspecial.controller');
const { verificarToken } = require('../middleware/auth.middleware');
const { soloRol } = require('../middleware/role.middleware');

router.post('/',           verificarToken, soloRol('cliente'), crear);
router.get('/mis',         verificarToken, soloRol('cliente'), listarPorCliente);
router.get('/pendientes',  verificarToken, soloRol('admin'), listarPendientes);
router.get('/',            verificarToken, soloRol('admin'), listarTodas);
router.patch('/:id',       verificarToken, soloRol('admin'), responder);

module.exports = router;
