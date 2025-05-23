# Imbau - Backend

Este es el backend de Imbau, una plataforma desarrollada por Duwoh Developers para conectar compradores, vendedores y prestadores de servicios del rubro de la construcción. El backend está construido en Node.js con Express y utiliza MongoDB como base de datos principal.

# Funcionalidades clave

Autenticación con JWT

Roles y permisos: Admin, Usuario, Prestador, Vendedor

Gestión de productos, servicios, compras y ofertas

Chat interno entre usuarios

Subida de imágenes con Cloudinary

Integración con Mercado Pago para pagos

Búsquedas personalizadas

# Tecnologías utilizadas

Node.js + Express

MongoDB + Mongoose

JWT para autenticación

Express Validator para validaciones

Cloudinary para gestión de imágenes

Mercado Pago SDK para pagos

dotenv para variables de entorno

CORS, FileUpload, bcryptjs, nanoid

# Estructura del proyecto

tree -I "node_modules" 

# Cómo levantar el proyecto en local

git clone 

cd imbau-backend

** Instalar las dependencias

npm install

** Crear archivo .env

PORT=5000
MONGODB_URI=mongodb://localhost:27017/imbau
SECRETORPRIVATEKEY=tu_clave_secreta
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
MERCADOPAGO_ACCESS_TOKEN=xxx


** Ejecutar el servidor

npm start
npm node --watch index.js

# Postman
https://documenter.getpostman.com/view/15483785/2sB2qajMoV#intro