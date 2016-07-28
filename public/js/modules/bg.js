define(function(require, exports, module) {
    var langZh_Cn = {
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
    };

    var $ = window.jQuery = require('jquery');
    require('datatable')($);
    require('bootstrap')($);
    $(function() {
        $('nav.leftbar-nav').on('click', 'li.sub-menu>a', function() {
            $(this).parent().hasClass('open') ? $(this).next().slideUp(250) && $(this).parent().removeClass('open') : $(this).next().slideDown(250) && $(this).parent().addClass('open');
        });
        $.extend($.fn.dataTableExt.oStdClasses, {
            sWrapper: "dataTables_wrapper form-inline",
            // sFilterInput: "form-control",
            sLengthSelect: "form-control"
        });
        $('#usertable').dataTable({
            "dom": '<"row"<"col-sm-6 col-xs-5"l><"col-sm-6 col-xs-7"f>>',
            'oLanguage': {
                sLengthMenu: "_MENU_",
                sSearch: '<div class="input-group">_INPUT_<i class="fa fa-search"></i></div>',
                // sInfo: "<strong>_START_</strong>-<strong>_END_</strong> of <strong>_TOTAL_</strong>",
                "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项"
            },
            'language': langZh_Cn,
        });
        var $table = $('#usertable');
        $table.on('click', 'tbody i', function() {
            changeClass($(this), 'fa-square-o', 'fa-check-square-o');
        })
        $('#adduser').on('click', function() {
            $('.pagelayer').show();
            $('.lycover,.lycontent').addClass('show');



        });
        $('#page-wraper').on('click', 'a.lyclose,a.lyfn-btn.cancle', function() {
            $('.pagelayer').hide();
            $('.lycover,.lycontent').removeClass('show');
        });
        $('#page-wraper').on('click','#saveuser',function () {
            $.ajax({
                url:'',
                type:'post',
                data:'',
                success:function(){

                }
            });
        })
        function changeClass(obj, c1, c2) {
            obj.hasClass(c1) ? obj.removeClass(c1).addClass(c2) : obj.removeClass(c2).addClass(c1);
        }
    });
});
