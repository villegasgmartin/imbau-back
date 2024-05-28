
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
    direccion:{
        type: String,
        required: [true, 'la direccion es requerida']
    },
    ocultardireccion:{
        type: Boolean,
        default: false,
    },
    Provicia:{
        type: String,
        required: [true, 'la Provicia es requerida']
    },
    Ciudad:{
        type: String,
        required: [true, 'la Ciudad es requerida']
    },
    Barrio:{
        type: String,
        
    },
    
    rubro:{
        type: String,
        required: [true, 'el rubro es requerida']
    },
    servicio:{
        type: String,
        required: [true, 'el servicio es requerida']
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