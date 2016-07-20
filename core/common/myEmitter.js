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


function addEvent(sEvent, callback) {
	var myEmit = new MyEmitter();
    if (!sEvent) return;
    myEmit.on(sEvent, callback);
    console.log('*************************************************');
    console.log('实例化一个EventEmitter[ '+sEvent+' ]');
    console.log('*************************************************\n');
    return myEmit;
}

module.exports = addEvent;