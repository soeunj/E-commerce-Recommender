const Basket  = require('../models/basket');
const request = require('request');

exports.getDietAnalysis = function(req, res, next){
    var id = req.session.user_id;
    Basket.aggregate([{$match:{user_id:Number(id)}},{$group:{_id:"$foodgroup", count:{$sum:1}}}], function(err, basket){
        if (err) throw err;
        var data = [], label = [], list_group =[];
        var sum_num = 0;
        var deficiency = {};
        var foodgroup = {'carbohydrates':38, 'fat':1, 'proteins':12, 'vegetables and fruits':40, 'diary products and alternatives':8};
        for(let i=0; i<basket.length; i++){
            if(basket[i]._id != "others"){
                data.push(basket[i].count);
                label.push(basket[i]._id);
                sum_num = sum_num + basket[i].count;
                list_group.push(basket[i]._id);
            }
        }
        for(let i=0; i<basket.length; i++){
            var percentage = basket[i].count/sum_num*100;
            if(basket[i]._id == 'carbohydrates' && percentage < 38){
                deficiency['carbohydrates'] = 38-percentage;
            }
            else if(basket[i]._id == 'fat' && percentage < 1){
                deficiency['fat']=1-percentage;
            }
            else if(basket[i]._id == 'proteins' && percentage < 12){
                deficiency['proteins']= 12-percentage;
            }
            else if(basket[i]._id == 'vegetables and fruits' && percentage < 40){
                deficiency['vegetables and fruits']=40-percentage;
            }
            else if(basket[i]._id == 'diary products and alternatives' && percentage < 8){
                deficiency['diary products and alternatives']=8-percentage;
            }
        }
        for(var key in foodgroup){
            if(list_group.indexOf(key) == -1) {
                deficiency[key] = foodgroup[key];
            }       
         }
        var sortable = [];
        for (var k in deficiency) {
            sortable.push([k, deficiency[k]]);
        }

        sortable.sort(function(a, b) {
        return a[1] - b[1];
        });
        
        var order_odw = [], order_hour_of_day = [], reorder_department = [];
        request('http://localhost:5000/analysis/'+String(id)+'/order_dow/_id', { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            order_odw = body;
        });

        request('http://localhost:5000/analysis/'+String(id)+'/order_hour_of_day/_id', { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            order_hour_of_day = body;
        });

        request('http://localhost:5000/analysis/reorder_department/'+String(id), { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            reorder_department = body;
        });

        request('http://localhost:5000/analysis/reorder_aisle/'+String(id), { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            reorder_aisle = body;
        });

        request('http://localhost:5000/analysis/reorder_diet/'+String(id)+'/diet', { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            reorder_diet = body;
        });
        res.render('diet',{ username: req.session.username, data: data, label: label, deficiency: sortable, order_odw: order_odw['data'], order_hour_of_day:order_hour_of_day['data'], reorder_department: reorder_department['data'], reorder_department_l: reorder_department['label'], reorder_aisle: reorder_aisle['data'], reorder_aisle_l: reorder_aisle['label'], reorder_diet: reorder_diet['data'],  reorder_diet_l: reorder_diet['label']});
    });
};

//app.get('/dietanalysis/:id/:name', DietAnalysis.getListOfProductByDiet);
exports.getListOfProductByDiet = function(req, res, next){
    var id = req.session.user_id;
    var name = req.params.name;
    Basket.aggregate([{$match:{user_id:Number(id), foodgroup:name}}], function(err, basket){
        if (err) throw err;
        res.send(basket);
        console.log(basket);
    });
};