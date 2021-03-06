/**
* Aquest fitxer es per el manejador de les diferents vistes de la web
**/

var express = require('express');
var router = express.Router();


router.get("/", function(req, resp) {
  resp.render('index', {});
	console.log('send to home');
});

router.get('/register',function(req,resp){
  resp.render('users/register', {});
	console.log('send to signup');
});


router.get('/login',function(req,resp){
  resp.render('users/login', {});
	console.log('send to login');
});

router.get('/userprofile',function(req,resp){
  if (req.session.user.email === "admin@concertesdev.com") {
    resp.redirect('adminprofile');
  } else if (req.session.user) {
    resp.render('users/userprofile');
  } else {
    resp.render('users/login');
  }
});

router.get('/adminprofile',function(req,resp){
  if (req.session.user.email === "admin@concertesdev.com") {
    resp.render('users/adminprofile');
  } else if (req.session.user) {
    resp.redirect('userprofile');
  } else {
    resp.render('users/login');
  }
});

/**
* Manejador GET que renderizació a la vista "addSuggested.html"
**/
router.get('/suggested',function(req, resp){
  if (req.session.user) {
    resp.render('events/addSuggested', {});
  	console.log('send to events suggested');
 } else {
   req.flash("error", "¡Per poder promocionar esdeveniments, tens que iniciar sessió!");
   resp.locals.messages = req.flash();
   resp.render('users/login');
 }

});

/**
* Manejador GET que renderizació a la vista "insert.html"
**/
router.get('/insert',function(req, resp){
	resp.render('events/insert', {});
	console.log('send to insert new event');
});

/**
* Manejador GET que renderizació a la vista "formulariContacte.html"
**/
router.get('/formulariContacte',function(req, resp){
	resp.render('formulariContacte', {});
	console.log('send to formulari de contacte');
});


router.get('/confirmMail', function(req, resp) {
  resp.render('confirmMail', {});
});


module.exports = router;
