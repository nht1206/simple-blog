var express = require('express');
var router = express.Router();
var { adminAuthenticated } = require('../../helpers');
var Post = require('../../models/Post');
var Category = require('../../models/Category');
var Comment = require('../../models/Comment');

//reconfigure the default layout = admin
router.all('/*',adminAuthenticated ,(req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

/* GET admin listing. */
router.get('/',  async function(req, res, next) {
    var promiseStack = [];
    var postCount = await Post.count();
    var commentCount = await Comment.count();
    var categoryCount = await Category.count();
    promiseStack.push(postCount);
    promiseStack.push(commentCount);
    promiseStack.push(categoryCount);
    Promise.all(promiseStack).then((results) => {
        res.render('admin', {postCount: results[0], commentCount: results[1], categoryCount: results[2]});
    });


});

router.get('/myposts', (req, res) => {
    let perPage = 10;
    let page = req.query.page || 1;
    Post.find({user: req.user.id})
        .skip(perPage*page - perPage)
        .limit(perPage)
        .populate('category')
        .then((posts) => {
            Post.count().then((postCount) => {
                res.render('admin/posts/my-posts', {
                    posts: posts,
                    current: parseInt(page),
                    pages: Math.ceil(postCount / perPage)
                });
            });
        });
});



/* POST admin page listing */

/* PUT admin listing*/




/*DELETE admin listing*/


module.exports = router;
