var express = require('express'),
	app = express(),
	server = require('http').createServer(app);
var assert = require('assert');
var path = require('path');
var bodyParser = require('body-parser');
var db = require('./db/database');
var session = require('express-session');
var flash = require('connect-flash');
var logger = function(req, resp, next) {
	console.log(req.url);
	next();
}

app.use(logger);
app.use(flash());

app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/users', require('./controllers/usuaris'));
app.use('/events', require('./controllers/esdeveniments'));
app.use('/', require('./controllers/vistes'));
app.engine(".html", require("ejs").__express);
app.set('view engine', 'html');
app.set('views', './views');
app.use('/public', express.static('./public'));

//app.use('/public', express.static('./public'));
//app.set('view engine', 'pug');
//app.set('views', './views');

app.listen(8500);
console.log("Servidor iniciat al port 8500");
