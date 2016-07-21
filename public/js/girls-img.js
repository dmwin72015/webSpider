;
$(function(argument) {
    $('#get').click(function() {
        var url = $('#kw').val() || '';
        if (!url) {
            $('div.input-wraper').after('<p style="color:red">请输入url</p>');
            return;
        }

        $.ajax({
            url: 'getgirlsimg',
            data: { url: url },
            type: 'post',
            success: function(data) {
                console.log(data);
            },
            error: function(xml, status, c) {

            }
        });
    });
});
