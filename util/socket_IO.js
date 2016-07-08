const _ = require('underscore');
const EventEmitter = require('events');
const util = require('util');
const _io = require('socket.io');
var _clazz = {};
// util.inherits(MyEmitter, EventEmitter);
/**
 * 初始化io
 * @param {number} port - 端口
 * 
 */

/**
 * 构造函数
 */ 
function Clazz (){

}
/**
 * 构造函数原型prototype
 */ 
var _fn;

_fn = Clazz.fn = Clazz.prototype =  {
	constructor:Clazz
};

_fn.

function init(port) {
    'use strict';
    let io = _io.listen(port || '9108');

}

function onSpace(space) {
    if (!_.isString(space)) return _io;
    if (space.charAt(0) !== '/') {
        space += '/';
    }
    //TODO 封装socket.IO 这块工能还未完成
    _clazz[space] = io
        .of(space)
        .on('connection', (socket) => {
            // 使用socket监听 获取文章数据事件(获取从客户端传来的url)
            socket.on('get_article_data', (data) => {
                if (!data) return;

                myEmit.emit('get article from web', {
                    id: data.id,
                    url: data.url,
                    socket: socket
                });
            });
        });
}
