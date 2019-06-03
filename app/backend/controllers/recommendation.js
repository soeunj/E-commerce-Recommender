const Recommendation  = require('../models/recommendation');

//app.get('/recommendation/:id', Recommendation.getRecommendation);
exports.getRecommendation = function(req, res, next){
    var id = req.params.id;
    Recommendation.find({user_id:id}, function(err, data){
        if (err) throw err;
        res.send(data);
        console.log(data);
    });
};
