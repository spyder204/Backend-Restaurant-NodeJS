// to create user schema and model
// normal and admin user -distinguishing by using a flag

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    admin:{
        type:Boolean,
        default:false
    }

});

module.exports = mongoose.model('User', User);