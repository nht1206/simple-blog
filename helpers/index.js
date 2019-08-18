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
    isEmpty: function (obj) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
    }
};