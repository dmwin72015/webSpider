define(function(require, exports, module) {
    // 'use strict';
    var jQuery = $ = require('jquery');
    var $easing = require('easing')($);
    $(function() {
        var nav = $('#nav');
        var oBgBlock = $('#textbg');
        var timer = null;
        $('.nav>ul>li').on({
            'mouseover': function(ev) {
                var _this = $(this);
                timer = setTimeout(function() {
                    oBgBlock.stop().animate({
                        width: _this.outerWidth(),
                        left: _this.position().left
                    }, 300);
                }, 200);
            },
            'mouseout': function(ev) {
                if (!$.contains(nav[0], oBgBlock[0])) {
                    var oCurr = $('li.cuurent');
                    oBgBlock.stop().animate({
                        width: oCurr.outerWidth(),
                        left: oCurr.position().left
                    }, 300);
                }
                clearTimeout(timer);
            }
        });
    });
});