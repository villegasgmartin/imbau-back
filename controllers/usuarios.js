const { response, request } = require('express');
const bcryptjs = require('bcryptjs');


//modelos de usuario
const User = require('../models/usuario')
const User_Admin = require('../models/usuarioAdmin');
const usuario = require('../models/usuario');
const Servicio = require('../models/Servicio')

const Compra = require('../models/compras');
const ChatImbau = require('../models/ChatImbau');


const getUsuario = async (req, res) => {
    const {id} = req.query;
    try {
        const usuario =  await User.findById( id ) || await User_Admin.findById(id) ;

        res.status(200).json(usuario)
    } catch (error) {
        res.status(500).json({
            msg: error
        })
    }

}




const usuariosPost = async (req, res = response) => {
        
    let {password, ...resto} = req.body;

    const usuario = new User({password, ...resto});

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    await usuario.save()

    res.json({
       
        usuario
     
    });
}
const AdminPost = async (req, res = response) => {
        
    let {password, ...resto} = req.body;

    const usuario = new User_Admin({password, ...resto});

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    await usuario.save()

    res.json({
       
        usuario
     
    });
}


const usuariosPut = async (req, res = response) => {

    const { id } = req.query;
    console.log(id);
    const { _id, password, correo, ...resto } = req.body;

     // Buscar el usuario en las tres colecciones
     let user = await User.findById(id)

     if (!user) {
         return res.status(404).json({
             msg: 'Usuario no encontrado'
         });
     }
 
    

    if ( password ) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }
        usuario = await User.findByIdAndUpdate( id, resto );
    
    res.json(usuario);
}


const productosCompradosporUsuario = async (req, res) => {
    const uid = req.uid;

    try {
        // Selecciona los campos relevantes desde la base de datos
        const items = await Compra.find({ usuarioId: uid }).select('_id producto estado');

        if (!items || items.length === 0) {
            return res.status(200).json({
                msg: 'No hay productos comprados para este usuario.',
                productos: []
            });
        }

        // Mapea los datos para devolver un array estructurado
        const productos = items.map(item => ({
            id: item._id,
            nombre: item.producto.nombre,
            marca: item.producto.marca,
            modelo: item.producto.modelo,
            estado: item.estado
        }));

        res.status(200).json({
            productos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al obtener los productos.',
            error
        });
    }
};


const productosvendidosporUsuario = async (req, res) => {
    const uid = req.uid;
    console.log(uid)
    try {
        // Selecciona solo el campo 'producto' de las ventas del usuario
        const items = await Compra.find({ usuariovendedor: uid }).select('_id producto estado');

        if (!items || items.length === 0) {
            return res.status(200).json({
                msg: 'No hay productos comprados para este usuario.',
                productos: []
            });
        }

         // Mapea los datos para devolver un array estructurado
         const productos = items.map(item => ({
            id: item._id,
            nombre: item.producto.nombre,
            marca: item.producto.marca,
            modelo: item.producto.modelo,
            estado: item.estado
        }));

        res.status(200).json({
            productos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al obtener los productos.',
            error
        });
    }
};

//actualizar estado de compra
const actualizarEstadoCompraComprador = async(req, res) => {
    const { id } = req.query;
    const {...body } = req.body;
    const uid = req.uid;

    try {
        const usuario = await User.findById(uid);

        if (!usuario) {
            return res.status(404).json({
                msg: 'Debe estar logueado para actualizar productos'
            });
        }

        // Buscamos y actualizamos el producto
        let producto = await Compra.findOneAndUpdate(
            { _id: id, usuarioId: uid },
            body,
            { new: true }
        );



        if (!producto) {
            return res.status(404).json({
                msg: 'compra no encontrada'
            });
        }

        res.json({
            msg:"estado actualizado"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error del servidor'
        });
    }
};

const actualizarEstadoCompraVendedor = async(req, res) => {
    const { id } = req.query;
    const {...body } = req.body;
    const uid = req.uid;

    try {
        const usuario = await User.findById(uid);

        if (!usuario) {
            return res.status(404).json({
                msg: 'Debe estar logueado para actualizar productos'
            });
        }
        console.log(id, uid);
        
        // Buscamos y actualizamos el producto
        let producto = await Compra.findOneAndUpdate(
            { _id: id, usuariovendedor: uid },
            body,
            { new: true }
        );



        if (!producto) {
            return res.status(404).json({
                msg: 'compra no encontrada'
            });
        }

        res.json({
            msg:"estado actualizado"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error del servidor'
        });
    }
};


