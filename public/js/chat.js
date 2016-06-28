$(function () {
    var socket = io('http://localhost:8080');
    var locat = window.location;

    //监听连接事件,
    socket.on('connect', (data)=> {
        if (!data) return;
        $('span.talk-to').text('在线人数' + data.currentNum || 0);
        $('#own-info').html(data.user + '(' + data.browser + ')');
    });
    
    

    //监听用户上线
    socket.on('userJoin', (data)=> {
        console.log(data.id);

        var arr = data.userlist,
            i = 0,
            len = arr.length;
            $ul = $('ul.user-list'),
            sRes = '';
        console.log(arr);
        for(;i<len;i++){
            sRes+='<li>' + arr[i].user + '(' + (arr[i].browser.b || 'unkown') + ')</li>'
        }
        $('span.talk-to').text('在线人数' + data.onlineNum);
        $ul.html(sRes);
    });

    //监听来自服务端的数据
    socket.on('sendToClient', (data)=> {
        console.log(data);
    });

    //监听群发消息
    socket.on('sendAllPeople', (data)=> {
        var $ul = $('div.record-area').find('ul');
        $ul.append('<li>' + data.msg + '(' + data.time + ')</li>');

    });
    $('#send').on('click', function () {
        var value = $('#kw').text();
        //触发服务都监听的事件,向服务端发数据
        socket.emit('mydata', {user: '张三', msg: value});
    });
});


