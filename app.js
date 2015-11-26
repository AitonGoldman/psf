var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var users = require('./routes/users');

/*
plugins
*/
var passport = require('passport');
var session  = require('express-session');
var secrets  = require('./secrets/secrets');
var configDB = require('./config/database.js');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
require('./models/ChallengeUserLogin');
mongoose.connect(configDB.url);

var app = express();


/*
passport setup
*/
app.use(cookieParser());
app.use(session({ secret: secrets.cookie_secret ,
		  cookie: { httpOnly: false ,
			    maxAge: 18000000 }
		}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
require('./config/passport')(passport);

//include routes
//var routes = require('./routes/index')(app,passport,secrets);
var routes = require('./routes/index')(app,
				       {userLoginType:'local'});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
