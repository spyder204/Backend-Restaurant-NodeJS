var express  = require('express');

const bodyParser = require('body-parser');
var User = require('../models/user');
//const { response } = require('../app');


var router = express.Router();
router.use(bodyParser.json());


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', function(req,res,next){ // to register a user, POST op 

  User.findOne({username:req.body.username})
  .then((user)=>{
    if(user!=null){
      //username already exists
      var err= new Error('User'+req.body.username+' already exists!');
      err.status=403; //forbidden
      next(err);
    }
    else{
      return User.create(
        {
          username:req.body.username,
          password:req.body.password
        }
      )// create
    }

  }).then((user)=>{ // promise returned from prev then() -after a new user is signed up
     res.statusCode=200;
     res.setHeader('Content-type','application/json');
     res.json({status:'Registration successful', user:user});
  }, (err)=>next(err))
    .catch((err)=>next(err));
});

//to login a user
router.post('/login', function(req,res,next){
 // from app.js
 if(!req.session.user)  
 { // user has not been authorized yet if signed cookie doesn't contain the user property
   // so auth has to be done now
   var authHeader = req.headers.authorization;

   if(!authHeader){
     var err = new Error('Authentication required!!');
     //setting header in the response msg
     res.setHeader('WWW-Authenticate','Basic');
     err.status=401;// unauthorized access
     return next(err); // will be handled by the handler down below
 
   }
 
   // if the auth header exists..we'll extract it
   //we'll split the header- it's a string basically- using buffer
   // split function se array milegi, uska index=1 chahye
 
   var auth=new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
   /* split function se array milegi, uska index=1 chahye --- index=0 pe 'base' ya 'basic' h shayd
       fir index=1 wla buffer mein convert kra
       jo array mili thi usme name, password hoga separated by a semicolon
       toh semicolon pe firse split mara
 
       so the variable auth is an array 
       */
   var username=auth[0]; 
   var password=auth[1]; 

   User.findOne({username:username})
   .then((user)=>{
    
    if(user===null){
      var err = new Error('User '+username+' does not exist');
      //setting header in the response msg
      res.setHeader('WWW-Authenticate','Basic');
      err.status=401;// unauthorized access
      return next(err); // will be handled by the handler down below

    }
    else if(user.password!==password){
      var err = new Error('incorrect password');
      //setting header in the response msg
      res.setHeader('WWW-Authenticate','Basic');
      err.status=401;// unauthorized access
      return next(err); // will be handled by the handler down below

    }


    else if(user.username===username && user.password===password){
      // instead of setting up the cookie, we'll use session.user
      req.session.user='authenticated';
      res.statusCode=200;
      res.setHeader('Content-type','application/json');
      res.end('You are authenticated!');
      //----------
      // we'll setup the cookie at this point  
      //res.cookie('user','admin',{signed:true})// cookie name=user-- that is why checking for req.signedCookies.user up there
      //                  ^ user field set to admin
 

   }
  }).catch((err)=>next(err));
 } // req.session.user not set
 
 else{
  // if req.session.uesr is set i.e, user is already logged in
  res.statusCode=200;
  res.setHeader('Content-type','application/json');
  res.end('You are already authenticated!');

 }
});
//-----------------------

// doing a GET on logout instead of POST as we don't 
// need to supply any info so GET is fine.
router.get('/logout',(req,res)=>{

  if(req.session){
    // sessions must exist to logout a user otherwise it does not make any sense
    req.session.destroy();//  info in server side is remove related to the session
    res.clearCookie('session-id'); // cookie named 'session-id' is removed from the client side
    res.redirect('/'); // redirecting to homepage

  }
  
  else{
    var err=new Error("You are not logged in.");
    err.status=403;
    next(err);
  }
}); 




module.exports = router;
