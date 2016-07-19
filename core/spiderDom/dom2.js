const _ = require('lodash');
const agent = require('../common/myAgent');
const io = require('../common/socket_IO')('9999');

const mysqlTool = require('../common/mysql_connect');

const TIPS_INFO = {
    '100': 'success',
    '101': 'url不能为空',
    '102': 'url格式不正确',
    '103': '获取页面资源失败',
    '104': '存储到数据库失败',
    '105': 'sql语句生成失败'
};

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
// 过滤url
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

//获取列表页的文章页连接地址
function getUrls(req, res, next) {
    // var url = req.body.url;
    // var oRes = urlFilter(url);
    // if (oRes.code) {
    //     res.send(oRes).end();
    // }
    var oHrefs = {};
    var nCount = 200;
    var baseUrl = 'http://www.cnblogs.com/rubylouvre/default.html?page=';
    for (var i = 0; i < 200; i++) {
        (function(pageNum) {
            var url = baseUrl + pageNum;
            agent.getDom(url).then(($) => {
                oHrefs['p' + pageNum] = stzm_page($);
            }).catch((err) => {
                oHrefs['p' + pageNum] = [err.stack];
            }).then(() => {
                nCount--;
                if (nCount == 1) {
                    var arrRealData = [];
                    for (var k in oHrefs) {
                        arrRealData = arrRealData.concat(oHrefs[k]);
                    }
                    oRes = {
                        code: '100',
                        message: TIPS_INFO['100'],
                        info: {
                            data: arrRealData,
                            error: null
                        }
                    };
                    res.send(oRes);
                }
            })
        })(i)
    }
    return;
}

// TODO：TOM大叔Blog
function tomuncle_page($) {
    var arrData = [];
    // TODO : 逻辑处理
    return arrData;
}
// 司徒正美Blog，文章页获取文章内容逻辑
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
            'tmpID': uniqueID,
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

// 获取页面中的文章
function stzm_article_page(data, socket) {
    var oRes = urlFilter(data.url);
    if (oRes.code) {
        socket.emit('article_data to client', oRes);
        return;
    }

    agent.getDom(data.url).then(($) => {
        $('#cnblogs_post_body').find('h3').remove();
        var sHtmlContent = $('#cnblogs_post_body').html();
        sTextContent = $('#cnblogs_post_body').text();
        oRes = {
            code: '100',
            message: TIPS_INFO['100'],
            info: {
                data: [data.id, sHtmlContent, sTextContent],
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
        socket.emit('article_data to client', oRes);
    });
}
// 将文章保存到数据库
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
        var tID = d.id;
        var sTitle = arrCache[tID].title;
        var sSorce = arrCache[tID].href;
        var sTime = arrCache[tID].time;
        var nRead = arrCache[tID].read;
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
            'arti_from': sSorce,
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


// socket操作
io.on('connection', (socket) => {
    // [废弃] 测试能否获取到文章页面的文章正文
    socket.on('article url', (d) => {
        stzm_article_page(d, socket);
    });

    // [监听]  保存到数据库事件
    socket.on('save article data', (d) => {
        save_to_database(d, socket);
    })
});

module.exports = {
    'getUrls': getUrls
};
