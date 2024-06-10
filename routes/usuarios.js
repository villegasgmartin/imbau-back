
const { Router } = require('express');


const { check } = require('express-validator');


const { validarCampos } = require('../middlewares/validar-campos');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');


const {  usuariosGetTotal,
        usuariosServicioPost,
        usuariosCompradorPost,
        usuariosVendedorPost,
        usuariosDelete,
        usuariosPut} = require('../controllers/usuarios');

const router = Router();


router.get('/usuarios', usuariosGetTotal );




//*******rutas de login de usuarios*********


router.post('/new-seller',
check('nombre', 'El nombre es obligatorio').not().isEmpty(),
check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
check('correo', 'El correo no es válido').isEmail(),
check('correo').custom( emailExiste ),
// check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
check('rol').custom( esRoleValido ), 
validarCampos
, usuariosVendedorPost );


// router.post('/new-buyer', usuariosCompradorPost );
router.post('/new-buyer', 
check('nombre', 'El nombre es obligatorio').not().isEmpty(),
check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
check('correo', 'El correo no es válido').isEmail(),
check('correo').custom( emailExiste ),
// check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
check('rol').custom( esRoleValido ), 
validarCampos
,usuariosCompradorPost );


router.post('/new-service',
check('nombre', 'El nombre es obligatorio').not().isEmpty(),
check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
check('correo', 'El correo no es válido').isEmail(),
check('correo').custom( emailExiste ),
// check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
check('rol').custom( esRoleValido ), 
validarCampos
,usuariosServicioPost );


//*** actualizar usuario */

router.put('/',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('rol').custom( esRoleValido ), 
    validarCampos
],usuariosPut ); 

router.delete('/', usuariosDelete );







module.exports = router;