var express = require('express');
var router = express.Router();
var Comment = require('../../models/Comment');
var Post = require('../../models/Post');
// var User = require('../../models/User');
var { userAuthenticated } = require('../../helpers');
// var { encryptPassword } = require('../../helpers');


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

// router.get('/', (req, res) => {
//   var adminUser = new User({
//     email: 'nghuutho74@gmail.com',
//     firstName: 'Rhys',
//     lastName: 'Admin',
//     password: encryptPassword('123456'),
//     isAdmin: true
//   });
//   adminUser.save();
// });

module.exports = router;
