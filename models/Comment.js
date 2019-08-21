var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Comment = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    postId: {
        type: String,
        require: true
    },
    status: {
        type: Boolean,
        default: true
    },
    content: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('comments', Comment);