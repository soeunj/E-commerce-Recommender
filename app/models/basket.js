const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Basket = new Schema({
    _id: String,
    count: Number,
    order_id: Number,
    product_id: Number,
    add_to_cart_order: Number,
    reordered: Number,
    product_name: String,
    aisle_id: Number,
    department_id: Number,
    department: String,
    aisle: String,
    hi_dem: Number,
    user_id: Number,
    order_number: Number,
    order_dow: Number,
    order_hour_of_day: Number,
    days_since_prior_order: Number,
    foodgroup: String
},{collection:'analysis'});

module.exports = mongoose.model('basket', Basket, 'analysis');
