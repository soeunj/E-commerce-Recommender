
exports.loadMain = function(req, res, next){
    if (req.session.loggedin) {
		res.render('index',{});
	} else {
		res.render('login',{});
	}
	res.end();
};

