var io = require('socket.io').listen('8080');
var sockets = io.sockets;

io.on('connection', (socket)=> {
    console.log('链接成功......');

    // console.dir(socket);

    socket.emit('connect', {user: '张三', msg: '链接成功'});

    socket.on('message', (data)=> {
        console.log(data);
    });

    socket.on('mydata',(data)=>{

        console.log(data);
        data.time = new Date;

        socket.emit('sendToClient',data);
    });

});


exports.io = io;
