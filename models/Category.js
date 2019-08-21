var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Category = new Schema({
    name: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('categories', Category);