const request = require('request');
const fetch = require('node-fetch');
exports.getRecommendation = async function (req, res, next) {
    var id = req.session.user_id;
    try {
        var data = await Promise.all([
            fetch('http://localhost:5000/analysis/recommendation/' + String(id)).then((response) => response.json())
        ]);
        console.log(data[0]['product']);
        res.render('recommendation', { username: req.session.username, product:data[0]['product'], p_r:data[0]['p_r'], association:data[0]['association'] });
    }
    catch (error) {
        console.log(error);
    }

};
