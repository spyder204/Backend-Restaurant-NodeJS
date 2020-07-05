const mongoose = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
const Schema = mongoose.Schema;    

require('mongoose-currency').loadType(mongoose);
const Currency=mongoose.Types.Currency;

const leaderSchema = new Schema({

    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    designation:{
        type:String,
        required:true
    },
    abbr:{
        type:String,
        required:true,
        
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

var Leaders=mongoose.model('Leaders', leaderSchema);
module.exports=Leaders;