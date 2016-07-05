/**
 * Created by yxp on 2016/6/21.
 */
$(function () {
    var socket = io('http://localhost:8080');
    var $kw = $('#kw');
    $kw.focus(function () {
        $(this).parent().addClass('active');
    }).blur(function () {
        $(this).parent().removeClass('active');
    });
    $('#get').on('click',function () {
        var sUrl = '';
        var data = {url: $kw.val()};
        $.ajax({
            url: '/pach/ruanyf',
            type: 'post',
            data: {
                url: $kw.val(),
                pathname:window.location.pathname
            },
            success: function (data, textStatus, xhr) {
               console.dir(data);
            },
            error: function (xml, textStatus, error) {
                console.log(textStatus);
            }
        })
    });
});