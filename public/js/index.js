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
            timeout: '1500',
            success: function (data, textStatus, xhr) {
               console.dir(data);
            },
            error: function (xml, textStatus, error) {
                console.log(textStatus);
            }
        })
    });
});