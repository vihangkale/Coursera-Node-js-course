/*******GETTING MULTER ERROR: UNEXPECTED FIELD*********/


const express = require("express");

const authenticate = require("../authenticate");

const bodyParser = require("body-parser");

const multer = require("multer");

const cors = require("./cors");

const storage = multer.diskStorage({
	destination:(req, file, cb) => {
		cb(null, "public/images");
	},

	filename:(req, file, cb) => {
		cb(null, file.originalname)
	}
});

//applies a filter to check if there are image extensions or not
const imageFileFilter = (req, file, cb) => {
	if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) { //checks the file extension
		return cb (new Error("You can upload only image files!"), false);
	}
	cb(null, true);
};

const upload = multer({storage: storage, fileFilter: imageFileFilter})

const uploadRouter = express.Router(); //Creates a new router object.

uploadRouter.use(bodyParser.json()); //use json in this route



uploadRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.senStatus(200);})   

.get(cors.cors,authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next) => {
		res.statusCode = 403;
		res.end("Get operation not supported on the /imageUpload");
	})

.post(cors.corsWithOptions,
	upload.single("imageFile"),(req,res) => { //allow only single file to upload
		res.statusCode = 200;
		res.setHeader("Content-Type", "multipart/form-data");
		res.json(req.file);			
	})


.put(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next) => {
		res.statusCode = 403;
		res.end("Put operation not supported on the /imageUpload");
	})

.delete(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next) => {
		res.statusCode = 403;
		res.end("Put operation not supported on the /imageUpload");
	})


module.exports = uploadRouter;