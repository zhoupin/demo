'use strict';

$(function() {
	// 图片轮播
	var slide = {
		init: function() {
			var that = this,
				index = 0,
				box = $('#img_wrapper'),
				panel = box.find('.big_img .img'),
				length = panel.length;

			box.on('click', '.prev', function() {
				index--;
				index = index < 0 ? length - 1 : index;
				that.switchable(index);
			});
			box.on('click', '.next', function() {
				index++;
				index = index > length - 1 ? 0 : index;
				that.switchable(index);
			});
			box.on('click', '.small_img li', function() {
				index = $(this).index();
				that.switchable(index);
			});
		},
		switchable: function(index) {
			var that = this,
				box = $('#img_wrapper'),
				panel = box.find('.big_img .img'),
				nav = box.find('.small_img li');
			panel.eq(index).addClass('cur').siblings().removeClass('cur');
			nav.eq(index).addClass('cur').siblings().removeClass('cur');
		}
	};

	slide.init();
	// 文案tab切换
	$('#deal_word').tab({
        nav: '.nav',
        pane: '.content .tab_con',
        delegater: 'li',
        cls: 'cur',
        evt: 'click'
	});
});