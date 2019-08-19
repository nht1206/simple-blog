var express = require('express');
var router = express.Router()
var Post = require('../models/Post');
// var faker = require('faker');


//reconfigure the default layout = admin
router.get('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

/* GET admin listing. */
router.get('/', function(req, res, next) {
    // for (let i = 0; i < 5; i++) {
    //     const newPost = new Post();
    //     newPost.title = faker.name.title();
    //     newPost.image = 'default.jpg';
    //     newPost.allowComments = faker.random.boolean();
    //     newPost.status = 'public';
    //     newPost.body = faker.lorem.sentence();
    //     newPost.save();
    // }
    res.render('admin');
});

router.get('/posts', (req, res) => {
    console.log(req.flash());
    Post.find({}).then((posts) => {
        res.render('admin/posts', {posts: posts});
    });
});

router.get('/my-posts', (req, res) => {
    res.render('admin/posts/my-posts');
});

router.get('/posts/create', (req, res) => {
    res.render('admin/posts/create');
});


router.get('/comments', (req, res) => {
    res.render('admin/comments');
});

router.get('/categories', (req, res) => {
    res.render('admin/categories');
});

router.get('/posts/edit/:id', (req, res) => {

    Post.findOne({_id: req.params.id}).then((post) => {
        res.render('admin/posts/edit', {post: post});
    });
});


/* POST admin page listing */

router.post('/posts', (req, res) => {
    var fileName = 'default.jpg';
    var allowComments;
    if (req.files) {
        const { file } = req.files;
        fileName = Date.now() + '-' + file.name;
        file.mv('./public/uploads/' + fileName, (err) => {
            if (err) throw err;
        });
    }
    var newPost =  new Post();
    if (req.body.allowComments)
        allowComments = true;
    else
        allowComments = false;
    newPost.image = fileName;
    newPost.title = req.body.title;
    newPost.status = req.body.status;
    newPost.allowComments = allowComments;
    newPost.body = req.body.body;

    newPost.save().then((post) => {
        res.redirect('/admin/posts');
    }).catch((err) => {
        res.render('admin/posts/create', { errors: err.errors});
    });

});

/* PUT admin listing*/

router.put('/posts', (req, res) => {
    Post.findOne({_id: req.body.id}).then((post) => {
        var fileName = 'default.jpg';
        if (req.files) {
            const { file } = req.files;
            fileName = Date.now() + '-' + file.name;
            file.mv('./public/uploads/' + fileName, (err) => {
                if (err) throw err;
            });
        }
        post.title = req.body.title;
        if (req.body.allowComments)
            post.allowComments = true;
        else
            post.allowComments = false;
        post.image = fileName;
        post.status = req.body.status;
        post.body = req.body.body;
        post.save().then((updatedPost) => {
            res.redirect('/admin/posts');
        }).catch((err) => {
            req.flash('errors', 'sadasdasd');
            res.redirect('/admin/posts');
        });
    });
});


/*DELETE admin listing*/

router.delete('/posts', (req, res) => {
    Post.deleteOne({_id: req.body.id}).then(() => {
        res.redirect('/admin/posts');
    }).catch((err) => {
        throw err;
    });
});



module.exports = router;
