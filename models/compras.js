
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
    tipo:{
        type: String
    },
    estados:{
        type:String,
        enum:["En preparacion", "Rechazado","En camino", "Listo para entregar", "Enviado", "Entregado"]
    },
    entregadoConfirmadoPorComprador: {
        type: Boolean,
        default: false
      }
   
})

module.exports= model('Compra', ComprasSchema)