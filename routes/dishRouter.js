const express = require("express");

const mongoose = require("mongoose");

const samsung = require("../models/samsung")

const bodyParser = require("body-parser");

const dishRouter = express.Router(); //Creates a new router object.

dishRouter.use(bodyParser.json()); //use json in this route



dishRouter.route('/') //declaring an endpoint
	.get((req,res,next) => {
		samsung.find({})
		.then((sams) => {
			res.statusCode = 200;
			res.setHeader("Content-type","application/json");
			res.json(sams); //it wil send it back to the server
		}, (err) => next(err)) //handles the error
		.catch((err) => next(err));
	})


	.post((req,res,next) => {
		samsung.create(req.body)
		.then((sam) => {
			console.log("samsung created", sam);
			res.statusCode = 200;
			res.setHeader("Content-type","application/json");
			res.json(sam); //it wil send it back to the server
		},(err) => next(err)) //handles the error
		.catch((err) => next(err));
	})

	.put((req,res,next) => {
		res.statusCode = 403;
		res.end("Put operation not supported on the /dishes");
	})

	.delete((req,res,next) => {
		samsung.remove({})
		.then ((resp) => {
			res.statusCode = 200;
			res.setHeader("Content-type","application/json");
			res.json(resp); //it wil send it back to the server

		},(err) => next(err)) //handles the error
		.catch((err) => next(err));
	});



	dishRouter.route('/:dishId') 
	.get((req,res,next) => {
    	samsung.findById(req.params.dishId)
    	.then((sam) => {
			res.statusCode = 200;
			res.setHeader("Content-type","application/json");
			res.json(sam); //it wil send it back to the server
		},(err) => next(err)) //handles the error
		.catch((err) => next(err));
	})

	.post((req,res,next) => {
  		res.statusCode = 403;
  		res.end('POST operation not supported on /dishes/'+ req.params.dishId);
	})

	.put((req,res,next) => {
  		samsung.findByIdAndUpdate(req.params.dishId,{
  			$set: req.body 
  		}, { new:true })
		.then((sam) => {
			console.log("samsung created", sam);
			res.statusCode = 200;
			res.setHeader("Content-type","application/json");
			res.json(sam); //it wil send it back to the server
		},(err) => next(err)) //handles the error
		.catch((err) => next(err));
	})

	.delete((req,res,next) => {
    	samsung.findByIdAndRemove(req.params.dishId)
    	.then ((resp) => {
			res.statusCode = 200;
			res.setHeader("Content-type","application/json");
			res.json(resp); //it wil send it back to the server

		},(err) => next(err)) //handles the error
		.catch((err) => next(err));
	});



//module.exports are the instruction that tells Node.js which bits of 
//code (functions, objects, strings, etc.) to “export” from a given 
//file so other files are allowed to access the exported code
module.exports = dishRouter;