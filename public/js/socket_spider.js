/**
 * Created by yxp on 2016/6/28.
 */
$(function () {
    var socket = io('http://localhost:8080');
    var $ul = $('div.result-list>ul'),
        oUl = $ul.get(0);
    socket.on('send useFullLink', (data)=> {
        if (data && data.message == 'success') {
            var arr = data.data,
                i = 0,
                len = arr.length,
                str = '';
            for (; i < len; i++) {
                str += '<li>' + arr[i] + '<a href="javascript:;" class="tosee">查看</a></li>';
            }
            oUl.innerHTML = str;
            $('#kw').val('共获取到' + len + '条数据');
        } else {
            oUl.innerHTML = '没有获取到数据';

        }
    });

    socket.on('send singleData', (data)=> {
        if (data || data.errCode) {
            console.log(data.message);
        } else {
            alert(data.message);
        }
    });

    $('#get').click(function () {
        socket.emit('get baseUrl', 'http://www.dytt8.net');
    });
    $(oUl).on('click', 'a.tosee', function () {
        var url = $(this).parent().text().replace('查看', '');
        console.log(url);
        socket.emit('get singleUrl', url);
    });

});