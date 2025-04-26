const { Schema, model } = require('mongoose');

const ChatImbauSchema = Schema({
    usuarioComprador: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    usuarioNombre:{type:String},
    proveedorNombre:{type:String},
    Proveedor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mensajes: [
        {
            tipo: { type: String},
            mensaje: { type: String },
            fecha: { type: Date, default: Date.now },
        },
    ],
});

module.exports = model('chatImbau', ChatImbauSchema);
