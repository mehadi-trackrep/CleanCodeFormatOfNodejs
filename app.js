var express = require('express');

var app = express();
var constants = require('constants');
var constant = require('./config/constants');

var port = process.env.PORT || 3749;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var path = require('path');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

/***************Mongodb configuratrion********************/
var mongoose = require('mongoose');
var configDB = require('./config/database.js');
//configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

/** .. Including External 'routes' folder  files ..
  var VAR_NameOfthe_route_file = require('./routes/a_route_file_name');
**/
var charts = require('./routes/charts');

//Init App
var app = express(); // Only we have to 'set' view engine
                     // otherwise 'use' some folder/modules
                     // for this we have to use:
                     // app.set(), app.use()

//View Engine
app.set('views', path.join(__dirname, 'app/views'));  // views + views er under a joto gula folder ace shobar path dite hobe ..
app.set('view engine', 'ejs');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
require('./config/passport')(passport); // pass passport for configuration
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());  // To set global session value ..................................

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
next();
});

// load all routes and pass in our app and fully configured passport
require('./config/common_routes.js')(app, passport);
app.use('/charts', charts);  // Prefix url and path/directory of users.js router file

app.listen(port, function(){
	console.log('Server started on port ' + port);
});

//Catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404).render('404', {title: "Sorry, page not found", session: req.sessionbo});
});
app.use(function (req, res, next) {
    res.status(500).render('404', {title: "Sorry, page not found"});
});

exports = module.exports = app;
