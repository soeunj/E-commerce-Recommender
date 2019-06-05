const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Recommendation = new Schema({
    user_id: Number,
    recommendations: Object
},{collection:'recommendation'});

module.exports = mongoose.model('recommendation', Recommendation, 'recommendation');
