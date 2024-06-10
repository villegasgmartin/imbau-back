const { response } = require('express');
const bcryptjs = require('bcryptjs')

//modelos de usuario
const User_Servicio = require('../models/usuarioServicio')
const User_Comprador = require('../models/usuarioComprador')
const User_Vendedor = require('../models/usuarioVendedor')
const User_Admin = require('../models/usuarioAdmin')


const { generarJWT } = require('../helpers/generar-jwt');


const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {
      
        // Verificar si el email existe
        const usuario = await User_Servicio.findOne({ correo }) || await User_Comprador.findOne({ correo }) || await User_Vendedor.findOne({ correo }) || await User_Admin.findOne({correo}) ;
        if ( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }
        console.log(usuario)
        // SI el usuario está activo
        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }   

}



module.exports = {
    login
}
