const { response, request } = require('express');


//modelos de usuario
const User = require('../models/usuario')
const User_Admin = require('../models/usuarioAdmin')
const Producto = require('../models/producto')
const Servicio = require('../models/Servicio')


const crearProducto = async (req, res) =>{
    const {userId, ...resto} = req.body;

    const uid = req.uid

    const usuario = await User.findById(uid);

    if(!usuario){
        return res.status(404).json({
            msg:'debe estar logiado para crear producto'
        })
    }

    if(usuario.rol != 'USER_SELLER'){
        return res.status(404).json({
            msg:'debe ser un usuario vendedor'
        })
    }

    const producto = new Producto({usuario:uid, ...resto})
    try {
        await producto.save()
        res.status(200).json({
            msg: 'producto creado',
            producto
        })

    } catch (error) {
        console.error(error);
        res.status(404).json({message: error.message});
    }
}

const crearServicio = async (req, res) =>{
    const {userId, ...resto} = req.body;

    const uid = req.uid

    const usuario = await User.findById(uid);

    if(!usuario){
        return res.status(404).json({
            msg:'debe estar logiado para crear servicio'
        })
    }

    if(usuario.rol != 'USER_SERVICE'){
        return res.status(404).json({
            msg:'debe ser un usuario servicio'
        })
    }

    const servicio = new Servicio({usuario:uid, ...resto});
    try {
        await servicio.save()
        res.status(200).json({
            msg: 'producto creado',
            servicio
        })

    } catch (error) {
        console.error(error);
        res.status(404).json({message: error.message});
    }
}

const getProductos = async(req, res)=>{
    const uid = req.uid

    const usuario = await User.findById(uid);
 
    if(!usuario){
        return res.status(404).json({
            msg:'debe estar logiado para ver las productos'
        })
    }
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        console.error(error);
        res.status(404).json({message: error.message});

    }
}

const getServicios = async(req, res)=>{
    const uid = req.uid
    

    const usuario = await User.findById(uid);
 
    if(!usuario){
        return res.status(404).json({
            msg:'debe estar logiado para ver las servicios'
        })
    }
    try {
        const servicios = await Servicio.find();
        res.json(servicios);
    } catch (error) {
        console.error(error);
        res.status(404).json({message: error.message});

    }
}

const getProductoPorUsuario = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const uid = req.uid


    const query = { usuario: uid };

    try {
        // Obtener el conteo total de documentos en las
        const totalProductos = await Promise.all([
            Producto.countDocuments(query),
        ]);

        const total = totalProductos;

        let productos = [];
        let skip = Number(desde);
        let limit = Number(limite);

        // Obtener los usuarios de User_Servicio
        if (skip < totalProductos) {
            const totalProductos = await Producto.find(query).skip(skip).limit(limit).exec();
            productos = totalProductos;
            limit -= totalProductos.length;
            skip = 0;
        } else {
            skip -= totalProductos;
        }

        res.json({
            total,
            totalProductos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error en el servidor'
        });
    }
};

module.exports ={
    crearProducto,
    crearServicio,
    getProductos,
    getServicios,
    getProductoPorUsuario
}