var io = require('socket.io').listen('8080');
var sockets = io.sockets || '';
var onlineUsers = [];
var onlineNum = 0;

io.on('connection', (socket)=> {
    var shakeInfo = socket.handshake,
        sIp = shakeInfo.address,
        userAgent = shakeInfo.headers['user-agent'],
        time = shakeInfo.time;

    var browser = getBrowserInfo(userAgent);
    onlineUsers.push({
        user: sIp,
        browser: browser,
        time: time
    });

    onlineNum++;

    //发送给所有人
    io.emit('userJoin', {
        id: socket.id,
        onlineNum: onlineNum,
        userlist: onlineUsers
    });

    //触发客户端的链接事件
    socket.emit('connect', {
        user: sIp,
        browser: browser,
        time: time,
        currentNum: onlineNum
    });

    socket.on('message', (data)=> {
        console.log(data);
    });

    socket.on('mydata', (data)=> {
        console.log(data);
        data.time = new Date;

        // 给其他所有人发送(不包括当前socket)
        socket.broadcast.emit('sendAllPeople', data);
    });


    socket.on('disconnect', (socket)=> {
        console.log(socket);
        var index = onlineUsers.indexOf(sIp);
        onlineUsers.splice(index);
        onlineNum--;
    });
});

function getBrowserInfo(user_agent) {
    var arrReg = [/(Chrome)\/(.*?)\./i, /(Firefox)\/(.*?)/i, /(MSIE)(.*?)/i];
    var i = 0, len = arrReg.length, res = null;
    for (; i < len; i++) {
        if (res = user_agent.match(arrReg[i]) , res && res.length) {
            return {b: res[1], ver: res[2].trim()}
        }
    }
    return res;
}

exports.io = io;
