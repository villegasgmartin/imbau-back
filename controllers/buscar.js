const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Usuario, Servicio, Producto } = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'servicios',
    'productos'
];

const buscarUsuarios = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); // TRUE 

    if ( esMongoID ) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: ( usuario ) ? [ usuario ] : []
        });
    }

    const regex = new RegExp( termino, 'i' );
    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    res.json({
        results: usuarios
    });

}

const buscarServicios = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); // TRUE 

    if ( esMongoID ) {
        const servicio = await Servicio.findById(termino);
        return res.json({
            results: ( servicio ) ? [ servicio ] : []
        });
    }

    const regex = new RegExp( termino, 'i' );
    const servicios = await Servicio.find({ servicio: regex });

    res.json({
        results: servicios
    });

}

const buscarProductos = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); // TRUE 

    if ( esMongoID ) {
        const producto = await Producto.findById(termino)
        return res.json({
            results: ( producto ) ? [ producto ] : []
        });
    }

    const regex = new RegExp( termino, 'i' );
    const productos = await Producto.find({ nombre: regex })

    res.json({
        results: productos
    });

}


const buscar = ( req, res = response ) => {
    
    const { coleccion, termino  } = req.params;

    if ( !coleccionesPermitidas.includes( coleccion ) ) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;
        case 'servicios':
            buscarServicios(termino, res);
        break;
        case 'productos':
            buscarProductos(termino, res);
        break;

        default:
            res.status(500).json({
                msg: 'Se le olvido hacer esta búsquda'
            })
    }

}



module.exports = {
    buscar
}