const { response, request } = require('express');
const bcryptjs = require('bcryptjs');


//modelos de usuario
const User = require('../models/usuario')
const User_Admin = require('../models/usuarioAdmin');
const usuario = require('../models/usuario');

const Compra = require('../models/compras');


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


const productosCompradosporUsuario = async (req, res) => {
    const uid = req.uid;

    try {
        // Selecciona solo el campo 'producto' de las compras del usuario
        const items = await Compra.find({ usuarioId: uid }).select('producto');

        if (!items || items.length === 0) {
            return res.status(200).json({
                msg: 'No hay productos comprados para este usuario.',
                productos: []
            });
        }

        // Extrae solo los productos
        const productos = items.map(item => item.producto);

        res.status(200).json({
            productos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al obtener los productos.',
            error
        });
    }
};

const productosvendidosporUsuario = async (req, res) => {
    const uid = req.uid;
    console.log(uid)
    try {
        // Selecciona solo el campo 'producto' de las ventas del usuario
        const items = await Compra.find({ usuariovendedor: uid }).select('producto');
        console.log(items)
        if (!items || items.length === 0) {
            return res.status(200).json({
                msg: 'No hay productos comprados para este usuario.',
                productos: []
            });
        }

        // Extrae solo los productos
        const productos = items.map(item => item.producto);

        res.status(200).json({
            productos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al obtener los productos.',
            error
        });
    }
};





module.exports = {
    usuariosPost,
    usuariosPut,
    AdminPost,
    getUsuario,
    productosCompradosporUsuario,
    productosvendidosporUsuario
}