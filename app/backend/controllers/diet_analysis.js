const Basket  = require('../models/basket');

//app.get('/dietanalysis/:id', DietAnalysis.getDietAnalysis);
exports.getDietAnalysis = function(req, res, next){
    var id = req.params.id;
    Basket.aggregate([{$match:{user_id:Number(id)}},{$group:{_id:"$foodgroup", count:{$sum:1}}}], function(err, basket){
        if (err) throw err;
               res.send(basket);
        console.log(basket);
    });
};

//app.get('/dietanalysis/:id/:name', DietAnalysis.getListOfProductByDiet);
exports.getListOfProductByDiet = function(req, res, next){
    var id = req.params.id;
    var name = req.params.name;
    Basket.aggregate([{$match:{user_id:Number(id), foodgroup:name}}], function(err, basket){
        if (err) throw err;
               res.send(basket);
        console.log(basket);
    });
};