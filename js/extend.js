'use strict';

$.fn.extend({
    // 标签页
    //param: option 配置参数列表，参考默认配置
    tab: function(option) {
        var opts = $.extend({
                //标签容器默认calss
                nav: '.tab-nav',
                //标签默认calss
                pane: '.tab-content .tab-pane',
                //标签默认标签
                delegater: 'a',
                //默认页签需要加上的class，加上后默认就显示这一页，之后每次添加该class的页签代表当前页签
                cls: 'active',
                //默认触发事件
                evt: 'mouseenter',
                //页签切换之后回调函数
                callback: null
            }, option),
            $this = this,
            $nav = $this.find(opts.nav),
            $navs = $nav.find(opts.delegater),
            $panes = $this.find(opts.pane),
            $current = $nav.find('.' + opts.cls),
            index = 0;
        if (!this.length) {
            return this;
        }
        if ($current.length) {
            if ($current.data('index') != undefined) {
                index = parseInt($current.data('index'));
            } else {
                index = $current.index();
            }
        };
        //初始切换到当前页签
        changeTab(index);
        //绑定页签切换触发事件，可以自定义触发事件，比如点击等
        $nav.delegate(opts.delegater, opts.evt, function(e) {
            e.preventDefault();
            var $this = $(this);
            if ($this.data('index') != undefined) {
                index = parseInt($this.data('index'));
            } else {
                index = $this.index();
            }
            changeTab(index);
        });
        // 防止未设href点击
        opts.evt == 'click' || $nav.delegate(opts.delegater, 'click', function(e) {
            e.preventDefault();
        });

        //切换页签事件
        function changeTab(index) {
            $navs.eq(index).addClass(opts.cls).siblings().removeClass(opts.cls);
            $panes.eq(index).addClass(opts.cls).siblings().removeClass(opts.cls);
            //执行回调函数
            if ($.type(opts.callback) === 'function') {
                opts.callback.call($this, index);
            }
        };
        return this;
    },
     /*可循环轮播*/
    slide: function(option) {
        var opts = $.extend({
                //默认容器标签
                container: 'ul',
                //默认条目标签
                item: 'li',
                //默认翻前一页标签class
                prev: '.prev',
                //默认翻后一页标签class
                next: '.next',
                //默认分屏
                num: 1,
                //默认滑动动画时间
                speed: 500,
                //是否自动轮播
                auto: true,
                //鼠标移入时候是否暂定自动轮播，该选项在启动自动轮播的情况下生效
                pause: true,
                //自动轮播时间间隔
                time: 3000,
                //轮播前的回调函数
                callbackBefore: null,
                //轮播后的回调函数
                callback: null
            }, option),
            $this = this,
            $container = $this.find(opts.container),
            $items = $container.find(opts.item),
            $prev = $this.find(opts.prev),
            $next = $this.find(opts.next),
            _width = $items.outerWidth(true),
            len = $items.length,
            page = Math.ceil(len / opts.num),
            moving = false,
            n = 0,
            itemIndex = 0,
            exports = {
                n: 0,
                go: loop
            },
            timer;
        init();
        //绑定翻页事件
        $prev.bind('click', function(e) {
            e.preventDefault();
            exports.n--;
            loop();
        });
        $next.bind('click', function(e) {
            e.preventDefault();
            exports.n++;
            loop();
        });
        //是否开启自动轮播
        if (opts.auto) {
            timer = setInterval(function() {
                loop(++exports.n);
            }, opts.time);

            //是否绑定鼠标移入后暂停轮播
            if (opts.pause) {
                $container.parent().bind('mouseenter', function() {
                    clearInterval(timer);
                });
                $container.parent().bind('mouseleave', function() {
                    clearInterval(timer);
                    timer = setInterval(function() {
                        loop(++exports.n);
                    }, opts.time);
                });
            }
        };
        //初始化，
        function init() {
            //页面有宽窄屏区分，每次都必须重新获取
            var _width = $items.outerWidth(true);
            if (len <= opts.num) {
                $prev.hide();
                $next.hide();
            } else {
                //克隆一段相同的html代码，做轮播效果
                $items.first().clone().appendTo($container);
                $container.width((len + 1) * _width);
            }
            //默认第一个item为展示状态
            $items.eq(itemIndex).addClass("itemOn");
        };

        //轮播效果，借助animate动态修改margin值来达到滑动效果
        function loop(index, type) {
            //页面有宽窄屏区分，每次都必须重新获取
            var _width = $items.outerWidth(true);
            exports.n = index !== undefined ? index : exports.n;
            if (exports.n > page) {
                exports.n = 1;
                $container.css('margin-left', 0);
            }
            if (exports.n < 0) {
                exports.n = page - 1;
                $container.css('margin-left', -page * _width);
            }
            if (type === 'instance') {
                $container.css({
                    marginLeft: -exports.n * _width * opts.num
                });
                if (exports.n == page) {
                    $container.css('margin-left', 0);
                    exports.n = 0;
                }
            } else {

                if (!!opts.callbackBefore) {
                    opts.callbackBefore(itemIndex);
                }

                $container.stop().animate({
                    marginLeft: -exports.n * _width * opts.num
                }, opts.speed, function() {
                    // moving = false;
                    if (exports.n >= page) {
                        $container.css('margin-left', 0);
                        exports.n = 0;
                    }
                    //获取当前item 索引
                    itemIndex = -($container.css("marginLeft").replace("px", "") / _width);
                    $items.removeClass("itemOn");
                    $items.eq(itemIndex).addClass("itemOn");

                    if (!!opts.callback) {
                        opts.callback(itemIndex);
                    }
                });
            }
        };
        this.exports = exports;
        return this;
    }
});