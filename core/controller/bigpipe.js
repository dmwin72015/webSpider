var mysqlTool = require('../common/mysql_connect');

module.exports = function (req, res, next) {
    res.render('index', {
        title: 'nunjucks模板测试页面',
        content: '这个模板还是比较好用的'
    })
};