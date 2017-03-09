'use strict';

var express = require('express');
var join = require('path').join;
var ejsLocals = require('ejs-locals');
var favicon = require('serve-favicon');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidtor = require('express-validator');
var passport = require('passport');
var flash = require('connect-flash');
var csurf = require('csurf');
var i18n = require('i18n');

var config = require(join(__dirname, 'config'));

var app = module.exports = express();

require(join(__dirname, 'middlewares/errorLogs'))(app);

i18n.configure(config.get('i18n'));

app.engine('ejs', ejsLocals);
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(methodOverride());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(expressValidtor());

app.use(session({
	name: config.get('cookie:name'),
	secret: config.get('cookie:secret'),
	resave: false,
	saveUninitialized: true,
	cookie: {
		secure: true,
		httpOnly: true,
		maxAge: new Date(Date.now() + ((60000*60)*24)*30)
	},
	store: new RedisStore(config.get('redis'))
}));

app.use(i18n.init);
app.use(passport.initialize());
app.use(passport.session());
//app.use(passport.authenticate('remember-me'));
app.use(flash());
app.use(csurf({cookie: true}));
//app.disable('x-powered-by');
app.use(favicon(join(__dirname, 'public/favicon.ico')));
app.use('/assets', express.static(join(__dirname, 'public/assets')));
//app.use('/uploads', express.static(join(__dirname, '../uploads')));

require(join(__dirname, 'routes'))(app);
//require(join(__dirname, 'middlewares/errorHandler'))(app);
require(join(__dirname, 'middlewares/passport'))(passport);
