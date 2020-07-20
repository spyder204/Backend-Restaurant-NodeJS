const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);


const favoriteArray = new Schema({

    dish:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }

});


const favoriteSchema = new Schema({
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    fav: [favoriteArray]
},

{
    timestamps : true
}

);

var Favorites = mongoose.model('Favorite', favoriteSchema);
module.exports = Favorites;