var express = require('express');
const bodyParser = require("body-parser");
var User = require("../models/user");


var router = express.Router();
router.use(bodyParser.json());
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//support post operation for signup
router.post("/signup", function(req, res, next) {
		User.findOne({username: req.body.username}) //checks if the user exists or not
		.then((user) => { 
			if(user != null) { //if the username exist
				var err = new Error("User " + req.body.username + " already exist");
				err.status = 403;
				next(err);	
			}
			else { //else if it doesn't exists then the user is created
				return User.create({
					username: req.body.username,
					password: req.body.password
				})	
			}

		})
		.then((user) => {
			res.statusCode = 200;
			res.setHeader("Content-Type", "app/json");
			res.json({status:"Registration Successfull", user:user});
		}, (err) => next(err)) //if there is an error then this will handle the error
		.catch((err) => next(err));
});		

//support post operation for login
router.post("/login", (req, res, next) => {
	//if user has not authenticated
	if(!req.session.user) {
  	
  	var authHeader = req.headers.authorization;
  	
  	if (!authHeader) { //throw a error if not authenticated
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401; //unauthorized
      return next(err);
  }

  var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  var username = auth[0];
  var password = auth[1];

  User.findOne({username:username})
  .then((user) => {
  	if(user == null) { //if user does'nt exist then error is thrown
  	  var err = new Error('User' + username + "does not exist");
      err.status = 403;
      return next(err);
  	}
  	else if (user.password !== password) { //if user's password does't match
  	  var err = new Error("Your password is incorrect!");
      err.status = 403;
      return next(err);
  	}
  	else if (user.username == username && user.password == password) { //if the username and password matches then
    req.session.user = 'authenticated';  
    res.statusCode = 200; //authenticated status
  	res.setHeader("Content-Type", "text/plain");
	res.end("You are Authenticated");  
  } 
  })
  	.catch((err) => next(err));

  }
  else { //if re.session.user is not null then
  	res.statusCode = 200;
  	set.setHeader("Content-Type", "text/plain");
  	res.end("You are already authenticated");
  }
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

module.exports = router;
