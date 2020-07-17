const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');

const multer = require('multer');
const cors = require('./cors');

// multer provides a disk storage function 
const storage = multer.diskStorage({
    destination:(req, file, cb) => {
        //allows to configure a destination
        //file - info about file in file object to be processed by Multer
        // cb- call back function
        cb(null, 'public/images'); // public folder in the destination folder where images will be stored

    } ,
    filename: (req, file, cb)=>{
        cb(null, file.originalname);// gives the original name of the file that had been uploaded from the client side
        // otherwise multer gives random string as file names with no extension by default
 
    }
});

// file filter enables which kind of files can be uploaded
const imageFileFilter = (req, file, cb)=> {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        // regex ^
        return cb(new Error('You can upload only image files!'), false);
        //false as we are supplying the error in the first param
        
    }
    cb(null, true);

};

const upload = multer({storage: storage, fileFilter: imageFileFilter});


const uploadRouter = express.Router();
uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
// allowing only the POST method
.options(cors.corsWithOption, (req, res)=>{res.sendStatus = 200;})

.get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /imageUpload');
})
.put(cors.corsWithOption,authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /imageUpload');
})
.delete(cors.corsWithOption,authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /imageUpload');
})

.post(cors.corsWithOption,upload.single('imageFile'),(req, res) => {
    //                          upload function defined above
    //                          which supports the single function to upload a single file
    //                          single() takes as the param the name of the form field
    //                          form field name- imageFile-- which specifies the file

    // now if the file is successfully uploaded --
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
    // passing back the req.file object contains the info about the file uploaded



});

// now configuring the router in app.js




module.exports = uploadRouter;

