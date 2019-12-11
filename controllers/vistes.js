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
  resp.render('register', {});
	console.log('send to signup');
});


router.get('/login',function(req,resp){
  resp.render('login', {});
  //resp.sendFile(__dirname+ "/views/login.html");
	console.log('send to login');
});

router.get('/userprofile',function(req,resp){
	//resp.sendFile(__dirname+ "/views/login.html");
  resp.render('login', {});
	console.log('send to profile');
});

router.get('/adminprofile',function(req,resp){
    resp.render('login', {});
  	//console.log('send to profile');
});

/**
* Manejador GET que renderizació a la vista "addSuggested.html"
**/
router.get('/suggested',function(req, resp){
	resp.render('addSuggested', {});
	console.log('send to events suggested');
});

/**
* Manejador GET que renderizació a la vista "insert.html"
**/
router.get('/insert',function(req, resp){
	resp.render('insert', {});
	console.log('send to insert new event');
});

router.get('/confirmMail', function(req, resp) {
  resp.render('confirmMail', {});
});


module.exports = router;
