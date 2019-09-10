const Basket = require('../models/basket');
const request = require('request');
const fetch = require('node-fetch');

exports.getDietAnalysis = async function (req, res, next) {
    var id = req.session.user_id;
    try {
        var data = await Promise.all([
            fetch('http://localhost:5000/diet/' + String(id)).then((response) => response.json()),
            fetch('http://localhost:5000/analysis/order_dow/' + String(id)).then((response) => response.json()),
            fetch('http://localhost:5000/analysis/order_hour_of_day/' + String(id)).then((response) => response.json()),
            fetch('http://localhost:5000/analysis/reorder_department/' + String(id)).then((response) => response.json()),
            fetch('http://localhost:5000/analysis/reorder_aisle/' + String(id)).then((response) => response.json()),
            fetch('http://localhost:5000/analysis/reorder_diet/' + String(id)).then((response) => response.json())
        ]);
        var deficiency = calDdeficiency(data[0]);
        res.render('diet', {
            username: req.session.username, diet: data[0]['data'], diet_l: data[0]['label'], deficiency: deficiency,
            order_odw: data[1]['data'], order_hour_of_day: data[2]['data'], reorder_department: data[3]['data'], reorder_department_l: data[3]['label'], reorder_aisle: data[4]['data'], reorder_aisle_l: data[4]['label'], reorder_diet: data[5]['data'], reorder_diet_l: data[5]['label']
        });
    } catch (error) {
        console.log(error);
    }
};

function calDdeficiency(data) {
    var list_of_nutrition = ['carbohydrates', 'fat', 'proteins', 'vegetables and fruits', 'diary products and alternatives'];
    var nutritions = {};
    var diet_data = data['data'], diet_label = data['label'];
    var sum = 0;
    console.log(data);
    for(let i=0; i<list_of_nutrition.length; i++){
        if(diet_label.indexOf(list_of_nutrition[i]) == -1) {
            nutritions[list_of_nutrition[i]] = -1;
        }
    }
    console.log(nutritions);
    for(let i=0 ;i<diet_label.length; i++){
        if(list_of_nutrition.indexOf(diet_label[i]) != -1){
            sum += diet_data[i];
        }
    }
    for (let i = 0; i < diet_data.length; i++) {
        if(list_of_nutrition.indexOf(diet_label[i]) == -1){
            continue;
        }
        var percentage = diet_data[i] / sum * 100.0;
        if (diet_label[i] == 'carbohydrates' && percentage < 38) {
            nutritions['carbohydrates'] = 38.0 - percentage;
        }
        else if (diet_label[i] == 'fat' && percentage < 1) {
            nutritions['fat'] = 1.0 - percentage;
        }
        else if (diet_label[i] == 'proteins' && percentage < 12) {
            nutritions['proteins'] = 12.0 - percentage;
        }
        else if (diet_label[i] == 'vegetables and fruits' && percentage < 40) {
            nutritions['vegetables and fruits'] = 40.0 - percentage;
        }
        else if (diet_label[i] == 'diary products and alternatives' && percentage < 8) {
            nutritions['diary products and alternatives'] = 8.0 - percentage;
        }
    }
    var sortable = [];
    for (var k in nutritions) {
        sortable.push([String(k), nutritions[k]]);
    }

    sortable.sort(function (a, b) {
        return a[1] - b[1];
    });

    deficiency = [];
    for(let i=0; i<sortable.length; i++){
        deficiency.push(sortable[i][0]);
    }
    console.log(deficiency);
    return deficiency;
}