const mongoose = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
const Schema = mongoose.Schema;    

require('mongoose-currency').loadType(mongoose);
const Currency=mongoose.Types.Currency;

const promoSchema = new Schema({

    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    label:{
        type:String,
        required:true,
        default:''
    },
    price:{
        type:Currency,
        required:true,
        min:0
    },
    description:{
        type:String,
        required:true,
        min:''
    },
    featured:{
        type:Boolean,
        required:false
    }
},



{
    timestamps:true
}
);

var Promotions=mongoose.model('Promotion', promoSchema);
module.exports=Promotions;