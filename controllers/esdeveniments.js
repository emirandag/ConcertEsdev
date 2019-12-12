var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var fs = require('fs');
var eventos = require('../models/esdevenimentsModel');


/*************************** Funcions dels usuaris sobre els esdeveniments *******************************/


/**
* Manejador i funció que realitzará el llistat dels esdeveniments
* que disposen a la web per part dels usuaris
**/
router.get('/listUser', function(request, response){

	eventos.find({},function(error, eventos){

		if (error) {

			request.flash("error", "¡Hi ha hagut un error a l'carregar els esdeveniments!");
			response.locals.messages = request.flash();
			response.render('/');
			console.log("Hi ha hagut un error a l'carregar els esdeveniments => " + error);

		} else {

			if (request.session.user) {
				request.flash("info", "Aquests son els esdeveniments disponibles");
				response.locals.messages = request.flash();
				response.render('eventsUser', {events: eventos});
				console.log("Aquests son els esdeveniments disponibles => " + eventos);
		 } else {
		   request.flash("error", "¡Per poder promocionar esdeveniments, tens que iniciar sessió!");
		   response.locals.messages = request.flash();
		   response.render('login');
		 }

		}
	});
});


/**
* Manejador i funció que permetre veure els detalls del esdeveniment
* que ha escullit l'usuari per veure, es redireccionará a la vista "detailsEvent.html"
**/
router.get('/listUser/:id', function(request, response){

  eventos.findById(request.params.id, function(error, detalls){

    if (error) {

			request.flash("error", "Error en intentar veure l'esdeveniment");
			response.locals.messages = request.flash();
			response.render('eventsUser', {events: eventos});
			console.log("Error en intentar veure l'esdeveniment\n");

    } else {

			request.flash("info", "Pots veure els detalls del esdeveniment");
			response.locals.messages = request.flash();
			response.render('detailsEvent', {event: detalls});
			console.log("S'ha vist l'esdeveniment amb ID => " + request.params.id + "\n");

    }
  });
});


/**
* Manejador i funció que permetre afegir una proposta d'esdeveniment per part de l'usuari a els admins
* Módule "fs" que permet crear el fitxer sobre el directori "events" i ho crea a format JSON
* Si l'esdeveniment ja existeix amb el nom que proposa l'usuari mostrará un missatge de error, si no afegirá
* l'esdeveniment al directori "events" i redireccionará a la funció GET "listUser" i mostrará un missatge i tornará
* a mostrar els esdeveniments
**/
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
				response.render('addSuggested');
				console.log('Ja existeix un esdeveniment amb aquest nom');

		} else {

				var jsonString = JSON.stringify(sugerencia);

				fs.appendFile('events/'+nomJson+'.json', jsonString, err => {
				if (err) {
					console.log('Error al desar el fitxer', err);
				} else {

					request.flash("success", "¡S'ha enviat la voste solicitud d'esdeveniment!");
					response.redirect('listUser');
					console.log('Esdeveniment afegit al fitxer');
			}
		});
		}
});



/*************************** Funcions dels administradors sobre els esdeveniments *******************************/


/**
* Manejador i funció que listará tots els esdeveniments proposats per part dels usuaris
* Llegirà tots els esdeveniments de directori "events" i recollirà tots els esdeveniments proposats.
* A la vista "eventsSuggested" es mostrarà només el nom de l'esdeveniment
**/
router.get('/listSuggested', function(request, response) {

	var testFolder = 'events/';

	fs.readdir(testFolder, (err, files) => {

		if (err) {

			console.log(err);

		} else {

			request.flash("info", "¡Aquest son els esdeveniments proposats pels usuaris!");
			response.locals.messages = request.flash();
			response.render('eventsSuggested', {listado: files});

		}
	});
});


/**
* Manejador i funció POST que mostrará els camps de l'esdeveniment proposat i que l'admin a seleccionat per veure
* Módule "fs" per llegir el fitxer de l'esdeveniment escollit per l'admin, es mostrára els camps en la vista
* "addEvent.html" on s'ompliran tots els camps de l'esdeveniment proposat escollit
**/
router.post('/suggested', function(request, response) {

	var escogido = request.body.escogido;

	fs.readFile('events/'+escogido+'.json', 'utf8', (err, jsonString) => {
		if (err) {
				console.log("File read failed:", err);
				return;
		} else {
				var evento = JSON.parse(jsonString);
				request.flash("info", "¡Heu de decidir si s'acepta o s'elimina la proposta d'esdeveniment!");
				response.locals.messages = request.flash();
				response.render('suggested', {evento: evento});
		}
	});
});

/**
* Manejador i funció GET que redireccionará a la funció "listSuggested" en cas intentar accedir per URL
**/
router.get('/suggested', function(request, response) {
	response.redirect('listSuggested');
});


/**
* Manejador i funció POST per insertar la proposta d'esdeveniment
* Funció "save" de mongodb per afegir l'esdeveniment a la base de dades si s'acepta la proposta
* Module "fs" i funció "unlink" que l'eliminara el fitxer de l'esdeveniment una vegada aceptat
**/
router.post('/insertSuggested', function(request, response) {

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

			} else {

				fs.unlink('events/'+eliminado+'.json', (err) => {

  				if (err) throw err;

						request.flash("success", "¡S'ha afegit l'esdeveniment a la base de dades!");
						response.locals.messages = request.flash();
						response.render('adminprofile');
  					console.log('Fichero eliminado');

					});
			}
		});
	}
});


