var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var fs = require('fs');
var eventos = require('../models/esdevenimentsModel');


/**
* Manejador i funció que realitzará el llistat dels esdeveniments
* que disposen a la web
**/
router.get('/listUser', function(request, response){

	eventos.find({},function(error, eventos){
		if (error){
			console.log(error);

		}else{
			console.log(eventos);
			request.flash("info", "Aquests son els esdeveniments disponibles");
			response.locals.messages = request.flash();
      response.render('events', {events: eventos});
		}
});
	});


/**
* Manejador i funció que permetre veure els detalls del esdeveniment
* que ha escullit l'usuari per veure
**/
router.get('/listUser/:id', function(request, response){
  eventos.findById(request.params.id, function(error, detalls){
    if (error) {

      console.log("Error en intentar veure l'esdeveniment\n");
			request.flash("error", "Error en intentar veure l'esdeveniment");
			response.locals.messages = request.flash();
			response.render('events', {events: eventos});

    } else {

      console.log("S'ha vist l'esdeveniment amb ID => " + request.params.id + "\n");
			request.flash("info", "Pots veure els detalls del esdeveniment");
			response.locals.messages = request.flash();
			response.render('detailsEvent', {event: detalls});

    }
  });
});



router.post('/addSuggested', function(request, response) {

    var sugerencia = {
			nomEsdev: request.body.nomEsdev,
			tipus: request.body.tipus,
			ubicacio: request.body.ubicacio,
			preuEntrada: request.body.preuEntrada,
			entradesDisponibles: request.body.entradesDisponibles,
			descripcio: request.body.descripcio,
			dataEsdev: request.body.dataEsdev
    };

		var nomJson = request.body.nomEsdev;

			if (fs.existsSync('events/'+nomJson+'.json')) {

				request.flash("error", "¡Ja existeix un esdeveniment amb aquest nom!");
				response.locals.messages = request.flash();
				response.render('eventSuggested');
				console.log('Ja existeix un esdeveniment amb aquest nom');

		} else {
				var jsonString = JSON.stringify(sugerencia);
				fs.appendFile('events/'+nomJson+'.json', jsonString, err => {
				if (err) {
					console.log('Error al desar el fitxer', err);
				} else {

					request.flash("success", "¡S'ha enviat la voste solicitud d'esdeveniment!");
					response.redirect('list');
					console.log('Esdeveniment afegit al fitxer');
			}
		});
		}
});

router.get('/listAdmin', function(request, response) {
	var testFolder = 'events/';

fs.readdir(testFolder, (err, files) => {
	console.log(files+'********************');
	response.render('eventsAdmin', {listado: files});
});

});

router.get('/suggested',function(req,resp){
	resp.render('eventSuggested', {});
	console.log('send to events suggested');
});



router.post('/suggested', function(request, response) {
	var escogido = request.body.escogido;
	fs.readFile('events/'+escogido+'.json', 'utf8', (err, jsonString) => {
		if (err) {
				console.log("File read failed:", err);
				return;
		} else {
				var evento = JSON.parse(jsonString);
				response.render('addEvent', {evento: evento});
		}
	});
});



router.post('/insert', function(request, response) {

	if (request.body.codiEsdev && request.body.nomEsdev ) {
		var aceptado = {
			codiEsdev: request.body.codiEsdev,
			nomEsdev: request.body.nomEsdev,
			tipus: request.body.tipus,
			ubicacio: request.body.ubicacio,
			preuEntrada: request.body.preuEntrada,
			entradesDisponibles: request.body.entradesDisponibles,
			descripcio: request.body.descripcio,
			dataEsdev: request.body.dataEsdev
		};

		var eliminado = request.body.nomEsdev;
		add = new eventos(aceptado);
		add.save(function(error, eventos){
			if (error) {
				request.flash("error", "¡Ha hagut un problema al desar l'esdeveniment!");
				response.locals.messages = request.flash();
				response.render('adminprofile');
				//response.send('Error al guardar evento'+error);
			} else {
				fs.unlink('events/'+eliminado+'.json', (err) => {
  				if (err) throw err;
  					console.log('Fichero eliminado');
					});

					request.flash("success", "¡S'ha afegit l'esdeveniment a la base de dades!");
					response.locals.messages = request.flash();
					response.render('adminprofile');

			}
		});
	}

});


router.post('/deleteSuggested', function(request, response) {

		var eliminado = request.body.nomEsdev;
				fs.unlink('events/'+eliminado+'.json', (err) => {
  				if (err) throw err;
						response.render
  					console.log('Fichero eliminado');
					});
				response.send('evento eliminado');
});


router.get('/list', function(request, response) {
	eventos.find({},function(error, eventos){
		if (error) {

			request.flash("error", "¡Error al listar els esdeveniments!");
			response.locals.messages = request.flash();
			response.render('adminprofile');
			console.log(error);

		}else{

			request.flash("success", "¡S'ha listat els esdeveniments!");
			response.locals.messages = request.flash();
			response.render('listado', {listado: eventos});
			console.log(eventos);

		}
	});
});

router.put('/update:id', function(request, response) {
	eventos.findById(request.params.id, function(error, actualizado){
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

		eventos.save(function(error, actualizado){
			if (error) {

				request.flash("error", "¡Error a l'actualitzar l'esdeveniment!");
				response.locals.messages = request.flash();
				response.render('adminprofile');
				console.log("Error a l'actualitzar l'esdeveniment");

			} else {

				request.flash("success", "¡S'ha actualitzat l'esdeveniment a la base de dades!");
				response.locals.messages = request.flash();
				response.render('adminprofile');
				console.log('Actualitzar: '+request.params.id);

			}
		});
	}
});
});



router.delete('/remove:id', function(request, response) {
	eventos.remove({_id: request.params.id}, function(error, eliminar){

	if (error) {

		request.flash("error", "¡Ha hagut un problema al eliminar l'esdeveniment!");
		response.locals.messages = request.flash();
		response.render('adminprofile');
		console.log("¡Ha hagut un problema al eliminar l'esdeveniment! " + request.params.id);

	} else {

		request.flash("success", "¡S'ha eliminat l'esdeveniment de la base de dades!");
		response.locals.messages = request.flash();
		response.render('adminprofile');
		console.log("¡S'ha eliminat l'esdeveniment " + request.params.id +" de la base de dades!");

	}
});
});

module.exports = router;
