/**
 * Created by yxp on 2016/6/21.
 */
$(function () {
    var $kw = $('#kw');
    $kw.focus(function () {
        $(this).parent().addClass('active');
    }).blur(function () {
        $(this).parent().removeClass('active');
    });
    $('#get').one('click',function () {
        var sUrl = '';
        var data = {url: $kw.val()};
        $.ajax({
            url: '/movie',
            type: 'post',
            data: {
                url: $kw.val(),
                pathname:window.location.pathname
            },
            timeout: '15000',
            success: function (data, textStatus, xhr) {
               console.dir(data);
            },
            error: function (xml, textStatus, error) {
                console.log(textStatus);
            }
        })
    });
});