
const { Router } = require('express');


const { check } = require('express-validator');


const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../middlewares');

const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');


const {  usuariosGetTotal,
        usuariosPost,
        usuariosDelete,
        usuariosPut,
        AdminPost,
        getUsuario,
        productosCompradosporUsuario,
        productosvendidosporUsuario} = require('../controllers/usuarios');

const router = Router();







//*******rutas de login de usuarios*********





// router.post('/new-buyer', usuariosCompradorPost );
router.post('/login', 
check('nombre', 'El nombre es obligatorio').not().isEmpty(),
check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
check('correo', 'El correo no es válido').isEmail(),
check('correo').custom( emailExiste ),
check('rol').custom( esRoleValido ), 
validarCampos
,usuariosPost );





//**admin post */

router.post('/admin-post',
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom( emailExiste ),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom( esRoleValido ), 
    validarCampos
    , AdminPost);


//*** actualizar usuario */

router.put('/',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarJWT,
    validarCampos
],usuariosPut ); 





//**obtener un usuario */
router.get('/perfil',[
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
],getUsuario );


//productos comprados por usuario
router.get('/compras-por-usuario',[
    validarJWT,
],productosCompradosporUsuario );

router.get('/ventas-por-usuario',[
    validarJWT,
],productosvendidosporUsuario);




module.exports = router;