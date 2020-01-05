//var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var users = require('../models/usuarisModel');


/*
* Manejador POST per realitzar el registre del usuari
*/

router.get('/register', function(request, response){
  response.render('users/login');
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
        response.render('users/register');
				console.log('¡Aquest email ja existeix! => ' +request.body.email);
      } else {
        request.flash("success", '¡Te has registrat correctament! => ' + request.body.email);
        response.locals.messages = request.flash();
        response.render('users/login');
      }
    });
  } else {
    request.flash("error", "!El valor proporcionat de les contrasenyes no coincideix!");
    response.locals.messages = request.flash();
    response.render('users/register');
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
  if (request.session.user.email == "admin@concertesdev.com") {
    response.redirect('../adminprofile');
  } else if (request.session.user) {
    response.redirect('../userprofile');
  } else {
    response.render('users/login');
  }

});

router.post('/login', function(request, response, next){

  if (request.body.email && request.body.pass){
    //request.session.email = request.body.email;
      users.getAuthenticated(request.body.email, request.body.pass, function(error, user){

        if (error || !user) {

          if (user === null) {

            request.flash("error", '¡Aquest usuari no existeix!');
            response.locals.messages = request.flash();
            response.render('users/login');

          } else if (user == null) {

           request.flash("error", '¡Contrasenya incorrecta!');
           response.locals.messages = request.flash();
           response.render('users/login');

          } else {

            response.send('Error!');

          }
      } else {

				if (request.body.email == 'admin@concertesdev.com') {

          request.flash("success", '¡Has iniciat sessió correctament!');
          response.locals.messages = request.flash();
          response.render('users/adminprofile', {user: user});
          request.session.user = user;
          request.session.save(function (user) {
            request.session.user = user;
          });

				} else {

            //request.session.user = request.body.email;
            //response.locals.user = request.session.user;
            request.flash("success", '¡Has iniciat sessió correctament!');
            response.locals.messages = request.flash();
            response.render('users/userprofile', {user: user});
            request.session.user = user;
            request.session.save(function (user) {
              request.session.user = user;
            });

				}
      }
  });
}
});


router.get('/logout', function(request, response, next) {
    request.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        response.redirect('../login');
      }
    });

});

router.post('/confirmMail', function(request, response) {
  users.findOne({email: request.body.email}, function(err, user) {
    if (err) {
      response.send("Aquest mail no existeix");
    } else {
      //response.send("El mail es correcte", {user: user});
      response.render('resetPass', {user: user});
    }
  });
});


router.get('/listUsers', function(request, response) {
  users.find({}, function(err, users) {
    if (err) {
      request.flash("error", '¡Contrasenya incorrecta!');
      response.locals.messages = request.flash();
      response.render('../adminprofile');
    } else {
      request.flash("info", '¡Aquest son els usuaris registrats a la web!');
      response.locals.messages = request.flash();
      response.render('users/users', {users: users});
    }
  });
});


module.exports = router;
