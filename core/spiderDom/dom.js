var _ = require('lodash');
var agent = require('../common/myAgent');
var io = require('../common/socket_IO')('9999');

var defaultUrl = 'http://www.cnblogs.com/rubylouvre/default.html?page=1';
var tomUrl = 'http://www.cnblogs.com/TomXu/archive/2011/12/15/2288411.html';

const ERROR_INFO = {
    '101':'url不能为空',
    '102':'url格式不正确',
    '103':'获取页面资源失败'
};

function urlFilter(url) {
    "use strict";
    var errTips = {};
    if (!url) {
        errTips = {
            code: '101',
            message: ERROR_INFO['101'],
            info: {
                data: null,
                error: 'fail'
            }
        }
        return errTips;
    }
    if (!/^http:\/\//.test(url)) {
        errTips = {
            code: '102',
            message: ERROR_INFO['102'],
            info: {
                data: null,
                error: 'fail'
            }
        }
        return errTips;
    }
    return errTips;
}

function tomUrls(req, res, next) {
    var url = req.body.url;
    var oRes = urlFilter(url);
    if (oRes.code) {
        res.send(oRes);
    }
    var arrHrefs = [];
    agent.getDom(url).then(($) => {
        $('#cnblogs_post_body').find('a').each((i, ele) => {
            var that = $(ele);
            var sHref = that.attr('href');
            var sTitle = that.text();
            arrHrefs[i] = {
                title: sTitle,
                href: sHref
            };
        });
        oRes = {
            code: '100',
            message: 'success',
            info: {
                data: arrHrefs,
                error: null
            }
        };
    }).catch((err) => {
        oRes = {
            code: '103',
            message:ERROR_INFO['103'],
            info: {
                data: null,
                error: err
            }
        };
    }).then(() => {
        res.send(oRes);
    });
    return;
}


module.exports = {
    'tomUrls': tomUrls
};
