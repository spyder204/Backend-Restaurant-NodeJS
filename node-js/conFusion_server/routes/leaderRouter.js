const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const leaders = require('../models/leaders');

const leaderRouter = express.Router();
const authenticate = require('../authenticate');
const cors = require('./cors');
leaderRouter.use(bodyParser.json());



leaderRouter.route('/')
.options(cors.corsWithOption, (req, res)=>{res.sendStatus = 200;})
.get(cors.cors, (req, res, next)=>{

  leaders.find(req.query)
  .then((leader)=>{
    res.statusCode=200;
    res.setHeader('Content-type','application/json');
    res.json(leader);
  }, (err)=>next(err))
    .catch((err)=>next(err));


})// get 

.put(cors.corsWithOption,authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next)=>{
  res.statusCode=403;
  res.end('This operation is invalid');
})

.post(cors.corsWithOption,authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{

  leaders.create(req.body)
  .then((leader)=>{
    console.log("New leader info created\n");
    res.statusCode=200;
    res.setHeader('Content-Type', 'application/json');
    res.json(leader);
  }, (err)=>next(err)
  ).catch((err)=>next(err));

})//post

.delete(cors.corsWithOption,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next)=>{
  //res.end('All promotions deleted!');
  leaders.remove({})
  .then((response)=>{
    res.statusCode=200;
    res.setHeader('Content-type','application/json');
    res.json(response);

  }, (err)=>next(err))
  .catch((err)=>next(err));

});

leaderRouter.route('/:leaderID')
.options(cors.corsWithOption, (req, res)=>{res.sendStatus = 200;})
.get(cors.cors, (req, res, next)=>{
  console.log("Fetching leader info\n");
  leaders.findById(req.params.leaderID)
  .then((leader)=>{

    res.statusCode=200;
    res.setHeader('Content-type','application/json');
    res.json(leader);

  }, (err)=>next(err))
  .catch((err)=>next(err));

})// get 

.put(cors.corsWithOption,authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next)=>{
  //res.end('updating the promotion '+req.params.promoID+' with new details '+req.body.description);

  leaders.findByIdAndUpdate(req.params.leaderID,
  {
    $set:req.body
  },
  {
    new:true
  }
  )// findbyIdAndUpdate
  
  .then((leader)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(leader);

  },(err)=>next(err)
  ).catch((err)=>next(err));



})

.post(cors.corsWithOption,authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
  res.end('POST operation is invalid on /leaders/'+req.params.leaderID);
})

.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
  //res.end(`Promotion Id: ${req.params.promoID}, Name: ${req.body.name}- deleted!`);
  leaders.findByIdAndDelete(req.params.leaderID)
  .then((leader)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(leader);

  },(err)=>next(err)
  ).catch((err)=>next(err));

});

module.exports=leaderRouter;
