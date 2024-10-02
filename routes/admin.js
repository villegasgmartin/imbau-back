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
        deleteProductosComprados
        } = require('../controllers/admin');


const router = Router();



router.get('/usuarios',[
    validarJWT,
    // esAdminRole,
    tieneRole('USER_ADMIN'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
], usuariosGetTotal );

//**borrar usuario cambiando estado */
router.put('/',[
    validarJWT,
    // esAdminRole,
    tieneRole('USER_ADMIN'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
],usuariosDelete );

//**activar usuario cambiando estado */
router.put('/',[
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
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
], usuariosPorTipo );


//productos comprados
router.get('/productos-comprados',[
    validarJWT,
    // esAdminRole,
    tieneRole('USER_ADMIN'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
], getProductosComprados );

//borrar producto comprado
router.delete('/productos-comprados',[
    validarJWT,
    // esAdminRole,
    tieneRole('USER_ADMIN'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
], deleteProductosComprados );