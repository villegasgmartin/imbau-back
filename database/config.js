
const mongoose = require('mongoose');


const dbConnection = async () => {
    try {
        await mongoose.connect("mongodb+srv://admin_imbau:yBeawTJc2oxjUrf9@imbau.yy0hgxm.mongodb.net/imbaudb", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            socketTimeoutMS: 45000, // opción de timeout
            family: 4  // forzar el uso de IPv4
        });

        console.log('Connected');
    } catch (error) {
        console.error(error);
        throw new Error('Error en la connection: ' + error.message);
    }
}

//para prodcucio
// const dbConnection = async () => {
//     try {
//         await mongoose.connect(process.env.MONGODB_URL_ATLAS);

//         console.log('Connected');
//     } catch (error) {
//         console.error(error);
//         throw new Error('Error en la connection: ' + error.message);
//     }
// }







module.exports = {
    dbConnection
}