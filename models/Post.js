var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Slug = require('mongoose-url-slugs');

var Post = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    title: {
        type: String,
        require: true,
        default: '',
        minlength: 10
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'categories'
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
    },
    slug: {
        type: String,
        default: '',
        trim: true
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comments'
    }]
}, {usePushEach: true});

Post.plugin(Slug('title', {field: 'slug'}));

module.exports = mongoose.model('posts', Post);