const { response, request } = require('express');
const bcryptjs = require('bcryptjs');


//modelos de usuario
const User_Servicio = require('../models/usuarioServicio')
const User_Comprador = require('../models/usuarioComprador')
const User_Vendedor = require('../models/usuarioVendedor')

const usuariosGetTotal = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    try {
        // Obtener el conteo total de documentos en las tres colecciones
        const [ totalServicio, totalComprador, totalVendedor ] = await Promise.all([
            User_Servicio.countDocuments(query),
            User_Comprador.countDocuments(query),
            User_Vendedor.countDocuments(query),
        ]);

        const total = totalServicio + totalComprador + totalVendedor;

        let usuarios = [];
        let skip = Number(desde);
        let limit = Number(limite);

        // Obtener los usuarios de User_Servicio
        if (skip < totalServicio) {
            const usuariosServicio = await User_Servicio.find(query).skip(skip).limit(limit).exec();
            usuarios = usuariosServicio;
            limit -= usuariosServicio.length;
            skip = 0;
        } else {
            skip -= totalServicio;
        }

        // Obtener los usuarios de User_Comprador si aún queda límite
        if (limit > 0 && skip < totalComprador) {
            const usuariosComprador = await User_Comprador.find(query).skip(skip).limit(limit).exec();
            usuarios = usuarios.concat(usuariosComprador);
            limit -= usuariosComprador.length;
            skip = 0;
        } else {
            skip -= totalComprador;
        }

        // Obtener los usuarios de User_Vendedor si aún queda límite
        if (limit > 0) {
            const usuariosVendedor = await User_Vendedor.find(query).skip(skip).limit(limit).exec();
            usuarios = usuarios.concat(usuariosVendedor);
        }

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

const getUsuario = (req, res) => {
    
}




const usuariosServicioPost = async (req, res = response) => {

    let {password, ...resto} = req.body;

    const usuario = new User_Servicio({password, ...resto});

     // Encriptar la contraseña
     const salt = bcryptjs.genSaltSync();
     usuario.password = bcryptjs.hashSync( password, salt );

    await usuario.save()

    res.json({
        msg: 'post API - usuariosPost',
        usuario
      
    });
}
const usuariosCompradorPost = async (req, res = response) => {
        
    let {password, ...resto} = req.body;

    const usuario = new User_Comprador({password, ...resto});

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    await usuario.save()

    res.json({
        msg: 'post API - usuariosPost',
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
     let user = await User_Servicio.findById(id) || await User_Vendedor.findById(id) || await User_Comprador.findById(id);

     if (!user) {
         return res.status(404).json({
             msg: 'Usuario no encontrado'
         });
     }
 
     const { rol } = user; 

    if ( password ) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    

    switch (rol) {
        case 'USER_SERVICE':
            usuario = await User_Servicio.findByIdAndUpdate( id, resto );
            break;
        case 'USER_SELLER':
            usuario = await User_Vendedor.findByIdAndUpdate( id, resto );
        break;
        case 'USER_BUYER':
            usuario = await User_Comprador.findByIdAndUpdate( id, resto );
        break;
        default:
            break;
    }  
    

    res.json(usuario);
}



const usuariosDelete = (req, res = response) => {
    res.json({
        msg: 'delete API - usuariosDelete'
    });
}




module.exports = {
    usuariosGetTotal,
    usuariosServicioPost,
    usuariosCompradorPost,
    usuariosVendedorPost,
    usuariosDelete,
    usuariosPut
}