/**
 * Created by mjj on 16/6/19.
 */
var mysql = require('mysql');
var config = require('../config/database.conf')['mysql_dev'];
var pool = mysql.createPool(config);

/**
 * 基础查询语句
 * @param {string} sql - 执行的sql语句
 * @data {object|json} data - 传递的参数
 * @callback {function} [callback] - 回掉函数,需要两个参数:(err,rows); err:错误,rows查询结果.
 * */
function baseQuery(sql, data, callback) {
    if (typeof data == 'function') {
        callback = data;
    }
    pool.getConnection(function (err, conn) {
        if (err) throw err.stack;
        conn.query(sql, data, function (err, rows) {
            //释放连接
            conn.release();
            callback && callback(err, rows);
        })
    });
}

//所有连接关闭
function endPool(pool, cb) {
    pool.end(function (err) {
        cb(err);
    });
}
//事件监听
pool.on('connection', function (conn) {
    console.log('已经链接');
    // console.log('链接ID：' + conn && conn.threadId + '连接池连接成功...');
});

pool.on('enqueue', function (conn) {
    console.log('队列中......');
    // console.log('链接ID：' + conn && conn.threadId + '连接池连接成功...');
});
pool.on('end', function (conn) {
    console.log('连接关闭.....');
    // console.log('链接ID' + conn.threadId + '连接关闭......');
});
pool.on('error',function(conn){
    console.log('链接关闭......');
});

//测试链接
function testConnect() {
    baseQuery('select now()', function (err, row) {
        console.log(row);
    });
}
// testConnect();


/**暴露方法*/
var tools = {
    query: baseQuery
};


module.exports = tools;