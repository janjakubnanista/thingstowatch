'use strict';

var cheerio = require('cheerio');

module.exports = function(hbs) {
    hbs.registerHelper('smart-excerpt', function() {
        var html = String(this.html),
            $ = cheerio.load(html),
            paragraph = $('p');

        return new hbs.handlebars.SafeString(paragraph.html());
    });
};
