var mongoose = require('mongoose');
var Schelma = mongoose.Schema;

var User = new Schelma({
    username: {
        require: true,
        type: String,
        minlength: 6
    },
    password: {
        require: true,
        type: String,
        minlength: 6
    }
});

module.exports = mongoose.model('users', User);