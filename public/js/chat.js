$(function () {
    var socket = io('http://localhost:8080');
    var locat = window.location;

    //监听连接事件,
    socket.on('connect', (data)=> {
        socket.send(locat.href);

    });

    //监听来自服务端的数据
    socket.on('sendToClient',(data)=>{
        console.log(data);
        alert(data.time);
    });

    $('#send').on('click', function () {
        var value = $('#kw').val();
        //触发服务都监听的事件,向服务端发数据
        socket.emit('mydata', {user: '张三', msg: value});
    });
});



