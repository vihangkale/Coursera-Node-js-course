var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var User = require("./models/user");
var passport = require("passport");
var JwtStrategy = require("passport-jwt").Strategy; //json webtoken based strategy for configuring passport based module 
var ExtractJwt = require("passport-jwt").ExtractJwt;
var jwt = require("jsonwebtoken");

var config = require("./config");

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
	return jwt.sign(user, config.secretKey, //creates json web token
		{expiresIn: 3600}); //the time in which the token will expire

};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); //extract info
opts.secretOrKey = config.secretKey;



exports.jwtPassport = passport.use(new JwtStrategy(opts,
	(jwt_payload, done) => {
		console.log("JWT payload", jwt_payload);
		User.findOne({id: jwt_payload._id},(err, user) => {
			if(err) {//if error
				return done(err, false);
			}
			else if(user) { //if user is found then
				return done(null, user);
			}
			else { //if user is not found
				return done(null, false);
			}
		});
	}));


exports.verifyUser = function (req, res, next) { 
	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token']; 
	
	// decode token
	if(token) { 
		// verifies secret and checks exp
		jwt.verify(token, config.secretKey, function (err, decoded) {
			if(err) {
				var err = new Error("You are not authenticated");
				err.status = 401;
				return next(err);
			}
			else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				next();
			}
		});
	} else {
		// if there is no token
        // return an error
		var err = new Error("No token provided and not authenticated");
		err.status = 403;
		return next(err);
	}
};

exports.verifyAdmin = function (req, res, next) {
	if(req.user.admin) {
		next();
	}
	else {
		var err = new Error("You are not Authorized to perform this operation!");
		err.status = 403;
		return next(err);
	}
  } 
