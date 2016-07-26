define(function(require, exports, module) {
    var $ = window.jQuery  = require('jquery');
    var $datatable = require('datatable')($);
    var boots = require('bootstrap');
    $(function() {
        $('nav.leftbar-nav').on('click', 'li.sub-menu>a', function() {
            $(this).parent().hasClass('open') ? $(this).next().slideUp(250) && $(this).parent().removeClass('open') : $(this).next().slideDown(250) && $(this).parent().addClass('open');
        });
        $('#usertable').dataTable();
    })

});
