'use strict';
const _ = require('lodash');
const agent = require('../common/myAgent');
const io = require('../common/socket_IO')('9999');
const TIPS_INFO = require('../../config/error_info');

const mysqlTool = require('../common/mysql_connect');
const articleMod = require('../models/blog_articleMod');
const commonDao = require('../models/commonDao');

var addEmit = require('../common/myEmitter');
var uuid = require('../common/littleTool')['uuid'];

// 缓存
var arrCache = {};


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
                return arrHrefs;
            }).catch((err) => {
                // arrHrefs['p' + pNum] = TIPS_INFO['103'];
                // arrHrefs['p' + pNum] = err.stack;
                console.log('[错误信息-->]' + err);
                errorUrls.push(url);
                return arrHrefs;
            }).then((data) => {
                nTote--;
                if (nTote == 0) {
                    var tmpArr = [];
                    for (var n in data) {
                        tmpArr = tmpArr.concat(data[n]);
                    }
                    var oRes = {
                        code: '100',
                        message: TIPS_INFO['100'],
                        info: {
                            data: tmpArr,
                            error: errorUrls
                        }
                    };
                    console.log('采集完成');
                    res.send(oRes).end();
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
        return {
            code: '100',
            message: TIPS_INFO['100'],
            info: {
                data: [data.tid, sHtmlContent, sTextContent],
                error: null
            }
        }
    }).catch((err) => {
        console.log('[fail 错误信息]' + err.stack);
        return {
            code: '103',
            message: TIPS_INFO['103'],
            info: {
                data: [data.tid],
                error: err.stack
            }
        };
    }).then((res) => {
        if (save) {
            var oneEmit = addEmit('server_save_article', save_to_database2);
            if (res.code == '100') {
                var tmpData = {
                    'tid': res.info.data[0],
                    'html': res.info.data[1],
                    'text': res.info.data[2]
                };
                tmpData = _.merge({}, data, tmpData);
                oneEmit.emit('server_save_article', tmpData, socket);
                // save_to_database2(tmpData,socket)
                console.log('--------保存数据事件完成--------');
            } else {
                socket.emit('article_data to client', res);
                console.log('--------返回到客户端--------');
            }
        } else {
            socket.emit('article_data to client', res);
        }
    }).catch((e) => {
        throw e;
    });
}

// 保存文章数据到数据库，版本1，根据model生成sql语句
function save_to_database(data, socket) {
    var oRes = urlFilter(data.url);
    if (oRes.code) {
        socket.emit('article_data to client', oRes);
        return;
    }
    agent.getDom(d.url).then(($) => {
        $('#cnblogs_post_body').find('h3').remove();
        var sHtmlContent = $('#cnblogs_post_body').html(),
            sTextContent = $('#cnblogs_post_body').text();
        var tid = data.tid;
        var sTitle = arrCache[tid].title || data.title;
        var sSorce = arrCache[tid].href || data.href;
        var sTime = arrCache[tid].time || data.time;
        var nRead = arrCache[tid].read || data.read;

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
        console.log('[sql 语句]-->' + sql);
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
            throw err;
            oRes = {
                code: '104',
                message: TIPS_INFO['104'],
                info: {
                    data: null,
                    error: err.stack
                }
            };
            console.log('[错误信息-->]' + err.stack);
        }).then(() => {
            socket.emit('article_data to client', oRes);
        })
    }).catch((err) => {
        throw err;
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

/*
    保存到数据库，版本2，自己写sql语句
    @param {Object|JSON} data - 存放文章的数据
    @param {Object|sockeet} socket - socket连接对象
*/
function save_to_database2(data, socket) {
    console.log('chufa.......');

    var sHtmlContent = data.html || '没获取到';
    var sTextContent = data.text || '没获取到';
    var sTid = data.tid;
    var sTitle = data.title;
    var sSorce = data.href;
    var sTime = data.time;
    var nRead = data.read;

    // TODO: 刚开始设想把第一次获取到的所有href,title等缓存,
    // 但是使用supervisor,每次修改文件会重启服务,而页面没有刷新,
    // 导致缓存是空的,就无法获取到数据
    var sql = 'INSERT INTO `blog_article` (`arti_name`,`arti_author_id`, `arti_author_name`, `arti_textcontent`, `arti_htmlcontent`, `arti_sorce`, `arti_label`, `arti_cate_id`,`arti_cate_name`, `arti_editor`,`arti_from`, `pub_time`,`read_num`, `create_time`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,now())';

    var arrData = [sTitle, 1002, '司徒正美(Ruby\'s Louvre)', sTextContent, sHtmlContent, sSorce, 'javascript,blog', '100', 'javascript', '司徒正美(Ruby\'s Louvre)', sTid, sTime, nRead];

    mysqlTool.queryProm(sql, arrData).then((rows) => {
        return {
            code: '100',
            message: TIPS_INFO['100'],
            info: {
                data: [sTid, rows],
                error: null
            }
        };
    }).catch((err) => {
        return {
            code: '104',
            message: TIPS_INFO['104'],
            info: {
                data: [sTid],
                error: err.stack
            }
        };
    }).then((data) => {
        console.log('保存完毕');
        socket.emit('article_data to client', data);
    })

}

// socket操作
io.on('connection', (socket) => {

    // [监听]  获取文章内容事件
    socket.on('get article data', (data) => {
        stzm_article_page(data, socket, false);
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
