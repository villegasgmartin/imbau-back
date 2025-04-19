const { Schema, model } = require('mongoose');

const OfertasSchema = Schema({
    titulo:{
        type:String,
        required: true
    },
    descripcion:{
        type:String,
        required:true
    },
    resultado:{
        type:String,
        required:true
    },
    duracion:{
        type:String
    },
    etapas:{
        type:Boolean,
    },
    cantidadDeEtapas:{
        type:Number
    },
    etapasRealizadas:{
        type:Number
    },
    presupuesto:{
        type:Number
    },
    tiempoPorEtapas:{
        type:String,
    },
    proveedor:{
        nombre:{
            type:String,
        },
        id:{
            type:String
        }
    },
    comprador:{
        nombre:{
            type:String,
        },
        id:{
            type:String
        }
    },
    estado:{
        type:Boolean,
        default:true
    },
    imagen: {
        type: String
    },
    estadoFinal:{
        type:String,
        default:"Pendiente"
    }


});


module.exports = model( 'Ofertas', OfertasSchema );