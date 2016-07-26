var mysqlTool = require('../../common/mysql_connect');
var queryProm = mysqlTool.queryProm;

module.exports = {
    'index': (req, res, next) => {
        var sql = 'SELECT ID,user_login,user_nicename,user_email,user_url,user_registered,user_rolename,user_status from blog_users limit 10;'
        queryProm(sql).then((rows)=>{
            console.log(rows);
            res.render('admin/user',{data:rows});

        }).catch((err)=>{
            next();
        });

    },
    'articleList': (req, res, next) => {
        res.end(req.path);
    },
    'getArticle/:id|post': (req, res, next) => {
        console.log(req.param.id);
        res.end(req.path);
    },
    'getArticle/:id': (req, res, next) => {
        console.log(req.param.id);
        res.end(req.path);
    },
    'testRoute/:name|post': {
        'subroute1': (req, res, next) => {},
        'subroute2': (req, res, next) => {}
    },
    'article/save': (req, res, next) => {
        // res.render('');
    }
};
