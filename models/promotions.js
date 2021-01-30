  const mongoose = require("mongoose");
  const Schema = mongoose.Schema;
  require("mongoose-currency").loadType(mongoose);
  const Currency = mongoose.Types.Currency;

  const promotionsSchema = new Schema({
  	name: {
  		type:String,
  		required:true
  	},



  	image: {
  		type:String,
  		required:true
  		//get: v =>8 `${root}${v}`
  	},

  	label: {
  		type:String,
  		default:true
  	},
  	
  	price: {
  		type:Currency,
  		required:true,
  		min: 0
  	},

  	description: {
  		type:String,
  		required:true
  	}
  },{
  		timestamps:true	
});

var promotions = mongoose.model("promotions", promotionsSchema);

module.exports = promotions;