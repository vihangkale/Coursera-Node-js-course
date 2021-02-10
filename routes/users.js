var express = require('express');
const bodyParser = require("body-parser");
var User = require("../models/user");
var passport = require("passport");
var authenticate = require("../authenticate");
const cors = require("./cors");
var router = express.Router();

router.use(bodyParser.json());


/* GET users listing. */
router.get('/',cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin , (req, res, next) => {
  User.find({}, (err, users) => {
  	if(err) {
  		return next(err);
  	} else {
  		res.statusCode = 200;
  		res.setHeader('Content-Type', 'application/json');
  		res.json(users);
  	}
  });
  //res.send('respond with a resource');
});

//passport local authentication
router.post("/signup",cors.corsWithOptions, (req, res, next) => {
		User.register(new User({
			username: req.body.username
		}), 
		req.body.password, (err, user) => {//checks if the user exists or not
			if(err) { //if the username exist
				res.statusCode = 500;
				res.setHeader("Content-Type", "application/json");
				res.json({
					err: err
				});
			}
			else { //else if it doesn't exists then the user is created
				if(req.body.firstname) {
					user.firstname = req.body.firstname;
				}
				if(req.body.lastname) {
					user.lastname = req.body.lastname;	
				}

				user.save((err, user) => {
				passport.authenticate("local")(req, res, () => {
				if(err) {
				res.statusCode = 500;
              	res.setHeader('Content-Type', 'application/json');
				res.json({
                err: err
              });
				return;
			}
					res.statusCode = 200;
					res.setHeader("Content-Type", "app/json");
					res.json({
						success:true, 
						status:"Registration Successfull"
					});
				});
			});			
		}
	});
});		

//passport local authentication used in login
router.post('/login',cors.corsWithOptions, passport.authenticate('local'), (req, res) => {
var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

//handling the logout of the session
router.get("/logout",(req, res) => {
	if(req.session) { //session ust exxist so
		req.session.destroy(); //this will remove or destroy session
		res.clearCookie("session-id"); //delete the cookie
		res.redirect("/");  //redirects to homepage when logged out
	}
	else { //if req.session doesn't exist then
		var err = new Error("You are not logged in!");
		err.status = 403;
		next(err);
	}	
});

//express server will return a json web token to our client

router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  if (req.user) {
    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
  }
});

module.exports = router;
