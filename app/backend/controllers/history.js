const Basket  = require('../models/basket');
const Group  = require('../models/group');

exports.getHistory = function(req, res, next){
    var id = req.params.id;
    Basket.find({user_id:id}, function(err, basket){
        if (err) throw err;
        res.send(basket);
        console.log(basket);
    });
};

//app.get('/history/:id/department', History.getDepartmentHistoryByUser);
exports.getDepartmentHistoryByUser = function(req, res, next){
    var id = req.params.id;
    if(id == "admin"){
        Basket.aggregate([{$group:{_id:"$department", count:{$sum:1}}}], function(err, basket){
            if (err) throw err;
            res.send(basket);
            console.log(basket);
        });
    }
    else{
        Basket.aggregate([{$match:{user_id:Number(id)}},{$group:{_id:"$department", count:{$sum:1}}}], function(err, basket){
            if (err) throw err;
            res.send(basket);
            console.log(basket);
        });
    }
};
//app.get('/history/:id/aisle', History.getAisleHistoryByUser);
exports.getAisleHistoryByUser = function(req, res, next){
    var id = req.params.id;
    if(id == "admin"){
        Basket.aggregate([{$group:{_id:"$aisle", count:{$sum:1}}}], function(err, basket){
            if (err) throw err;
            res.send(basket);
            console.log(basket);
        });
    }
    else{
        Basket.aggregate([{$match:{user_id:Number(id)}},{$group:{_id:"$aisle", count:{$sum:1}}}], function(err, basket){
            if (err) throw err;
            res.send(basket);
            console.log(basket);
        });
    }
};
//app.get('/history/:id/diet',History.getDietHistoryByUser);
exports.getDietHistoryByUser = function(req, res, next){
    var id = req.params.id;
    if(id == "admin"){
        Basket.aggregate([{$group:{_id:"$foodgroup", count:{$sum:1}}}], function(err, basket){
            if (err) throw err;
            res.send(basket);
            console.log(basket);
        });
    }
    else{
        Basket.aggregate([{$match:{user_id:Number(id)}},{$group:{_id:"$foodgroup", count:{$sum:1}}}], function(err, basket){
            if (err) throw err;
            res.send(basket);
            console.log(basket);
        });
    }
};

//app.get('/history/:id/department/:name', History.getUserHistoryByDepartment);
exports.getUserHistoryByDepartment = function(req, res, next){
    var id = req.params.id;
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
//app.get('/history/:id/aisle/:name', History.getUserHistoryByAisle);
exports.getUserHistoryByAisle = function(req, res, next){
    var id = req.params.id;
    var aisle = req.params.name;
    if(id == "admin"){
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
//app.get('/history/:id/diet/:name',History.getUserHistoryByDiet);
exports.getUserHistoryByDiet = function(req, res, next){
    var id = req.params.id;
    var diet = req.params.name;
    if(id == "admin"){
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