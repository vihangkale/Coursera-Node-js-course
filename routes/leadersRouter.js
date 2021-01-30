const express = require("express");

const bodyParser = require("body-parser");

const leaders = require("../models/leaders");

const leadersRouter = express.Router(); //Creates a new router object.

leadersRouter.use(bodyParser.json()); //use json in this route



	leadersRouter.route('/') //declaring an endpoint
	.get((req,res,next) => {
		leaders.find({})
		.then((leads) => {
			res.statusCode = 200;
			res.setHeader("Content-type","application/json");
			res.json(leads); //it wil send it back to the server
		}, (err) => next(err)) //handles the error
		.catch((err) => next(err));
	})


	.post((req,res,next) => {
		leaders.create(req.body)
    	.then((lead) => {
        	console.log('leader Created ', lead);
        	res.statusCode = 200;
        	res.setHeader('Content-Type', 'application/json');
        	res.json(lead);
    }, (err) => next(err))
    .catch((err) => next(err));
	})

	.put((req,res,next) => {
		res.statusCode = 403;
		res.end("Put operation not supported on the /leaders");
	})

	.delete((req,res,next) => {
		leaders.remove({})
    	.then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
	})



	leadersRouter.route('/:leadId') 
	.get((req,res,next) => {
    leaders.findById(req.params.leadId)
    .then((lead) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(lead);
    }, (err) => next(err))
    .catch((err) => next(err));
	})

	.post((req,res,next) => {
  		res.statusCode = 403;
  		res.end('POST operation not supported on /leaders/'+ req.params.leadId);
	})

	.put((req,res,next) => {
  	leaders.findByIdAndUpdate(req.params.leadId, {
        $set: req.body
    }, { new: true })
    .then((lead) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'appli  cation/json');
        res.json(lead);
    }, (err) => next(err))
    .catch((err) => next(err));
	})

	.delete((req,res,next) => {
    	leaders.findByIdAndRemove(req.params.leadId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
	});



//module.exports are the instruction that tells Node.js which bits of 
//code (functions, objects, strings, etc.) to “export” from a given 
//file so other files are allowed to access the exported code
module.exports = leadersRouter;