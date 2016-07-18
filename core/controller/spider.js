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
        "use strict";
        var defaultUrl = 'http://www.cnblogs.com/rubylouvre/default.html?page=1';
        var url = req.body.url;
        var oReturn = {};
        var flag = false;
        if (!url) {
            oReturn = {
                code: '101',
                info: {
                    message: 'url没有传值',
                    data:null,
                    error: null
                }
            }
            flag = true;
        }
        if (!/^http:\/\//.test(url)) {
            oReturn = {
                code: '102',
                info: {
                    message: 'url格式不正确',
                    data:null,
                    error: null
                }
            }
            flag = true;
        }
        if(flag){
            res.send(oReturn);
            return;
        }
        var arrHrefs = [];
        agent.getDom(url).then((dom) => {
            var $ = dom;
            var $art_title = $('#main').find('div.post');
            $art_title.each((i, ele) => {
                var that = $(ele);
                var sHref = that.find('h2>a').attr('href');
                var sTitle = that.find('h2>a').text();
                var sSummary = that.find('div.c_b_p_desc').text();
                arrHrefs[i] = {
                    title: sTitle,
                    href: sHref,
                    summary: sSummary
                };
            });
            oReturn = {
                code: '100',
                info: {
                    message: 'success',
                    data:arrHrefs,
                    error: null
                }
            }
        }).catch((err) => {
            oReturn = {
                code: '101',
                data: {
                    message: '获取页面资源失败',
                    data:null,
                    error: err
                }
            }
        }).then(()=>{
            res.send(oReturn);
        });
        return;
    },
    'getdom|post': (req, res, next) => {
        var url = req.body.url || '';
    }
};
