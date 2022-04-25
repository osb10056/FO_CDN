/*
 * name : ui_search_ink.js
 * desc : 통합검색 공통 자바스크립트
 * writer : glim
 * create : 2021/12/14
 * update :
 * -
 */

$(function () {
	// 리스트형보기/썸네일형보기 토글 버튼 이벤트 설정
	KyoboBookPub.ink.setSwitchListBtn(function(tg){
		if(tg.hasClass('view_type_img')){
			tg.find('.prod_area').removeClass('horizontal');
		}else{
			tg.find('.prod_area').addClass('horizontal');
		}
	});

	// 검색 전 - 지금 많이 찾는 상품 or 함께 많이 본 상품 swiper
	if ($('.keyword_prod_swiper_wrap .keyword_prod_swiper .swiper-slide').length > 1){
		$('.control_keyword_prod').css('display', 'block');

		var keywordProdSwiper = new CustomSwiper('.keyword_prod_swiper_wrap .keyword_prod_swiper', {
			slidesPerView: '1',
			speed: 500,
			navigation: {
				nextEl: $('.control_keyword_prod').find('.swiper_control_box .swiper-button-next')[0],
				prevEl: $('.control_keyword_prod').find('.swiper_control_box .swiper-button-prev')[0],
			},
			pagination: {
				el: $('.control_keyword_prod').find('.swiper_control_box .swiper-pagination')[0],
				type: "fraction",
				formatFractionCurrent: function (number) {
					return KyoboBookPub.ink.setPrependZero(number, 2);
				},
				formatFractionTotal: function (number) {
					return KyoboBookPub.ink.setPrependZero(number, 2);
				},
			},
		});
	} else {
		$('.control_keyword_prod').css('display', 'none');
	}

	// 검색 후 - 관련 상품
	if ($('.related_prod_swiper_wrap .related_prod_swiper .swiper-slide').length > 1){
		var keywordProdSwiper = new CustomSwiper('.related_prod_swiper_wrap .related_prod_swiper', {
			slidesPerView: '1',
			speed: 500,
			spaceBetween: 10,
			navigation: {
				nextEl: $('.control_related_prod').find('.swiper_control_box .swiper-button-next')[0],
				prevEl: $('.control_related_prod').find('.swiper_control_box .swiper-button-prev')[0],
			},
			pagination: {
				el: $('.control_related_prod').find('.swiper_control_box .swiper-pagination')[0],
				type: "fraction",
				formatFractionCurrent: function (number) {
					return KyoboBookPub.ink.setPrependZero(number, 2);
				},
				formatFractionTotal: function (number) {
					return KyoboBookPub.ink.setPrependZero(number, 2);
				},
			},
		});
	} else {
		$('.control_related_prod').css('display', 'none');
	}

	// 검색 후 - 관련 이벤트
	if ($('.related_event_swiper_wrap .related_event_swiper .swiper-slide').length > 1){
		var keywordProdSwiper = new CustomSwiper('.related_event_swiper_wrap .related_event_swiper', {
			slidesPerView: 'auto',
			slidesPerGroup: 2,
			speed: 500,
			navigation: {
				nextEl: $('.control_related_event').find('.swiper_control_box .swiper-button-next')[0],
				prevEl: $('.control_related_event').find('.swiper_control_box .swiper-button-prev')[0],
			},
			pagination: {
				el: $('.control_related_event').find('.swiper_control_box .swiper-pagination')[0],
				type: "fraction",
				formatFractionCurrent: function (number) {
					return KyoboBookPub.ink.setPrependZero(number, 2);
				},
				formatFractionTotal: function (number) {
					return KyoboBookPub.ink.setPrependZero(number, 2);
				},
			},
		});
	} else {
		$('.control_related_event').css('display', 'none');
	}

	searchBannerSwiperInit();
	hotKeywordSwiperInit();
	searchEventSwiperInit();
	searchReccomendSwiperInit();
	searchAuthorSwiperInit();
	setSpecCompareLayer();
	relatedKeywordMore();
});

