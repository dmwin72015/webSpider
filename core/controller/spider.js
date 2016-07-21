"use strict";
var domDao = require('../spiderDom/dom');
var girlDao = require('../spiderDom/girls');
module.exports = {
    'index': (req, res, next) => {
        res.render('article/getarticle', {
            title: '采集首页'
        });
    },
    'geturls|post': domDao.getUrls,
    'getdom|post': (req, res, next) => {
        var url = req.body.url || '';
    },
    'getgirls': (req, res, next) => {
        res.render('article/getGirls', {
            title: '采集美女图片'
        });
    },
    'getgirlsimg|post': girlDao.getImg
};
