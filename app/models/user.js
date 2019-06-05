const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define model
const userSchema = new Schema({
    username: { type: String, unique: true, lowercase: true },
    user_id: Number,
    password: String
},{collection:'user'});
// Export the model
module.exports = mongoose.model('user', userSchema, 'user');