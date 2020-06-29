const mongoose = require('mongoose');
const Dishes = require('./models/dishes')
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
//establishing conn. to the mongod server using connect()
const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then((db)=>{
    console.log('Connected to server');
    var newDish=Dishes({
        name:'Chicken',
        description:'test'
    });
    newDish.save().then((dish)=>{
        console.log(dish);
        Dishes.find({}).exec();
        //exec ensures that this will executed
    }).then((dishes)=>{
        console.log(dishes);
        console.log('removing dishes now');
        return Dishes.remove({});// removes all the entries in the database

    }).then(()=>{
        return mongoose.connection.close();
    }).catch((err)=>{console.log(err);
        });
});

// 


