const { WebpayPlus } = require('transbank-sdk');
const asyncHandler = require('../utils/asyncHandler');

// Crear Transacción
exports.create = asyncHandler(async function (req, res) {
    let fechaActual = new Date();
    let fecha = fechaActual.toISOString().split('T')[0];
    let buyOrder = 'OC' + '-' + fecha + '-' + Math.floor(Math.random() * 100)
    let sessionId = 'S-' + Math.floor(Math.random() * 100000000);
    let amount = req.session.carrito.total;
    let returnUrl = `${req.protocol}://${req.get('host')}/webpay_plus/commit`;


    let productos = req.session.carrito.productos;  
    
    const createResponse = await new WebpayPlus.Transaction().create(
        buyOrder,
        sessionId,
        amount,
        returnUrl
    );

    res.render('webpay_plus/create', {
        token: createResponse.token,
        url: createResponse.url,
        buyOrder,
        sessionId,
        amount,
        productos
    });
});

// Confirmar Transacción
exports.commit = asyncHandler(async function (req, res) {
  const token = req.query.token_ws || req.body.token_ws;

  if (!token) {
    return res.status(400).send('Token no recibido');
  }

  // Confirmar la transacción con el token recibido
  const commitResponse = await new WebpayPlus.Transaction().commit(token);
  res.render('webpay_plus/commit', {
    token,
    commitResponse,
  });
});