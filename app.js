var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var uploadFile = require('express-fileupload');
var flash = require('connect-flash');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');

var indexRouter = require('./routes/home');
var userRouter = require('./routes/home/users');
var adminRouter = require('./routes/admin');
var commentsRouter = require('./routes/admin/comment');
var postRouter = require('./routes/admin/post');
var categoryRouter = require('./routes/admin/category');

const { select, ConvertTime, paginate } = require('./helpers');

var app = express();



//get url connection for mongodb

var { urlConnection } = require('./configs/database');

//connect to the database
mongoose.connect(urlConnection, { useNewUrlParser: true, useCreateIndex: true }).then((db) => {
    console.log('Connected to database.');
}).catch((err) => {
    console.log('could not connect to database.');
});


//register a handlebars
app.engine('handlebars', hbs({ defaultLayout: 'home', helpers: {
        selects: select,
        ConvertTime: ConvertTime,
        paginate: paginate
}}));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));




//express upload middleware

app.use(uploadFile());

//add method override middleware

app.use(methodOverride((req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

app.use(cookieParser());
app.use(session({
    secret: 'rhys---x',
    resave: false,
    saveUninitialized: true,
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.errors = req.flash('errors');
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    next();
});

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/admin/posts', postRouter);
app.use('/admin/categories', categoryRouter);
app.use('/admin/comments', commentsRouter);

module.exports = app;
