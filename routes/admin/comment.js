var express = require('express');
var router = express.Router();
var Comment = require('../../models/Comment');
var Post = require('../../models/Post');

/* GET comment listing. */

router.get('/', (req, res) => {
    Comment.find({}).populate('user').then((comments) => {
        res.render('admin/comments', {comments: comments});
    });
});

/* POST comment page listing */


/* PUT comment listing*/

router.put('/', (req, res) => {
    Comment.findOne({_id: req.body.id}).then((comment) => {
        comment.status = req.body.approveComment;
        comment.save().then((comment) => {
            res.send(comment);
        });
    });
});

/*DELETE comment listing*/

router.delete('/', (req, res) => {
    Post.findOne({_id: req.body.postId}).populate('comments').then((post) => {
        post.comments.forEach((comment) => {
            if (comment.id === req.body.id){
                comment.remove();
                req.flash('success_message', 'Comments was deleted');
                res.redirect('/admin/comments');
            }
        });
    });
});

module.exports = router;
