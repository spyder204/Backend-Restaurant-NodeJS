const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.route('/')
.all((req,res,next)=>{
  res.statusCode=200; // OK
  res.setHeader('Content-type','text/plain');
  next();
})

.get((req, res, next)=>{
  res.end('getting all the leaders');
})

.put((req, res, next)=>{
  res.end('This operation is invalid');
})

.post((req, res, next)=>{
  res.end(`Leader added- ${req.body.name} added with details ${req.body.describe}`);
})

.delete((req, res, next)=>{
  res.end('All leaders data deleted!');
});

leaderRouter.route('/:leadersID')
.all((req,res,next)=>{
  res.statusCode=200; // OK
  res.setHeader('Content-type','text/plain');
  next();
})

.get((req, res, next)=>{
  res.end('getting the leader info of ID '+req.params.leadersID);
})

.put((req, res, next)=>{
  res.end('updating the leader info '+req.params.leadersID+' with new details '+req.body.description);
})

.post((req, res, next)=>{
  res.end('POST operation is invalid');
})

.delete((req, res, next)=>{
  res.end(`Promotion Id: ${req.params.leadersID}, Name: ${req.body.name}- deleted!`);
});

module.exports=leaderRouter;
