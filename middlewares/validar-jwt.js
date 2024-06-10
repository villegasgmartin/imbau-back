const { response, request } = require('express');
const jwt = require('jsonwebtoken');

//modelos de usuario
const User_Servicio = require('../models/usuarioServicio')
const User_Comprador = require('../models/usuarioComprador')
const User_Vendedor = require('../models/usuarioVendedor')
const User_Admin = require('../models/usuarioAdmin')



const validarJWT = async( req = request, res = response, next ) => {

    const token = req.header('x-token');

    if ( !token ) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        console.log(uid)

        // leer el usuario que corresponde al uid
        const usuario = await User_Servicio.findById( uid ) || await User_Vendedor.findById(uid) || await User_Comprador.findById(uid) || await User_Admin.findById(uid) ;

        

        if( !usuario ) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe DB'
            })
        }

        // Verificar si el uid tiene estado true
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Token no válido - usuario con estado: false'
            })
        }
        
        
        req.usuario = usuario;
        next();

    } catch (error) {

        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        })
    }

}




module.exports = {
    validarJWT
}