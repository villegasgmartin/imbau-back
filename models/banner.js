const {Schema, model } = require('mongoose');

const BannerSchema = Schema({

    ubicacion:{
        type: String,
        required: true,
    },
    posicion:{
        type: Number,
        required: true,
    },
    img:{
        type: String,
        required: true, 
    },
    inicio:{
        type: Date,
        required: true,
    },
    fin:{
        type: Date,
        required: true,
    }
   
})

module.exports= model('Banner', BannerSchema)