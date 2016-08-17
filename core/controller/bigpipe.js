const async = require('async');
var mysqlTool = require('../common/mysql_connect');

module.exports = function (req, res, next) {
    var mt = mysqlTool;
    function getArticle(cb) {
        var sql = 'SELECT ID, arti_name, arti_author_name, arti_textcontent, arti_htmlcontent, arti_sorce, arti_label, arti_cate_name, pub_time, read_num FROM blog_article WHERE arti_author_id = 1002 ORDER BY pub_time DESC LIMIT 5';
        commonQuery(sql, function (err, rows) {
            if (!err) {
                res.render('include/index_sugg_article', {data: rows}, function (err, html) {
                    res.write(renderScript('article_list', html));
                    cb(null, 'article_list');
                });
            } else {
                res.write('');
                cb(null, 'article_list');
            }
        });
    }

    function getTop10(cb) {
        var sql = 'SELECT ID, arti_name FROM blog_article WHERE arti_author_id = 1002 ORDER BY read_num DESC LIMIT 8';
        commonQuery(sql, function (err, rows) {
            if (!err) {
                res.render('include/index_top10', {data: rows}, function (err, html) {
                    res.write(renderScript('top10', html));
                    cb(null, 'top10');
                });
            } else {
                res.write('');
                cb(null, 'top10');
            }
        });
    }

    function getLables(cb) {
        var sql = 'SELECT DISTINCT label_name FROM `blog_article_label` WHERE label_status = 1;';
        commonQuery(sql, function (err, rows) {
            if (!err) {
                res.render('include/index_labels', {label_title: '标签云', data: rows}, function (err, html) {
                    res.write(renderScript('labels', html));
                    cb(null, 'labels');
                });
            } else {
                res.write('');
                cb(null, 'labels');
            }
        });
    }

    function getSuggList(cb) {
        var sql = 'SELECT ID, arti_name,arti_cate_name,pub_time FROM blog_article WHERE arti_author_id = 1002 ORDER BY read_num  LIMIT 5';
        commonQuery(sql, function (err, rows) {
            if (!err) {
                res.render('include/index_right_sugglist', {data: rows}, function (err, html) {
                    res.write(renderScript('pic_sugg', html));
                    cb(null, 'pic_sugg');
                });
            } else {
                res.write('');
                cb(null, 'pic_sugg');
            }
        });
    }

    var arr = [getArticle, getLables, getSuggList, getTop10];
    res.render('index', {title: '首页异步'}, function (err, html) {
        res.write(html);
    });
    async.parallel(arr, function (err, results) {
        console.log(results);
        res.end();
    });
    // return;
};


function commonQuery(sql, cb) {
    var mt = mysqlTool, queryProm = mt.queryProm;
    queryProm(sql).then((rows) => {
        return rows;
    }).catch((err) => {
        cb && cb(err)
    }).then((rows) => {
        cb && cb(null, rows);
    });
}

function renderScript(id, html) {
    var whitespace1 = ">[\\x20\\t\\r\\n\\f]*";
    // var whitespace2 = "[\\x20\\t\\r\\n\\f]*<";
    html = html ? html.replace(new RegExp(whitespace1, 'g'), '>') : '';
    return "<script>render('" + id + "','" + html + "');</script>";
}