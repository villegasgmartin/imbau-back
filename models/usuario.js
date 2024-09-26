
const {Schema, model } = require('mongoose');

const UserSchema = Schema({
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
        required: true
    }, 
    estado:{
        type: Boolean,
        default: true,
      
    },
    Provicia:{
        type: String,
       
    },
    Ciudad:{
        type: String,

    },
    Profesion:{
        type: String, 
    },
    sobremi:{
        type: String, 
    },
    experiencia:{
        type: Number,
    },
    alias:{
        type: String, 
    },
    cbu:{
        type: Number, 
    },
    banco:{
        type: String,  
    },
    productosComprados: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'  
    }],
    serviciosComprados: [{
        type: Schema.Types.ObjectId,
        ref: 'Servicio' 
    }]

    
})

UserSchema.methods.toJSON = function() {
    const { __v, password, _id, ...usuario  } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

module.exports= model('User', UserSchema)