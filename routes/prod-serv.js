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
    getProductoporId,
    comprarProducto,
    getProductosAleatorio1,
    getProductosAleatorio2,
    getProductosAleatorio,
    getServiciosAleatorio,
    getServiciosAleatorio1,
    getServicioleatorio2,
    actualizarCompra,
    confirmarEntrega,
    agregarComentario,
    crearOferta,
    actualizarEtapa,
    borrarOferta,
    borrarOfertaDefinitivamente,
    subirImagenOferta,
    ofertasTerminadas,
    getOfertasPorId,
    ofertasPendientes,
    ofertasFalsas,
    agregarComentarioOferta,
    getOfertaporId} = require('../controllers/Prod-Serv');
const { validarJWT } = require('../middlewares');
const { esRoleValido } = require('../helpers/db-validators');

const router = Router();

router.post('/new-product',[
    validarJWT,
    validarCampos
],crearProducto );

//get productos aleatorio

router.get('/productos', getProductosAleatorio);
router.get('/productos1', getProductosAleatorio1);
router.get('/productos2', getProductosAleatorio2);

//get servicios aletiorio
router.get('/servicios', getServiciosAleatorio);
router.get('/servicios1', getServiciosAleatorio1);
router.get('/servicios2', getServicioleatorio2);



router.post('/new-service',[
    validarJWT,
    validarCampos
],crearServicio );

//router.get('/servicios', getServicios );

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

router.post('/comprar-producto',[
    validarJWT,
    validarCampos
], comprarProducto);


//actualizar estado del pedido comprado

router.put('/actualizar-compra',[
    validarJWT,
    validarCampos
],actualizarCompra )

router.put('/confirmar-entrega',[
    validarJWT,
    validarCampos
],confirmarEntrega )

router.post('/agregar-comentario',[
    validarJWT,
    validarCampos
],agregarComentario)


//oferta de sericios

router.post('/crear-oferta',[
    validarJWT,
    validarCampos
],crearOferta )

router.put('/actualizar-etapa',[
    validarJWT,
    validarCampos
],actualizarEtapa )

//borrar oferta por estado

router.put('/estado-oferta',[
    validarJWT,
    validarCampos
],borrarOferta )

//borrar oferta definitivamente
router.delete('/borrar-oferta',[
    validarJWT,
    validarCampos
],borrarOfertaDefinitivamente )

//subir imagen servicio terminado
router.post('/imagen-proyecto',[
    validarJWT,
    validarCampos
],subirImagenOferta )

//ofertas terminadas
router.get('/ofertas-terminadas', ofertasTerminadas)

//todas las ofertas
router.get('/ofertas',[
    validarJWT,
    validarCampos
], getOfertasPorId)

//todas las ofertas pendientes
router.get('/ofertas-pendientes',[
    validarJWT,
    validarCampos
], ofertasPendientes)

//todas las ofertas interrumpidas
router.get('/ofertas-interrumpidas',[
    validarJWT,
    validarCampos
], ofertasFalsas)


//todas las ofertas interrumpidas
router.post('/ofertas-comentario',[
    validarJWT,
    validarCampos
], agregarComentarioOferta)

//get oferta sola
router.get('/oferta', getOfertaporId)



module.exports = router;