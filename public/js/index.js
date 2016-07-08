/**
 * Created by yxp on 2016/6/21.
 */
/**
 * 产生一个UUID
 */
function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
}

$(function () {
    var socket = io('http://localhost:9080');
    var $kw = $('#kw');
    var $ul = $('div.result-list ul').eq(0);
    $kw.focus(function () {
        $(this).parent().addClass('active');
    }).blur(function () {
        $(this).parent().removeClass('active');
    });
    $('#get').on('click', function () {
        // var sUrl = 'http://www.ruanyifeng.com/blog/algorithm/';
        // var sUrl = 'http://www.ruanyifeng.com/blog/javascript';
        var sUrl = 'http://www.ruanyifeng.com/blog/developer/';
        var data = {url: $kw.val() || sUrl};
        $.ajax({
            url: '/article/ruanyf',
            type: 'post',
            data: data,
            success: function (data, textStatus, xhr) {
                if (data && data.err == 1) {
                    var len;
                    if (data.d && (len = data.d.length) > 0) {
                        $('#arti_num').html('一共搜索到<em>' + len + '</em>条结果');
                        var str = '',
                            i = 0;
                        for (; i < len; i++) {
                            str += '<li id="' + uuid() + '"><span class="arti_name">(' + data.d[i].name + ')</span><span class="arti_href">' + data.d[i].href + '</span><a class="tosee">采集</a></li>'
                        }
                        $ul.html(str);
                    }

                } else {
                    alert(data.msg);
                }

            },
            error: function (xml, textStatus, error) {
                console.log(textStatus);
            }
        })
    });

    // 采集单个
    $ul.on('click', 'a.tosee', function () {
        if ($(this).hasClass('disable')) return;
        var url = $(this).prev().text();
        var id = $(this).parent()[0].id;
        // var url = 'http://www.ruanyifeng.com/blog/2008/03/six_criteria_of_a_business-critical_programming_language.html';
        socket.emit('get_article_data', {
            url: url,
            id: id
        });
    });

    // 采集所有
    $('#caiji').on('click', function () {
        var arr = [];
        $ul.find('li span.arti_href').each(function (i, e) {
            arr.push($(e).text());
            if (!$(this).next().hasClass('disable')) {
                var id = $(e).parent()[0].id;
                var url =  $(e).text();
                if(url.indexOf('odp_data_php_parser')>-1){
                    return;
                }
                socket.emit('get_article_data', {
                    url:url,
                    id: id
                })
            }
        });
    });

    //监听与服务器连接
    socket.on('connect', (data) => {
        // console.log('链接成功.....');
    });

    //监听 服务器端是否成功获取页面资源
    socket.on('dataFromServer', (json) => {
        console.log(json);

        var id = json.id;
        var resStatus = json.err ? '成功' : '重试';
        var sClass = json.err ? 'tosee disable ' : 'tosee try-again fale';
        $('#' + id).find('a').attr('class', sClass).text(resStatus);
    });

});
