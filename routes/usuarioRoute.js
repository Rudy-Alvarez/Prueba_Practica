const express = require('express');
const router = express.Router();

// Ruta de prueba
router.get('/', (req, res) => {
  res.json({
    mensaje: 'API funcionando correctamente'
  });
});

const verificarToken = require('../middlewares/verificarToken');


const usuarioController = require('../controllers/usuarioController');

router.post('/login', usuarioController.login);
router.post('/registro', usuarioController.registrar);
router.get('/usuarios', verificarToken, usuarioController.listarUsuarios);




module.exports = router;