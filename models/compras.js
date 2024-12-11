
const {Schema, model } = require('mongoose');

const ComprasSchema = Schema({
    usuarioId: [
        { type: Schema.Types.ObjectId, ref: 'User' }
    ],
    usuariovendedor:[
        { type: Schema.Types.ObjectId, ref: 'User' }
    ],
    idcorto:{
        type: String
    },
    usuario: {
        type: Object,
        required: true
    },
    producto: {
        type: Object
    },
    servicio: {
        type: Object
    },
    estado:{
        type: String,
        required: true
    },
    tipo:{
        type: String
    }
   
})

module.exports= model('Compra', ComprasSchema)