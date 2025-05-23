const {MercadoPagoConfig, Preference} = require('mercadopago');

// Configura las credenciales
const client = new MercadoPagoConfig({ accessToken: process.env.TOKEN_MP });

async function generarLinkDePago(precio) {

  const preference = new Preference(client);

  try {
    const response = await preference.create({
      body: {
        items: [
          {
            title: "Compra realizada en Imbau",
            quantity: 1,
            unit_price: precio, // Precio dinámico
          },
        ],
      },
    });

    return response.init_point
    
  } catch (error) {
    console.error('Error al crear la preferencia de pago:', error);
    throw error; // Propagar el error para que pueda ser manejado por el llamante
  }
}




module.exports = generarLinkDePago;
