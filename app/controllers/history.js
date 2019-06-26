const Basket  = require('../models/basket');

exports.getHistory = function(req, res, next){
    var id = req.session.user_id;
    var diet_list = ["carbohydrates", "proteins", "sugar sweets and bakeries", "processed foods", "vegetables and fruits", "fat",  "others", "diary products and alternatives"];
    var department_list = ["frozen",
        "other",
        "bakery",
        "produce",
        "alcohol",
        "international",
        "beverages",
        "pets",
        "dry goods pasta",
        "bulk",
        "personal care",
        "meat seafood",
        "pantry",
        "breakfast",
        "canned goods",
        "dairy eggs",
        "household",
        "babies",
        "snacks",
        "deli",
        "missing"];
    console.log(req.session);
    res.render('history',{ username: req.session.username, data: "", diet_list:diet_list, department_list: department_list});
};

//app.get('/history//department', History.getDepartmentHistoryByUser);
exports.getHistoryByGroup = function(req, res, next){
    var id = req.session.user_id;
    var grouping = req.body.group;
    if(req.session.username == "admin"){
        Basket.aggregate([{$group:{_id:"$"+grouping, count:{$sum:1}}}], function(err, basket){
            if (err) throw err;
            res.render('history',{ username: req.session.username, data: basket, diet_list:diet_list, department_list: department_list});
            console.log(basket);
        });
    }
    else{
        Basket.aggregate([{$match:{user_id:Number(id)}},{$group:{_id:"$"+grouping, count:{$sum:1}}}], function(err, basket){
            if (err) throw err;
            res.send(basket);
            console.log(basket);
        });
    }
};

//app.get('/history/department/:name', History.getUserHistoryByDepartment);
exports.getUserHistoryByDepartment = function(req, res, next){
    var id = req.session.user_id;
    var department = req.params.name;
    if(id == "admin"){
        Basket.find({department:department}, function(err, basket){
            if (err) throw err;
            res.send(basket);
            console.log(basket);
        });
    }
    else{
        Basket.find({user_id:id, department:department}, function(err, basket){
            if (err) throw err;
            res.send(basket);
            console.log(basket);
        });
    }
};
//app.get('/history/aisle/:name', History.getUserHistoryByAisle);
exports.getUserHistoryByAisle = function(req, res, next){
    var id = req.session.user_id;
    var aisle = req.params.name;
    if(req.session.username == "admin"){
        Basket.find({aisle:aisle}, function(err, basket){
            if (err) throw err;
            res.send(basket);
            console.log(basket);
        });
    }
    else{
        Basket.find({user_id:id, aisle:aisle}, function(err, basket){
            if (err) throw err;
            res.send(basket);
            console.log(basket);
        });
    }
};
//app.get('/history//diet/:name',History.getUserHistoryByDiet);
exports.getUserHistoryByDiet = function(req, res, next){
    var id = req.session.user_id;
    var diet = req.params.name;
    if(req.session.username == "admin"){
        Basket.find({foodgroup:diet}, function(err, basket){
            if (err) throw err;
            res.send(basket);
            console.log(basket);
        });
    }
    else{
        Basket.find({user_id:id, foodgroup:diet}, function(err, basket){
            if (err) throw err;
            res.send(basket);
            console.log(basket);
        });
    }
};