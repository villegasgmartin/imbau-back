const { Router } = require('express');
const { check } = require('express-validator');
const { crearChat, obtenerChats, obtenerMensajes, enviarMensaje } = require('../controllers/chat');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post(
    '/',
    [
        validarJWT,
        validarCampos,
    ],
    crearChat
);

router.get('/', validarJWT, obtenerChats);

router.get('/historial/:chatId', [
    validarJWT, 
    validarCampos,
], obtenerMensajes);

router.post(
    '/mensaje',
    [
        validarJWT,
        check('chatId', 'El ID del chat es obligatorio').isMongoId(),
        check('mensaje', 'El mensaje no puede estar vacío').notEmpty(),
        validarCampos,
    ],
    enviarMensaje
);

module.exports = router;
