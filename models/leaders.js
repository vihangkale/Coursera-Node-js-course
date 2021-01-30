  const mongoose = require("mongoose");
  const Schema = mongoose.Schema;
  require("mongoose-currency").loadType(mongoose);
  const Currency = mongoose.Types.Currency;

  const leadersSchema = new Schema({
  	name: {
  		type:String,
  		required:true
  	},

  	image: {
  		type:String,
  		required:true
  		//get: v =>8 `${root}${v}`
  	},

  	designation: {
  		type:String,
  		required:true
  	},
  	
  	abbr: {
  		type:String,
  		required:true
  	},

  	description: {
  		type:String,
  		required:true
  	}
  },{
  		timestamps:true	
});

var leaders = mongoose.model("leaders", leadersSchema);

module.exports = leaders;