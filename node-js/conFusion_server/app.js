var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session');
var fileStore = require('session-file-store')(session);
// file store to persist the session info
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
//app.use(cookieParser('1234-5678-9766'));// middleware is used-- parameter is secret key
// using signed cookies here ^
//authn. before accessing data 
//-------------------
//instead of cookie parser, we will use the session here

app.use(session({
  name:'session-id',
  secret:'1234-5678-9766',
  saveUninitialized:false,
  resave:false,
  store:new fileStore()

}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//putting these before auth so any user can access the above two endpoints without being authenticated.

function auth(req, res, next){     // authorization
    
  //session middleware adds req.session to the request message
  console.log(req.session);
  
  //console.log(req.signedCookies);
  //console.log('\nHeaders',req.headers);
  if(!req.session.user)  
  { // user has not been authorized yet if signed cookie doesn't contain the user property
    // so auth has to be done now
    var err=new Error('You are not authenticated!');
    err.status=403;
    return next(err);
  
  } 
  else{  // means the signed cookie already exists

    if(req.session.user==='authenticated'){  // in users.js- line 99-we have set it to authn.
      next();
    }
    else{
      let err = new Error('You are not authenticated!');
      //setting header in the response msg
      err.status=403;// 
      return next(err); // will be handled by the handler down below

    }


  }


}


app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));// to serve static data from public folder


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