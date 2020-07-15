var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session');
var fileStore = require('session-file-store')(session);
// file store to persist the session info

const passport = require('passport');
//var authenticate =require('./authenticate');
const config = require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');

// to connect this server with mongoDB now-- first
const mongoose = require('mongoose');
const Dishes = require('./models/dishes');
// establish the connection
const url = config.mongoUrl; // from config.js module
const connect = mongoose.connect(url);// established



connect.then((db) => {
  console.log('Connected!');

}, (err) => {
  console.log(err);
});


var app = express();
// to redirect traffic to https
app.all('*', (req, res, next)=>{ // * means all

  if(req.secure){// if incoming req is already secure, then the req object
      return (next); // has a flag secure set to true
  }       
  
  else{
    // redirects incoming req to other url i.e. localhost:3443
    res.redirect(307, 'https://'+req.hostname+':'+app.get('secPort')+req.url);
    // 307 - return status code
    // means that the target resource resides in a different url
    // user agent must not change the req method that is get, post,etc.
  }


    });
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

/* not using sessions now
app.use(session({
  name:'session-id',
  secret:'1234-5678-9766',
  saveUninitialized:false,
  resave:false,
  store:new fileStore()

})); */
app.use(passport.initialize());
//app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

//putting these before auth so any user can access the above two endpoints without being authenticated.



app.use(express.static(path.join(__dirname, 'public')));// to serve static data from public folder


app.use('/dishes', dishRouter);         // we are now allowing GET op to be performed without any auth
app.use('/promotions', promoRouter);    // POST, PUT, DELETE still require auth .
app.use('/leaders', leaderRouter);      // to do this we have made changes in these routes.

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