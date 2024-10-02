
const {Schema, model } = require('mongoose');

const ComprasSchema = Schema({
    usuarioId: [
        { type: Schema.Types.ObjectId, ref: 'User' }
    ],
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
    }
   
})

module.exports= model('Compra', ComprasSchema)