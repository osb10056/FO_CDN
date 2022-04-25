$(function() {
	setCommentList();
	prodSwiperCommon();

	var bookCastSearchWrap;
	bookCastSearchWrap = $('.book_cast_menu .search_wrap');
	KyoboBookPub.ink.setSpsOffsetData();

	$('.book_cast_menu .btn_search_open').on('click.bookCast', function(event) {
		bookCastSearchWrap.addClass('active');
		bookCastSearchWrap.find('.form_ip').focus();

	});

	bookCastSearchWrap.find('a, button:not(.btn_search_open), input').on('focusout.bookCast', function(event) {
		var that;
		that = this;
		if ($(that).is('.btn_search_open')) {
			// console.log('btn_search_open');
		}
		setTimeout(function () {
			if ((bookCastSearchWrap.find('a:focus').length < 1 && bookCastSearchWrap.find('button:focus').length < 1 && bookCastSearchWrap.find('input:focus').length < 1)
				|| bookCastSearchWrap.find('.btn_search_open').is(":focus")) {
				bookCastSearchWrap.find('.btn_search_open').focus();
				bookCastSearchWrap.removeClass('active');
			}
		}, 1);
	});

	// 북캐스트 상세 > 관련 콘텐츠 스와이퍼
	if($('.related_content_list_wrap .swiper-container').length > 0) {
		var relatedContentsListSlide = new CustomSwiper('.related_content_list_wrap .swiper-container', {
			slidesPerView: 'auto',
			spaceBetween: 36,
			speed: 500,
			navigation: {
				nextEl: $('.related_content_list_wrap .swiper-button-next')[0],
				prevEl: $('.related_content_list_wrap .swiper-button-prev')[0],
			},
			on : {
				init : function() {
					if(this.slides.length <= 2) {
						$('.related_content_list_wrap .swiper-button-next').remove();
						$('.related_content_list_wrap .swiper-button-prev').remove();
					}
				}
			}
		});
	}

	// 북캐스트 상세 > 이벤트 배너 스와이퍼
	if($('.bookcast_detail_banner_wrap .swiper-container').length > 0 && $('.bookcast_detail_banner_wrap .swiper-container .swiper-slide').length > 1) {
		$('.bookcast_detail_banner_wrap .swiper_auto_control_area').show();
		var bookcastDetailBannerSlide = new CustomSwiper('.bookcast_detail_banner_wrap .swiper-container', {
			init: false,
			slidesPerView: 1,
			spaceBetween: 20,
			speed: 800,
			observer: true,
			observeParents: true,
			initialSlide: 0,
			loop: true,
			autoplay: {
				delay: 1000,
			},
			navigation: {
				nextEl: $('.bookcast_detail_banner_wrap').find('.swiper_auto_control_area .swiper-button-next')[0],
				prevEl: $('.bookcast_detail_banner_wrap').find('.swiper_auto_control_area .swiper-button-prev')[0],
			},
			pagination: {
				el: $('.bookcast_detail_banner_wrap').find('.swiper_auto_control_area .swiper-pagination')[0],
				type: "fraction",
				formatFractionCurrent: function (number) {
					return KyoboBookPub.ink.setPrependZero(number, 2);
				},
				formatFractionTotal: function (number) {
					return KyoboBookPub.ink.setPrependZero(number, 2);
				},
			},
			on: {
				touchEnd: function () {
					var swiper = this;
					swiper.autoplay.stop();
					swiper.$el.find('.btn_auto_control').addClass('pause');
					swiper.$el.find('.btn_auto_control .hidden').html('play');
				},
				init : function() {
					// console.log(this);
					console.log(this.slides.length <= 1);
					if(this.slides.length <= 1) {
						this.destory();
					}
				},
				transitionEnd : function() {
					// console.log(this);
				}
			},
		});

		bookcastDetailBannerSlide.init();

		// auto play swiper - play, pause control 버튼 클릭 event
		$('.bookcast_detail_banner_wrap .btn_auto_control').on('click', function () {
			if ($(this).hasClass('pause')) {
				$(this).removeClass('pause');
				$(this).find('.hidden').html('멈춤');
				bookcastDetailBannerSlide.autoplay.start();
			} else {
				$(this).addClass('pause');
				$(this).find('.hidden').html('재생');
				bookcastDetailBannerSlide.autoplay.stop();
			}
		});
	}
});

