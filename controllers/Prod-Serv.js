const { response, request } = require('express');
const { customAlphabet } = require('nanoid');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

//modelos de usuario
const User = require('../models/usuario')
const User_Admin = require('../models/usuarioAdmin')
const Producto = require('../models/producto')
const Servicio = require('../models/Servicio');
const generarLinkDePago = require('../middlewares/mercado-pago');
const Compra = require('../models/compras');
const Categoria = require('../models/categoria');
const Ofertas = require('../models/ofertas');


const crearProducto = async (req, res) => {
    const { userId, ...resto } = req.body;

    const uid = req.uid;

    const usuario = await User.findById(uid).lean();  // Usar .lean() para obtener un objeto JavaScript plano
    if (!usuario) {
        return res.status(404).json({
            msg: 'Debe estar logueado para crear un producto'
        });
    }

    if (usuario.rol !== 'USER_SELLER') {
        return res.status(404).json({
            msg: 'Debe ser un usuario vendedor'
        });
    }

    // Validar que tiene configurada la cuenta bancaria antes de continuar
    if (!usuario.alias || !usuario.cbu || !usuario.banco) {
        return res.status(404).json({
            msg: 'Debe completar los datos de la cuenta bancaria antes de continuar'
        });
    }

    const producto = new Producto({ usuarioId: uid, usuario, ...resto });

    try {
        await producto.save();
        res.status(200).json({
            msg: 'Producto creado',
            producto
        });
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: error.message });
    }
};


