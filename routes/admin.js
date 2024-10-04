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
        usuariosDelete,
        usuariosActivar,
        usuariosPorTipo,
        getProductosComprados,
        deleteProductosComprados,
        postBanner,
        getBanner
        } = require('../controllers/admin');


const router = Router();



router.get('/usuarios',[
    validarJWT,
    // esAdminRole,
    tieneRole('USER_ADMIN'),
    validarCampos
], usuariosGetTotal );

//**borrar usuario cambiando estado */
router.put('/delete',[
    validarJWT,
    // esAdminRole,
    tieneRole('USER_ADMIN'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
],usuariosDelete );

//**activar usuario cambiando estado */
router.put('/activar',[
    validarJWT,
    // esAdminRole,
    tieneRole('USER_ADMIN'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
],usuariosActivar );



//usuario por tipo de servicio
router.get('/usuarios-tipo',[
    validarJWT,
    // esAdminRole,
    tieneRole('USER_ADMIN'),
    validarCampos
], usuariosPorTipo );


//productos comprados
router.get('/productos-comprados',[
    validarJWT,
    // esAdminRole,
    tieneRole('USER_ADMIN'),
    validarCampos
], getProductosComprados );

//borrar producto comprado
router.delete('/borrar-productos-comprado',[
    validarJWT,
    // esAdminRole,
    tieneRole('USER_ADMIN'),
    validarCampos
], deleteProductosComprados );

//crear un banner

router.post('/new-banner',[
    validarJWT,
    // esAdminRole,
    tieneRole('USER_ADMIN'),
    validarCampos
],postBanner )

//obtener banner

router.get('/banner',[
    validarJWT,
    // esAdminRole,
    tieneRole('USER_ADMIN'),
    validarCampos
],getBanner )


module.exports = router;