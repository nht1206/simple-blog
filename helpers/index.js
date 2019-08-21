const moment = require('moment');
var bcrypt = require('bcryptjs');
module.exports = {
    select: function(value, options) {
        return options.fn(this)
            .split('\n')
            .map(function(v) {
                var t = 'value="' + value + '"'
                return ! RegExp(t).test(v) ? v : v.replace(t, t + ' selected="selected"')
            })
            .join('\n')
    },
    ConvertTime: function (date, format) {
        return moment(date).format(format);
    },
    encryptPassword: (password) => {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);
        return hash;
    },
    userAuthenticated: (req, res, next) => {
        if (req.isAuthenticated())
            return next();
        res.redirect('/login');
    },
    adminAuthenticated: (req, res, next) => {
        if (req.isAuthenticated() && req.user.isAdmin)
            return next();
        res.redirect('/');
    }
};