const crearServicio = async (req, res) =>{
    const {userId, ...resto} = req.body;

    const uid = req.uid

    const usuario = await User.findById(uid).lean();

    if(!usuario){
        return res.status(404).json({
            msg:'debe estar logiado para crear servicio'
        })
    }

    if(usuario.rol != 'USER_SERVICE'){
        return res.status(404).json({
            msg:'debe ser un usuario servicio'
        })
    }

    //validar que tiene configurado la cuenta bancaria antes de continuar
    if(!usuario.alias || !usuario.cbu || !usuario.banco){
        return res.status(404).json({
               msg:'debe completar datos de cuenta bancaria antes de continuar'
       })
   }   

    //validad que tenga los datos de usuario antes de crear servicio
    if(!usuario.experiencia && !usuario.sobremi && !usuario.Provicia){
        return res.status(404).json({
               msg:'debe completar datos personales antes de continuar'
       })
   }

    const servicio = new Servicio({usuarioId:uid, usuario, ...resto});
    try {
        await servicio.save()
        res.status(200).json({
            msg: 'servicio creado',
            servicio
        })

    } catch (error) {
        console.error(error);
        res.status(404).json({message: error.message});
    }
}
//get productos aleatorio
const getProductosAleatorio = async (req, res) => {
    try {
        const productos = await Producto.aggregate([
            { $sample: { size: await Producto.countDocuments() } }
        ]);
        res.json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const getProductosAleatorio1 = async (req, res) => {
    try {
        const totalProductos = await Producto.countDocuments();
        const productos = await Producto.aggregate([{ $sample: { size: Math.ceil(totalProductos / 2) } }]);
        res.json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const getProductosAleatorio2 = async (req, res) => {
    try {
        const productos = await Producto.find();
        
        // Mezclar manualmente los productos
        for (let i = productos.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [productos[i], productos[j]] = [productos[j], productos[i]];
        }

        res.json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

//get servicios aleatorio
const getServiciosAleatorio = async (req, res) => {
    try {
        const servicios = await Servicio.find();
        res.json(servicios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const getServiciosAleatorio1 = async (req, res) => {
    try {
        const totalServicios = await Servicio.countDocuments();
        const servicios = await Servicio.aggregate([{ $sample: { size: Math.ceil(totalServicios / 2) } }]);
        res.json(servicios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const getServicioleatorio2 = async (req, res) => {
    try {
        const servicio = await Servicio.find();
        
        // Mezclar manualmente los productos
        for (let i = servicio.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [servicio[i], servicio[j]] = [servicio[j], servicio[i]];
        }

        res.json(servicio);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
const getServicios = async(req, res)=>{

    try {
        const servicios = await Servicio.find();
        res.json(servicios);
    } catch (error) {
        console.error(error);
        res.status(404).json({message: error.message});

    }
}
const getProductoporId = async(req, res)=>{
    const id = req.query.id
    
    try {
        const producto = await Producto.findById(id);
        res.json(producto);
    } catch (error) {
        console.error(error);
        res.status(404).json({message: error.message});

    }
}

const getServiceporId = async(req, res)=>{
    const id = req.query.id
    
    try {
        const servicio = await Servicio.findById(id);
        res.json(servicio);
    } catch (error) {
        console.error(error);
        res.status(404).json({message: error.message});

    }
}

const getProductoPorUsuario = async(req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const uid = req.uid


    const query = { usuario: uid };

    try {
        // Obtener el conteo total de documentos en las
        const totalProductos = await Promise.all([
            Producto.countDocuments(query),
        ]);

        const total = totalProductos;

        let productos = [];
        let skip = Number(desde);
        let limit = Number(limite);

        // Obtener los usuarios de User_Servicio
        if (skip < totalProductos) {
            const totalProductos = await Producto.find(query).skip(skip).limit(limit).exec();
            productos = totalProductos;
            limit -= totalProductos.length;
            skip = 0;
        } else {
            skip -= totalProductos;
        }

        const productoslistados = await Producto.find(query)


        res.json({
            total,
            productoslistados
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error en el servidor'
        });
    }
};

const getServicioPorUsuario = async(req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const uid = req.uid
    const query = { usuario: uid };

    try {
        // Obtener el conteo total de documentos en las
        const totalServicios = await Promise.all([
            Servicio.countDocuments(query),
        ]);

        const total = totalServicios;

        let productos = [];
        let skip = Number(desde);
        let limit = Number(limite);

        // Obtener los usuarios de User_Servicio
        if (skip < totalServicios) {
            const totalServicios = await Servicio.find(query).skip(skip).limit(limit).exec();
            productos = totalServicios;
            limit -= totalServicios.length;
            skip = 0;
        } else {
            skip -= totalServicios;
        }

        const servicioslistados = await Servicio.find(query)

        res.json({
            total,
            servicioslistados
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error en el servidor'
        });
    }
};

const actualizarProducto = async(req, res) => {
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
        let producto = await Producto.findOneAndUpdate(
            { _id: id, usuario: uid },
            body,
            { new: true }
        );



        if (!producto) {
            return res.status(404).json({
                msg: 'Producto no encontrado o no pertenece al usuario'
            });
        }

        res.json(producto);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error del servidor'
        });
    }
};


const actualizarServicio = async (req, res) => {
    const { id } = req.query;
    const { ...body } = req.body;
    const uid = req.uid;

    try {
        const usuario = await User.findById(uid);

        if (!usuario) {
            return res.status(404).json({
                msg: 'Debe estar logueado para actualizar servicios'
            });
        }

        // Buscamos y actualizamos el servicio
        let servicio = await Servicio.findOneAndUpdate(
            { _id: id, usuario: uid },
            body,
            { new: true }
        );

        if (!servicio) {
            return res.status(404).json({
                msg: 'Servicio no encontrado o no pertenece al usuario'
            });
        }

        res.json(servicio);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error del servidor'
        });
    }
};


const eliminarServicio = async(req, res)=>{
    const { id} = req.query;

    const uid = req.uid
    
    try {
        const usuario = await User.findById(uid);
 
        if(!usuario){
            return res.status(404).json({
                msg:'debe estar logiado para ver las eliminar Servicios'
            })
        }

        const servicioEliminado = await Servicio.findByIdAndDelete({_id:id, usuario:uid})

        if (!servicioEliminado) {
            return res.status(404).json({
                msg: 'Servicio no encontrado o no pertenece al usuario'
            });
        }


        res.status(200).json({
            msg: 'servicio Eliminado',
            servicioEliminado
        })

    } catch (error) {
        console.log(error);
        res.status(404).json({
            msg: 'error'
        })
    }
    
}


const eliminarProducto = async(req, res)=>{
    const { id} = req.query;

    const uid = req.uid
    
    try {
        const usuario = await User.findById(uid);
 
        if(!usuario){
            return res.status(404).json({
                msg:'debe estar logiado para ver las eliminar Producto'
            })
        }
     

        const productoEliminado = await Producto.findByIdAndDelete({_id:id, usuario:uid})

        if (!productoEliminado) {
            return res.status(404).json({
                msg: 'Producto no encontrado o no pertenece al usuario'
            });
        }


        res.status(200).json({
            msg: 'Producto Eliminado',
            productoEliminado
        })

    } catch (error) {
        console.log(error);
        res.status(404).json({
            msg: 'error'
        })
    }
    
}

//compra producto

const comprarProducto =async(req, res) => {
   
    const {cantidad, ids} = req.body
    const uid = req.uid;
    let total = 0

    console.log(cantidad, ids)
  

    try {
        //validamos el usuario comprador 
        const usuario = await User.findById(uid);

        if (!usuario) {
            return res.status(404).json({
                msg: 'Debe poder comprar'
            });
        }

        // Verificar si id es un array
        if (Array.isArray(ids) && Array.isArray(cantidad)) {

            for (let i = 0; i < ids.length; i++) {
                let producto = await Producto.findOne({ _id: ids[i] });
                const usuariovendedor = producto.usuarioId
                console.log(producto)

                if (!producto) {
                    return res.status(404).json({
                        msg: 'producto no encontrado'
                    });
                }
                 //actualizar el stock 
                let cant = cantidad[i]
                producto.stock = producto.stock - cant

                console.log(producto.precio , cant)
                //obtener precio del total
                total += producto.precio * cant
                // asignar la compra del producto al comprador 
                // usuario.productosComprados.push(ids[i]);
                // await usuario.save();
               
                    //guardar la compra en el modelo de compras

                // Crea un generador con 4-5 caracteres de longitud, combinando letras y números
                const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 5);

                // Generar un ID único
                const idCorto = nanoid();
                const compra = new Compra({
                    usuarioId: uid, usuario, producto : producto,  estados:'En preparacion', idcorto:idCorto, tipo:'Producto', usuariovendedor:usuariovendedor
                })

                await compra.save();
                
            }

            console.log(total);
            //obtner el link de pago
            const link = await generarLinkDePago(total);

            
            res.status(200).json(link); 
            
        } else {
            
            return res.status(404).json({
                msg: 'producto no encontrado, debe mandarse como array'
            })
            
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error del servidor'
        });
    }
}
//actualizar estado de producto comprado
const actualizarCompra = async (req, res)=>{
    const uid = req.uid;
    const estado = req.query.estado
    const id = req.query.id

    const usuario = await User.findById(uid)  // Usar .lean() para obtener un objeto JavaScript plano
    if (!usuario) {
        return res.status(404).json({
            msg: 'Debe estar logueado para actualizar la compra'
        });
    }

    try {
        if (estado === 'Entregado') {
            // El vendedor lo marcó como entregado, pero falta confirmación
            await Compra.findByIdAndUpdate(id, {
                estados: 'Entregado',
                entregadoConfirmadoPorComprador: false
            }, { new: true });
        } else {
            await Compra.findByIdAndUpdate(id, {
                estados: estado
            }, { new: true });
        }

        res.json({
            msg:"compra actualizada a estado" + estado
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error del servidor'
        });
    }
}

const confirmarEntrega = async (req, res) => {
    const uid = req.uid;
    const id = req.query.id;

    try {
        const compra = await Compra.findById(id);

        if (!compra) {
            return res.status(404).json({ msg: 'Compra no encontrada' });
        }

        // Validar que quien confirma es el comprador
        if (!compra.usuarioId.includes(uid)) {
            return res.status(403).json({ msg: 'No estás autorizado para confirmar esta entrega' });
        }

        // Confirmar la entrega
        compra.entregadoConfirmadoPorComprador = true;
        await compra.save();

        res.json({ msg: 'Entrega confirmada por el comprador', compra });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error del servidor'
        });
    }

    
};

const agregarComentario = async (req, res)=>{
    const uid = req.uid;
    const {mensaje, estrellas}= req.body;
    const idCompra = req.query.idCompra

    const usuario = await User.findById(uid);
    if (!usuario) {
        return res.status(404).json({
            msg: 'Debe estar logueado para realizar la accion'
        });
    }

    try {

        const compra = await Compra.findById(idCompra);
        if(!compra){
            return res.json({
                msg: "no hay compra con ese id"
            })
        }
        if(estrellas>5 || estrellas<1){
            return res.json({
                msg:"las estrellas van de 1 a 5"
            })
        }
        console.log(Object(compra.producto._id));
        const idProducto = compra.producto._id
        const nuevoComentario = {
            estrellas,
            mensaje,
            fecha: new Date()
        };

        const productoActualizado = await Producto.findByIdAndUpdate(
            idProducto,
            { $push: { comentarios: nuevoComentario } },
            { new: true }
        );

        if (!productoActualizado) {
            return res.status(404).json({ msg: "Producto no encontrado" });
        }

        res.json({
            msg: "Comentario agregado con éxito",
            producto: productoActualizado
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error del servidor'
        }); 
    }
}

//crud categorias y subcategorias


// Crear una nueva categoría
const crearCategoria = async (req, res) => {
    const { categoria, subcategoria } = req.body;

    try {
        //verificar que no exista una categoria con el mismo nombre
        const mismaCategoria = await Categoria.find({categoria})
        console.log(mismaCategoria)
        if(mismaCategoria.length > 0){
            return res.json({
                msg: "Ya existe categoria con ese nombre"
            })
        }
        const nuevaCategoria = new Categoria({ categoria, subcategoria });
        await nuevaCategoria.save();

        res.status(201).json({
            msg: 'Categoría creada exitosamente',
            categoria: nuevaCategoria
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al crear la categoría', error });
    }
};

// Crear una subcategoría asociada a una categoría
const agregarSubcategoria = async (req, res) => {
    const categoriaId = req.query.categoria
    const {subcategoria } = req.body;

    try {
        const categoria = await Categoria.findById(categoriaId);

        if (!categoria) {
            return res.status(404).json({ msg: 'Categoría no encontrada' });
        }

        categoria.subcategoria.push(subcategoria);
        await categoria.save();

        res.status(200).json({
            msg: 'Subcategoría agregada exitosamente',
            categoria
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al agregar la subcategoría', error });
    }
};

// Editar una categoría o su visibilidad
const editarCategoria = async (req, res) => {
    const  id  = req.query.categoria;
    const { categoria, visibilidad } = req.body;

    try {
        const categoriaEditada = await Categoria.findByIdAndUpdate(
            id,
            { categoria, visibilidad },
            { new: true }
        );

        if (!categoriaEditada) {
            return res.status(404).json({ msg: 'Categoría no encontrada' });
        }

        res.status(200).json({
            msg: 'Categoría editada exitosamente',
            categoria: categoriaEditada
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al editar la categoría', error });
    }
};

// Eliminar una categoría y sus subcategorías
const eliminarCategoria = async (req, res) => {
    const  id  = req.query.categoria;

    try {
        const categoriaEliminada = await Categoria.findByIdAndDelete(id);

        if (!categoriaEliminada) {
            return res.status(404).json({ msg: 'Categoría no encontrada' });
        }

        res.status(200).json({
            msg: 'Categoría y subcategorías eliminadas exitosamente',
            categoria: categoriaEliminada
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al eliminar la categoría', error });
    }
};

// Obtener categorías y subcategorías visibles
const obtenerCategoriasVisibles = async (req, res) => {
    try {
        const categorias = await Categoria.find({ visibilidad: true });

        res.status(200).json({
            msg: 'Categorías obtenidas exitosamente',
            categorias
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener las categorías', error });
    }
};
// Obtener categorías y subcategorías visibles
const obtenerSubCategoriasVisibles = async (req, res) => {
    const categoria = req.query.categoria
    try {
        const categorias = await Categoria.find({ visibilidad: true, categoria });
        console.log(categorias)
        const subcategorias = categorias[0].subcategoria

        res.status(200).json({
            subcategorias
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener las categorías', error });
    }
};


//rutas de creacion de oferta
const crearOferta = async (req, res) => {
    const uid = req.uid;
    const {idComprador, ...rest} = req.body
    try {
        const usuario = await User.findById(uid);
        if (!usuario || usuario.rol != "USER_SERVICE") {
            return res.status(404).json({
                msg: 'Debe estar logueado para realizar la accion o ser vendedor de servicios'
            });
        }

        //buscar al usuario q solicita el servicio
        const userComprador = await User.findById(idComprador);
       

        const nuevaOferta = new Ofertas({
            ...rest,
            proveedor: {
                id: usuario._id.toString(),
                nombre: usuario.nombre
            },
            comprador: {
                id: userComprador._id.toString(),
                nombre: userComprador.nombre
            }
        });
        await nuevaOferta.save();

        res.json({
            msg: "Oferta creada con éxito",
            oferta: nuevaOferta
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al crear la oferta" });
    }
};

const actualizarEtapa = async (req, res) => {
    const id  = req.query.id;

    try {
        const oferta = await Ofertas.findById(id);
        if (!oferta) return res.status(404).json({ msg: "Oferta no encontrada" });

        if (oferta.etapasRealizadas >= oferta.cantidadDeEtapas) {
            return res.status(400).json({ msg: "Ya se completaron todas las etapas" });
        }

        oferta.etapasRealizadas += 1;

        if (oferta.etapasRealizadas === oferta.cantidadDeEtapas) {
            oferta.estadoFinal = "terminado";
        }

        await oferta.save();

        res.json({
            msg: "Etapa actualizada",
            oferta
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al actualizar etapa" });
    }
};

const borrarOferta = async (req, res) => {
    const id  = req.query.id;

    try {
        const oferta = await Ofertas.findByIdAndUpdate(id, { estado: false }, { new: true });
        if (!oferta) return res.status(404).json({ msg: "Oferta no encontrada" });

        res.json({
            msg: "Oferta marcada como eliminada",
            oferta
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al borrar la oferta" });
    }
};

const borrarOfertaDefinitivamente = async (req, res) => {
    const id  = req.query.id;

    try {
        const oferta = await Ofertas.findByIdAndDelete(id);
        if (!oferta) return res.status(404).json({ msg: "Oferta no encontrada" });

        res.json({
            msg: "Oferta eliminada permanentemente"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al eliminar definitivamente la oferta" });
    }
};

const subirImagenOferta = async (req, res) => {
    const id = req.query.id;

    try {
        const oferta = await Ofertas.findById(id);
        if (!oferta) return res.status(404).json({ msg: "Oferta no encontrada" });

        if (oferta.estadoFinal !== "terminado") {
            return res.status(400).json({ msg: "La oferta no está terminada aún" });
        }

        if (!req.files.imagen) {
            return res.status(400).json({ msg: "No se subió ninguna imagen" });
        }

        const { tempFilePath } = req.files.imagen;

		const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

		// imgEntrada = secure_url;

        // const result = await cloudinary.uploader.upload(req.files.imagen.path, {
        //     folder: 'ofertas'
        // });

        oferta.imagen = secure_url;
        await oferta.save();

        res.json({
            msg: "Imagen subida correctamente",
            oferta
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al subir imagen" });
    }
};


const ofertasTerminadas = async (req, res) =>{
    const id = req.query.id

    const usuario = await User.findById(id);
    if (!usuario) {
        return res.status(404).json({
            msg: 'Debe estar logueado para realizar la accion'
        });
    }

    try {
        let ofertasTerminadas;
        if(usuario.rol === "USER_SERVICE"){
            ofertasTerminadas = await Ofertas.find({estadoFinal:"terminado", "proveedor.id": usuario._id.toString()});
        }else{
            ofertasTerminadas = await Ofertas.find({estadoFinal:"terminado", "comprador.id": usuario._id.toString()});

        }

        res.json(ofertasTerminadas)
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error en peticion" });
    }

}
const ofertasPendientes = async (req, res) =>{
    const id = req.uid;

    const usuario = await User.findById(id);
    if (!usuario) {
        return res.status(404).json({
            msg: 'Debe estar logueado para realizar la accion'
        });
    }

    try {
        let ofertasPendientes;
        if(usuario.rol === "USER_SERVICE"){
            ofertasPendientes = await Ofertas.find({estadoFinal:"Pendiente", "proveedor.id": usuario._id.toString(), estado:true});
        }else{
            ofertasPendientes = await Ofertas.find({estadoFinal:"Pendiente", "comprador.id": usuario._id.toString(), estado:true});

        }

        res.json(ofertasPendientes)
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error en peticion" });
    }

}

const ofertasFalsas = async (req, res) =>{
    const id = req.uid

    const usuario = await User.findById(id);
    if (!usuario) {
        return res.status(404).json({
            msg: 'Debe estar logueado para realizar la accion'
        });
    }

    try {
        let ofertasInterrumpidas;
        if(usuario.rol === "USER_SERVICE"){
            ofertasInterrumpidas = await Ofertas.find({estado:false, "proveedor.id": usuario._id.toString()});
        }else{
            ofertasInterrumpidas = await Ofertas.find({estado:false, "comprador.id": usuario._id.toString()});

        }

        res.json(ofertasInterrumpidas)
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error en peticion" });
    }

}

const getOfertasPorId = async (req, res) =>{
    const uid = req.uid

    const usuario = await User.findById(uid);
    if (!usuario) {
        return res.status(404).json({
            msg: 'Debe estar logueado para realizar la accion'
        });
    }

    console.log(usuario._id.toString())

    try {
        let ofertaPorId;
        if(usuario.rol === "USER_SERVICE"){
            ofertaPorId = await Ofertas.find({
                "proveedor.id": usuario._id.toString()
              });
        }else{
            ofertaPorId = await Ofertas.find({
                "comprador.id": usuario._id.toString()
              });
        }
       
          

        res.json(ofertaPorId)
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error en peticion" });
    }

}

const agregarComentarioOferta = async (req, res)=>{
    const uid = req.uid;
    const {mensaje, estrellas}= req.body;
    const idOferta = req.query.idOferta

    const usuario = await User.findById(uid);
    if (!usuario) {
        return res.status(404).json({
            msg: 'Debe estar logueado para realizar la accion'
        });
    }

    try {

        const oferta = await Ofertas.findById(idOferta);
        if(!oferta){
            return res.json({
                msg: "no hay oferta con ese id"
            })
        }
        if(estrellas>5 || estrellas<1){
            return res.json({
                msg:"las estrellas van de 1 a 5"
            })
        }
        
        const nuevoComentario = {
            estrellas,
            mensaje,
            fecha: new Date()
        };

        const ofertaActualizada = await Ofertas.findByIdAndUpdate(
            idOferta,
            { $push: { comentarios: nuevoComentario } },
            { new: true }
        );

        if (!ofertaActualizada) {
            return res.status(404).json({ msg: "Producto no encontrado" });
        }

        res.json({
            msg: "Comentario agregado con éxito",
            oferta: ofertaActualizada
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error del servidor'
        }); 
    }
}

const getOfertaporId = async (req, res)=>{
    const id = req.query.id

    try {
        const oferta = await Ofertas.findById(id);
        if(!oferta){
            return res.json({
                msg:'No hay oferta por ese id'
            })
        }
        res.status(200).json({
            oferta
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error del servidor'
        });  
    }
}

//get ofertas por servicio
const getOfertasporServicio = async (req, res)=>{
    const idServicio = req.query.idServicio

    try {

        const {usuarioId} = await Servicio.findById(idServicio);
        console.log(usuarioId);
        const idproevedor = usuarioId.toString()
        console.log(idproevedor);
        //buscar ofertas con ese id

        const ofertas = await Ofertas.find({
            "proveedor.id": idproevedor,
            estadoFinal:"terminado"
          });

        res.status(200).json(ofertas)

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error del servidor'
        });  
    }
}


module.exports ={
    crearProducto,
    crearServicio,
    getServicios,
    getProductoPorUsuario,
    getServicioPorUsuario,
    eliminarProducto,
    eliminarServicio,
    actualizarServicio,
    actualizarProducto,
    getProductoporId,
    getServiceporId,
    comprarProducto,
    crearCategoria,
    agregarSubcategoria,
    editarCategoria,
    eliminarCategoria,
    obtenerCategoriasVisibles,
    obtenerSubCategoriasVisibles,
    getProductosAleatorio,
    getProductosAleatorio1,
    getProductosAleatorio2,
    actualizarCompra,
    confirmarEntrega,
    agregarComentario,
    crearOferta,
    actualizarEtapa,
    borrarOferta,
    borrarOfertaDefinitivamente,
    subirImagenOferta,
    getServiciosAleatorio,
    getServiciosAleatorio1,
    getServicioleatorio2,
    ofertasTerminadas,
    getOfertasPorId,
    getOfertaporId,
    ofertasPendientes,
    ofertasFalsas,
    agregarComentarioOferta,
    getOfertasporServicio
}