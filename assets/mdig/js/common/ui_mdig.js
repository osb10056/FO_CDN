/*
 * name : ui.js
 * desc : 공통 자바스크립트
 * writer : ipgroup
 * create : 2022/01/26
 * update :
 * -
 */

var KyoboBookPub = KyoboBookPub || {};

KyoboBookPub.mdig = KyoboBookPub.mdig || (function () {
	var _front = {};

	function setToggleClass(target,cls){
		var obj = $(target);
		obj.toggleClass(cls);
	}
	/**
	 * fold 설정
	 * @param selector Tab 생성 DOM 셀렉터(default : .tab_wrap)
	 */
	function setFoldBox(selector) {
		selector = selector ? selector : '.fold_wrap';
		if ($(selector).length > 0) {
			var allFoldBox = $(selector);
			allFoldBox.each(function(){
				var foldBtn = $(this).find('.btn_fold');
				var idx = $(this).index();
				foldBtn.off('click.uiFold').on('click.uiFold',function(e){
					var foldWrap = $(this).closest('.fold_wrap');
					var foldState = foldWrap.hasClass('expended');
					var allFoldState = allFoldBox.hasClass('expended');
					if(!foldState && allFoldState){
						allFoldBox.removeClass('expended');
					}
					foldWrap.toggleClass("expended");
				});
			});
		}
	}
	/**
	 * fold On/Off
	 */
	function setGnbCategoryFoldBox(selector){
		selector = selector ? selector : '.menu_category_box.type-fold';
		if ($(selector).length > 0) {
			var allFoldBox = $(selector);
			allFoldBox.each(function(){
				var foldBtn = $(this).find('.btn_fold_toggle');
				var idx = $(this).index();
				foldBtn.off('click').on('click',function(e){
					var foldWrap = $(this).closest('.menu_category_box.type-fold');
					var foldState = foldWrap.hasClass('active');
					var allFoldState = allFoldBox.hasClass('active');
					if(!foldState && allFoldState){
						allFoldBox.removeClass('active');
					}
					foldWrap.toggleClass("active")
				});
			});
		}
	}
	function setGnbSubCategoryInit(selector){
		selector = selector ? selector : '.menu_list_box';
		var allFoldBox = $(selector).find('.menu_list > li');
		$(selector).each(function(){
			$(this).find('.menu_list > li').each(function(){
				var hasSubBox =  $(this).find('.sub_menu_box').length;
				if(hasSubBox){
					$(this).find('> a').addClass('btn_fold');
					$(this).find('> a').on('click',function(){
						var foldWrap = $(this).parent()
						var foldState = foldWrap.hasClass('active');
						var allFoldState = allFoldBox.hasClass('active');
						if(!foldState && allFoldState){
							allFoldBox.removeClass('active');
						}
						foldWrap.toggleClass("active");
						return false
					})
				}
			});
		});
	}
	//
	function setSwiperDefault(){
		var loop_type = null;
		var align_type = null;
		var has_fold = null;
		var swipe_auto = null;
		if($('.swiper-container.swiper_default').length > 0){
			$('.swiper-container.swiper_default').each(function () {
				var defSwiperEl = $(this);
				if ($('.swiper-slide', defSwiperEl).length > 1) {
					loop_type =  defSwiperEl.attr('swipe-loop') == 'true' ? loop_type = true : loop_type = false;
					align_type =  defSwiperEl.attr('swipe-align') == 'true' ? align_type = true : align_type = false;
					has_fold =  defSwiperEl.attr('has-fold') == 'true' ? has_fold = true : has_fold = false;
					swipe_auto =  defSwiperEl.attr('swipe-auto') == 'true' ? swipe_auto = true : swipe_auto = false;
					var paging_type = 1;
					var defaultSwiper = new CustomSwiper(defSwiperEl.get(0), {
						slidesPerView: 'auto',
						loop:loop_type,
						centeredSlides:align_type,
						speed: 500,
						autoplay: swipe_auto,
						disableOnInteraction:true,
						on: {
							slideChange: function () {
								if(has_fold){
									defSwiperEl.find('.fold_wrap.expended').removeClass('expended');
								}
							}
						}
					});
				}else{
					$('.swiper-scrollbar', defSwiperEl).remove();
				}
			});
		}

		if($('.swiper-container.swiper_freemode').length > 0){
			$('.swiper-container.swiper_freemode').each(function () {
				var defSwiperEl = $(this);
				if ($('.swiper-slide', defSwiperEl).length > 1) {
					var paging_type = 1;
					var defaultSwiper = new CustomSwiper(defSwiperEl.get(0), {
						slidesPerView: 'auto',
						speed: 500,
						freeMode: true,
						disableOnInteraction:true,
					});
				}else{
					$('.swiper-scrollbar', defSwiperEl).remove();
				}
			});
		}

		if($('.swiper-container.swiper_default_loop').length > 0){
			$('.swiper-container.swiper_default_loop').each(function () {
				var defLoopSwiperEl = $(this);
				if ($('.swiper-slide', defLoopSwiperEl).length > 1) {
					var defaultSwiper = new CustomSwiper(defLoopSwiperEl.get(0), {
						slidesPerView: 'auto',
						speed: 500,
					});
				}else{
					$('.swiper-scrollbar', defLoopSwiperEl).remove();
				}
			});
		}

		if($('.swiper-container.swiper_paging_fraction').length > 0){
			$('.swiper-container.swiper_paging_fraction').each(function () {
				var defSwiperEl = $(this);
				if ($('.swiper-slide', defSwiperEl).length > 1) {
					loop_type =  defSwiperEl.attr('swipe-loop') == 'true' ? loop_type = true : loop_type = false;
					align_type =  defSwiperEl.attr('swipe-align') == 'true' ? align_type = true : align_type = false;
					var defaultSwiper = new CustomSwiper(defSwiperEl.get(0), {
						slidesPerView: 'auto',
						loop:loop_type,
						centeredSlides:align_type,
						speed: 500,
						pagination: {
							el: $(this).find('.swiper-pagination')[0],
							type: 'fraction',
							formatFractionCurrent: function (number) {
								return KyoboBookPub.mok.setPrependZero(number, 2);
							},
							formatFractionTotal: function (number) {
								return KyoboBookPub.mok.setPrependZero(number, 2);
							},
						},
					});
				}else{
					$('.swiper-scrollbar', defSwiperEl).remove();
				}
			});
		}

		if($('.swiper-container.swiper_paging_dot').length > 0){
			$('.swiper-container.swiper_paging_dot').each(function () {
				var defSwiperEl = $(this);
				if ($('.swiper-slide', defSwiperEl).length > 1) {
					loop_type =  defSwiperEl.attr('swipe-loop') == 'true' ? loop_type = true : loop_type = false;
					align_type =  defSwiperEl.attr('swipe-align') == 'true' ? align_type = true : align_type = false;
					var defaultSwiper = new CustomSwiper(defSwiperEl.get(0), {
						slidesPerView: 'auto',
						loop:loop_type,
						centeredSlides:align_type,
						speed: 500,
						pagination: {
							el: $(defSwiperEl).find('.swiper_control_box .swiper-pagination')[0],
						},
					});
				}else{
					$('.swiper-scrollbar', defSwiperEl).remove();
				}
			});
		}

		if($('.swiper-container.swiper_paging_number').length > 0){
			$('.swiper-container.swiper_paging_number').each(function () {
				var defSwiperEl = $(this);
				if ($('.swiper-slide', defSwiperEl).length > 1) {
					loop_type =  defSwiperEl.attr('swipe-loop') == 'true' ? loop_type = true : loop_type = false;
					align_type =  defSwiperEl.attr('swipe-align') == 'true' ? align_type = true : align_type = false;
					var defaultSwiper = new CustomSwiper(defSwiperEl.get(0), {
						slidesPerView: 'auto',
						loop:loop_type,
						centeredSlides:align_type,
						speed: 500,
						pagination: {
							el: $(defSwiperEl).find('.swiper-pagination')[0],
							clickable: true,
							renderBullet: function (index, className) {
								return '<span class="' + className + '">' + '0' + (index + 1) + "</span>";
							},
						},
					});
				}else{
					$('.swiper-scrollbar', defSwiperEl).remove();
				}
			});
		}

		if($('.swiper-container.swiper_navigation').length > 0){
			$('.swiper-container.swiper_navigation').each(function () {
				var defSwiperEl = $(this);
				if ($('.swiper-slide', defSwiperEl).length > 1) {
					loop_type =  defSwiperEl.attr('swipe-loop') == 'true' ? loop_type = true : loop_type = false;
					align_type =  defSwiperEl.attr('swipe-align') == 'true' ? align_type = true : align_type = false;
					var defaultSwiper = new CustomSwiper(defSwiperEl.get(0), {
						slidesPerView: 'auto',
						loop:loop_type,
						centeredSlides:align_type,
						speed: 500,
						navigation: {
							nextEl: $(defSwiperEl).find('.swiper-button-next')[0],
							prevEl: $(defSwiperEl).find('.swiper-button-prev')[0],
						},
						pagination: {
							el: $(defSwiperEl).find('.swiper-pagination')[0],
						},
					});
				}else{
					$('.swiper-scrollbar', defSwiperEl).remove();
				}
			});
		}

		if($('.swiper-container.swiper_paging_play').length > 0){
			$('.swiper-container.swiper_paging_play').each(function () {
				var defSwiperEl = $(this);
				var totalLen = defSwiperEl.find('.swiper-slide').length;
				var paginationWidth = 40; // progressbar 넓이
				if ($('.swiper-slide', defSwiperEl).length > 1) {
					loop_type =  defSwiperEl.attr('swipe-loop') == 'true' ? loop_type = true : loop_type = false;
					align_type =  defSwiperEl.attr('swipe-align') == 'true' ? align_type = true : align_type = false;
					var defaultSwiper = new CustomSwiper(defSwiperEl.get(0), {
						slidesPerView: 'auto',
						loop:loop_type,
						centeredSlides:align_type,
						speed: 500,
						observer: true,
						observeParents: true,
						autoplay: {
							delay: 3000,
						},
						pagination: {
							el: $('.swiper-pagination', defSwiperEl)[0],
							type: 'fraction',
							renderFraction: function(currentClass, totalClass){
								return '<span class="' + currentClass + '"></span>' + '<span class="progress_bar"><span class="progress_fill"></span></span>' + '<span class="' + totalClass + '"></span>';
							},
							formatFractionCurrent: function (number) {
								$('.progress_fill', defSwiperEl).css('width', (paginationWidth / totalLen) * number);
								return KyoboBookPub.mok.setPrependZero(number, 2);
							},
							formatFractionTotal: function (number) {
								return KyoboBookPub.mok.setPrependZero(number, 2);
							},
						},
						on: {
							touchEnd: function () {
								var swiper = this;
								swiper.autoplay.stop();
								swiper.$el.find('.btn_auto_control').addClass('pause');
								swiper.$el.find('.btn_auto_control .hidden').html('재생');
							},
						},
					});
					$('.btn_auto_control', defSwiperEl).on('click', function () {
						if ($(this).hasClass('pause')) {
							$(this).removeClass('pause');
							$(this).find('.hidden').html('멈춤');
							defaultSwiper.autoplay.start();
						} else {
							$(this).addClass('pause');
							$(this).find('.hidden').html('재생');
							defaultSwiper.autoplay.stop();
						}
					});
				}else{
					$('.swiper-scrollbar', defSwiperEl).remove();
				}
			});
		}
	}
	//
	function setProductListToggle(){
		var wrapper = $('.product_list_wrap');
		var hasWrap = wrapper.length;
		if(hasWrap > 0){
			var listState = wrapper.find('.list_sort_btn').hasClass('active');
			var listBox = wrapper.find('.product_list_box .product_list');
			var toogleBtn = wrapper.find('.list_sort_btn');
			toggleList(listState);
			toogleBtn.on('click',function(){
				$(this).toggleClass('active');
				listState = $(this).hasClass('active');
				toggleList(listState);
			});
		}
		function toggleList(type){
			if(listState){
				listBox.removeClass('type-grid');
				listBox.addClass('type-list');
			}else{
				listBox.addClass('type-grid');
				listBox.removeClass('type-list');
			}
		}
	}
	//
	function setHeaderWhite(){
		var headerPosi, scrollTop;
		var headerWhite = $('.header_wrapper').hasClass('type_white');
		var topArea = $('.top_visual_area').length;
		if(headerWhite && topArea > 0){
			headerPosi = Math.round($('.top_visual_area').offset().top + $('.top_visual_area').outerHeight());
			$(window).on('scroll resize', function(){
				setHeaderSpsControl();
				scrollTop = $(window).scrollTop();
			});
			setHeaderSpsControl();
		}
		// 마이룸 홈 헤더영역 type_white class 제어
		function setHeaderSpsControl(){
			scrollTop = Math.round(document.documentElement.scrollTop || window.pageYOffset);
			if(scrollTop > headerPosi){
				$('.header_wrapper').removeClass('type_white');
			}else{
				$('.header_wrapper').addClass('type_white');
			}
		}
	}
	//
	function setTabMenuBox(selector){
		selector = selector ? selector : '.tab_menu_box';
		if ($(selector).length > 0) {
			$(selector).each(function(){
				var allList = $(this).find('li');
				$(this).find('li').each(function(){
					$(this).on('click',function(){
						if(!$(this).hasClass('active')){
							$(this).parent().find('li.active').removeClass('active');
							$(this).addClass('active');
						}
					});
				})
			});
		}
	}
	//헤더 카테고리메뉴
	function setGnbCategoryMenu(){
		var gnbCategoryWrap = $('.header_wrapper .header_center');
		var hasGnbCategory = gnbCategoryWrap.hasClass('has-category');
		if(hasGnbCategory){
			var gnbCategoryBox = $('.header_wrapper .header_center .page_title .category_menu_box');
			var gnbCategoryListBox = $('.header_wrapper .header_center .page_title .category_menu_box .category_list_box');
			var gnbCategoryBtn = $('.header_wrapper .header_center .page_title .category_menu_box .btn_category_dropdown');
			var windowH = $( window ).innerHeight();
			gnbCategoryListBox.css('height',windowH);
			gnbCategoryBtn.off().on('click',function(){
				gnbCategoryBox.toggleClass('active');
				if(gnbCategoryBox.hasClass('active')){
					$('html').addClass('dialog_open');
				}else{
					$('html').removeClass('dialog_open');
				}
			})
		}
	}

	_front.setToggleClass = setToggleClass;
	_front.setFoldBox = setFoldBox;
	_front.setSwiperDefault = setSwiperDefault;
	_front.setGnbSubCategoryInit = setGnbSubCategoryInit;
	_front.setGnbCategoryFoldBox = setGnbCategoryFoldBox;
	_front.setProductListToggle = setProductListToggle;
	_front.setHeaderWhite = setHeaderWhite;
	_front.setTabMenuBox = setTabMenuBox;
	_front.setGnbCategoryMenu = setGnbCategoryMenu;

	$(document).ready(function () {
		setFoldBox();
		setSwiperDefault();
		setGnbSubCategoryInit();
		setGnbCategoryFoldBox();
		setProductListToggle();
		setHeaderWhite();
		setTabMenuBox();
		setGnbCategoryMenu();
	});
	return _front;
})();
