const Chat = require('../models/ChatImbau');

const crearChat = async (req, res) => {
    const { proveedorID } = req.body;
    const usuarioId = req.userId;

    try {
        let chat = await Chat.findOne({ usuarioComprador: usuarioId, Proveedor: proveedorID });

        if (!chat) {
            chat = new Chat({ usuarioComprador: usuarioId, Proveedor: proveedorID });
            await chat.save();
        }

        res.json({ ok: true, chat });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, msg: 'Error al crear el chat' });
    }
};

const obtenerChats = async (req, res) => {
    const userId = req.userId;
    console.log("id proevedor", userId)

    try {
        const chats = await Chat.find({
            $or: [{ usuarioComprador: userId }, { Proveedor: userId }],
        })
            .populate('usuarioComprador', 'nombre')
            .populate('Proveedor', 'nombre');

        res.json({ ok: true, chats });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, msg: 'Error al obtener los chats' });
    }
};

const obtenerMensajes = async (req, res) => {
    const { chatId } = req.params;

    try {
        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json({ ok: false, msg: 'Chat no encontrado' });
        }

        res.json({ ok: true, mensajes: chat.mensajes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, msg: 'Error al obtener mensajes' });
    }
};

const enviarMensaje = async (req, res) => {
    const { chatId, mensaje } = req.body;
    const remitente = req.userId;

    try {
        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json({ ok: false, msg: 'Chat no encontrado' });
        }

        chat.mensajes.push({ remitente, mensaje });
        await chat.save();

        res.json({ ok: true, msg: 'Mensaje enviado', mensaje: { remitente, mensaje } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, msg: 'Error al enviar el mensaje' });
    }
};


  

module.exports = {
    crearChat,
    obtenerChats,
    obtenerMensajes,
    enviarMensaje,
};
