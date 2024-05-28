
const {Schema, model } = require('mongoose');

const ServicioSchema = Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es requerido']
    },
    correo:{
        type: String,
        required: [true, 'El correo es requerido'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'La password es requerida']
    },
    
    rol:{
        type: String,
        required: true,
        enum: 'USER_BUYER'
    }, 
    estado:{
        type: Boolean,
        default: true,
      
    }
    
})

module.exports= model('User_Comprador', ServicioSchema)