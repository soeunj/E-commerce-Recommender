const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Group = new Schema({
    _id: String,
    count: Number
},{collection:'basket'});

module.exports = mongoose.model('group', Group, 'basket');
