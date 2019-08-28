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
    },
    paginate: function(options){
        let output = '';
        if(options.hash.current === 1){
            output += `<li class="page-item disabled"><a class="page-link">First</a></li>`;
        } else {
            output += `<li class="page-item"><a href="?page=1" class="page-link">First</a></li>`;
        }
        let i = (Number(options.hash.current) > 5 ? Number(options.hash.current) - 4 : 1);
        if(i !== 1){
            output += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
        }
        for(; i <= (Number(options.hash.current) + 4) && i <= options.hash.pages; i++){
            if(i === options.hash.current){
                output += `<li class="page-item active"><a class="page-link">${i}</a></li>`;
            } else {
                output += `<li class="page-item "><a href="?page=${i}" class="page-link">${i}</a></li>`;
            }

            if(i === Number(options.hash.current) + 4 && i < options.hash.pages){
                output += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
            }
        }
        if(options.hash.current === options.hash.pages) {
            output += `<li class="page-item disabled"><a class="page-link">Last</a></li>`;
        } else {
            output += `<li class="page-item "><a href="?page=${options.hash.pages}" class="page-link">Last</a></li>`;
        }
        return output;
    }
};