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
//var redis = require('redis');
//var redisStore = require('connect-redis')(session);
//var client = redis.createClient();
var cookieParser = require('cookie-parser');
var partials = require('express-partials');
//var expressLayouts = require('express-ejs-layouts');

//client.on('error', (err) => {
//  console.log('Redis error: ', err);
//});


app.use(logger);
app.use(flash());
app.use(cookieParser());
app.use(partials());
//app.use(expressLayouts);
var expiryDate = new Date(Date.now() + (24 * 60 * 60 * 1000));
app.use(session({
  secret: "somerandonstuffs",
	name: 'sessio_user',
  resave: true,
	saveUninitialized: true,
	cookie: {
        expires: expiryDate
    }
}));
/*
app.use(function (req, res, next) {
if(req.session.userId !== undefined){
res.locals.loggedIn = req.user;
} else {
res.locals.loggedIn = null;
}
next();
});
*/

app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  next();
});


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/users', require('./controllers/usuaris'));
app.use('/events', require('./controllers/esdeveniments'));
app.use('/tickets', require('./controllers/compres'));
app.use('/', require('./controllers/vistes'));
app.engine(".html", require("ejs").__express);
app.set('view engine', 'html');
app.set('views', './views');
app.use('/public', express.static('./public'));

//app.use('/public', express.static('./public'));
//app.set('view engine', 'pug');
//app.set('views', './views');


app.use(function(req, res) {
	res.status(404).render('errors/404', {title: '404: Page Not Found'});
});

app.use(function(req, res) {
	res.status(500).render('errors/500');
});


app.set('port', process.env.PORT || 8500);

app.listen(app.get('port'), () => {
	console.log("Servidor web iniciat");
});

module.exports = app;
