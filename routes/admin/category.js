var express = require('express');
var router = express.Router();
var Category = require('../../models/Category');

//reconfigure the default layout = admin
router.get('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

/* GET category listing. */

router.get('/', (req, res) => {
    Category.find({}).then((categories) => {
        res.render('admin/categories', {categories: categories});
    });
});

router.get('/edit/:id', (req, res) => {
    Category.findOne({_id: req.params.id}).then((category) => {
        res.render('admin/categories/edit', { category: category });
    });
});

/* POST category page listing */

router.post('/',(req, res) => {
    var newCategory = new Category();
    newCategory.name = req.body.name;
    newCategory.save().then((data) => {
        req.flash('success_message', ` Category ${data.name} was created`);
        res.redirect('/admin/categories');
    }).catch((err) => {
        req.flash('errors', err);
        console.log(err);
        res.redirect('/admin/categories');
    });
});

/* PUT category listing*/

router.put('/',(req, res) => {
    Category.findOne({_id: req.body.id}).then((category) => {
        category.name = req.body.name;
        category.save().then((category) => {
            req.flash('success_message', `Category ${category.name} was updated`);
            res.redirect('/admin/categories');
        }).catch((err) => {
            req.flash('errors', err);
            res.redirect('/admin/categories');
        });
    });
});


/*DELETE category listing*/

router.delete('/',(req, res) => {
    Category.deleteOne({_id: req.body.id}).then(() => {
        req.flash('success_message', 'Category was deleted');
        res.redirect('/admin/categories');
    }).catch((err) => {
        req.flash('errors', err);
        res.redirect('/admin/categories');
    });
});

module.exports = router;
