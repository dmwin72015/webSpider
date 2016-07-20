const _ = require('lodash');
const agent = require('../common/myAgent');
const io = require('../common/socket_IO')('9999');
const TIPS_INFO = require('../../config/error_info');

const mysqlTool = require('../common/mysql_connect');
const articleMod = require('../models/blog_articleMod');
const commonDao = require('../models/commonDao');

var addEmit = require('../common/myEmitter');

// 缓存
var arrCache = {};

/* 生一个UUID字符串*/
function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
}
// 过滤字符串
function urlFilter(url) {
    "use strict";
    var errTips = {};
    if (!url) {
        errTips = {
            code: '101',
            message: TIPS_INFO['101'],
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
            message: TIPS_INFO['102'],
            info: {
                data: null,
                error: 'fail'
            }
        }
        return errTips;
    }
    return errTips;
}
// 获取列表页的文章地址
function getUrls(req, res, next) {
    // var url = req.body.url;
    // var oRes = urlFilter(url);
    // if (oRes.code) {
    //     res.send(oRes).end();
    // }
    var arrHrefs = {};
    var errorUrls = [];
    var nTote = 117;
    var baseUrl = 'http://www.cnblogs.com/rubylouvre/default.html?page=';
    for (var i = 1, len = nTote + 1; i < len; i++) {
        (function(pNum) {
            var url = baseUrl + pNum;
            agent.getDom(url).then(($) => {
                arrHrefs['p' + pNum] = stzm_page($);
            }).catch((err) => {
                arrHrefs['p' + pNum] = TIPS_INFO['103'];
                console.log(err);
                errorUrls.push(url);
            }).then(() => {
                nTote--;
                if (nTote == 1) {
                    var tmpArr = [];
                    for (var n in arrHrefs) {
                        tmpArr = tmpArr.concat(arrHrefs[n]);
                    }
                    oRes = {
                        code: '100',
                        message: TIPS_INFO['100'],
                        info: {
                            data: tmpArr,
                            error: errorUrls
                        }
                    };
                    res.send(oRes);
                }
            })
        })(i)
    }
    return;
}

// TOM大叔Blog
function tomuncle_page($) {
    var arrData = [];
    // TODO : 逻辑处理
    return arrData;
}
// 司徒正美Blog ,返回数组,存放每一个列表页面中所有文章地址
function stzm_page($) {
    var arrData = [];
    var regTime = /\d{4}-\d{2}-\d{2}\s*\d{2}\:\d{2}/;
    var regRead = /阅读\((\d+)\)/;
    var regComment = /评论\((\d+)\)/;
    $('#main').find('div.post').each((i, ele) => {
        var $ele = $(ele);
        var sTitle = $ele.find('h2>a').text(),
            sHref = $ele.find('h2>a').attr('href'),
            sSummary = $ele.find('div.c_b_p_desc').text(),
            sOther = $ele.find('p.postfoot').text();

        var arrTime = sOther.match(regTime),
            arrRead = sOther.match(regRead),
            arrComment = sOther.match(regComment);

        var uniqueID = uuid();

        arrData[i] = {
            'tid': uniqueID,
            'title': sTitle,
            'href': sHref,
            'summary': sSummary,
            'time': arrTime[0] || '0000-00-00',
            'read': (arrRead && arrRead[1]) || 0,
            'comment': (arrComment && arrComment[1]) || 0
        };
        if (!arrCache[uniqueID]) {
            arrCache[uniqueID] = arrData[i]
        }
    })
    return arrData;
}


/*在后台触发保存事件*/


/*
    获取页面中的数据
    @param {Object|JSON} data  - 必须有2个属性, id:生成的临时ID; url:文章的地址
    @param {Object}  socket - socket链接对象
    @param {boolean} save  - 是否保存到数据看库
*/
function stzm_article_page(data, socket, save) {
    var oRes = urlFilter(data.href);
    if (oRes.code) {
        socket.emit('article_data to client', oRes);
        return;
    }

    agent.getDom(data.href).then(($) => {
        $('#cnblogs_post_body').find('h3').remove();
        var sHtmlContent = $('#cnblogs_post_body').html(),
            sTextContent = $('#cnblogs_post_body').text();
        var newData = _.merge({}, data, {
            html: sHtmlContent,
            text: sTextContent
        });
        oRes = {
            code: '100',
            message: TIPS_INFO['100'],
            info: {
                data: [data.tid, sHtmlContent, sTextContent],
                error: null
            }
        }
    }).catch((err) => {
        oRes = {
            code: '103',
            message: TIPS_INFO['103'],
            info: {
                data: null,
                error: err.stack
            }
        };
    }).then(() => {
        if (save) {
            var oneEmit = addEmit('server_save_article', save_to_database2);
            if (oRes.code == '100') {
                // oneEmit.emit('server save article', {
                //     'tid': data.tid,
                //     'html': sHtmlContent,
                //     'text': sTextContent
                // }, socket);
                var tmpData = {
                    'tid': data.tid,
                    'html': sHtmlContent,
                    'text': sTextContent
                };
                try{
                oneEmit.emit('server_save_article',function (argument) {
                    // body...
                });
                }

            } else {
                console.log('[fail]' + oRes.info.error);
            }
        } else {
            socket.emit('article_data to client', oRes);
        }
    });
}
// 保存文章数据到数据库



