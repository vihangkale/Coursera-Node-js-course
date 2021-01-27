const express = require("express");

const bodyParser = require("body-parser");

const dishRouter = express.Router(); //Creates a new router object.

dishRouter.use(bodyParser.json()); //use json in this route



dishRouter.route('/') //declaring an endpoint
	.all((req,res,next) => {
		res.statusCode = 200;
		res.setHeader("Content-Type", "text/plain");
		next();
	})

	.get((req,res,next) => {
		res.end("Will send all the dishes to you");
	})


	.post((req,res,next) => {
		res.end("Will add all the dish: " + req.body.name + " with details " + req.body.description);
	})

	.put((req,res,next) => {
		res.statusCode = 403;
		res.end("Put operation not supported on the /dishes");
	})

	.delete((req,res,next) => {
		res.end("Deleting all the dishes!");
	})



	dishRouter.route('/:dishId') 
	.get((req,res,next) => {
    	res.end('Will send details of the dish: ' + req.params.dishId +' to you!');
	})

	.post((req,res,next) => {
  		res.statusCode = 403;
  		res.end('POST operation not supported on /dishes/'+ req.params.dishId);
	})

	.put((req,res,next) => {
  		res.write('Updating the dish: ' + req.params.dishId + '\n');
  		res.end('Will update the dish: ' + req.body.name + 
        ' with details: ' + req.body.description);
	})

	.delete((req,res,next) => {
    	res.end('Deleting dish: ' + req.params.dishId);
	})



//module.exports are the instruction that tells Node.js which bits of 
//code (functions, objects, strings, etc.) to “export” from a given 
//file so other files are allowed to access the exported code
module.exports = dishRouter;