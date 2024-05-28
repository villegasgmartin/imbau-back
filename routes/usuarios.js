
const { Router } = require('express');

const {  usuariosGet,
        usuariosServicioPost,
        usuariosCompradorPost,
        usuariosVendedorPost,
        usuariosDelete,
        usuariosPut} = require('../controllers/usuarios');

const router = Router();


router.get('/', usuariosGet );




//rutas de login de usuarios
router.post('/new-seller', usuariosVendedorPost );
// router.post('/new-buyer', usuariosCompradorPost );
router.post('/new-buyer', usuariosCompradorPost );
router.post('/new-service', usuariosServicioPost );

router.delete('/', usuariosDelete );







module.exports = router;