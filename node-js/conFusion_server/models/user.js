// to create user schema and model
// normal and admin user -distinguishing by using a flag

const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');



var User = new Schema({
    // fname and lname are supplied by the user in the registration process
    // in users.js
    firstname:{
        type:String,
        default:''
    },

    lastname:{
        type:String,
        default:''
    },
    
    admin:{
        type:Boolean,
        default:false
    }
    /*username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }, */

    // removed username and password as they would be automatically added in by the PLM plugin
   

});

User.plugin(passportLocalMongoose); // using PLM as a plugin-- 
// stores password after hashing them

module.exports = mongoose.model('User', User);