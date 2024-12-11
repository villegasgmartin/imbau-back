const Role = require('../models/role');
//modelos de usuario
const User = require('../models/usuario')


const esRoleValido = async(rol = '') => {

    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
}

const emailExiste = async( correo = '' ) => {

    // Verificar si el correo existe
    const existeEmail = await User.findOne({ correo });
   

    if ( existeEmail) {
        throw new Error(`El correo: ${ correo }, ya está registrado`);
    }
}

const existeUsuarioPorId = async( id ) => {
    
    // Verificar si el correo existe
    const existeUsuario = await User.findById(id);
    



    if ( !existeUsuario ) {
        throw new Error(`El id no existe ${ id }`);
    }
}



module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId
}
