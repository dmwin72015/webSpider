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

function getText(ele, recu, result) {
    var arrChild = ele.childNodes;
    var i = 0,
        len = arrChild.length,
        result = result || [];
    for (; i < len; i++) {
        var currNode = arrChild[i];
        if (recu && currNode.nodeType == 1) {
            getText(currNode, recu, result);
        } else if (currNode.nodeType == 3) {
            result.push(currNode.nodeValue);
        }
    }
    return innerText.join('');
}
/*
获取字符串的字节数
*/
function getSize(str, charset) {
    var total = 0,
        charCode,
        i,
        len;
    charset = charset ? charset.toLowerCase() : '';
    if (charset === 'utf-16' || charset === 'utf16') {
        for (i = 0, len = str.length; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode <= 0xffff) {
                total += 2;
            } else {
                total += 4;
            }
        }
    } else {
        for (i = 0, len = str.length; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode <= 0x007f) {
                total += 1;
            } else if (charCode <= 0x07ff) {
                total += 2;
            } else if (charCode <= 0xffff) {
                total += 3;
            } else {
                total += 4;
            }
        }
    }
    return total;

}

$(function() {
    var socket = io('http://localhost:9999');
    var $kw = $('#kw');
    var $ul = $('div.result-list ul').eq(0);
    $kw.focus(function() {
        $(this).parent().addClass('active');
    }).blur(function() {
        $(this).parent().removeClass('active');
    });
    $('#get').on('click', function() {
        // var sUrl = 'http://www.ruanyifeng.com/blog/algorithm/';
        // var sUrl = 'http://www.ruanyifeng.com/blog/javascript';
        // var sUrl = 'http://www.ruanyifeng.com/blog/developer/';
        var sUrl = $kw.val().trim()
            // if (!sUrl) {
            //     alert('请输入url');
            //     return;
            // }
        var data = { url: sUrl };
        $('.maskbgContainer').show();
        $.ajax({
            url: '/spider/geturls',
            type: 'post',
            data: data,
            // timeout: '2000',
            success: function(d, textStatus, xhr) {
                if (typeof d == 'string') {
                    d = $.parseJSON(d);
                }
                if (!$.isPlainObject(d)) {
                    console.log('数据格式有误!!!');
                }
                if (d.code != '100') {
                    console.log(d);
                    return;
                }
                console.log(d);
                var arrData = d.info.data;
                if (!arrData) {
                    return;
                }
                var i = 0,
                    len = arrData.length,
                    $ul = $('div.result-list>ul')[0];
                sTemplet = $('#list_tpt').html();
                var arrHtml = [];
                for (; i < len; i++) {
                    arrHtml[i] = sTemplet
                        .replace(/\{\$tmpID\}/, arrData[i].tid)
                        .replace(/\{\$title\}/, arrData[i].title)
                        .replace(/\{\$href\}/, arrData[i].href)
                        .replace(/\{\$read\}/, arrData[i].read)
                        .replace(/\{\$comment\}/, arrData[i].comment);
                }
                $ul.innerHTML = arrHtml.join('');
                $('.maskbgContainer').hide();
            },
            error: function(xml, textStatus, error) {
                $('.maskbgContainer').hide();
                var content = xml.responseText;
                if (content) {
                    var rTag = /<("[^"]*"|'[^']*'|[^'">])*>/g;
                    content = content.replace(rTag, function(str) {
                        switch (str) {
                            case '<h1>':
                            case '</h1>':
                                return str;
                                break;
                            case '<pre>':
                            case '</pre>':
                                return str
                            default:
                                return '';
                                break;
                        }
                    });
                    $('#errors').html(content);
                }else{
                    console.log('Nothing');
                }
                $('.maskbgContainer').hide();
            }
        });


    });

    // 采集单个
    $ul.on('click', 'a.tosee', function() {
        if ($(this).hasClass('disable')) return;
        var $parent = $(this).parent();
        var sTid = $parent[0].id;
        var sHref = $parent.find('span.href').text();
        var sTitle = $parent.find('span.title').text();
        var sRead = $parent.find('span.read').text().match(/\d+/)[0];
        var sComment = $parent.find('span.comment').text().match(/\d+/)[0];

        var oData = {
            'tid': sTid,
            'title': sTitle,
            'href': sHref,
            'read': sRead,
            'comment': sComment
        };
        alert(JSON.stringify(oData));

        // [触发]  服务器端保存数据事件
        socket.emit('save article data', oData);

        // [触发]  获取文章内容事件(在触发服务器端保存数据事件时.默认执行) 
        // socket.emit('get article data',{url:url,id:id});
    });

    // 采集所有
    $('#caiji').on('click', function() {
        $ul.find('li').each(function(i, e) {
            $(this).find('a.tosee').trigger('click');
        });
    });

    //[监听]  与服务器连接
    socket.on('connect', (data) => {
        // console.log('链接成功.....');
    });

    //[监听]  服务器是否成功保存数据到数据库中
    socket.on('article_data to client', function(d) {
        console.log(d);
        if (d.code != '100') {
            console.log(d);
            alert(d.message + '\n' + d.info.error);
            return;
        }
        $('#' + d.info.data[0]).find('a').addClass('disable').text('成功');
    });

});
