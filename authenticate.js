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

exports.verifyUser = passport.authenticate("jwt", {session:false});
