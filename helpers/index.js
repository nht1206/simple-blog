const moment = require('moment');
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
    }
};