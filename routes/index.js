var express = require('express');
var router = express.Router();
var util = require('util');
const pach = require('../model/article');
const CONFIG = {
    url: "http://huaban.com"
};

/* GET home page. */
router.get('/', (req, res, next)=> {
    // res.end(JSON.stringify(process.env));
    // var url = CONFIG.url;
    // pach.getDom(url, ($)=> {
    //     $('link[href]').each(function (i,e) {
    //         var sOldHref = $(e).attr('href');
    //         $(e).attr('href',url+sOldHref);
    //     });
    //     $('script[src]').each(function (i,e) {
    //         var sOldScr = $(e).attr('src');
    //         $(e).attr('src',url+sOldScr);
    //     })
    //     res.send($.html());
    // });
    res.render('article/imglist',{
        title:'获取.....'
    });
    // res.render('index', { title: 'Express' });
}).get('/hello', (req, res, next) => {
//    TODO

}).get('/img', (req, res, next) => {
    var url ="http://www.360doc.com/content/10/1210/10/4850390_76686018.shtml";
    pach.getImg(url, (arr)=> {
        console.log(arr.length);
        res.render('article/imglist',{
            imgs:arr
        })
    });

}).get('/article', (req, res, next)=> {
    var url = "http://www.cnblogs.com/wengxuesong/p/5589854.html";
    pach.getDom(url, ($)=> {
        var title = $('#topics h1.postTitle').text();
        var subTitle = $('#wxs-h-1').text();
        var sContent = $('#cnblogs_post_body').html();

        res.render('article/article_detail',{
            title:title,
            art_title:title,
            art_subTitle:subTitle,
            art_content:sContent

        });
    });
});

module.exports = router;
