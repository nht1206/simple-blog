var express = require('express');
var router = express.Router();
var Categories = require('../../models/Category');
var Post = require('../../models/Post');
var User = require('../../models/User');
var { encryptPassword } = require('../../helpers');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


//reconfigure the default layout = home
router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'home';
  next();
});

/* GET home page. */
router.get('/search', (req, res) => {
  let keyword = req.query.keyword || '';
  Post.find({})
      .populate('user')
      .then((posts) => {
        Categories.find({}).then((categories) => {
          let list = [];
          posts.forEach((post) => {
            if (post.title.toLowerCase().search(keyword) !== -1 || post.body.toLowerCase().search(keyword) !== -1){
              list.push(post);
            }
          });
          res.render('home/search', {
            posts: list,
            categories: categories,
          });
        });
      });
});
router.get('/', (req, res) => {
  let perPage = 10;
  let page = req.query.page || 1;
  Post.find({})
      .skip(perPage*page - perPage)
      .limit(perPage)
      .populate('user')
      .then((posts) => {
    Post.count().then((postCount) => {
      Categories.find({}).then((categories) => {
        res.render('home', {
          posts: posts,
          categories: categories,
          current: parseInt(page),
          pages: Math.ceil(postCount / perPage)
        });
      });
    });
  });
});

router.get('/post/:slug', (req, res) => {
  Post.findOne({slug: req.params.slug}).populate('user').populate({path: 'comments', populate: {path: 'user', model: 'users'}}).then((post) => {
    Categories.find({}).then((categories) => {
      res.render('home/post', { post: post, categories: categories });
    });
  });
});

router.get('/about', (req, res) => {
  res.render('home/about');
});

router.get('/login', (req, res) => {
  if (req.isAuthenticated()){
    res.redirect('/');
  } else {
    res.render('home/login');
  }
});

router.get('/register', (req, res) => {
  if (req.isAuthenticated()){
    res.redirect('/');
  } else {
    res.render('home/register');
  }
});

router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/login');
});

/* POST home page */

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
  User.findOne({ email: email }, function(err, user) {
    if (err) { return done(err); }
    if (!user) {
      return done(null, false, req.flash('error_message', 'Incorrect email.'));
    }
    if (!user.validPassword(password)) {
      return done(null, false, req.flash('error_message', 'Incorrect password.'));
    }
    return done(null, user);
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/register', (req, res) => {
  console.log(req.flash());
  var newUser = new User();
  newUser.firstName = req.body.firstName;
  newUser.lastName = req.body.lastName;
  User.findOne({email: req.body.email}).then((user) => {
    if (user) {
      req.flash('error_message', 'Email is exist already');
      res.redirect('/register');
    } else {
      newUser.email = req.body.email;
      if ( req.body.password === req.body.passwordConfirm ){
        newUser.password = encryptPassword(req.body.password);
        newUser.save().then((data) => {
          req.flash('success_message', 'You have registered successfully. Please login');
          res.redirect('/login');
        }).catch((err) => {
          req.flash('errors', err);
          res.redirect('/register');
        })
      } else {
        req.flash('error_message', 'Password fields do not match');
        res.redirect('/register');
      }
    }
  });
});

module.exports = router;
