const { Router } = require('express');
const { check } = require('express-validator');


const { validarCampos } = require('../middlewares/validar-campos');


const {  crearProducto,
    crearServicio,
    getProductos,
    getServicios,
    getProductoPorUsuario} = require('../controllers/Prod-Serv');
const { validarJWT } = require('../middlewares');
const { esRoleValido } = require('../helpers/db-validators');

const router = Router();

router.post('/new-product',[
    validarJWT,
    validarCampos
],crearProducto );

router.get('/productos',[
    validarJWT,
    validarCampos
],getProductos );

router.post('/new-service',[
    validarJWT,
    validarCampos
],crearServicio );

router.get('/servicios',[
    validarJWT,
    validarCampos
],getServicios );

module.exports = router;