function save_to_database(d, socket) {
    var oRes = urlFilter(d.url);
    if (oRes.code) {
        socket.emit('article_data to client', oRes);
        return;
    }
    agent.getDom(d.url).then(($) => {
        $('#cnblogs_post_body').find('h3').remove();
        var sHtmlContent = $('#cnblogs_post_body').html(),
            sTextContent = $('#cnblogs_post_body').text();
        var tid = d.tid;
        var sTitle = arrCache[tid].title || d.title;
        var sSorce = arrCache[tid].href || d.href;
        var sTime = arrCache[tid].time || d.time;
        var nRead = arrCache[tid].read || d.read;

        var oData = {
            'arti_name': sTitle,
            'arti_author_id': 1002,
            'arti_author_name': "司徒正美(Ruby\'s Louvre)",
            'arti_textcontent': sTextContent,
            'arti_htmlcontent': sHtmlContent,
            'arti_sorce': sSorce,
            // 'arti_status     '
            'arti_label': 'javascript,blog',
            'arti_cate_id': '100',
            'arti_cate_name': 'javascript',
            'arti_editor': "司徒正美(Ruby\'s Louvre)",
            'arti_from': tID,
            'pub_time': sTime,
            // 'last_edit_time  '
            'read_permission': '1',
            'read_num': nRead,
            // 'like_num        '
            // 'unlike_num      '
            // 'hot             '
            'create_time': 'now()'
        }

        var sql = commonDao.insertSql(articleMod, oData);
        console.log(sql);
        if (!sql) {
            oRes = {
                code: '105',
                message: TIPS_INFO['105'],
                info: {
                    data: null,
                    error: null
                }
            };
            socket.emit('article_data to client', oRes);
            return;
        }
        var arrData = [];
        for (var name in oData) {
            arrData.push(oData[name]);
        }
        mysqlTool.queryProm(sql, arrData).then((rows) => {
            oRes = {
                code: '100',
                message: TIPS_INFO['100'],
                info: {
                    data: [tID, rows],
                    error: null
                }
            };
        }).catch((err) => {
            oRes = {
                code: '104',
                message: TIPS_INFO['104'],
                info: {
                    data: null,
                    error: err.stack
                }
            };
            console.log(err.stack);
        }).then(() => {
            socket.emit('article_data to client', oRes);
        })
    }).catch((err) => {
        oRes = {
            code: '103',
            message: TIPS_INFO['103'],
            info: {
                data: null,
                error: err.stack
            }
        };
        socket.emit('article_data to client', oRes);
    });
}


function save_to_database2(data, socket) {
    console.log('chufa.......');

    console.log(data);

    var sHtmlContent = data.html,
        sTextContent = data.text,
        sTid = data.tid,
        sTitle = arrCache[sTid].title || data.title,
        sSorce = arrCache[sTid].href || data.href,
        sTime = arrCache[sTid].time || data.time,
        nRead = arrCache[sTid].read || data.read;

    var sql = 'INSERT INTO `blog_article` (`arti_name`,`arti_author_id`, `arti_author_name`, `arti_textcontent`, `arti_htmlcontent`, `arti_sorce`, `arti_label`, `arti_cate_id`,`arti_cate_name`, `arti_editor`,`arti_from`, `pub_time`,`read_num`, `create_time`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,now())';

    var arrData = [sTitle, 1002, '司徒正美(Ruby\'s Louvre)', sTextContent, sHtmlContent, sSorce, 'javascript,blog', '100', 'javascript', '司徒正美(Ruby\'s Louvre)', sTid, sTime, nRead];

    mysqlTool.queryProm(sql, arrData).then((rows) => {
        oRes = {
            code: '100',
            message: TIPS_INFO['100'],
            info: {
                data: [sTid, rows],
                error: null
            }
        };
    }).catch((err) => {
        oRes = {
            code: '104',
            message: TIPS_INFO['104'],
            info: {
                data: null,
                error: err.stack
            }
        };
    }).then(() => {
        socket.emit('article_data to client', oRes);
    })
}

// socket操作
io.on('connection', (socket) => {

    // [监听]  获取文章内容事件
    socket.on('get article data', (data) => {
        stzm_article_page(data, socket);
    });

    // [监听]  保存到数据库事件
    socket.on('save article data', (data) => {
        // console.log(data);
        stzm_article_page(data, socket, true);
    })
});



// 10分钟之后,清空缓存
setTimeout(() => {
    arrCache = {};
}, 600000);

module.exports = {
    'getUrls': getUrls
};
