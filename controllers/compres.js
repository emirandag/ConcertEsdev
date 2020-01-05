var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var compras = require('../models/compresModel');
var eventos = require('../models/esdevenimentsModel');


router.get('/buyTicket/:id', function(request, response) {
  eventos.findById(request.params.id, function(error, comprar){

    if (error) {
      request.flash("error", "¡No es pot carregar la venta d'entrades!");
      response.locals.messages = request.flash();
      response.redirect('../listUser/:id');
      console.log('No es pot comprar entrades: ' + error);
    } else {
      request.flash("info", "¡Agafa les teves entrades!");
      response.locals.messages = request.flash();
      response.render('tickets/buyTicket', {buy: comprar});
      console.log('Es renderizará a la vista de compras' + comprar);
    }

  });
});



router.post('/buyTicket', function(request, response) {

  if (request.body.numEntrada > 0 ) {

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
      request.flash("success", "¡Realitza el pagament de les entrades!");
      response.locals.messages = request.flash();
      response.render('tickets/payment', {evento: datosEvento, compra:datosCompra});
      console.log("Evento: "+datosEvento.tipus);

    } else {

      request.flash("error", "¡Has de seleccionar una entrada com a mínim!");
      response.redirect('buyTicket/'+request.body.id);

    }
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

var evento = {
  codiEsdev : request.body.codiEsdev,
  nomEsdev : request.body.nomEsdev,
  tipus : request.body.tipus,
  ubicacio : request.body.ubicacio,
  preuEntrada : request.body.preuEntrada,
  entradesDisponibles : request.body.entradesDisponibles,
  descripcio : request.body.descripcio,
  dataEsdev : request.body.dataEsdev,
  organitzador : request.body.organitzador
}

var date = new Date();
var d = date.getDate();
var m = date.getMonth()+1;
var y = date.getFullYear();
var h = date.getHours();
var mi = date.getMinutes();
var fechaCompra = d+"/"+m+"/"+y+" - "+h+":"+mi;

  var pago = {
    numEntrada : request.body.numEntrada,
    targetaPagament: request.body.targetaPagament,
    preuEntrada: request.body.preuEntrada,
    preuTotal: request.body.preuTotal,
    dataCompra: fechaCompra,
    idEsdeveniment: request.body.id,
    idUsuari: request.session.user._id
  }

  console.log("*******************"+evento);
  addBuy = new compras(pago);
  addBuy.save(function(error, compra){

    if (error) {

      console.log(':(    '+error);

    } else {
      request.flash("success", "¡Has fet la compra satisfactòriament!");
      response.locals.messages = request.flash();
      response.render('tickets/invoice', {pagado: evento, compra:compra});
      console.log(':D  '+compra);

    }
  });
});

router.get('/payment', function(request, response) {
  response.redirect('../userprofile');
});


router.get('/myShopping/:idUsuari', function(request, response) {

	compras.find({idUsuari:request.params.idUsuari},function(error, micompra){

	if (error) {
    console.log(error);
  } else {
    response.render('tickets/shopping', {micompra:micompra});
  }
	});
});


router.post('/eventData/:id', function(request, response){

  eventos.findById(request.params.id, function(error, mievento){

    if (error) {

			request.flash("error", "Error en intentar veure l'esdeveniment");
			response.locals.messages = request.flash();
			response.render("<p>No es pot carregar les dades de l'esdeveniment</p>");
			console.log("Error en intentar veure l'esdeveniment\n");

    } else {

      var micompra = {
        id : request.body.id,
        preuEntrada : request.body.preuEntrada,
        numEntrada : request.body.numEntrada,
        dataCompra : request.body.dataCompra,
        targetaPagament : request.body.targetaPagament,
        preuTotal : request.body.preuTotal
      }

			request.flash("info", "Pots veure els detalls del esdeveniment comprat");
			response.locals.messages = request.flash();
			response.render('tickets/eventData', {mievento: mievento, micompra:micompra});

    }


  });
});
module.exports = router;
