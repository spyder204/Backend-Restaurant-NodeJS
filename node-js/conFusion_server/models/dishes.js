const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
const Schema = mongoose.Schema;
// to use mongoose currency
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const commentSchema=new Schema({

    rating:{
        type:Number,
        min:1,
        max:5,
        required:true
    },
    comment:{
        type:String,
        required:true

    },
    author:{
        type:String,
        required:true
    }
},
    {
        timestamps:true
    

});

const dishSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            required: true
        },

        image:{
            type:String,
            require:true
        },
        category:{
            type:String,
            require:true
        },
        label:{
            type:String,
            default:''
        },
        price:{
            type:Currency,
            require:true,
            min:0
        },
        featured:{
            type:Boolean,
            require:false
        },

        comments:[commentSchema]// array of type commentSchema
    },
 
 {
    timestamps: true
 }
 
 );




var Dishes = mongoose.model('Dish', dishSchema);

module.exports = Dishes;