/**
 * Created by yxp on 2016/6/16.
 */
const cheerio = require('cheerio');
const sAgentCharset = require('superagent-charset');
const sAgent = sAgentCharset(require('superagent'));
const fs = require('fs');
const http = require('http');
const myTool = require('./littleTool');

const headrs = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
};

/**
 * 获取页面上的数据
 * @param {string} -  资源的url
 * @param {Obejct|JSON} [opt={charset:'utf-8'}] - 参数
 *
 * */
function _getData(url, opt) {
    //判断传递参数的个数，
    if (typeof url == 'object') {
        opt = url;
        url = null;
    }
    // 初始化opt
    opt = opt || {};
    var url = url || opt.url,
        cb = opt.success,
        charset = opt.charset || 'utf-8';
    //没有url和success 返回
    if (!url || !cb) return;
    sAgent.get(url).charset(charset).end((err, res) => {
        cb && cb(err, res);
    });
}
/**
 * 获取页面的DOM
 * @link _getData
 * @param {string} url - 页面的url
 * @param {JSON} [opt={charset:'utf-8'}] - 参数
 * @param {Function} [cb] - 回掉函数
 * */
function _getDom(url, opt, cb) {
    if (typeof opt == 'object') {
        opt = opt || {};
    } else if (typeof  opt == 'function') {
        cb = opt;
    }
    _getData(url, {
        success: function (err, res) {
            if (err) {
                cb(1, err);
            } else {
                var sHtml = res.text.trim();
                var errorInfo = {
                    message: '空文章',
                    eerror: {
                        status: 200,
                        stack: ''
                    }
                };
                !sHtml ? cb(1, errorInfo) : cb(0, cheerio.load(sHtml, {
                    ignoreWhitespace: true,
                    xmlMode: true,
                    decodeEntities: false//禁止中文转成unicode，主要出现在html()方法的时候，一些title、alt
                }));
            }
        },
        charset: opt.charset
    });
}
/**
 * 获取页面中img资源
 * @param {string} url - 页面的url
 * @param {Function} [cb] - 回掉函数 接受一个参数:arr ,保存获取到的图片src
 * */
function _getImg(url, cb) {
    _getDom(url, ($)=> {
        var arrRes = [];
        $('img[src]').each(function (i, e) {
            arrRes[i] = $(e).attr('src');
        });
        cb(arrRes);
    });
}
/**
 * 保存img资源
 * @param {string} url - 图片的url
 * @param {Function} [cb] - 回掉函数 接受两个个参数:（err,res）;err:报错信息，res：结果数据
 * */
function _saveImg(url, cb) {
    var randomName = myTool.randomName;
    _getData(url, {
        success: function (err, res) {
            fs.writeFile('download/' + randomName() + '.png', res.body, (err, data)=> {
                cb && cb(err, data);
            })
        }
    })
}

module.exports = {
    getData: _getData,
    getDom: _getDom,
    getImg: _getImg,
    saveImg: _saveImg
};