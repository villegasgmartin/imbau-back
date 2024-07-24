
const {Schema, model } = require('mongoose');

const UserSchema = Schema({
    usuario: [
        { type: Schema.Types.ObjectId, ref: 'User' }
    ],
    img:{
        type: String,
        
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
    titulo:{
        type: String,
        required: true
    
    },
    descripcion:{
        type: String,
        required: true
    
    },
    video:{
        type: String,
        
    
    },
    precio:{
        type: Number
    
    },
})
UserSchema.methods.toJSON = function() {
    const { __v, password, _id, ...usuario  } = this.toObject();
    usuario.uid = _id;
    return usuario;
}
module.exports= model('Servicio', UserSchema)