var express = require('express');
var router = express.Router();
var Post = require('../../models/Post');
var Categories = require('../../models/Category');
var faker = require('faker');
var fs = require('fs');


router.get('/', (req, res) => {
    Post.find({}).populate('category').then((posts) => {
        res.render('admin/posts', { posts: posts });
    });
});

router.get('/create', (req, res) => {
    Categories.find({}).then((categories) => {
        res.render('admin/posts/create', {categories: categories});
    });
});

router.get('/edit/:id', (req, res) => {
    Post.findOne({_id: req.params.id}).then((post) => {
        Categories.find({}).then((categories) => {
            res.render('admin/posts/edit', {categories: categories, post: post});
        });
    });
});


/* POST post page listing */

router.post('/generate-fake-posts',(req, res) => {
    for (let i = 0; i < req.body.amount; i++) {
        const newPost = new Post();
        newPost.user = req.user.id;
        newPost.title = faker.name.title();
        newPost.slug = faker.name.title();
        newPost.image = 'default.jpg';
        newPost.allowComments = faker.random.boolean();
        newPost.status = 'public';
        newPost.body = faker.lorem.sentence();
        newPost.save();
    }
    req.flash('success_message', `${req.body.amount} fake posts were created`);
    res.redirect('/admin/posts');
});

router.post('/', (req, res) => {
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
    newPost.user = req.user.id;
    if (req.body.allowComments)
        allowComments = true;
    else
        allowComments = false;
    newPost.image = fileName;
    newPost.title = req.body.title;
    newPost.status = req.body.status;
    newPost.allowComments = allowComments;
    newPost.body = req.body.body;
    newPost.category = req.body.category;

    newPost.save().then((post) => {
        req.flash('success_message', `Post ${ post.title } was created`);
        res.redirect('/admin/posts');
    }).catch((err) => {
        req.flash('errors', err);
        res.redirect('/admin/posts/create');
    });

});

/* PUT post listing*/

router.put('/', (req, res) => {
    Post.findOne({_id: req.body.id}).then((post) => {
        var fileName = post.image;
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
        post.category = req.body.category;
        post.save().then((updatedPost) => {
            req.flash('success_message', `Post ${updatedPost.id} was updated`);
            res.redirect('/admin/posts');
        }).catch((err) => {
            req.flash('errors', err);
            res.redirect('/admin/posts/edit/' + post.id);
        });
    });
});

router.put('/allowComments', (req, res) => {
    Post.findOne({_id: req.body.id}).then((post) => {
        post.allowComments = req.body.allowCommentsUpdate;
        post.save().then((post) => {
            res.send(post.toJSON());
        });
    });
});


/*DELETE post listing*/

router.delete('/', (req, res) => {
    Post.findOne({_id: req.body.id}).populate('comments').then((post) => {
        post.comments.forEach((comment) => {
            comment.remove();
        });
        post.remove().then((post) => {
            if (post.image !== 'default.jpg'){
                fs.unlinkSync('./public/uploads/' + post.image);
            }
            req.flash('success_message', `Post ${req.body.id} was deleted`);
            res.redirect('/admin/posts');
        }).catch((err) => {
            req.flash('errors', err.errors);
            res.redirect('/admin/posts');
        });
    });
});

module.exports = router;
