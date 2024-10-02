const { response, request } = require('express');
const bcryptjs = require('bcryptjs');


//modelos de usuario
const User = require('../models/usuario')
const User_Admin = require('../models/usuarioAdmin');
const Compra = require('../models/compras');
const Banner = require('../models/banner');


const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const usuariosGetTotal = async(req = request, res = response) => {
    const { limite = 99, desde = 0 } = req.query;
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

//usuarios por servicios o productos 
const usuariosPorTipo = async(req = request, res = response) => {
    const { limite = 99, desde = 0, tipo } = req.query;
    const query = { estado: true, rol : tipo };

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

// suspender usuario
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

// activar usuario
const usuariosActivar = async(req, res = response) => {
    const { id } = req.query;


    // Buscar el usuario en las tres colecciones
    let user = await User.findById(id)

    if (!user) {
        return res.status(404).json({
            msg: 'Usuario no encontrado'
        });
    }

    // Actualizar el estado del usuario encontrado
    user.estado = true;
    await user.save();
    res.json(user);
}

//get compras de productos

const getProductosComprados = async(req, res)=>{

    try {
        const comprasProductos = await Compra.find();
        res.json(comprasProductos);
    } catch (error) {
        console.error(error);
        res.status(404).json({message: error.message});

    }
}

//borrar compra de producto
const deleteProductosComprados = async(req, res)=>{
    const {id}= req.query
    try {
        const comprasProductos = await Compra.delete({_id: id});
        res.json({
            msg: 'producto eliminado de la lista de comprados'
        });
    } catch (error) {
        console.error(error);
        res.status(404).json({message: error.message});

    }
}


//agregar banner
const postBanner = async(req, res)=>{
    const {ubicacion, posicion, img, inicio, fin} = req.body;

    try {
        

         //agrego imagen si es que hay
        if (req.files) {
            const { tempFilePath } = req.files.img;

            const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

            img = secure_url;
        } else {
            img =
                'https://res.cloudinary.com/dj3akdhb9/image/upload/v1724899221/samples/caravatar_rsuxln.png';
        }
        
        const banner = new Banner({ubicacion, posicion, img, inicio, fin});

        banner.save();

        res.status(200).json({
            msg:'banner guardado',
            banner
        })



    } catch (error) {
        console.error(error);
        res.status(404).json({message: error.message});
    }

}

//get banner

const getBanner = async (req, res) =>{

}



module.exports = {
    usuariosGetTotal,
    usuariosDelete,
    usuariosActivar,
    usuariosPorTipo,
    getProductosComprados,
    deleteProductosComprados
}