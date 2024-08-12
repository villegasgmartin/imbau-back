const { Router } = require('express');
const { check } = require('express-validator');


const { validarCampos } = require('../middlewares/validar-campos');


const {  crearProducto,
    crearServicio,
    getProductos,
    getServicios,
    getProductoPorUsuario,
    actualizarServicio,
    actualizarProducto,
    eliminarProducto,
    eliminarServicio,
    getServicioPorUsuario,
    getServiceporId,
    getProductoporId} = require('../controllers/Prod-Serv');
const { validarJWT } = require('../middlewares');
const { esRoleValido } = require('../helpers/db-validators');

const router = Router();

router.post('/new-product',[
    validarJWT,
    validarCampos
],crearProducto );

router.get('/productos',getProductos );

router.post('/new-service',[
    validarJWT,
    validarCampos
],crearServicio );

router.get('/servicios', getServicios );

router.put('/service-update', [
    validarJWT,
    validarCampos
], actualizarServicio )

router.put('/product-update', [
    validarJWT,
    validarCampos
], actualizarProducto )

router.delete('/delete-product', [
    validarJWT,
    validarCampos
], eliminarProducto )


router.delete('/delete-service', [
    validarJWT,
    validarCampos
], eliminarServicio )

router.get('/product-by-client',[
    validarJWT,
    validarCampos
], getProductoPorUsuario);

router.get('/service-by-client',[
    validarJWT,
    validarCampos
], getServicioPorUsuario);

router.get('/servicio', getServiceporId);
router.get('/producto', getProductoporId);



module.exports = router;