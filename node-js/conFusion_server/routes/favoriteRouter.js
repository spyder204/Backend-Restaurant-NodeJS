const express = require('express');
const bodyparser = require('body-parser');

const Favorite = require('../models/favorite');
const favoriteRouter = express.Router();
const authenticate = require('../authenticate');


favoriteRouter.use(bodyparser.json());

favoriteRouter.route('/')
.get(authenticate.verifyUser,(req, res, next)=>{
    Favorite.find({'user':req.decoded._doc._id})
    .populate('user')
    .populate('fav')
    .then((favs)=>{
        if(!favs){

            var err = new Error("Favorites list doesn't exist!");
            return next(err);
        }
        res.json(favs);

    },(err)=>next(err))
    .catch((err)=>next(err));

});
module.exports=favoriteRouter;