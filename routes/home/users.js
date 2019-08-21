var express = require('express');
var router = express.Router();
var Comment = require('../../models/Comment');
var Post = require('../../models/Post');
var { userAuthenticated } = require('../../helpers');


router.post('/*', userAuthenticated);

/* POST users listing. */

router.post('/comments', (req, res) => {
  Post.findOne({_id: req.body.postId}).then((post) => {
    var newComment = new Comment({
      postId: req.body.postId,
      user: req.user.id,
      content: req.body.content
    });
    post.comments.push(newComment);
    post.save().then((post) => {
      newComment.save().then((comment) => {
        res.redirect('/post/' + post.id);
      });
    }).catch((err) => {
      throw err;
    });
  });
});

module.exports = router;
