const EventEmitter = require('events');
const util = require('util');

util.inherits(MyEmitter, EventEmitter);

/**
 *  自定义事件的构造函数
 *  @constructor
 * */
function MyEmitter() {
    EventEmitter.call(this);
}

var myEmit = new MyEmitter();


function addEvent(sEvent,callback) {
    if(!sEvent) return;
    myEmit.on(sEvent,callback);
    return myEmit;
}

exports.addEvent = addEvent;