/**
* Manejador i funció POST per eliminar la proposta d'esdeveniment
* Module "fs" i funció "unlink" que l'eliminara el fitxer de l'esdeveniment
**/
router.post('/deleteSuggested', function(request, response) {

	var eliminado = request.body.nomEsdev;

	fs.unlink('events/'+eliminado+'.json', (err) => {

   if (err) throw err;

	 	request.flash("success", "¡S'ha eliminat l'esdeveniment suggerit!");
		response.locals.messages = request.flash();
		response.render('adminprofile');
  	console.log('Fichero eliminado');

	});
});


/**
* manejador i funció GET que permet llistar a l'admin tots els esdeveniments de la base de dades
**/
router.get('/listAll', function(request, response) {

	eventos.find({},function(error, eventos){

		if (error) {

			request.flash("error", "¡Error al listar els esdeveniments!");
			response.locals.messages = request.flash();
			response.render('adminprofile');
			console.log(error);

		}else{

			request.flash("info", "¡S'ha listat els esdeveniments!");
			response.locals.messages = request.flash();
			response.render('list', {listado: eventos});
			console.log(eventos);

		}
	});
});


/**
* Manejador i funció GET que permet editar l'esdeveniment seleccionat per su ID
**/
router.get('/update/:id', function(request, response) {
	eventos.findById(request.params.id, function(error, documento) {

		if (error) {

			request.flash("error", "¡Error al editar l'esdeveniment!");
			response.locals.messages = request.flash();
			response.render('list');
			console.log(error);

		} else {

			request.flash("info", "¡Pots editar l'esdeveniment!");
			response.locals.messages = request.flash();
			response.render('edit', {editado: documento});

		}
	});
});


/**
* Manejador i funció POST que fará la actualizació de l'esdeveniment seleccionat per su ID que es va ser editat
**/
router.post('/update/:id', function(request, response) {
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
				response.redirect('update/:id');
				console.log("Error a l'actualitzar l'esdeveniment");

			} else {

				request.flash("success", "¡S'ha actualitzat l'esdeveniment a la base de dades!");
				response.redirect('../listAll');
				console.log('Actualitzar: '+request.params.id);

			}
		});
	}
});
});


/**
* Manejador i fdunció POST per eliminar l'esdeveniment seleccionat per parametre ID de la base de dades.
**/
router.post('/remove/:id', function(request, response) {
	eventos.remove({_id: request.params.id}, function(error, eliminar){

	if (error) {

		request.flash("error", "¡Ha hagut un problema al eliminar l'esdeveniment!");
		response.redirect('../listAll');
		console.log("¡Ha hagut un problema al eliminar l'esdeveniment! " + request.params.id);

	} else {

		request.flash("success", "¡S'ha eliminat l'esdeveniment de la base de dades!");
		response.redirect('../listAll');
		console.log("¡S'ha eliminat l'esdeveniment " + request.params.id +" de la base de dades!");

	}
});
});


/**
* Manejador i funció POST per crear esdeveniment per part del admin
**/
router.post('/insertAdmin', function(request, response) {

	if (request.body.codiEsdev && request.body.nomEsdev &&  request.body.tipus && request.body.ubicacio &&
		request.body.preuEntrada && request.body.descripcio && request.body.dataEsdev && request.body.organitzador) {

		var nuevo = {
			codiEsdev: request.body.codiEsdev,
			nomEsdev: request.body.nomEsdev,
			tipus: request.body.tipus,
			ubicacio: request.body.ubicacio,
			preuEntrada: request.body.preuEntrada,
			entradesDisponibles: request.body.entradesDisponibles,
			descripcio: request.body.descripcio,
			dataEsdev: request.body.dataEsdev,
			organitzador: request.body.organitzador
		};

		add = new eventos(nuevo);

		add.save(function(error, eventos){

			if (error) {

				request.flash("error", "¡Ha hagut un problema al desar l'esdeveniment, aquest codi ja existeix!");
				response.locals.messages = request.flash();
				response.render('adminprofile');

			} else {

				request.flash("success", "¡S'ha afegit l'esdeveniment a la base de dades!");
				response.locals.messages = request.flash();
				response.render('adminprofile');

			}
		});
	}
});

/**
* Manejador i funció GET que renderizar a la vista "listSuggested" en cas intentar accedir per URL
**/
router.get('/insertAdmin', function(request, response) {
	response.render('adminprofile');
});


router.get('/findTipus/:tipus', function(request, response) {
	var tipo = request.params.tipus;
	//console.log(tipo);
	eventos.find({tipus:request.params.tipus},function(error, tipos){

		if (error) {
			response.send(error);
		} else {
			 if (request.session.user) {
				response.render('eventType', {tipos:tipos});
			} else {
				request.flash("error", "¡Per poder veure els esdeveniments, tens que iniciar sessió!");
				response.locals.messages = request.flash();
				response.render('login');
			}

		}
	});
});


module.exports = router;
