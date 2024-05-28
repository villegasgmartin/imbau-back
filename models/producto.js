
const {Schema, model } = require('mongoose');

const ServicioSchema = Schema({
    nombre:{
        type: String,
        required: true,
        
    },
    categoria:{
        type: String,
        required: true,
        
    },
    subcategoria:{
        type: String,
        required: true,
        
    },
    marca:{
        type: String,
        required: true,
        
    },
    modelo:{
        type: String,
       
        
    },
    color:{
        type: String,
       
        
    },
    info:{
        type: String,
       
        
    },
    img:{
        type: String,
        
    },
    codigouniversal:{
        type: String,
    },
    SKU:{
        type: String,
    },
    cuota:{
        type: String,
      
    },
    entrega:{
        type: String,
        required: true,
    },
    garantia:{
        type: String,
        required: true,
    },
    factura:{
        type: String,
        required: true,
    },
    
    precio:{
        type: Number,
        required: true
    
    },
})

module.exports= model('USer_Servicio', ServicioSchema)