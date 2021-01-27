const express = require("express");

const bodyParser = require("body-parser");

const promoRouter = express.Router(); //Creates a new router object.

promoRouter.use(bodyParser.json()); //use json in this route



	promoRouter.route('/') //declaring an endpoint
	.all((req,res,next) => {
		res.statusCode = 200;
		res.setHeader("Content-Type", "text/plain");
		next();
	})

	.get((req,res,next) => {
		res.end("Will promote this product");
	})


	.post((req,res,next) => {
		res.end("Will add all the promotional content: " + req.body.name + " with details " + req.body.description);
	})

	.put((req,res,next) => {
		res.statusCode = 403;
		res.end("Put operation not supported on the /promotions");
	})

	.delete((req,res,next) => {
		res.end("Deleting all the promotions!");
	})



	promoRouter.route('/:promoId') 
	.get((req,res,next) => {
    	res.end('Will send details of the promotions: ' + req.params.promoId +' to you!');
	})

	.post((req,res,next) => {
  		res.statusCode = 403;
  		res.end('POST operation not supported on /promotions/'+ req.params.promoId);
	})

	.put((req,res,next) => {
  		res.write('Updating the promotions: ' + req.params.promoId + '\n');
  		res.end('Will update the promotions: ' + req.body.name + 
        ' with details: ' + req.body.description);
	})

	.delete((req,res,next) => {
    	res.end('Deleting promotions: ' + req.params.promoId);
	})



//module.exports are the instruction that tells Node.js which bits of 
//code (functions, objects, strings, etc.) to “export” from a given 
//file so other files are allowed to access the exported code
module.exports = promoRouter;