
exports.loadMain = function(req, res, next){
    if (req.session.loggedin) {
			console.log(req.session);
		res.render('index',{username:req.session.username});
	} else {
		res.render('login',{});
	}
	res.end();
};

