var _ = require('lodash');
var agent = require('../common/myAgent');
var io = require('../common/socket_IO')('9999');

module.exports = {
    'index': (req, res, next) => {
        res.render('article/getarticle', {
            title: '采集首页'
        });
    },
    'geturls|post': (req, res, next) => {
        var url = req.body.url || '';
        var oReturn;
        if (!url) {
            oReturn = {
                code: '100',
                errors: {
                    message: '没有传递url'
                }
            }
            res.send(oReturn).end();
        }
        agent.getDom(url).then((dom) => {
            var $ = dom;
            domAction(dom);
            res.send('获取到的数据：' + $('li.module-list-item').length).end();
        }).catch((err) => {
            console.error('faile');
            res.end(err);
        });
        return;
    },
    'getdom|post': (req, res, next) => {
        var url = req.body.url || '';
    }
};
// dom梳理
function domAction($) {
    // body...
}