var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');

// to connect this server with mongoDB now-- first
const mongoose = require('mongoose');
const Dishes = require('./models/dishes');
// establish the connection
const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);// established

connect.then((db) => {
  console.log('Connected!');

}, (err) => {
  console.log(err);
});


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');




app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('1234-5678-9766'));// middleware is used-- parameter is secret key
// using signed cookies here ^
//authn. before accessing data 

function auth(req, res,next){     // authorization
    
  console.log(req.signedCookies);
  //console.log('\nHeaders',req.headers);
  if(!req.signedCookies.user)  
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
  
    if(username==='admin' && password==='password'){
      // we'll setup the cookie at this point  
      
      res.cookie('user','admin',{signed:true})// cookie name=user-- that is why checking for req.signedCookies.user up there
      //                  ^ user field set to admin

      next(); // from here req will be passed on to the next middleware
      
    }
    else{
      var err = new Error('Authentication required!!');
      //setting header in the response msg
      res.setHeader('WWW-Authenticate','Basic');
      err.status=401;// unauthorized access
      return next(err); // will be handled by the handler down below
  
    }
  

  }//req.signed

  else{  // means the signed cookie already exists

    if(req.signedCookies.user==='admin'){ 
      next();
    }
    else{
      let err = new Error('Authentication required!!');
      //setting header in the response msg
      err.status=401;// unauthorized access
      return next(err); // will be handled by the handler down below

    }


  }


}


app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));// to serve static data from public folder

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500); // error  handler
  res.render('error');
});

module.exports = app;

/* Notes
1. Cookie-parser middleware in Express allows the server to setup the cookie in
 the response header

2. To preserve the authenticity of the cookie-- they are signed with
 secret key which is only known to the server. DIGITAL SIGNATURE .

  parsed signed cookies available as --- req.signedCookies.name

SESSIONS=
- limitations of cookies- small size,can't store a lot of info

-enables the server to recognize a client

-EXPRESS sessions = used to track user sessions using SESSION ID
express-session middleware

-file storage or DB used to store tracked sessions in case server
 is restarted

- using this module, every request has req.session property 


*/