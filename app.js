var createError = require('http-errors');
var express = require('express');
var path = require('path');
//Cookies are parsed in Express server using the cookie-parser middleware
var cookieParser = require('cookie-parser'); 
var logger = require('morgan');
var session = require("express-session");
var FileStore = require("session-file-store")(session);
var passport = require("passport");
var authenticate = require("./authenticate");
var config = require("./config");

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
const url = config.mongoUrl;
const connect = mongoose.connect(url);

connect.then((db) => {
	console.log("Connected correctly to the server");


}, (err) => {console.log(err); });

var app = express();

//for all request coming in
app.all("*", (req, res, next) => {
	if(req.secure) {
		return next();
	}
	else {//if it accesses the insecure 3000 port then this will redirect it to the secure port 3443
		res.redirect(307, "https://" + req.hostname + ":" + app.get("secPort") + req.url); //redirects the insecure request
	}
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//global logger
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('58586-75848-74774-68663')); //cookie parser


app.use(passport.initialize());


app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(express.static(path.join(__dirname, 'public')));

//to mount the urls to files
app.use("/dishes", dishRouter);
app.use("/promotions", promoRouter);
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
