// to create user schema and model
// normal and admin user -distinguishing by using a flag

const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var User = new Schema({
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
    admin:{
        type:Boolean,
        default:false
    }

});

User.plugin(passportLocalMongoose); // using PLM as a plugin-- 
// stores password after hashing them

module.exports = mongoose.model('User', User);