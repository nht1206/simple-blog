var mongoose = require('mongoose');
var Schelma = mongoose.Schema;

var Post = new Schelma({
    user: {},
    title: {
        type: String,
        require: true,
        minlength: 10
    },
    image: {
        type:String,
    },
    status: {
        type: String,
        default: 'public'
    },
    allowComments: {
        type: Boolean,
        require: true
    },
    body: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('posts', Post);