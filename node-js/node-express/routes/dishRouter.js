const express = require('express');
const bodyParser=require('body-parser');

const dishRouter=express.Router(); // dishRouter declared as an express Router

 // takes in endpoint as a param
// just '/' to avoid error such as /dishes ki jagah /dish likha toh gadbad ho jayegi
dishRouter.route('/')
.all( (req, res, next)=>     //no longer need endpoint /dishes
{
  // no matter GET PUT POST DELETE, executed first
  res.statusCode=200; // modifying res obj  here and in next line
  res.setHeader('Content-type', 'text/plain'); // sending plain text replies to the client

  next();
      // continues to look additional specs down below which matches /dishes endpoint
      // if we receive a GET req at /dishes endpoint, req and would be passed on down below
      // and app.get will be executed
})

.get((req, res, next)=>{ // res object modified in app.all is the parameter here
  res.end('will send all the dishes to you');

})

.post( (req, res, next)=>{  // runs after app.all if there is a POST require
  res.end('will add to the dish: '+req.body.name+' with details '+req.body.description ); // name present in body prop in req obj
})// post means that you are posting a new dish to the server so a PUT does not make sense

.put((req, res, next)=>{
  res.statusCode=403; //means operation not supported
  res.end('PUT operation not supported on dishes');
})
.delete((req, res, next)=>{
  res.end('deleting all the dishes'); // dangerous operation, need admin privileges- will do it later
})



module.exports = dishRouter;
