const { response, request } = require('express');


//modelos de usuario
const User_Servicio = require('../models/usuarioServicio')
const User_Comprador = require('../models/usuarioComprador')
const User_Vendedor = require('../models/usuarioVendedor')

const usuariosGet = (req = request, res = response) => {

    const { q, nombre = 'No name', apikey, page = 1, limit } = req.query;

    res.json({
        msg: 'get API - controlador',
        q,
        nombre,
        apikey,
        page, 
        limit
    });
}

const usuariosServicioPost = async (req, res = response) => {

    const body = req.body;

    const usuario = new User_Servicio(body);

    await usuario.save()

    res.json({
        msg: 'post API - usuariosPost',
        body
      
    });
}
const usuariosCompradorPost = async (req, res = response) => {
        
    const body = req.body;

    const usuario = new User_Comprador(body);

    await usuario.save()

    res.json({
        msg: 'post API - usuariosPost',
        body
     
    });
}

const usuariosVendedorPost = async (req, res = response) => {

    const body = req.body;

    const usuarioVendedor = new User_Vendedor(body);
    const usuarioComprador = new User_Comprador(body);

    await usuarioVendedor.save()
    await usuarioComprador.save()

    res.json({
        msg: 'post API - usuariosPost',
        body, 
        
    });
}

const usuariosPut = (req, res = response) => {

    const { id } = req.params;

    res.json({
        msg: 'put API - usuariosPut',
        id
    });
}



const usuariosDelete = (req, res = response) => {
    res.json({
        msg: 'delete API - usuariosDelete'
    });
}




module.exports = {
    usuariosGet,
    usuariosServicioPost,
    usuariosCompradorPost,
    usuariosVendedorPost,
    usuariosDelete,
    usuariosPut
}