//var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var users = require('../models/usuarisModel');


/*
* Manejador POST per realitzar el registre del usuari
*/

router.get('/register', function(request, response){
  response.render('login');
});

router.post('/register', function(request, response) {
  if (request.body.nom && request.body.cognom && request.body.email && request.body.pass &&
    request.body.confpass) {
      if (request.body.pass === request.body.confpass) {

    datos = {
      nom: request.body.nom,
      cognom: request.body.cognom,
      email: request.body.email,
      pass: request.body.pass
    }
    nuevo = new users(datos);
    nuevo.save(function(error, data) {
      if (error) {
        request.flash("error", '¡Aquest email ja existeix!  => ' + request.body.email);
        response.locals.messages = request.flash();
        response.render('register');
				console.log('¡Aquest email ja existeix! => ' +request.body.email);
      } else {
        request.flash("success", '¡Te has registrat correctament! => ' + request.body.email);
        response.locals.messages = request.flash();
        response.render('login');
      }
    });
  } else {
    request.flash("error", "!El valor proporcionat de les contrasenyes no coincideix!");
    response.locals.messages = request.flash();
    response.render('register');
  }
  }
  users.find({}, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  });
});

/*
* Manejador POST per realitzar la validació del usuari
*/
router.get('/login', function(request, response){
  response.render('login');
});


router.post('/login', function(request, response){

var errors = [];
  if (request.body.email && request.body.pass){

      users.getAuthenticated(request.body.email, request.body.pass, function(error, user){

				var validado = request.session.user;
				 validado = user;
				 console.log(validado);
        if (error || !user) {
          
          if (user === null) {

            request.flash("error", '¡Aquest usuari no existeix!');
            response.locals.messages = request.flash();
            response.render('login');

          } else if (user == null) {

           request.flash("error", '¡Contrasenya incorrecta!');
           response.locals.messages = request.flash();
           response.render('login');

          } else {

            response.send('Error!');

          }
      } else {

				if (request.body.email == 'admin@concertesdev.com') {

          request.flash("success", '¡Has iniciat sessió correctament!');
          response.locals.messages = request.flash();
          response.render('adminprofile', {user: user.nom});

				} else {

            request.flash("success", '¡Has iniciat sessió correctament!');
            response.locals.messages = request.flash();
            response.render('userprofile', {user: user.nom});

				}
      }
  });
}
});


module.exports = router;
