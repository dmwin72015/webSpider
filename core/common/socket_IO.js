const _ = require('underscore');
const EventEmitter = require('events');
const _io = require('socket.io');
var io = null;

function init(port) {
    return _io.listen(port || 8080);
}


module.exports = function(port) {
    if(io === null){
        io = init(port);
    }else {
        var port = io.httpServer._connectionKey;
        console.log('*********************************');
        console.warn('socket 已经在[ ' + port + ' ]监听');
        console.log('*********************************\n');
    }
    return io;
}