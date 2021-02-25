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

})

.post(authenticate.verifyUser,(req, res, next)=>{
    Favorite.findOne({'user':req.decoded._doc._id}, (err, fav)=>{
        if(err)
        throw err;
        if(!fav){
            console.log('Creating a favorites list');
            Favorite.create(req.body, (err, fav)=>{
                if(err)
                 throw err;
                console.log('list created');
                fav.user = req.decoded._doc._id;
                fav.dishes.push(req.body._id);
                fav.save()
                .then((fav) => {
                    Favorite.findById(favorite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
                })
                .catch((err) => {
                    return next(err);
                });    
                
            
            });
        }
            else {
                    var dish = req.body._id;

                    if (fav.dishes.indexOf(dish) == -1) {
                        fav.dishes.push(dish);
                    }
                    
                    fav.save(function (err, fav) {
                        if (err) throw err;
                        res.json(fav);
                    });
            }
        
        
    });
})//post


.delete(authenticate.verifyUser,(req, res, next)=>{
    Favorite.remove({'user':req.decoded._id}, (err, resp)=>{
        if(err)
            throw err;
        res.json(resp);
    });


});

favoriteRouter.route('/:dishId')
get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorites) => {
        if (!favorites) { // if favorites list exists
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({"exists": false, "favorites": favorites});
        }
        else {
            if (favorites.dishes.indexOf(req.params.dishId) < 0) { // if fav exists but dish not in favorites list
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": false, "favorites": favorites});
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": true, "favorites": favorites});
            }
        }

    }, (err) => next(err))
    .catch((err) => next(err))
})

.delete(authenticate.verifyUser, (req, res, next)=>{

    Favorite.findOneAndUpdate({'user':req.decoded._doc._id}, {$pull : {dishes : req.params.dishId}}, (err,fav)=>{
        if(err)
            throw err;
        fav.findOne({'postedBy': req.decoded._doc._id}, function(err, fav){
            res.json(fav);
        });
    });


});


module.exports=favoriteRouter;