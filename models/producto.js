
const {Schema, model } = require('mongoose');

const ServicioSchema = Schema({
    usuarioId: [
        { type: Schema.Types.ObjectId, ref: 'User' }
    ],
    usuario: {
        type: Object,
        required: true
    },
    nombre: {
        type: String,
        required: true,
    },
    categoria: {
        type: String,
        required: true,
    },
    subcategoria: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
        required: false,
    },

    marca: {
        type: String,
        required: true,
    },
    modelo: {
        type: String,
    },
    color: {
        type: String,
    },
    info: {
        type: String,
    },
    img: {
        type: String,
    },
    codigouniversal: {
        type: String,
    },
    SKU: {
        type: String,
    },
    cuota: {
        type: String,
    },
    stock: {
        type: Number,
    },
    entrega: {
        type: String,
        required: true,
    },
    garantia: {
        type: Boolean,
        required: true,
    },
    factura: {
        type: Boolean,
        required: true,
    },
    precio: {
        type: Number,
        required: true
    },
    estrellas:{
        type: Number
    }
});


module.exports= model('Product', ServicioSchema)