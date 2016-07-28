/**
 * Created by yxp on 2016/6/16.
 */
const cheerio = require('cheerio');
const sAgent = require('superagent');
// const sAgentProxy = require('superagent-proxy');
const sAgentCharset = require('superagent-charset');
sAgentCharset(sAgent);
// sAgentProxy(sAgent);
const fs = require('fs');
const http = require('http');
const myTool = require('./littleTool');
const options = {
    'charset': 'utf-8',
    'Connection': 'keep-alive',
    'Content-Type': 'text/html; charset=utf-8',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.80 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, sdch',
    'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6',
    // 'Host':'www.ruanyifeng.com',
    // 'Cookie': '_gat=1; _ga=GA1.2.2015803745.1466476471',
    // 'Referer': 'http://www.ruanyifeng.com/blog/developer'
};
const cheerOpts = {
    ignoreWhitespace: true,
    xmlMode: true,
    decodeEntities: false //禁止中文转成unicode，主要出现在html()方法的时候，一些title、alt
};
const proxyIP = 'http://61.135.217.24:80';
const dateStr = new Date().toUTCString();
/**
 * 获取页面上的数据
 * @param {string} -  资源的url
 * @param {Obejct|JSON} [opt={charset:'utf-8'}] - 参数
 *
 * */
function _getData(url, opt) {
    'use strict';
    //判断传递参数的个数，
    if (typeof url == 'object') {
        opt = url;
        url = null;
    }
    // 初始化opt
    opt = opt || {};
    var url = url || opt.url,
        timeout = opt.timeout === void 0 ? 3000 : opt.timeout,
        charset = opt.charset || options['charset'];

    //没有url和success 返回
    if (!url) return;
    return new Promise((resolve, reject) => {
        sAgent.get(url)
            .charset(charset)
            // .proxy(proxyIP)
            .set(options)
            // .timeout(2000)
            .on('error', (err) => {
                //问题出在这里啊，频繁访问某一个站点资源，可能对方设置了限制，导致短时间 内无法访问，或者是其他原因。
                //console.log('获取页面上的数据出问题了',err);
                //reject(err);
            })
            .end((err, res) => {
                err ? reject(err) : resolve(res);
            });
    });
}
/**
 * 获取页面的DOM
 * @link _getData
 * @param {string} url - 页面的url
 * @param {JSON} [opt={charset:'utf-8'}] - 参数
 * @param {Function} [cb] - 回掉函数
 * */
function _getDom(url, opt) {
    return new Promise((resolve, reject) => {
        _getData(url, opt).then((res) => {
            var sHtml = res.text.trim();
            var errorInfo = {
                message: '空文章',
                eerror: {
                    status: 200,
                    stack: ''
                }
            };
            sHtml ? resolve(cheerio.load(sHtml, cheerOpts)) : reject(errorInfo);
        }).catch((err) => {
            reject(err);
        });
    });
}
/**
 * 获取页面中img资源
 * @param {string} url - 页面的url
 * @param {Function} [cb] - 回掉函数 接受一个参数:arr ,保存获取到的图片src
 * */
function _getImg(url, cb) {
    _getDom(url, ($) => {
        var arrRes = [];
        $('img[src]').each(function(i, e) {
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
        success: function(err, res) {
            fs.writeFile('download/' + randomName() + '.png', res.body, (err, data) => {
                cb && cb(err, data);
            })
        }
    })
}


module.exports = {
    getData: _getData,
    getDom: _getDom,
    getImg: _getImg,
    saveImg: _saveImg,
    src: sAgent
};
