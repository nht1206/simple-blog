var express = require('express');
var router = express.Router();
var Post = require('../../models/Post');

//reconfigure the default layout = home
router.get('/', (req, res, next) => {
  req.app.locals.layout = 'home';
  next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  Post.find({}).then((posts) => {
    res.render('home', {posts: posts});
  });
});

router.get('/post/:id', (req, res) => {
  Post.findOne({_id: req.params.id}).then((post) => {
    res.render('home/post', { post: post });
  });
});

router.get('/about', (req, res) => {
  res.render('home/about');
});

router.get('/about', (req, res) => {
  res.render('home/about');
});

router.get('/login', (req, res) => {
  res.render('home/login');
});

router.get('/register', (req, res) => {
  res.render('home/register');
});

/* POST home page */

router.post('/login', (req, res) => {

});

module.exports = router;
