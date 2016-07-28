define(function (require, exports, module) {
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

    //切换class
    function changeClass(obj, c1, c2) {
        obj.hasClass(c1)
            ? obj.removeClass(c1).addClass(c2)
            : obj.removeClass(c2).addClass(c1);
    }

    function toggleAttr(obj, k, v) {


    }

    $(function () {
        $('nav.leftbar-nav').on('click', 'li.sub-menu>a', function () {
            $(this).parent().hasClass('open') ? $(this).next().slideUp(250) && $(this).parent().removeClass('open') : $(this).next().slideDown(250) && $(this).parent().addClass('open');
        });
        $.extend($.fn.dataTableExt.oStdClasses, {
            sWrapper: "dataTables_wrapper form-inline",
            // sFilterInput: "form-control",
            sLengthSelect: "form-control"
        });

        var $table = $('#usertable');
        $table.dataTable({
            "dom": '<"row"<"col-sm-6 col-xs-5"l><"col-sm-6 col-xs-7"f>>',
            'oLanguage': {
                sLengthMenu: "_MENU_",
                sSearch: '<div class="input-group">_INPUT_<i class="fa fa-search"></i></div>',
                // sInfo: "<strong>_START_</strong>-<strong>_END_</strong> of <strong>_TOTAL_</strong>",
                "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项"
            },
            'language': langZh_Cn,
        });
        $table.on('click', 'tr td:first-child', function () {
            var otr = $(this).parent();
            changeClass($(this).find('i'), 'fa-square-o', 'fa-check-square-o');
            if(otr.attr('data-status')){
                otr.removeAttr('data-status');
            }else{
                otr.attr('data-status','selected');
            }
        });

        var $pagelayer = $('.pagelayer');

        $('#adduser').on('click', function () {
            $('.dmlayer').removeClass('disN').find('.lycover').addClass('show');
            $('body').css('overflow', 'hidden');
        });

        $pagelayer.on('click', 'a.cancle,a.lyclose', function () {
            var dmlayer = $('.dmlayer');
            dmlayer.addClass('disN').find('.lycover').removeClass('show');
            dmlayer.find('.form-group').removeClass('has-error');
            dmlayer.find('.lyloading').addClass('disN');
            $('body').css('overflow', 'visible');
        });

        var rName = /[\u4e00-\u9fa5\w]{1,20}/g,
            rPsswd = /\w{8,10}/g,
            rEmail = /^\w+@\w+(\.\w+)+$/g,
            rWeb = /^https?:\/\/\w+\..*/g;

        var formReady = [];
        var len = $pagelayer.find('form input,form textarea').length;

        $pagelayer.on('click', '#saveuser', function () {
            var $realname = $('#realname'),
                $nickname = $('#nickname'),
                $email = $('#email'),
                $website = $('#website'),
                $rolename = $('#rolename'),
                $userstatus = $('#userstatus');

            $('#userdata input').trigger('blur', function (arr) {
                var flag = true;
                for (var i = 0; i < arr.length; i++) {
                    if (!arr[i]) {
                        flag = false;
                        break;
                    }
                }
                clearTimeout(timer);
                var timer = setTimeout(function () {
                    $('.lyloading').removeClass('disN');
                }, 300);
                if (flag) {
                    $('.lycontent').hide();
                    $.ajax({
                        url: '/admin/user/add',
                        type: 'post',
                        data: {
                            'realname': $realname.val(),
                            'nickname': $nickname.val(),
                            'email': $email.val(),
                            'website': $website.val(),
                            'role': $rolename.val(),
                            'description': $userstatus.val()
                        },
                        success: function (d) {
                            clearTimeout(timer);
                            console.log(d);
                            // alert(d.message);
                            $('a.lyclose').trigger('click');
                        }
                    });
                }
            });
        });


        $pagelayer.on('focus', 'form input', function () {
            $(this).parent().parent().removeClass('has-error');
        });

        $pagelayer.on('blur', 'form input', function (e, fn) {
            var reg;
            var isMust = false;
            var id = $(this).get(0).id;
            switch (id) {
                case 'realname':
                    reg = rName;
                    isMust = true;
                case 'rolename':
                case 'userstatus':
                case 'nickname':
                    reg = rName;
                    break;
                case 'email':
                    reg = rEmail;
                    isMust = true;
                    break;
                case 'website':
                    reg = rWeb;
                    break;
            }
            switch (validateItem($(this).val(), reg, isMust)) {
                case -1:
                    errorRemind(id, '不能为空');
                    formReady.push(false);
                    break;
                case -3:
                    errorRemind(id, '格式有误');
                    formReady.push(false);
                    break;
                default:
                    formReady.push(true);
                    removeErrorRemind(id);
                    break;
            }
            if (formReady.length == len - 1) {
                fn && fn(formReady);
                formReady.length = 0;
            }
        });

    });

    function validateItem(val, reg, isMust, length) {
        if (!val) {
            if (isMust) {
                return -1;
            } else {
                return true;
            }
        } else {
            if (!reg.test(val)) {
                return -3
            }
        }
        reg.lastIndex = 0;
        return true;
    }

    function errorRemind(selector, text) {
        $('span.help-block[error-for="' + selector + '"]').eq(0).text(text).parent().parent().addClass('has-error');
    }

    function removeErrorRemind(selector) {
        $('span.help-block[error-for="' + selector + '"]').eq(0).text('').parent().parent().removeClass('has-error');
    }

    $('#deluser').click(function () {
        var id = $('tr[data-status="selected"]').eq(0).attr('data-id');
        if(id){
            $.ajax({
                url: '/admin/user/del',
                type: 'post',
                data: {id:id},
                success: function (d) {
                    console.log(d);
                    alert(d.message);
                    location.reload(true);
                }
            });
        }
    });
});
