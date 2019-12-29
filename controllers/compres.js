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



router.post('/buyTicket', function(request, response) {
    var datosEvento = {
      id: request.body.id,
      codiEsdev: request.body.codiEsdev,
      nomEsdev: request.body.nomEsdev,
      tipus: request.body.tipus,
      ubicacio: request.body.ubicacio,
      preuEntrada: request.body.preuEntrada,
      entradesDisponibles: request.body.entradesDisponibles,
      descripcio: request.body.descripcio,
      dataEsdev: request.body.dataEsdev,
      organitzador: request.body.organitzador
    }
    var datosCompra = {
      numEntrada: request.body.numEntrada,
      preuTotal: request.body.preuTotal
    }

    response.render('payment', {evento: datosEvento, compra:datosCompra});
    console.log("Evento: "+datosEvento.tipus);
    //console.log("Pago: "+datosPago);

});


router.post('/payment', function(request, response) {
  var id = request.body.id;
  console.log(id+'------------------------------------->');
  eventos.findById({_id:request.body.id}, function(error, actualizado){
  if (error) {
    response.send("Error a l'actualitzar l'esdeveniment");
  } else {
    var eventos = actualizado;
    eventos.codiEsdev = request.body.codiEsdev;
    eventos.nomEsdev = request.body.nomEsdev;
    eventos.tipus =  request.body.tipus;
    eventos.ubicacio = request.body.ubicacio;
    eventos.preuEntrada = request.body.preuEntrada;
    eventos.entradesDisponibles = request.body.entradesDisponibles;
    eventos.descripcio = request.body.descripcio;
    eventos.dataEsdev = request.body.dataEsdev;
    eventos.organitzador = request.body.organitzador;

    eventos.save(function(error, actualizado){

      if (error) {

        console.log("Error a l'actualitzar l'esdeveniment");

      } else {

        console.log("S'ha actualitzat l'esdeveniment: " + actualizado);

      }
    });
  }
  });


var pago = {
    numEntrada : request.body.numEntrada,
    targetaPagament: request.body.targetaPagament,
    preuEntrada: request.body.preuEntrada,
    preuTotal: request.body.preuTotal
  }

  addBuy = new compras(pago);
  addBuy.save(function(error, compra){

    if (error) {

console.log(':(    '+error);

    } else {
      request.flash("success", "¡Per poder veure els esdeveniments, tens que iniciar sessió!");
      response.locals.messages = request.flash();
      response.render('login');
      console.log(':D  '+compra);
    }
  });
});



module.exports = router;
