var mongoose = require('mongoose');
var Schelma = mongoose.Schema;

var Category = new Schelma({
    name: {
        type: String,
        require: true,
        minlength: 5
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('categories', Category);