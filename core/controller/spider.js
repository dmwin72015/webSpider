"use strict";
var domDao = require('../spiderDom/dom');

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
        res.render('article/getarticle', {
            title: '采集美女图片'
        });
    }
};
