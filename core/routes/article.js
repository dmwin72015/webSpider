var express = require('express');var router = express.Router();/* GET home page. */router.get('/', (req, res, next) => {    'use strict';    res.render('article/getarticle', {        title: '获取文章'    });});//获取页面中文章的url的借口,返回获取到的所有的文章连接router.post('/ruanyf', (req, res, next) => {    'use strict';    var url = req.body.url;    if (!url) {        res.send({'errCode':0,'msg':'请传入一个有效的url地址'}).end();    } else {        pach.getryf(url, (data) => {            res.send(data);        });    }    return;});module.exports = router;