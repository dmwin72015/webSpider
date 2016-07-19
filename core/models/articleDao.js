const mysqlTool = require('./common/mysql_connect');
const articleMod = require('./blog_articleMod');
const commonDao = require('./commonDao');



function saveArticle(data) {

    var sql = commonDao.insertSql(articleMod, data);

    mysqlTool.queryProm(sql).then((rows)=>{
        socket.emit('article_data to client',rows);
    }).catch((err)=>{
        
    })
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
