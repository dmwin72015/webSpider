var _ = require('lodash');
var agent = require('../common/myAgent');
var io = require('../common/socket_IO')('9999');

var defaultUrl = 'http://www.cnblogs.com/rubylouvre/default.html?page=1';

function getUrl(url) {
    "use strict";
    url = url || defaultUrl;
    var arrHrefs = [];
    agent.getDom(url).then((dom) => {
        var $ = dom;
        var $art_title = $('#main').find('div.post');
        $art_title.each((index, ele) => {
            var that = $(this);
            var sHref = that.find('h2>a').attr('href');
            var sTitle = that.find('h2>a').text();
            var sSummary = that.find('div.c_b_p_desc').text();
            arrHrefs.push({
                title: sTitle,
                href: sHref
            });
        });
        return arrHrefs;
        
    }).catch((err) => {
        console.error('faile');
        return
    });
}


function getSingleDom(url) {


}



module.exports = {};
