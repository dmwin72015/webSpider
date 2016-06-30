/**
 * Created by yxp on 2016/6/23.
 */
const URL = require('url');

const agent = require('../util/myAgent');
const query = require('../util/mysql_connect')['query'];
const myEmit = require('../util/myEmitter')['emitter'];
const addEvent = require('../util/myEmitter').addEvent;

const options = {
    charset: 'gb2312'
};
const keys = ['mov_cnName', 'mov_enName', 'mov_year', 'mov_country', 'mov_type', 'mov_language', 'mov_subtitles', 'mov_IMDb', 'mov_fileType', 'mov_fileResolution', 'mov_fileSize', 'mov_showTime', 'mov_director', 'mov_leadActor', 'mov_summary', 'mov_downloadUrl', 'mov_srcUrl', 'mov_poster', 'mov_stills', 'create_date'];
/**
 * movie构造函数
 * @constructor
 * @param {Array} arr - 传入一个包含与key(按照数据库中字段构成的一个数组)相对应的value的数组.
 * */
function Movie(arr) {
    var i = 0,
        len = keys.length;
    while (i < len) {
        this[keys[i]] = arr[i];
        i++;
    }
    return this;
}
Movie.fn = Movie.prototype = {
    constructor: Movie,
    sql: '',
    save: function () {

    },
    del: function () {
        var sql = 'delete from blog_movie where id = ';
    }
};

/**
 * 监听事件对象
 * */
var count = 0;
addEvent('saveMovie', function ($, res, next, url) {
    "use strict";
    var arrData = handleDom($,url);
    saveDomData(arrData);

});
/**
 * 获取页面中所有电影的链接
 */
addEvent('getMovieUrl', function ($, res, next, url) {
    var oA = $('div.co_content8 a,div.co_content2 a');
    var i = 0,
        arrUseful = [],
        len = oA.length;
    for (; i < len; i++) {
        var sHref = oA.eq(i).attr('href');
        if (sHref.indexOf('/gndy/') > 0 && sHref.indexOf('index.html') < 0) {
            //TODO 没有添加路劲的判断(是绝对路径还是相对路径)
            if (arrUseful.indexOf(sHref) < 0) {
                arrUseful.push(url + sHref);
            }
        }
        getMovie(arrUseful[i], res, next);
    }
    count = arrUseful.length;
    console.log('总条数' + count);
    // console.log('本次捕获到url【' + len + '】条,实际用到【' + arrUseful.length + '】条');
    // res.send(url);
    // res.send('成功获取数据'+count+'条');
});

/**
 * 获取电影页面中的电影相关信息
 * @param {string} url - 电影数据来源网页地址
 * @param {object}  res - 请求返回的响应对象
 * @param {function} next - 执行下一个路由方法
 * */
function getMovie(url, res, next) {
    "use strict";
    agent.getDom(url, options, (err, dom) => {
        if (err) {
            console.log('获取DOM失败');
            // res.send(err);
        } else {
            myEmit.emit('saveMovie', dom, res, next, url);
        }
    });
}
/**
 * 获取网站中所有电影的地址
 * @param {string} url - 所要爬取资源的地址
 * @param {object}  res - 请求返回的响应对象
 * @param {function} next - 执行下一个路由方法
 * */
function getMovieUrl(url, res, next) {
    "use strict";
    agent.getDom(url, options, (err, dom) => {
        if (err) {
            res.send(err);
        } else {
            myEmit.emit('getMovieUrl', dom, res, next, url);
        }
    });
}

function getUseFullLink(url, cb) {
    agent.getDom(url, options, (err, $) => {
        if (err) {
            cb && cb(1, {
                message: 'faile',
                data: []
            });
        } else {
            var oA = $('div.co_content8 a,div.co_content2 a');
            var i = 0,
                arrUseful = [],
                len = oA.length;
            for (; i < len; i++) {
                var sHref = oA.eq(i).attr('href');
                if (sHref.indexOf('/gndy/') > 0 && sHref.indexOf('index.html') < 0) {
                    //TODO 没有添加路劲的判断(是绝对路径还是相对路径)
                    if (arrUseful.indexOf(url + sHref) < 0) {
                        arrUseful.push(url + sHref);
                    }
                }
            }
            cb && cb(0, {
                message: 'success',
                data: arrUseful
            });
        }
    });
}

function getSingleLink(url, cb) {
    agent.getDom(url, options, (err, $) => {
        if (err) {
            var data = {
                errCode: 0,
                message: '获取DOM失败'
            };
        } else {
            var arrData = handleDom($,url);
            var movie = new Movie(arrData);
            var data = {
                errCode: 1,
                message: movie
            };
        }
        cb && cb(data)
    });
}


//获取数据库中的数据
function getMovAll(callback) {
    var sql = 'SELECT * from blog_movie ORDER BY mov_year;';
    query(sql, (err, rows) => {
        err ? callback(1, err) : callback(0, rows);
    })
}

// 根据ID获取数据
function getMovByID(id) {
    var sql = 'SELECT * from blog_movie where id = ?';
    query(sql, [id], (err, rows) => {
        err ? callback(1, err) : callback(0, rows);
    })
}

//处理文档结构

function handleDom($,url) {
    var $zoom = $('#Zoom');
    if (!$zoom.get(0)) {
        console.log('当前页面无资源');
        return;
    }
    var sHtml = $zoom.find('p').eq(0).text();
    var arrRes = sHtml.match(/◎译\s*名(.*)◎片\s*名(.*)◎年\s*代(.*)◎国\s*家(.*)◎类\s*别(.*)◎语\s*言(.*)◎字\s*幕(.*)◎IMDb评分(.*)◎文件格式(.*)◎视频尺寸(.*)◎文件大小(.*)◎片\s*长(.*)◎导\s*演(.*)◎主\s*演(.*)◎简\s*介(.*)/i);
    if (!arrRes) return;
    var arrData = arrRes.slice(1).map(function (item) {
        return item.trim();
    });

    var sDownloadUrl = $zoom.find('table a').attr('href');
    var sSrcUrl = url;
    var sPoster = $zoom.find('img').eq(0).attr('src');
    var sStills = $zoom.find('img').eq(1).attr('src');

    return arrData.concat(sDownloadUrl, sSrcUrl, sPoster, sStills);
}
//保存数据
function saveDomData(arrData, cb) {
    var sql = 'INSERT INTO `blog_movie` (`mov_cnName`,`mov_enName`,`mov_year`,`mov_country`,`mov_type`,`mov_language`,`mov_subtitles`,`mov_IMDb`,`mov_fileType`,`mov_fileResolution`,`mov_fileSize`,`mov_showTime`,`mov_director`,`mov_leadActor`,`mov_summary`,`mov_downloadUrl`,`mov_srcUrl`,`mov_poster`,`mov_stills`,`create_date`)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,now())';
    query(sql, arrData, (err, rows) => {
        if (err) {

        } else {
            cb && cb();
        }
    });
}


exports.getMovie = getMovie;
exports.getMovieUrl = getMovieUrl;
exports.getMovAll = getMovAll;
exports.getMovByID = getMovByID;
exports.getUseFullLink = getUseFullLink;
exports.getSingleLink = getSingleLink;