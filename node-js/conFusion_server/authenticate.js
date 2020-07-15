var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');

var jwtStrategy = require('passport-jwt').Strategy;
// provide us with  a jwt based strategy to config. our passport module.
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt= require('jsonwebtoken'); // used to  create, sign and verify tokens.
const config = require('./config');
const { NotExtended } = require('http-errors');


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


exports.getToken = function(user){  // used in users.js- takes one param 
    // user parameter is a json object
    // func will create a token and give it for us
    return jwt.sign(user, config.secretKey,  // user parameter is payload, second param from config file
        {expiresIn : 3600 }) ;   // additional param- token valid for 3600 secs- one hour, can be a few days too

};

// now configuring the jwt based strategy for our passport application
var opts = {};  //options

//jwtFromRequest specifies how the token should be extracted from the incoming request.
//ExtractJwt supports various methods for extracting token (see that by putting a dot(.))
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); // token extracted from the auth header

opts.secretOrKey = config.secretKey;


// specifying the jwt based strategy 
// jwtstrategy has to params- options(opts), a verify function
exports.jwtPassport = passport.use( new jwtStrategy(opts,   
    (jwt_payload, done)=>{ // done is the callback which passes back info to passport
                                 // to load thing in the request msg
        console.log("JWT payload: ",jwt_payload);
        User.findOne({_id:jwt_payload._id}, (err, user)=>{
            if(err){
                return done(err, false);// false denotes user does not exist  
            }
            else if(user){
                return done(null, user);
            }
            else{
                return done(null, false);// no err and no user
            }
        }); //findOne  

    }));  

exports.verifyUser = passport.authenticate('jwt', {session:false}); //jwt strategy
// session:false means we're not going to create sessions as we are using token based auth.
//user verified using this function


exports.verifyAdmin = function(){
    if(req.body.admin)
        next();
    else{
        var err = new Error('Admin access required!!');
        err.status = 403;
        return(next(err));
    }
};