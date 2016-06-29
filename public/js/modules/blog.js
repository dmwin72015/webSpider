define(function(require, exports, module) {
    // 'use strict';
    var jQuery = $ = require('jquery');
    var $datatable = require('datatable')($);
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
    //判断某一个元素实在包含另一个元素
    function isContains(o1, o2) {
        if (o1.compareDocumentPosition) {
            //TODO compareDocumentPosition返回值有点意思
            return o1 === o2 || !!(o1.compareDocumentPosition(o2) & 16);
        }
        if (o1.contains && o1.nodeType === 1) {
            return o1.contains(o2) && o1 !== o2;
        }
        while (o1 = o1.parentNode) {
            if (o1 === o2) {
                return true;
            }
            return false;
        }
    };

    ! function($, root, doc) {
        /** 全局变量、参数****/
        root = root ? root : window;
        doc = doc ? doc : window.document;
        var config = {
            area: ['200px', '300px'],
            autoPlay: 0,
            time: 1500,
            events: ['click', 'hover'],
            currEv: 'click', //默认触发事件
            defaultIndex: 0,
            direction: 0, //【1 顺时针】  【0 逆时针】
            round: 1, //循环播放
            nav: 1,
            button: 2, // 是否显示左右按钮 【1 是】、【0 否】
            buttonOption: {
                show: 0, //0 鼠标移入显示 ；1 一直显示
                event: 'click' //触发事件
            },
            hoverStop: 1 //鼠标停留是否停止播放，【1 是】、【0 否】
        };
        var eleClass = ['flip-item', 'unshow', 'past', 'prev', 'current', 'next', 'future'],
            fnClass = eleClass.slice(1), //用到的五个功能类名
            sAllClass = '.' + eleClass[0], //.flip-item
            sfnClass = '.' + fnClass.join(',.'); //.past,.prev,.current,.next,.future

        var navClass = ['flip-nav', 'nav-item'];

        var arrowClass = ['flip-arrow-btn', 'arrow-btn', 'l_arrow,r_arrow'];

        /***公共函数（方法）**/
        //根据当前下标和总元素个数，返回循环数组
        function getRoundArr(index, len) {
            var aTmp = [];
            switch (index) {
                case 0:
                    aTmp = [len - 2, len - 1, index, index + 1, index + 2];
                    break;
                case 1:
                    aTmp = [len - 1, index - 1, index, index + 1, index + 2];
                    break;
                case len - 1:
                    aTmp = [index - 2, index - 1, index, 0, 1];
                    break;
                case len - 2:
                    aTmp = [index - 2, index - 1, index, index + 1, 0];
                    break;
                default:
                    aTmp = [index - 2, index - 1, index, index + 1, index + 2];
                    break;
            }
            return aTmp;
        }



        /***内部调用类（单例模式）， 存放公共信息**/
        var _DM = {
            // srcEle: this,
            config: function(argument) {
                // body...
            },
        };

        //每个元素的返回对象 
        // fnClass   'unshow', 'past', 'prev', 'current', 'next', 'future'
        _DM.baseGo = function(index, opt, $ol) {
            var _this = this,
                $this = $(this),
                _aAllSon = $(this).find(sAllClass),
                _nLen = _aAllSon.length,
                _fnLen = _nLen - 1,
                _aFnSon = $(this).find(sfnClass);

            if (index < 0) index = 0;
            if (index > _nLen - 1) index = _nLen - 1;
            _this.cuurentIndex = index;
            _aFnSon.removeClass(fnClass.join(' '));
            // console.log(index, '-当前下标-', _this.cuurentIndex);
            var arrIndex = getRoundArr(index, _nLen);
            for (var x = 0; x < arrIndex.length; x++) {
                _aAllSon.eq(arrIndex[x]).addClass(fnClass[x + 1]);
            }
            for (var i = 0; i < _nLen; i++) {
                if ($.inArray(i, arrIndex) == -1) {
                    _aAllSon.eq(i).addClass(fnClass[0])
                }
                if ($ol) {
                    if (i == index) {
                        $ol.children().eq(i).addClass('current');
                    } else {
                        $ol.children().eq(i).removeClass('current');
                    }
                }
            }
        };


        //自动播放
        _DM.autoGo = function(opt, $ol) {
            var _this = this,
                $this = $(this),
                _nLen = $(this).find(sAllClass).length;
            _this.cuurentIndex = parseInt(opt.defaultIndex);
            _this.timer = setInterval(function() {
                opt.direction ? _this.cuurentIndex++ : _this.cuurentIndex--;
                if (_this.cuurentIndex >= _nLen) _this.cuurentIndex = 0;
                if (_this.cuurentIndex < 0) _this.cuurentIndex = _nLen;
                _DM.baseGo.call(_this, _this.cuurentIndex, opt, $ol);
            }, opt.time);

            $(this).on({
                'mouseover': function() {
                    console.log('鼠标移入，停止自动播放')
                    clearInterval(_this.timer);
                },
                'mouseout': function() {
                    console.log('鼠标移出，开始自动播放')
                }
            }, sfnClass);

        };

        //初始化图片
        _DM.initPic = function() {
            var _this = this;
            var aSon = $(this).find(sAllClass);
            var nLen = aSon.length;
            var nCuur = this.cuurentIndex;
            var aFnSon = getRoundArr(nCuur, nLen);
            if (nCuur < 0) nCuur = 0;
            if (nCuur > nLen - 1) nCuur = nLen - 1;

            for (var x = 0; x < aFnSon.length; x++) {
                aSon.eq(aFnSon[x]).addClass(fnClass[x + 1]);
            }
            for (var i = 0; i < nLen; i++) {
                if ($.inArray(i, aFnSon) == -1) {
                    aSon.eq(i).addClass(fnClass[0])
                }
            }
            // setTimeout(function(){
            //     $(_this).css('opacity','1')
            // },150);
        };

        //创建导航小点
        _DM.initNav = function() {
            var len = $(this).find(sAllClass).length;
            console.log(len);
            var $ol = $('<ol class="flip-nav">');
            var inner = '';
            for (var i = 0; i < len; i++) {
                var sTmp = this.cuurentIndex == i ? 'current' : '';
                inner += '<li class="nav-item ' + sTmp + '"></li>';
            }
            $(this).after($ol.html(inner));
            return $ol;
        }

        //初始化左右两边按钮
        _DM.initArrow = function() {
            var $arrowBox = $('<div class="flip-arrow-btn">');
            var $arrowL = $('<a href="javascript:;" class="arrow-btn l_arrow"></a>');
            var $arrowR = $('<a href="javascript:;" class="arrow-btn r_arrow"></a>');
            $arrowBox.append($arrowL).append($arrowR);
            return $(this).parent().append($arrowBox);
        };
        // 插件调用名称
        $.fn.DmCarousel = function(opt) {
            // alias 设置 这里的 that(this) 调用这个方法的jQuery对象（可能是多个，也可能是一个）
            var
                that = this,
                eleConfig = $.extend({}, config, opt);
            // console.log(that);

            function init(opt) {
                // 遍历调用这个方法的jQuery对象，取得其中的每个元素。
                var arr = [];
                that.each(function(i, e) {
                    // 这里的this就是每一个DOM对象（原生）

                    var _this = this,
                        $this = $(this),
                        event = opt.currEv;
                    if (_this.flag) return;
                    _this.cuurentIndex = parseInt(opt.defaultIndex);

                    //初始化图片
                    _DM.initPic.call(_this);

                    // 创建小点
                    var $ol = opt.nav ? _DM.initNav.call(_this) : void 0;

                    // 绑定事件 图片点击
                    $this.on('click', sfnClass, function(ev) {
                        if (!$(this).hasClass(fnClass[3]))
                            _DM.baseGo.call(_this, $(this).index(), opt, $ol);
                    });

                    //绑定事件 小点点击
                    $ol ? $this.parent().on(event, '.nav-item', function(ev) {
                        if (!$(this).hasClass(fnClass[3])) {
                            _DM.baseGo.call(_this, $(this).index(), opt, $ol);
                        }
                    }) : void 0;

                    if (opt.autoPlay) {
                        _DM.autoGo.call(_this, opt, $ol || void 0);
                    }

                    if (opt.button) {
                        _DM.initArrow.call(_this, opt);
                        var _nLen = $this.find(sAllClass).length;
                        $this.parent().on('click', '.l_arrow,.r_arrow', function() {
                            $(this).hasClass('l_arrow') ? _this.cuurentIndex++ : _this.cuurentIndex--;
                            if (_this.cuurentIndex >= _nLen) _this.cuurentIndex = 0;
                            if (_this.cuurentIndex < 0) _this.cuurentIndex = _nLen;
                            _DM.baseGo.call(_this, _this.cuurentIndex, opt, $ol);
                        });
                    }
                    //返回的结果
                    arr[i] = {
                        go: function(index) {
                            DM.baseGo.call(_this, index, opt, $ol);
                        },
                        stop: function() {
                            clearInterval(_this.timer);
                        },
                        start: function() {
                            _DM.autoGo.call(_this, opt)
                        }
                    };
                });
                return arr.length == 1 ? arr[0] : arr;
            };
            return init(eleConfig);
        };
    }(jQuery, window, document)

    // 
    var carouse = $('#DmCarousel').DmCarousel({
        autoPlay: true,
        time: 3000,
        currEv: 'mouseover',
        nav: true,
        hoverStop: true,
        direction: 1
    });

    $('.logo').click(function() {
        carouse.stop();
        alert('停止播放');
    })


});
