
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
    img:{
        type: String,
        
    },
    rol:{
        type: String,
        required: true,
        enum: 'USER_SERVICE'
    }, 
    estado:{
        type: Boolean,
        default: true,
      
    },
    rubro:{
        type: String,
        required: [true, 'el rubro es requerida']
    },
    servicio:{
        type: String,
        required: [true, 'el servicio es requerida']
    },
    direccion:{
        type: String,
    
    },
    experiencia:{
        type: String,
    
    },
    titulo:{
        type: String,
        required: true
    
    },
    descripcion:{
        type: String,
        required: true
    
    },
    foto:{
        type: String,
        
    
    },
    video:{
        type: String,
        
    
    },
    precio:{
        type: Number,
        required: true
    
    },
})

module.exports= model('User_Servicio', ServicioSchema)