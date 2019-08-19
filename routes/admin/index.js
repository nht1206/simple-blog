var express = require('express');
var router = express.Router();

//reconfigure the default layout = admin
router.get('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

/* GET admin listing. */
router.get('/', function(req, res, next) {
    res.render('admin');
});

router.get('/comments', (req, res) => {
    res.render('admin/comments');
});



/* POST admin page listing */

/* PUT admin listing*/




/*DELETE admin listing*/


module.exports = router;
