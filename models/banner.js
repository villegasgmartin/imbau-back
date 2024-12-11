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
        default: 'https://res.cloudinary.com/dj3akdhb9/image/upload/e_improve,w_300,h_600,c_thumb,g_auto/v1727921766/imbau-default_xbkzhj.jpg'
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