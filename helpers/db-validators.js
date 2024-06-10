const Role = require('../models/role');
//modelos de usuario
const User_Servicio = require('../models/usuarioServicio')
const User_Comprador = require('../models/usuarioComprador')
const User_Vendedor = require('../models/usuarioVendedor')

const esRoleValido = async(rol = '') => {

    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
}

const emailExiste = async( correo = '' ) => {

    // Verificar si el correo existe
    const existeEmailServicio = await User_Servicio.findOne({ correo });
    const existeEmailComprador = await User_Comprador.findOne({ correo });
    const existeEmailVendedor = await User_Vendedor.findOne({ correo });

    if ( existeEmailServicio || existeEmailVendedor || existeEmailComprador) {
        throw new Error(`El correo: ${ correo }, ya está registrado`);
    }
}

const existeUsuarioPorId = async( id ) => {
    
    // Verificar si el correo existe
    const existeUsuarioConprador = await User_Comprador.findById(id);
    const existeUsuarioServicios = await User_Servicio.findById(id);
    const existeUsuarioVendedor = await User_Vendedor.findById(id);



    if ( !existeUsuarioConprador && !existeUsuarioServicios && !existeUsuarioVendedor ) {
        throw new Error(`El id no existe ${ id }`);
    }
}



module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId
}
