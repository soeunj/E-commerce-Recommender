const request = require('request');

exports.getRecommendation = function(req, res, next){
    var id = req.session.user_id;
    var association = [], recommendation = [];
    request('http://localhost:5000/analysis/association/'+String(id), { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        association = body;
    });
    request('http://localhost:5000/analysis/recommendation/'+String(id), { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        recommendation = body;
    });
    res.render('recommendation',{ username: req.session.username, recommendation : recommendation, association: association });

};
