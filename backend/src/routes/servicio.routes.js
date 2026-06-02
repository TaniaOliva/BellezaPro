const router = require('express').Router();
const { listar, obtener, crear, actualizar } = require('../controllers/servicio.controller');
const { verificarToken } = require('../middleware/auth.middleware');
const { soloRol } = require('../middleware/role.middleware');

router.get('/',        listar);
router.get('/:id',     obtener);
router.post('/',       verificarToken, soloRol('admin'), crear);
router.put('/:id',     verificarToken, soloRol('admin'), actualizar);

module.exports = router;
