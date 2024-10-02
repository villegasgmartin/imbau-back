const { response, request } = require('express');
const bcryptjs = require('bcryptjs');


//modelos de usuario
const User = require('../models/usuario')
const User_Admin = require('../models/usuarioAdmin')


const getUsuario = async (req, res) => {
    const {id} = req.query;


    try {
        const usuario =  await User.findById( id ) || await User_Admin.findById(id) ;

        res.status(200).json(usuario)
    } catch (error) {
        res.status(500).json({
            msg: error
        })
    }
   



}




const usuariosPost = async (req, res = response) => {
        
    let {password, ...resto} = req.body;

    const usuario = new User({password, ...resto});

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    await usuario.save()

    res.json({
       
        usuario
     
    });
}
const AdminPost = async (req, res = response) => {
        
    let {password, ...resto} = req.body;

    const usuario = new User_Admin({password, ...resto});

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    await usuario.save()

    res.json({
       
        usuario
     
    });
}


const usuariosPut = async (req, res = response) => {

    const { id } = req.query;
    console.log(id);
    const { _id, password, correo, ...resto } = req.body;

     // Buscar el usuario en las tres colecciones
     let user = await User.findById(id)

     if (!user) {
         return res.status(404).json({
             msg: 'Usuario no encontrado'
         });
     }
 
    

    if ( password ) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }
        usuario = await User.findByIdAndUpdate( id, resto );
    
    res.json(usuario);
}








module.exports = {
    usuariosPost,
    usuariosPut,
    AdminPost,
    getUsuario
}