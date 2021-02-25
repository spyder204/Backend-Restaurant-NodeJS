var express  = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
var User = require('../models/user');
const cors = require('./cors');
var authenticate = require('../authenticate'); 
// authenticate.js -- it contains getToken() which we defined earlier

var router = express.Router();
router.use(bodyParser.json());


router.options('*', cors.corsWithOption, (req, res)=>{res.sendStatus(200);})

/* GET users listing. */
router.get('/',cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin ,function(req, res, next) {
  //  get performed by admin so corswithoptions
  //  console.log('jesfsfsf');
    User.find({})
    .then((err, users)=>{
      if(err){


        return next(err);
      }
      res.statusCode=200;
      res.setHeader('Content-Type', 'application/json');
      res.json(users);
    }, (err)=>next(err)) // then
    .catch((err)=>next(err));

});

router.post('/signup', cors.corsWithOption, function(req,res,next){ // to register a user, POST op 

  //User.findOne({username:req.body.username})
  // register provided by the mongoose plugin
  User.register(new User({username:req.body.username}), req.body.password,
   (err,user)=>
  {//callback
    //if(user!=null)
   if(err) {
      //username already exists
      res.statusCode=500; // Internal Server Error
      res.setHeader('Content-type','application/json');
      res.json({err:err}); // we'll construct a json object with the error as
      //the value for the error property in there and then send this back.
      

    }
    
    else{
      if(req.body.firstname)
        user.firstname=req.body.firstname;
        if(req.body.lastname)
        user.lastname=req.body.lastname;  
      user.save((err,user)=>{// save will return err or the user
        
        if(err){
          res.statusCode=500; // Internal Server Error
          res.setHeader('Content-type','application/json');
          res.json({err:err});

        }
        
        passport.authenticate('local')(req,res, ()=>{
          res.statusCode=200;
          res.setHeader('Content-type','application/json');
          res.json({success:true, status:'Registration completed'});
    

      });
     });
    } //else ends here
  });
});


//to login a user
//router.post('/login', cors.corsWithOption, passport.authenticate('local'), (req,res)=>{
  router.post('/login', cors.corsWithOption, (req,res,next)=>{
    passport.authenticate('local', (err, user, info)=>{
      if(err)
        return next(err);
      if(!user){   // if username or password is incorrect
        res.statusCode=401;
        res.setHeader('Content-type','application/json');
        res.json({success:false, status:'Unable to log in!', err:info});
      }
      req.logIn(user, (err)=>{ // method login added by passport.authenticate
          if(err) {
            res.statusCode=401;
            res.setHeader('Content-type','application/json');
            res.json({success:false, status:'Unable to log in!', err:info});
          }
          var token = authenticate.getToken({_id: req.user._id});
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Login Successful!', token: token})  



        });
    })(req, res, next);//passport
    // did this above as passport.authenticate doesnt show much info when user is not logged in- just shows unauthorized

  });

//router.post('/login', function(req,res,next){
 /* from app.js
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
       *//*
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
});*/
//-----------------------

// doing a GET on logout instead of POST as we don't 
// need to supply any info so GET is fine.
router.get('/logout',cors.corsWithOption, (req,res)=>{

  if(req.session){
    // sessions must exist to logout a user otherwise it does not make any sense
    req.session.destroy();//  info in server side is remove related to the session
    res.clearCookie('session-id'); // cookie named 'session-id' is removed from the client side
    res.json({success:true, status:'Logged out'})
    res.redirect('/'); // redirecting to homepage

  }
  
  else{
    var err=new Error("You are not logged in.");
    err.status=403;
    return next(err);
  }
}); 




module.exports = router;
