const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();

promoRouter.route('/')
.all((req,res,next)=>{
  res.statusCode=200; // OK
  res.setHeader('Content-type','text/plain');
  next();
})

.get((req, res, next)=>{
  res.end('getting all the promotions');
})

.put((req, res, next)=>{
  res.end('This operation is invalid');
})

.post((req, res, next)=>{
  res.end(`New promotion- ${req.body.name} added with details ${req.body.describe}`);
})

.delete((req, res, next)=>{
  res.end('All promotions deleted!');
});

promoRouter.route('/:promoID')
.all((req,res,next)=>{
  res.statusCode=200; // OK
  res.setHeader('Content-type','text/plain');
  next();
})

.get((req, res, next)=>{
  res.end('getting the promotion '+req.params.promoID);
})

.put((req, res, next)=>{
  res.end('updating the promotion '+req.params.promoID+' with new details '+req.body.description);
})

.post((req, res, next)=>{
  res.end('POST operation is invalid');
})

.delete((req, res, next)=>{
  res.end(`Promotion Id: ${req.params.promoID}, Name: ${req.body.name}- deleted!`);
});

module.exports=promoRouter;
