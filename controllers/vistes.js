/**
* Aquest fitxer es per el manejador de les diferents vistes de la web
**/

var express = require('express');
var router = express.Router();


router.get("/", function(req, resp) {
  //console.log(req.session.user);
  resp.render('index', {});
	//resp.sendFile(__dirname+ "/views/index.html");
	console.log('send to home');
});

router.get('/register',function(req,resp){
  resp.render('register', {});
	//resp.sendFile(__dirname+ "/views/register.html");
	console.log('send to signup');
});


router.get('/login',function(req,resp){
  resp.render('login', {});
  //resp.sendFile(__dirname+ "/views/login.html");
	console.log('send to login');
});

router.get('/userprofile',function(req,resp){
	//resp.sendFile(__dirname+ "/views/login.html");
  resp.send('¡Heu iniciat la sessió correctament!');
	console.log('send to profile');
});

router.get('/adminprofile',function(req,resp){
	resp.render('adminprofile', {});
  //resp.send('¡Heu iniciat la sessió correctament!');
	console.log('send to profile');
});

router.get('/formulariContacte',function(req,resp){
	resp.render('formulariContacte',{});
});

module.exports = router;
