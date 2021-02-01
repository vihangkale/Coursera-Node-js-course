var createError = require('http-errors');
var express = require('express');
var path = require('path');
//Cookies are parsed in Express server using the cookie-parser middleware
var cookieParser = require('cookie-parser'); 
var logger = require('morgan');
var session = require("express-session");
var FileStore = require("session-file-store")(session);
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require("./routes/dishRouter");
var promoRouter = require("./routes/promoRouter");
var leadersRouter = require("./routes/leadersRouter");

const mongoose = require("mongoose");
const samsung = require("./models/samsung");
const promotions = require("./models/promotions");
const leaders = require("./models/leaders");
//Mongo db connection
const url = "mongodb://localhost:27017/conFusionserver";
const connect = mongoose.connect(url);

connect.then((db) => {
	console.log("Connected correctly to the server");


}, (err) => {console.log(err); });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//global logger
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('58586-75848-74774-68663')); //cookie parser
app.use(session( {
	name:"session-id",
	secret:"1234-6433-45643-65433",
	saveUninitialized:false,
	resave:false,
	store: new FileStore()

}));

function auth (req, res, next) {
 
  console.log(req.session);

  if(!req.session.user) {
  	
  	var authHeader = req.headers.authorization;
  	
  	if (!authHeader) {
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
  }

  var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  var user = auth[0];
  var pass = auth[1];
  if (user == 'admin' && pass == 'password') { //default values
    req.session.user = 'admin';  
    next(); // authorized
  } else {
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');      
      err.status = 401;
      return next(err);
  	}
  }

else {
	
	if(req.session.user === "admin") { //if the signed cookie has correct information
	next(); //allow the request to pass through	
	}
	
	else {
	  var err = new Error('You are not authenticated!');
      err.status = 401;
     return next(err);
	}
  }
}
app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

//to mount the urls to files
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/dishes", dishRouter);
app.use("/promotions", promoRouter);
//app.use("/promotions/:promoId", promoRouter);
app.use("/leaders", leadersRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
