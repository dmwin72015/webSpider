const _ = require('lodash');
const async = require('async');
const fs = require('fs');
const sagent = require('superagent');
const path = require('path');
const cheerio = require('cheerio');

const agent = require('../common/myAgent');
const TIPS_INFO = require('../../config/error_info');
const io = require('../common/socket_IO')(9999);

var arrImg = [];

// 获取图片地址
function getImgUrl(req, res, next) {
    var url = req.body.url || '';
    if (!url) {
        res.send({
            code: '101',
            message: TIPS_INFO['101'],
            info: {
                data: null,
                error: TIPS_INFO['101']
            }
        });
    }
    agent.getDom(url).then(($) => {
        $('ul.ali img').each((i, e) => {
            arrImg.push($(e).attr('src'));
        });
        res.send({
            code: '100',
            message: TIPS_INFO['100'],
            info: {
                data: arrImg,
                error: null
            }
        });
    }).catch((err) => {
        res.send({
            code: '103',
            message: TIPS_INFO['103'],
            info: {
                data: null,
                error: err.stack
            }
        });
    });
    return;
}

// 抓取图片
function downloadAll(socket, urls, limit, cb) {
    async.mapLimit(urls, 15, (url, cb) => {
        sagent.get(url).end((err, res) => {
            if (err) throw err;
            console.log(res);
        });
    }, (err, res) => {
        if (err) {
            throw err;
        }
        socket.emit('save img result', res);
    });
}

function downloadImg(socket, url) {
    console.log('图片地址:' + url);
    var fileName = 'public/images/' + new Date().getTime() + path.extname(url);
    var imgSrc = '/images/' + new Date().getTime() + path.extname(url);
    // var stream = fs.createWriteStream();
    sagent.get(url).end((err, res) => {
        if (err) {
            console.log(err);
        }
        fs.writeFile(fileName, res.body, {
            encoding: 'binary'
        }, (err, res) => {
            if (!err) {
                socket.emit('save img result', {
                    code: '100',
                    message: 'success',
                    info: {
                        url: imgSrc,
                        error: null
                    }
                });
            }
        })
    });
}

// 批量获取
function getLargeUrls(req, res, next) {
    var nTotle = 90;
    var baseUrl = "http://www.ivsky.com";
    var pageBaseUrl = "http://www.ivsky.com/tupian/dongwutupian/index_{$pageNum$}.html";
    var arrUrls = []; //存放链接
    var cheerOpts = {
        ignoreWhitespace: true,
        xmlMode: true,
        decodeEntities: false //禁止中文转成unicode，主要出现在html()方法的时候，一些title、alt
    };

    for (var i = 1; i < nTotle + 1; i++) {
        arrUrls.push(pageBaseUrl.replace(/\{\$pageNum\$\}/, i));
    }

    var everyPageData = []; //存放每个页面中的二级链接和页面中图片

    async.mapLimit(arrUrls, 15, (url, cb) => {
        var startTime = new Date().getTime();
        sagent.get(url).end((err, res) => {
            if (err) {
                cb(null, err);
                return;
            }
            var resultTime = new Date().getTime();
            var sHtml = res.text.trim();
            if (!sHtml) {
                console.log('空的内容');
                return;
            }
            var $ = cheerio.load(sHtml, cheerOpts);
            var pageUrls = [];
            var imgUrls = [];
            $('ul.ali div.il_img').each((i, ele) => {
                var pageHref = $(ele).find('a').attr('href');
                var imgSrc = $(ele).find('img').attr('src');
                if (pageHref.charAt(0) == '/') {
                    pageUrls.push(baseUrl + pageHref);
                } else {
                    pageUrls.push(path.dirname(url) + '/' + pageHref);
                }
                imgUrls.push($(ele).find('img').attr('src'));
            });
            var lastEndTime = new Date().getTime();

            everyPageData.push({
                src: url,
                link: pageUrls,
                img: imgUrls,
                time: lastEndTime - startTime
            });

            cb(null, lastEndTime - startTime);
        });
    }, (err, result) => {
        if (err) {
            throw err;
        }
        // console.log(result);
        console.log('执行完了');
        res.send({
            data: everyPageData,
            time: result
        });
    });
}

// socket操作
io.on('connection', (socket) => {
    // [监听]  保存图片事件
    socket.on('save img to server', (url, flag) => {
        if (flag) {
            downloadAll(socket, url, 15);
        } else {
            downloadImg(socket, url);
        }
    });
});


module.exports = {
    getImg: getLargeUrls
}
