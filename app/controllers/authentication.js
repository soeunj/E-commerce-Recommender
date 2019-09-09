
const User = require('../models/user');

exports.signIn = function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    if (username && password) {
		User.findOne({username:username, password:password},function(error, results) {
            console.log(results);
			if (results) {
				req.session.loggedin = true;
                req.session.username = username;
                req.session.user_id = results.user_id;
				res.render('index', {username:req.session.username});
			} else {
				res.send('Incorrect Username and/or Password!');
			}			
			res.end();
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
};
