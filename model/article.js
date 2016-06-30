/**
 * Created by yxp on 2016/6/16.
 */
const agent = require('../util/myAgent');
const baseQuery = require('../util/mysql_connect')['query'];
const myEmit = require('../util/myEmitter')['emitter'];
const addEvent = require('../util/myEmitter').addEvent;

const headrs = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
};
/**
 * 保存文章
 * @param {string} url  - 文章的url
 * @param {JSON} opt - 参数
 * @param {Function} cb - 回掉函数
 * @returns undefined - 无返回值
 * */
function saveMovie(url, opt, cb) {
    "use strict";
    agent.getDom(url, opt, (err, data)=> {
        if (err) {
            cb(1, err);
        } else {
            var $ = data;
            var $article = $('#cont_1_1_2');
            var sTitle = $article.children('h1').text();
            var sTime = $article.find('.left-t').text().match(/\d{4}年\d{2}月\d{2}日\s*\d{2}:\d{2}/i);
            sTime = sTime ? sTime[0] : '';
            var sSource = $article.find('.left-t>a').eq(0).text();
            var sSource_href = $article.find('.left-t>a').eq(0).attr('href');
            var aImg = [];
            $article.find('.left_zw img').each(function (i, ele) {
                var src = $(ele).attr('src');
                if (/^(\/?).*?\.(bmp|jpg|gif)$/ig.test(src)) {
                    src += opt.baseUrl + RegExp.$1 + src;
                }
                aImg.push(src);
            });
            var sImgText = $article.find('div.left_pt').text() || $article.find('div.pictext').text();

            var sArticleText = '',
                sArticleHtml = '';
            $article.find('.left_zw p').each(function (i, ele) {
                sArticleText += $(ele).text();
                sArticleHtml += $(ele).html();
            });
            var sAuthor = $article.find('div.left_name div.left_name').text();
            var sql = 'INSERT INTO `dongmin`.`blog_article` (`arti_name`, `arti_author_id`, `arti_author_name`, `arti_textcontent`, `arti_htmlcontent` , `arti_sorce`, `arti_status`, `arti_label`, `arti_cate_id`, `arti_cate_name` , `create_time`, `pub_time`, `last_edit_time`) VALUES (?, "1", "admin",?, ?, ?,"1","新闻","1","社会新闻", now(),?, now())';
            sTime = sTime.replace(/年|月/g, '-').replace(/日/g, '').replace(/\s*/, ' ');
            var oAllData = {
                title: sTitle,
                art_title: sTitle,
                art_subTitle: sTitle,
                pub_time: sTime,
                sSource: sSource,
                sSource_href: sSource_href,
                art_content: sArticleHtml,
                editor: sAuthor
            };
            mysqlTool.query(sql, [sTitle, sArticleText, sArticleHtml, sSource, sTime], function (err, row) {
                if (err) {
                    cb(1, err);
                }
            });
            cb(0, oAllData);
        }
    });
}
/**
 * 获取所有文章
 * @param {JSON} options - 获取数据传递的参数
 * @param {function} callback - 回掉函数 传递参数(rows) ,rows: 返回查询结果集合.
 * */
function getAll(options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = undefined;
    }
    var sql = 'SELECT * FROM `blog_article` WHERE arti_name !="" order by pub_time';
    mysqlTool.query(sql, function (err, rows) {
        callback && callback(err, rows);
    });
}
/**
 * 获取范围从start开始到end结束的数据,
 * 如果不传递start,end.查询出所有结果.只传递了其中一个参数,则只查询前n条记录
 * @param {number} [start] - 开始的记录数
 * @param {number} [end] - 结束的记录数
 * @param {function} callback - 回掉函数
 * */
function getLimit(start, end, callback) {
    var len = arguments.length;
    switch (len) {
        case 1:
            callback = start;
            getAll(callback);
            break;
        case 2:
            if (typeof start != 'number') return;
            callback = end;
            start = 0;
            end = start < 0 ? 0 : start;
            break;
        default:
            if (typeof start != 'number' || typeof end != 'number') {
                return;
            }
            if (start < 0 || end < 0) {
                start = 0;
                end = 0;
            }
            if (start < end) {
                return;
            }
            break;
    }
    var sql = 'SELECT * FROM `blog_article` limit ' + start + ',' + end + ';';
    mysqlTool.query(sql, function (err, rows) {
        callback && callback(err, rows);
    });
}
/**
 * 根据ID获取文章
 * @param {string|number} id - 文章ID
 * @param {function} [callback] - 回掉函数.
 * */
function getById(id, callback) {
    "use strict";
    if (!id) return;
    var sql = 'SELECT * FROM `blog_article` WHERE arti_name !="" and id=?';
    baseQuery(sql, [id], callback);
}

/**
 * 根据name获取文章
 * @param {string} name - 文章name
 * @param {function} [callback] - 回掉函数
 * */
function getByName(name, callback) {
    "use strict";
    if (!name) return;
    var sql = 'SELECT * FROM `blog_article` WHERE arti_name like ?';
    baseQuery(sql, [name], callback);
}

/***/ 





module.exports = {
    getAll: getAll,
    getById: getById,
    getByName: getByName
};