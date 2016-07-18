"use strict";
var domDo = require('../spiderDom/dom');

module.exports = {
    'index': (req, res, next) => {
        res.render('article/getarticle', {
            title: '采集首页'
        });
    },
    'geturls|post': domDo.tomUrls,
    'getdom|post': (req, res, next) => {
        var url = req.body.url || '';
    }
};