//chat
const getOrCreateConversation = async (req, res) =>{
    const { usuario, prestador } = req.query;
      
    try {
      //buscar nombre de cliente
      const cliente = await User.findById(usuario);
      const nombreClient = cliente.nombre


      //buscar nombre de escort
      const service = await Servicio.findById(prestador);

      const idPrestador = service.usuarioId
  
      let chat = await ChatImbau.findOne({
        usuarioComprador:usuario, Proveedor:prestador
      });
  
      if (!chat) {
        chat = new ChatImbau({
            usuarioComprador:usuario, Proveedor:prestador, usuarioNombre:nombreClient, proveedorNombre:service.usuario.nombre
        });
        await chat.save();
      }
  
      res.status(200).json({
          data: 'chat creado',
          chat
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener o crear la conversación.' });
    }
  }
  
  //get de todos los chat creados
  const getChatsCliente = async(req, res) => {
      const uid = req.uid
  
      try {
          const chat = await ChatImbau.find({usuarioComprador:uid}) ||  await ChatImbau.find({Proveedor:uid});
  
          if(!chat){
              return res.status(301).json({message: " no hay chats disponibles"});
  
          }
          res.status(200).json({chat});
  
  
      } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Error al obtener chat.' });
  
  
      }
  
  }
  
  // Enviar un mensaje en un chat
  const enviarMensaje = async (req, res) => {
      try {
          const uid  = req.uid; // Obtener UID desde el token
          const { chatId, mensaje } = req.body;
  
          if (!mensaje.trim()) {
              return res.status(400).json({ msg: 'El mensaje no puede estar vacío' });
          }
  
          const cliente = await User.findById(uid);
          const proevedor = await User.findById(uid);
          let tipo;
  
          if (cliente) {
              tipo = 'usuario';
          } else if (proevedor) {
              tipo = 'proveedor';
          } else {
              return res.status(404).json({ msg: 'Usuario no encontrado' });
          }
  
          const chat = await ChatImbau.findById(chatId);
  
          if (!chat) {
              return res.status(404).json({ msg: 'Chat no encontrado' });
          }
  
          // Agregar el mensaje al chat
          const nuevoMensaje = {
              tipo,
              mensaje,
              fecha: new Date(),
          };
  
          chat.mensajes.push(nuevoMensaje);
          await chat.save();
  
          res.status(200).json({ msg: 'Mensaje enviado', chat });
      } catch (error) {
          console.error(error);
          res.status(500).json({ msg: 'Error al enviar el mensaje' });
      }
  };
  
  const obtenerMensajes = async (req, res) => {
      try {
          const uid  = req.uid; // Obtener UID desde el token
          const { chatId } = req.query; // ID del chat desde los parámetros
  
          const cliente = await User.findById(uid);
          const proevedor = await User.findById(uid);
  
          if (!cliente && !proevedor) {
              return res.status(404).json({ msg: 'Usuario no encontrado' });
          }
  
          const chat = await ChatImbau.findById(chatId).populate('usuarioComprador', 'nombre').populate('Proveedor', 'nombre');
  
          if (!chat) {
              return res.status(404).json({ msg: 'Chat no encontrado' });
          }
  
          // Ordenar mensajes por fecha (ascendente: más antiguo a más reciente)
          chat.mensajes.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  
          res.status(200).json({ mensajes: chat.mensajes });
      } catch (error) {
          console.error(error);
          res.status(500).json({ msg: 'Error al obtener los mensajes del chat' });
      }
  };
  
  // Controlador para borrar un chat
  const borrarChat = async (req, res) => {
      try {
        const { id } = req.params; // Obtén el ID del chat desde los parámetros de la URL
    
        // Verificar si el chat existe
        const chat = await ChatImbau.findById(id);
        if (!chat) {
          return res.status(404).json({ error: 'Chat no encontrado' });
        }
    
        // Borrar el chat
        await ChatImbau.findByIdAndDelete(id);
    
        res.status(200).json({ message: 'Chat eliminado exitosamente' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el chat' });
      }
    };




module.exports = {
    usuariosPost,
    usuariosPut,
    AdminPost,
    getUsuario,
    productosCompradosporUsuario,
    productosvendidosporUsuario,
    actualizarEstadoCompraComprador,
    actualizarEstadoCompraVendedor,
    getOrCreateConversation,
    getChatsCliente,
    enviarMensaje,
    obtenerMensajes,
    borrarChat
}