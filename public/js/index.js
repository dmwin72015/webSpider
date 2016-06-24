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
    $('#get').click(function () {
        var sUrl = '';
        var data = {url: $kw.val()};
        $.ajax({
            url: '/movie',
            type: 'post',
            data: {
                url: $kw.val()
            },
            timeout: '5000',
            success: function (data, textStatus, xhr) {
                console.log(data);
            },
            error: function (xml, textStatus, error) {
                console.log(textStatus);
            }
        })
    });
});