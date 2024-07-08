const { response, request } = require('express');
const bcryptjs = require('bcryptjs');


//modelos de usuario
const User = require('../models/usuario')
const User_Admin = require('../models/usuarioAdmin')

const usuariosGetTotal = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    try {
        // Obtener el conteo total de documentos en las tres colecciones
        const totalUsuarios = await Promise.all([
            User.countDocuments(query),
        ]);

        const total = totalUsuarios;

        let usuarios = [];
        let skip = Number(desde);
        let limit = Number(limite);

        // Obtener los usuarios de User_Servicio
        if (skip < totalUsuarios) {
            const totalUsuarios = await User.find(query).skip(skip).limit(limit).exec();
            usuarios = totalUsuarios;
            limit -= totalUsuarios.length;
            skip = 0;
        } else {
            skip -= totalUsuarios;
        }

        // // Obtener los usuarios de User_Comprador si aún queda límite
        // if (limit > 0 && skip < totalComprador) {
        //     const usuariosComprador = await User_Comprador.find(query).skip(skip).limit(limit).exec();
        //     usuarios = usuarios.concat(usuariosComprador);
        //     limit -= usuariosComprador.length;
        //     skip = 0;
        // } else {
        //     skip -= totalComprador;
        // }

        // // Obtener los usuarios de User_Vendedor si aún queda límite
        // if (limit > 0) {
        //     const usuariosVendedor = await User_Vendedor.find(query).skip(skip).limit(limit).exec();
        //     usuarios = usuarios.concat(usuariosVendedor);
        // }

        res.json({
            total,
            usuarios
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error en el servidor'
        });
    }
};

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
const usuariosVendedorPost = async (req, res = response) => {

    let {password, ...resto} = req.body;

    const usuarioVendedor = new User_Vendedor({password, ...resto});
    const usuarioComprador = new User_Comprador({password, ...resto});

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuarioVendedor.password = bcryptjs.hashSync( password, salt );
    usuarioComprador.password = bcryptjs.hashSync( password, salt );

    await usuarioVendedor.save()
    await usuarioComprador.save()

    res.json({
        msg: 'post API - usuariosPost',
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



const usuariosDelete = async(req, res = response) => {
    const { id } = req.query;


    // Buscar el usuario en las tres colecciones
    let user = await User.findById(id)

    if (!user) {
        return res.status(404).json({
            msg: 'Usuario no encontrado'
        });
    }

    // Actualizar el estado del usuario encontrado
    user.estado = false;
    await user.save();
    
    res.json(user);
}




module.exports = {
    usuariosGetTotal,
    usuariosPost,
    usuariosDelete,
    usuariosPut,
    AdminPost,
    getUsuario
}