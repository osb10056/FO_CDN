/*
 * name : ui_my_ink.js
 * desc : 마이룸 공통 실행 자바스크립트
 * writer : glim
 * create : 2021/02/04
 * update :
 * -

 */
$(function(){
	prodFilterOnOff();
});

// 상세조회 필터레이어 열기/닫기
function prodFilterOnOff(){
	var filterWrapEl = $('.prod_filter_wrap');

	$('.btn_sm', filterWrapEl).on('click', function(){
		filterWrapEl.addClass('active');
		$('.form_sel select', filterWrapEl).selectmenu('calcMenuWidth');
	});

	$('.btn_close_filter', filterWrapEl).on('click', function(){
		filterWrapEl.removeClass('active');
	});
}

$(window).on('load', function() {
	$('.my_profile_area .blur_img_box').each(function () {
		new blurify({
			images: $(this).find('img'),
			blur: 30,
			mode: 'auto',
		});
	});
});
