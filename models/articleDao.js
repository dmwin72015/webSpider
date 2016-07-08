const mysqlTool = require('./util/mysql_connect');

const keys = ['arti_name', 'arti_author_id', 'arti_author_name', 'arti_textcontent', 'arti_htmlcontent', 'arti_sorce', 'arti_status', 'arti_label', 'arti_cate_id', 'arti_cate_name', 'arti_editor', 'arti_from', 'pub_time', 'last_edit_time', 'read_permission', 'read_num', 'like_num', 'unlike_num', 'hot', 'create_time'];

/**
 * 构造函数
 * @constructor {array} - arr 保存着与keys一一对应的数据
 * @return  this - 生成的当前对象
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
/**
 * 扩展原型,增加公用方法.
 * 1.save @param {function} cb - 保存之后执行的回调函数
 * */
Article.fn = Article.prototype = {
    constructor: Article,
    save: function (cb) {
        if (!this.arti_name) return 'article_name 不存在';
        var sql = "INSERT INTO `blog_article` (`arti_name`, `arti_author_id`, `arti_author_name`, `arti_textcontent`, `arti_htmlcontent`, `arti_sorce`, `arti_status`, `arti_label`, `arti_cate_id`, `arti_cate_name`,`arti_editor` ,`arti_from`, `pub_time`, `last_edit_time`,`read_permission`,`read_num`,`like_num`,`unlike_num`,`hot`,`create_time`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?," + (this.create_time || 'now()') + ");";
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
            this.pub_time || '0000-00-00',
            this.last_edit_time || '0000-00-00',
            this.read_permission || 1,
            this.read_num || 0,
            this.like_num || 0,
            this.unlike_num || 0,
            this.hot || 0
            // this.create_time || 'now()'
        ];

        baseQuery(sql, arrData, (err, rows) => {
            //留着测试.链接数据库出错的时候
            if (err) {
                throw err;
                return;
            }
            cb && cb(err, rows);
        });
    }
};

























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
    var query = mysqlTool.query;
    query(sql, function(err, rows) {
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
    mysqlTool.query(sql, function(err, rows) {
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