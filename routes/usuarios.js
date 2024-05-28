
const { Router } = require('express');

const {  usuariosGet,
        usuariosServicioPost,
        usuariosCompradorPost,
        usuariosVendedorPost,
        usuariosPatch,
        usuariosDelete} = require('../controllers/usuarios');

const router = Router();


router.get('/', usuariosGet );




//rutas de login de usuarios
router.post('/new-seller', usuariosServicioPost );
// router.post('/new-buyer', usuariosCompradorPost );
router.post('/new-buyer', usuariosCompradorPost );
router.post('/new-service', usuariosVendedorPost );

router.delete('/', usuariosDelete );

router.patch('/', usuariosPatch );





module.exports = router;