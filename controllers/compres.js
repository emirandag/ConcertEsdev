var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var compras = require('../models/compresModel');
var eventos = require('../models/esdevenimentsModel');



router.get('/buyTicket/:id', function(request, response) {
  eventos.findById(request.params.id, function(error, comprar){

    if (error) {
      console.log('No es pot comprar entrades: ' + error);
    } else {
      response.render('buyTicket', {buy: comprar});
      console.log('Es renderizará a la vista de compras' + comprar);
    }

  });
});

router.post('/addCart/:id', function(request, response) {

  //var idCart = request.body._id;
  var idCart = request.params.id;
  var entrada = request.body.cantidad;

  console.log('.....'+idCart);
  console.log(entrada+'.....');


  /*
  eventos.findById(request.params.id, function(error, agregar){
    console.log('Evento en el carro: ----------> '+request.params.id);
  });
*/
});




module.exports = router;