// 리뷰(댓글) 목록
function setCommentList(){
	var reviewContents, reviewText, contentsOverflow, textOverflow, btnToggle;
	if ($('.comment_wrap').closest('.dialog_wrap.dialog_review').length > 0) return false; // 리뷰 팝업 내에선 실행 X

	if($('.comment_wrap .comment_item').length > 0){
		$('.comment_wrap .comment_item').each(function(){
			var that = $(this);
			btnToggle = $(this).find('.comment_footer .btn_more_body');
			reviewContents = $(this).find('.comment_contents .comment_contents_inner');

			// 리뷰 목록 toggle overflow
			if (reviewContents.length > 0) {
				reviewText = reviewContents.find('.comment_text');
				textOverflow = reviewText[0].scrollHeight > reviewText.height();
				contentsOverflow = reviewContents[0].scrollHeight > reviewContents.height();

				// console.log($(this).index(), 'Contents : ', reviewContents[0].scrollHeight, reviewContents.height(), contentsOverflow, '///', 'Text : ', reviewText[0].scrollHeight, reviewText.height(), textOverflow);
				if(contentsOverflow || textOverflow) {
					that.addClass('overflow');

					btnToggle.off('click').on('click', function(){
						if(that.hasClass('active')){
							that.removeClass('active');
							$(this).removeClass('active').find('.text').text('펼치기');
						} else {
							that.addClass('active');
							$(this).addClass('active').find('.text').text('접기');
						}
					});
				} else {
					that.removeClass('overflow');
				}
			}

			// 리뷰 이미지 비율 체크
			$(this).find('.comment_swiper_wrap .portrait_img_box').each(function(){
				var imgTg = $(this);
				KyoboBookPub.ink.checkImagePortrait(imgTg);
			});
		});
	}
}

// 상품상세 스와이퍼 공통
function prodSwiperCommon(){
	// 스크롤
	if($('.prod_swiper_wrap').length > 0) {
		$('.prod_swiper_wrap').each(function () {
			var prodCommonSwiperEl = $(this);
			if ($('.swiper-slide', prodCommonSwiperEl).length > 1) {
				var prodCommonSwiper = new CustomSwiper(prodCommonSwiperEl, {
					slidesPerView: 'auto',
					speed: 500,
					scrollbar: {
						el: $('.swiper-scrollbar', prodCommonSwiperEl)[0],
					},
					freeMode: true,
					keyboard: true,
				});

			}
		});
	}

	// 네비 있음
	if($('.prod_nav_swiper_wrap').length > 0) {
		$('.prod_nav_swiper_wrap').each(function () {
			var prodCommonNavSwiperEl = $(this);
			var swiperControlEl;
			prodCommonNavSwiperEl.parent().is('.product_detail_area') ? swiperControlEl = prodCommonNavSwiperEl.closest('.product_detail_area').find('.swiper_control_box') : swiperControlEl = prodCommonNavSwiperEl.closest('.prod_related_swiper_wrap').find('.swiper_control_box');

			if ($('.swiper-slide', prodCommonNavSwiperEl).length > 1) {
				var prodCommonNavSwiper = new CustomSwiper(prodCommonNavSwiperEl, {
					spaceBetween: 20,
					speed: 500,
					navigation: {
						nextEl: swiperControlEl.find('.swiper-button-next')[0],
						prevEl: swiperControlEl.find('.swiper-button-prev')[0],
					},
					pagination: {
						el: swiperControlEl.find('.swiper-pagination')[0],
						type: 'fraction',
						formatFractionCurrent: function (number) {
							return KyoboBookPub.ink.setPrependZero(number, 2);
						},
						formatFractionTotal: function (number) {
							return KyoboBookPub.ink.setPrependZero(number, 2);
						},
					},
				});
			}else{
				swiperControlEl.remove();
			}
		});
	}
}