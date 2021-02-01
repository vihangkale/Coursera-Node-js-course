//checks the username and password and a flag set to determine the user is admin or normal user

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose"); 

var User = new Schema({
	admin: {
		type:Boolean,
		default: false 
	}
});

User.plugin(passportLocalMongoose); //use it as plugin

module.exports = mongoose.model("User", User);
