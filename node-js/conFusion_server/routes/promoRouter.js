const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const promotions=require('../models/promotions');
const Promotions = require('../models/promotions');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')

.get((req, res, next)=>{

  promotions.find({})
  .then((promos)=>{
    res.statusCode=200;
    res.setHeader('Content-type','application/json');
    res.json(promos);
  }, (err)=>next(err))
    .catch((err)=>next(err));


})// get 

.put((req, res, next)=>{
  res.statusCode=403;
  res.end('This operation is invalid');
})

.post((req, res, next)=>{

  promotions.create(req.body)
  .then((promo)=>{
    console.log("Promotion created\n");
    res.statusCode=200;
    res.setHeader('Content-Type', 'application/json');
    res.json(promo);
  }, (err)=>next(err)
  ).catch((err)=>next(err));

})//post

.delete((req, res, next)=>{
  //res.end('All promotions deleted!');
  Promotions.remove({})
  .then((response)=>{
    res.statusCode=200;
    res.setHeader('Content-type','application/json');
    res.json(response);

  }, (err)=>next(err))
  .catch((err)=>next(err));

});

promoRouter.route('/:promoID')

.get((req, res, next)=>{
  console.log("Fetching promotion\n");
  promotions.findById(req.params.promoID)
  .then((promo)=>{

    res.statusCode=200;
    res.setHeader('Content-type','application/json');
    res.json(promo);

  }, (err)=>next(err))
  .catch((err)=>next(err));

})// get 

.put((req, res, next)=>{
  //res.end('updating the promotion '+req.params.promoID+' with new details '+req.body.description);

  promotions.findByIdAndUpdate(req.params.promoID,
  {
    $set:req.body
  },
  {
    new:true
  }
  )// findbyIdAndUpdate
  
  .then((promo)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(promo);

  },(err)=>next(err)
  ).catch((err)=>next(err));



})

.post((req, res, next)=>{
  res.end('POST operation is invalid on /promotions/'+req.params.promoID);
})

.delete((req, res, next)=>{
  //res.end(`Promotion Id: ${req.params.promoID}, Name: ${req.body.name}- deleted!`);
  promotions.findByIdAndDelete(req.params.promoID)
  then((promo)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(promo);

  },(err)=>next(err)
  ).catch((err)=>next(err));

});

module.exports=promoRouter;
