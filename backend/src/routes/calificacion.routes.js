const router = require('express').Router();
const { crear, promedioEstilista, listarPorEstilista } = require('../controllers/calificacion.controller');
const { verificarToken } = require('../middleware/auth.middleware');
const { soloRol } = require('../middleware/role.middleware');

router.post('/',                              verificarToken, soloRol('cliente'), crear);
router.get('/estilista/:estilistaId/promedio', promedioEstilista);
router.get('/estilista/:estilistaId',          verificarToken, listarPorEstilista);

module.exports = router;
