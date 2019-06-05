const Recommendation  = require('../models/recommendation');

//app.get('/recommendation/:id', Recommendation.getRecommendation);
exports.getRecommendation = function(req, res, next){
    var id = req.session.user_id;
    Recommendation.find({user_id:id}, function(err, basket){
        if (err) throw err;
        var products = Object.keys(basket[0].recommendations);
        var rates = Object.values(basket[0].recommendations);
        for(let i =0; i<rates.length; i++){
            rates[i] = rates[i].toFixed(2);
        }
        res.render('recommendation',{ username: req.session.username, products: products, rates: rates });
    });
};
