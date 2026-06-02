const router = require('express').Router();
const { crear, listarPorEstilista, eliminar } = require('../controllers/bloqueo.controller');
const { verificarToken } = require('../middleware/auth.middleware');
const { soloRol } = require('../middleware/role.middleware');

router.post('/',                         verificarToken, soloRol('admin'), crear);
router.get('/estilista/:estilistaId',     verificarToken, listarPorEstilista);
router.delete('/:id',                    verificarToken, soloRol('admin'), eliminar);

module.exports = router;
