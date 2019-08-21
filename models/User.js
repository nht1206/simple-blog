var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

var User = new Schema({
    firstName: {
        require: true,
        type: String,
        minlength: 2
    },
    lastName: {
        require: true,
        type: String,
        minlength: 2
    },
    email: {
        require: true,
        type: String,
        minlength: 5
    },
    password: {
        require: true,
        type: String,
        minlength: 6
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

User.methods.validPassword = function(pass){
    if (bcrypt.compareSync(pass, this.password))
        return true;
    return false;
};

module.exports = mongoose.model('users', User);