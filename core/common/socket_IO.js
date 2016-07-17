const _ = require('underscore');
const EventEmitter = require('events');
const _io = require('socket.io');

function init(port) {
    return _io.listen(port || 8080);
}


module.exports = function (port) {
    return _io.listen(port || 8080);
}