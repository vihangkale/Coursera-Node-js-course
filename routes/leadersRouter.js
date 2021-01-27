const express = require("express");

const bodyParser = require("body-parser");

const leadersRouter = express.Router(); //Creates a new router object.

leadersRouter.use(bodyParser.json()); //use json in this route



leadersRouter.route('/') //declaring an endpoint
	.all((req,res,next) => {
		res.statusCode = 200;
		res.setHeader("Content-Type", "text/plain");
		next();
	})

	.get((req,res,next) => {
		res.end("Will promote this product");
	})


	.post((req,res,next) => {
		res.end("Will add all the leaders content: " + req.body.name + " with details " + req.body.description);
	})

	.put((req,res,next) => {
		res.statusCode = 403;
		res.end("Put operation not supported on the /leaders");
	})

	.delete((req,res,next) => {
		res.end("Deleting all the leaders!");
	})



	leadersRouter.route('/:leaderId') 
	.get((req,res,next) => {
    	res.end('Will send details of the leaders: ' + req.params.leaderId +' to you!');
	})

	.post((req,res,next) => {
  		res.statusCode = 403;
  		res.end('POST operation not supported on /leaders'+ req.params.leaderId);
	})

	.put((req,res,next) => {
  		res.write('Updating the leaders: ' + req.params.leaderId + '\n');
  		res.end('Will update the leaders: ' + req.body.name + 
        ' with details: ' + req.body.description);
	})

	.delete((req,res,next) => {
    	res.end('Deleting leaders: ' + req.params.leaderId);
	})



//module.exports are the instruction that tells Node.js which bits of 
//code (functions, objects, strings, etc.) to “export” from a given 
//file so other files are allowed to access the exported code
module.exports = leadersRouter;