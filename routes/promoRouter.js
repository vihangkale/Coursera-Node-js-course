const express = require("express");

const bodyParser = require("body-parser");

const promotions = require("../models/promotions");

const promoRouter = express.Router(); //Creates a new router object.

promoRouter.use(bodyParser.json()); //use json in this route



	promoRouter.route('/') //declaring an endpoint
	.get((req,res,next) => {
		promotions.find({})
		.then((promos) => {
			res.statusCode = 200;
			res.setHeader("Content-type","application/json");
			res.json(promos); //it wil send it back to the server
		}, (err) => next(err)) //handles the error
		.catch((err) => next(err));
	})


	.post((req,res,next) => {
		promotions.create(req.body)
    	.then((promo) => {
        	console.log('Promos Created ', promo);
        	res.statusCode = 200;
        	res.setHeader('Content-Type', 'application/json');
        	res.json(promo);
    }, (err) => next(err))
    .catch((err) => next(err));
	})

	.put((req,res,next) => {
		res.statusCode = 403;
		res.end("Put operation not supported on the /promotions");
	})

	.delete((req,res,next) => {
		promotions.remove({})
    	.then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
	})



	promoRouter.route('/:promoId') 
	.get((req,res,next) => {
    promotions.findById(req.params.promoId)
    .then((promo) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo);
    }, (err) => next(err))
    .catch((err) => next(err));
	})

	.post((req,res,next) => {
  		res.statusCode = 403;
  		res.end('POST operation not supported on /promotions/'+ req.params.promoId);
	})

	.put((req,res,next) => {
  	promotions.findByIdAndUpdate(req.params.promoId, {
        $set: req.body
    }, { new: true })
    .then((promo) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'appli  cation/json');
        res.json(promo);
    }, (err) => next(err))
    .catch((err) => next(err));
	})

	.delete((req,res,next) => {
    	promotions.findByIdAndRemove(req.params.promoId)
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
module.exports = promoRouter;