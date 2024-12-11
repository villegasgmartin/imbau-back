const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

const fileUpload = require('express-fileupload');

class Server {

    constructor() {
        this.app  = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api';
        this.buscar =     '/api/buscar',
        this.authPath     = '/api/auth';
        this.productPath     = '/api/products';
        this.adminPath = '/api/admin'

        //conectar BD
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    async conectarDB(){
       await dbConnection();
    }
    middlewares() {

        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        //ip
        this.app.use((req, res, next) => {
            const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            console.log('IP del cliente:', clientIp);
            next();
        });

        // Directorio Público
        this.app.use( express.static('public') );

        //subida de imagenes
		this.app.use(
			fileUpload({
				useTempFiles: true,
				tempFileDir: './uploads',
				createParentPath: true
			})
		);

    }

    routes() {
        this.app.use( this.authPath, require('../routes/auth'));
        this.app.use( this.usuariosPath, require('../routes/usuarios'));
        this.app.use( this.productPath, require('../routes/prod-serv'));
        this.app.use( this.buscar, require('../routes/buscar'));
        this.app.use( this.adminPath, require('../routes/admin'));
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }

}




module.exports = Server;