// 상단 배너 swiper
function searchBannerSwiperInit(){
	// swiper 재생/멈춤 버튼 타입 script

	$('.search_banner_wrap .banner_area').each(function(){
		var searchBannerSwiperEl = $(this);

		if( $('.swiper-slide', searchBannerSwiperEl).length > 1 ) {
			var serhchBannerSwiper = new CustomSwiper(searchBannerSwiperEl, {
				init: false,
				slidesPerView: 1,
				speed: 800,
				observer: true,
				observeParents: true,
				initialSlide: 0,
				loop: true,
				navigation: {
					nextEl: $('.swiper_auto_control_area .swiper-button-next', $(this))[0],
					prevEl: $('.swiper_auto_control_area .swiper-button-prev', $(this))[0],
				},
				pagination: {
					el: $('.swiper_auto_control_area .swiper-pagination', $(this))[0],
					type: 'fraction',
					formatFractionCurrent: function (number) {
						return KyoboBookPub.ink.setPrependZero(number, 2);
					},
					formatFractionTotal: function (number) {
						return KyoboBookPub.ink.setPrependZero(number, 2);
					},
				},
			});
			serhchBannerSwiper.init();
		}else{
			$('.swiper_auto_control_area', searchBannerSwiperEl).remove();
		}
	});
}

// 실시간 검색어 swiper
function hotKeywordSwiperInit(){
	if ($('.hot_keyword_list .swiper-slide').length > 1){
		hotKeywordSwiper = new CustomSwiper('.hot_keyword_list', {
			direction: 'vertical',
			slidesPerView: 'auto',
			loop: true,
			speed: 500,
			autoplay: {
				delay: 2000,
			},
		});
	}
}

// 검색결과 이벤트 배너
function searchEventSwiperInit(){
	if ($('.event_swiper_wrap .swiper-slide').length > 3) {
		var searchEventSwiper = new CustomSwiper($('.event_swiper_wrap .swiper-container'), {
			slidesPerView: 'auto',
			speed: 500,
			navigation: {
				nextEl: $('.event_swiper_wrap').find('.swiper-button-next')[0],
				prevEl: $('.event_swiper_wrap').find('.swiper-button-prev')[0],
			},
		});
	}else{
		$('.event_swiper_wrap').find('.swiper-button-next').remove();
		$('.event_swiper_wrap').find('.swiper-button-prev').remove();
	}
}

// 함께 많이 본 상품
function searchReccomendSwiperInit(){
	if($('.prod_swiper_wrap.outside_nav').length > 0) {
		$('.prod_swiper_wrap.outside_nav').each(function () {
			var prodNavSwiperEl = $(this);
			if ($('.swiper-slide', prodNavSwiperEl).length > 6) {
				var prodNavSwiper = new CustomSwiper($('.swiper-container', prodNavSwiperEl), {
					slidesPerView: 'auto',
					speed: 500,
					navigation: {
						nextEl: $('.swiper-button-next', prodNavSwiperEl)[0],
						prevEl: $('.swiper-button-prev', prodNavSwiperEl)[0],
					},
				});
			}else{
				$('.swiper-button-next', prodNavSwiperEl).remove();
				$('.swiper-button-prev', prodNavSwiperEl).remove();
			}
		});
	}
}

// 저자정보
function searchAuthorSwiperInit(){
	if ($('.author_info_swiper_wrap .swiper-slide').length > 2) {
		var authorSwiper = new CustomSwiper($('.author_info_swiper_wrap .swiper-container'), {
			slidesPerView: 'auto',
			speed: 500,
			navigation: {
				nextEl: $('.author_info_swiper_wrap').find('.swiper-button-next')[0],
				prevEl: $('.author_info_swiper_wrap').find('.swiper-button-prev')[0],
			},
		});
	}else{
		$('.author_info_swiper_wrap').find('.swiper-button-next').remove();
		$('.author_info_swiper_wrap').find('.swiper-button-prev').remove();
	}
}

function setSpecCompareLayer(){
	var layerWrap;
	layerWrap = '.spec_compare_layer_wrap';

	if($(layerWrap).length > 0){
		// open
		$('.btn_spec_compare').on('click', function(){
			if($(layerWrap).hasClass('open')) return;
			$(layerWrap).addClass('open')
		});

		// close
		$('.btn_layer_close').on('click', function(){
			if(!$(layerWrap).hasClass('open')) return;
			$(this).closest(layerWrap).removeClass('open');
		});
	}
}

// 연관검색어 더보기 toggle
function relatedKeywordMore(){
	$('.related_keyword_wrap .btn_tag_more').on('click', function(){
		if($(this).closest('.related_keyword_inner').find('.tag_wrap').hasClass('active')){
			$(this).find('.hidden').text('더보기');
			$(this).closest('.related_keyword_inner').find('.tag_wrap').removeClass('active');
		}else{
			$(this).find('.hidden').text('접기');
			$(this).closest('.related_keyword_inner').find('.tag_wrap').addClass('active');
		}
	});
}