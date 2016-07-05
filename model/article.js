const _ = require('underscore');
const io = require('socket.io').listen('9080');

const agent = require('../util/myAgent');
const baseQuery = require('../util/mysql_connect')['query'];
const myEmit = require('../util/myEmitter')['emitter'];
const addEvent = require('../util/myEmitter').addEvent;

const headrs = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
};

const keys = ['arti_name', 'arti_author_id', 'arti_author_name', 'arti_textcontent', 'arti_htmlcontent', 'arti_sorce', 'arti_status', 'arti_label', 'arti_cate_id', 'arti_cate_name', 'arti_editor', 'arti_from', 'pub_time', 'last_edit_time', 'read_permission', 'read_num', 'like_num', 'unlike_num', 'hot', 'create_time'];

/**
 * 构造函数
 * @constructor {array} - arr 保存着与keys一一对应的数据
 * */
function Article(data) {
    var that = this;
    if (!data) return that;
    if (Array.isArray(data) && data.length) {
        var i = 0,
            len = data.length;
        for (; i < len; i++) {
            that[keys[i]] = arr[i];
        }
    } else if (_.isObject(data)) {
        that = _.extendOwn(this, data);
    }
    return that;
}
Article.fn = Article.prototype = {
    constructor: Article,
    save: function (cb) {
        if (!this.arti_name) return 'article不存在';
        var sql = "INSERT INTO `blog_article` (`arti_name`, `arti_author_id`, `arti_author_name`, `arti_textcontent`, `arti_htmlcontent`, `arti_sorce`, `arti_status`, `arti_label`, `arti_cate_id`, `arti_cate_name`,`arti_editor` ,`arti_from`, `pub_time`, `last_edit_time`,`read_permission`,`read_num`,`like_num`,`unlike_num`,`hot`,`create_time`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,now())";
        var arrData = [
            this.arti_name,
            this.arti_author_id || 1,
            this.arti_author_name || 'admin',
            this.arti_textcontent || '无内容',
            this.arti_htmlcontent || '<p>无内容</p>',
            this.arti_sorce || '',
            this.arti_status || 1,
            this.arti_label || '',
            this.arti_cate_id || 0,
            this.arti_cate_name || '',
            this.arti_editor || '',
            this.arti_from || '',
            this.pub_time || '',
            this.last_edit_time || '',
            this.read_permission || 1,
            this.read_num || 0,
            this.like_num || 0,
            this.unlike_num || 0,
            this.hot || 0,
            this.create_time || 'now()',
        ];
        baseQuery(sql, arrData, (err, rows)=> {
            if (err) {
                cb(1, {
                    msg: '插入失败',
                    err: err
                });
            } else {

                cb(0, rows);
            }
        });
    }
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

/**
 * 捕获取页面中文章链接
 * */
function getArticleLinkFromWeb(url, cb) {
    agent.getDom(url, (err, dom)=> {
        if (err) {

        } else {
            var $ = dom;
            var $li = $('#alpha-inner li.module-list-item'),
                i = 0,
                len = $li.length;
            // for (; i < len; i++) {
            //     var href = $li.eq(i).find('a').attr('href');
            //     if (href) {
            //        myEmit.emit('get article from web',href);
            //     }
            // }
            cb && cb($li);
        }
    });
}


//获取DOM从页面中
addEvent('get article from web', (url, cb)=> {
    agent.getDom(url, (err, dom)=> {
        if (err) {

        } else {
            myEmit.emit('save article to database', dom, url, cb);
        }
    });
});

//保存到数据库
addEvent('save article to database', (dom, url, cb)=> {
    var $ = dom;
    var $content = $('#entry-1867');
    var article = {
        arti_name: $('#page-title').text(),
        arti_author_id: '1001',
        arti_author_name: $content.find('.vcard.author a').text(),
        arti_textcontent: $('#main-content').text(),
        arti_htmlcontent: $('#main-content').html(),
        arti_sorce: url,
        arti_status: 1,
        arti_label: $content.find('.entry-categories ul').text(),
        arti_cate_id: '2',
        arti_cate_name: $content.find('.entry-categories ul').text(),
        arti_editor: $content.find('.vcard.author a').text(),
        arti_from: url,
        pub_time: $content.find('abbr.published').attr('title')
    };
    var arti = new Article(article);
    arti.save((err, rows)=> {
        cb(err, rows);
    });
});

/**
 * 使用socket的方式
 */ 

io.on('connection', (socket)=> {
    console.log(socket.id + '--链接....');
});

















module.exports = {
    getAll: getAll,
    getById: getById,
    getByName: getByName,
    getryf: getArticleLinkFromWeb

};