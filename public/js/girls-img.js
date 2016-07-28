;var I18N_CONFIG = {
    'zh_cn': {
        "sProcessing": "处理中...",
        "sLengthMenu": "显示 _MENU_ 项结果",
        "sZeroRecords": "没有匹配结果",
        "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
        "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
        "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
        "sInfoPostFix": "",
        "sSearch": "搜索:",
        "sUrl": "",
        "sEmptyTable": "表中数据为空",
        "sLoadingRecords": "载入中...",
        "sInfoThousands": ",",
        "oPaginate": {
            "sFirst": "首页",
            "sPrevious": "上页",
            "sNext": "下页",
            "sLast": "末页"
        },
        "oAria": {
            "sSortAscending": ": 以升序排列此列",
            "sSortDescending": ": 以降序排列此列"
        }
    }
};
$(function(argument) {
    var socket = io('http://localhost:9999');
    var $table = $('#mytable');

    $('#get').click(function() {
        var url = $('#kw').val() || '';
        // if (!url) {
        //     $('div.input-wraper').after('<p style="color:red">请输入url</p>');
        //     return;
        // }

        $.ajax({
            url: 'getgirlsimg',
            data: { url: url },
            type: 'post',
            success: function(d) {
                console.log(d);
                var data = d.data;
                var arr = [];
                if (d && data) {
                    var i = 0,
                        len = data.length;

                    for (; i < len; i++) {
                        var o = {
                            url: data[i].src,
                            links: data[i].link.length,
                            pic: data[i].img.length,
                            time:data[i].time/1000+'s'
                        }
                        arr.push(o);
                    }
                    initTable(arr);
                }
            },
            error: function(xml, status, c) {

            }
        });
    });

    $('#caiji').click(function() {
        initTable([{
            url: 'http://addasdasdasdasd',
            links: 10,
            pic: 20,
            time: '0.3s'
        }]);
    });

    // 触发保存图片事件
    $('ul').on('click', 'a.tosee', function(d) {
        socket.emit('save img to server', url)
    });


    // 初始化表格
    function initTable(data) {
        var $dataTable = $table.dataTable({
            language: I18N_CONFIG['zh_cn'],
            data: data,
            columns: [{ data: 'url' }, { data: 'links' }, { data: 'pic' }, { data: 'time' }],
            createdRow: function(row, data, index) {
                console.log(data);
            }
        });
    }
    // initTable();

    // 保存图片到本地成功
    socket.on('save img result', function(d) {
        console.log(d);
        if (d.code == '100') {
            var src = d.info.url;
            var oimg = new Image();
            oimg.src = src;
            document.body.appendChild(oimg);
        }
    });
});
