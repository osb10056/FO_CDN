/*
 * name : ui_service_ink.js
 * desc : 상품전시 전용 실행 자바스크립트
 * writer : glim
 * create : 2021/12/24
 * update :
 * -
 */

$(function(){
	showcaseMainSwiperInit();
	sideBannerSwiperInit();
	templateSwiperInit();
	autoRollingSwiperInit();
	burstBannerOff();
	setCommentList();

	// 리스트형보기/썸네일형보기 토글 버튼 이벤트 설정
	KyoboBookPub.ink.setSwitchListBtn(function(tg){
		if(tg.hasClass('switch_prod_wrap')){
			if(tg.hasClass('view_type_img')){
				tg.find('.prod_area').removeClass('horizontal');
			}else{
				tg.find('.prod_area').addClass('horizontal');
			}
		}
	});

	// 리뷰 내 리뷰 썸네일 swiper
	$('.comment_swiper_wrap .swiper-container').each(function(){
		if ($(this).find('.swiper-slide').length > 2){
			var reviewSwiper = new CustomSwiper(this, {
				observer: true,
				observeParents: true,
				slidesPerView: 'auto',
				navigation: {
					nextEl: $(this).siblings('.swiper-button-next'),
					prevEl: $(this).siblings('.swiper-button-prev'),
				},
			});
		} else {
			$(this).siblings('.swiper-button-next, .swiper-button-prev').css('display', 'none');
		}
	});
});

// 쇼케이스 메인 스와이퍼 init
function showcaseMainSwiperInit(){
	if($('.showcase_main_banner_wrap .showcase_main_swiper_wrap').length > 0){
		$('.showcase_main_swiper_wrap').each(function(){
			var showcaseMainWrap = $(this);
			var showcaseSwiperContainer = $('.swiper-container', showcaseMainWrap);

			if (showcaseSwiperContainer.find('.swiper-slide').length > 1){
				var totalLen = showcaseSwiperContainer.find('.swiper-slide').length;
				var paginationWidth = 70;
				var showcaseMainSwiper = new CustomSwiper(showcaseSwiperContainer, {
					slidesPerView: 1,
					speed: 800,
					observer: true,
					observeParents: true,
					initialSlide: 0,
					loop: true,
					navigation: {
						nextEl: $('.swiper-button-next', showcaseSwiperContainer)[0],
						prevEl: $('.swiper-button-prev', showcaseSwiperContainer)[0],
					},
					pagination: {
						el: $('.swiper-pagination', showcaseSwiperContainer)[0],
						type: 'fraction',
						renderFraction: function(currentClass, totalClass){
							return '<span class="' + currentClass + '"></span>' + '<span class="progress_bar"><span class="progress_fill"></span></span>' + '<span class="' + totalClass + '"></span>';
						},
						formatFractionCurrent: function (number) {
							$('.progress_fill', showcaseSwiperContainer).css('width', (paginationWidth / totalLen) * number);
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
							swiper.$el.find('.btn_auto_control .hidden').html('재생');
						},
					},
				});

				// auto play swiper - prev, next 버튼 클릭 event
				$('.swiper-button-next, .swiper-button-prev', showcaseSwiperContainer).on('click', function(){
					autoplayStop(showcaseSwiperContainer, showcaseMainSwiper)
				});

				// auto play swiper - play, pause control 버튼 클릭 event
				$('.btn_auto_control', showcaseSwiperContainer).on('click', function () {
					if ($(this).hasClass('pause')) {
						$(this).removeClass('pause');
						$(this).find('.hidden').html('멈춤');
						showcaseMainSwiper.autoplay.start();
					} else {
						$(this).addClass('pause');
						$(this).find('.hidden').html('재생');
						showcaseMainSwiper.autoplay.stop();
					}
				});

				// swiper init, change 시, pagination color check
				pagingTypeCheck(showcaseSwiperContainer.find('.swiper-slide.swiper-slide-active'));

				showcaseMainSwiper.on('slideChange', function(){
					pagingTypeCheck(showcaseSwiperContainer.find('.swiper-slide.swiper-slide-next'));
				});

				function pagingTypeCheck(tg){
					var pagingType = tg.attr('data-paging-white');
					if(pagingType !== undefined){
						$('.swiper_progress_control_area', showcaseSwiperContainer).removeClass('type_black');
					}else{
						$('.swiper_progress_control_area', showcaseSwiperContainer).addClass('type_black');
					}
				}
			} else {
				$('.swiper_control_floating_box', showcaseSwiperContainer).remove();
				$('.swiper_progress_control_area', showcaseSwiperContainer).remove();
			}
		});

		function autoplayStop(container, swiper){
			var btnAutoControl = $('.btn_auto_control', container);

			if (btnAutoControl.hasClass('pause')) return;

			btnAutoControl.addClass('pause');
			btnAutoControl.find('.hidden').html('재생');
			swiper.autoplay.stop();
		}

		function autoplayStart(container, swiper){
			var btnAutoControl = $('.btn_auto_control', container);

			btnAutoControl.removeClass('pause');
			btnAutoControl.find('.hidden').html('멈춤');
			swiper.autoplay.start();
		}

		if($('.showcase_main_banner_wrap .tab_wrap').length > 0){
			var firstActiveTab = $('.showcase_main_banner_wrap .tab_wrap .tab_content').eq(0).find('.showcase_main_swiper_wrap');
			var firstActiveSwiper = firstActiveTab.find('.swiper-container')[0].swiper;
			if (firstActiveSwiper !== undefined)  autoplayStart(firstActiveTab, firstActiveSwiper);
		}else{
			var activeBanner = $('.showcase_main_banner_wrap .showcase_main_swiper_wrap');
			var activeBannerSwiper = $('.showcase_main_banner_wrap .showcase_main_swiper_wrap').find('.swiper-container')[0].swiper;
			if (activeBannerSwiper !== undefined) autoplayStart(activeBanner, activeBannerSwiper);
		}

		// 탭 active 시, 자동롤링 auto play/stop
		$('.showcase_main_banner_wrap .tab_wrap').on('tabsactivate', function(event, ui){
			var updateContainer = $(ui.newPanel).find('.showcase_main_swiper_wrap');
			var oldContainer = $(ui.oldPanel).find('.showcase_main_swiper_wrap');

			if(updateContainer.find('.swiper-container .swiper-slide').length > 1){
				var updateSwiper = updateContainer.find('.swiper-container')[0].swiper;

				updateSwiper.update();
				autoplayStart(updateContainer, updateSwiper);
			}

			if(oldContainer.find('.swiper-container .swiper-slide').length > 1) {
				var oldSwiper = oldContainer.find('.swiper-container')[0].swiper;
				autoplayStop(oldContainer, oldSwiper);
				oldSwiper.slideTo(1, 0);
			}
		});

		// 상품 스와이퍼 type arrow
		if($('.prod_swiper_wrap.outside_nav').length > 0) {
			$('.prod_swiper_wrap.outside_nav').each(function () {
				var prodNavSwiperEl = $(this);
				if ($('.swiper-slide', prodNavSwiperEl).length > 1) {
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

	if($('.recommend_prod_wrap').length > 0) {
		$('.recommend_prod_wrap').each(function () {
			var priceCutSwiperEl = $(this);
			if ($('.swiper-slide', priceCutSwiperEl).length > 1) {
				var priceCutSwiper = new CustomSwiper($('.swiper-container', priceCutSwiperEl), {
					slidesPerView: 'auto',
					speed: 500,
					navigation: {
						nextEl: $('.swiper-button-next', priceCutSwiperEl)[0],
						prevEl: $('.swiper-button-prev', priceCutSwiperEl)[0],
					},
				});
			}else{
				$('.swiper-button-next', priceCutSwiperEl).remove();
				$('.swiper-button-prev', priceCutSwiperEl).remove();
			}
		});
	}
}

// 템플릿 a 사이드배너 스와이퍼
function sideBannerSwiperInit(){
	$('.recommend_prod_swiper').each(function(){
		var tg = $(this);
		if(tg.find('.swiper-container .swiper-slide').length > 0){
			var sideBannerSwiper = new CustomSwiper(tg.find('.swiper-container'), {
				speed: 500,
				navigation: {
					nextEl: tg.find('.swiper_control_box .swiper-button-next')[0],
					prevEl: tg.find('.swiper_control_box .swiper-button-prev')[0],
				},
				pagination: {
					el: tg.find('.swiper_control_box .swiper-pagination')[0],
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
			tg.find('.swiper_control_box').remove();
		}
	})
}

// 템플릿 b 개별 스와이퍼
function templateSwiperInit(){
	// 공통 swiper
	// 조건 - perView : 1 / navigation, pagination 기능을 가지고 있음(컨트롤러 구조는 swiper_control_box 을 공통으로 가져감)
	if($('.template_common_swiper').length > 0) {
		$('.template_common_swiper').each(function () {
			var templateCommonSwiperEl = $(this);
			var swiperControlEl = templateCommonSwiperEl.closest('.template_col').find('.swiper_control_box');
			if ($('.swiper-slide', templateCommonSwiperEl).length > 1) {
				var templateCommonSwiper = new CustomSwiper(templateCommonSwiperEl, {
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
			} else {
				swiperControlEl.remove();
			}
		});
	}

	// 공통 swiper
	// 조건 - perView : 1 / navigation 기능을 가지고 있음(natigation 버튼 구조는 swiper-container 내부에 위치함)
	if($('.template_nav_swiper').length > 0) {
		$('.template_nav_swiper').each(function () {
			var templateNavSwiperEl = $(this);
			if ($('.swiper-slide', templateNavSwiperEl).length > 1) {
				var templateNavSwiper = new CustomSwiper($('.swiper-container', templateNavSwiperEl), {
					speed: 500,
					navigation: {
						nextEl: templateNavSwiperEl.find('.swiper-button-next')[0],
						prevEl: templateNavSwiperEl.find('.swiper-button-prev')[0],
					},
				});
			} else {
				templateNavSwiperEl.find('.swiper-button-next').remove();
				templateNavSwiperEl.find('.swiper-button-prev').remove();
			}
		});
	}

	// 상품 대형_01_3x1
	if($('.expand_related_book_wrap').length > 0){
		$('.expand_related_book_wrap').each(function(){
			var that = $(this);
			var galleryTopEl = $('.thumb_swiper_wrap', that);
			var galleryThumbsEl = $('.detail_swiper_wrap', that);

			if($('.swiper-slide', galleryThumbsEl).length > 1) {
				var relatedBookThumbs = new CustomSwiper($('.swiper-container', galleryThumbsEl), {
					effect: 'fade',
					touchRatio: 0, //드래그 금지
				});
			}

			if($('.swiper-slide', galleryTopEl).length > 1){
				var relatedBookTop = new CustomSwiper($('.swiper-container', galleryTopEl), {
					slidesPerView: 'auto',
					navigation: {
						nextEl: $('.swiper-button-next', that)[0],
						prevEl: $('.swiper-button-prev', that)[0],
					},
					loop: true,
					touchRatio: 0, //드래그 금지
				});

				relatedBookTop.on('slideChange', function () {
					relatedBookThumbs.slideTo(relatedBookTop.realIndex);
				});
			}
		});
	}

	// 상품 대형_02_2x2
	if($('.related_book_wrap').length > 0){
		$('.related_book_wrap').each(function(){
			var that = $(this);
			var galleryTopEl = $('.detail_swiper_wrap', that);
			var galleryThumbsEl = $('.thumb_swiper_wrap', that);

			if($('.swiper-slide', galleryThumbsEl).length > 1) {
				var relatedBookThumbs = new CustomSwiper($('.swiper-container', galleryThumbsEl), {
					slidesPerView: 'auto',
					watchSlidesVisibility: true,
					watchSlidesProgress: true,
				});

				$('.btn_thumb', galleryThumbsEl).on('click', function(){
					var actIdx = $(this).closest('.swiper-slide').index();
					relatedBookTop.slideTo(actIdx);
				})
			}

			if($('.swiper-slide', galleryTopEl).length > 1){
				var relatedBookTop = new CustomSwiper($('.swiper-container', galleryTopEl), {
					effect: 'fade',
					thumbs: {
						swiper: relatedBookThumbs,
					},
					navigation: {
						nextEl: $('.swiper-button-next', that)[0],
						prevEl: $('.swiper-button-prev', that)[0],
					},
					pagination: {
						el: $('.swiper-pagination', that)[0],
						type: 'progressbar',
					},
				});

				relatedBookTop.on('slideChange', function () {
					relatedBookThumbs.slideTo(relatedBookTop.activeIndex);
				});

			}
		});
	}

	// 상품 대형_03_2x2(책 3개까지만 등록)
	if($('.few_related_book_wrap').length > 0){
		$('.few_related_book_wrap').each(function(){
			var that = $(this);
			var galleryTopEl = $('.banner_swiper_wrap', that);
			var galleryThumbsEl = $('.book_info_swiper_wrap', that);

			if($('.swiper-slide', galleryThumbsEl).length > 1) {
				var relatedBookThumbs = new CustomSwiper($('.swiper-container', galleryThumbsEl), {
					effect: 'fade',
				});
			}

			if($('.swiper-slide', galleryTopEl).length > 1){
				var relatedBookTop = new CustomSwiper($('.swiper-container', galleryTopEl), {
					effect: 'fade',
				});
			}

			relatedBookTop.on('slideChange', function () {
				relatedBookThumbs.slideTo(relatedBookTop.activeIndex);
			});

			relatedBookThumbs.on('slideChange', function () {
				relatedBookTop.slideTo(relatedBookThumbs.activeIndex);
			});

			$('.book_thumb_wrap .btn_thumb', that).on('click', function(){
				$(this).closest('.thumb_item').addClass('active');
				$(this).closest('.thumb_item').siblings().removeClass('active');
				var activeIdx = $(this).closest('.thumb_item').index();
				relatedBookThumbs.slideTo(activeIdx);
				relatedBookTop.slideTo(activeIdx);
			});
		});
	}

	// 상품 대형_04_2x2
	if($('.thumb_related_book_wrap').length > 0){
		$('.thumb_related_book_wrap').each(function(){
			var that = $(this);
			var galleryTopEl = $('.banner_swiper_wrap', that);
			var galleryThumbsEl = $('.book_info_swiper_wrap', that);
			var thumbCurHeight = galleryThumbsEl.find('.swiper-slide').eq(0).outerHeight();
			var relatedBookThumbs;

			if($('.swiper-slide', galleryThumbsEl).length > 1) {
				relatedBookThumbs = new CustomSwiper($('.swiper-container', galleryThumbsEl), {
					effect: 'fade',
					// autoHeight: true,
					observer: true,
					observeSlideChildren: true,
					observeParents: true,
					touchRatio: 0, //드래그 금지
				});
			}

			if($('.swiper-slide', galleryTopEl).length > 1){
				var relatedBookTop = new CustomSwiper($('.swiper-container', galleryTopEl), {
					// autoHeight: true,
					effect: 'coverflow',
					coverflowEffect: {
						rotate: 0,
						stretch: 0,
						depth: 0,
						scale: 1,
						modifier: 1,
						slideShadows: false,
					},
					navigation: {
						nextEl: $('.swiper-button-next', galleryTopEl)[0],
						prevEl: $('.swiper-button-prev', galleryTopEl)[0],
					},
					/*
					effect: "coverflow",
					  initialSlide: 1,
					  grabCursor: true,
					  loop: true,
					  centeredSlides: true,
					  slidesPerView: "auto",
					  coverflowEffect: {
					  rotate: 0,
					  stretch: 0,
					  depth: 0,
					  scale: 0.5,
					  modifier: 1,
					  slideShadows: true
					},
					*/
					slidesPerView: 'auto',
					grabCursor: true,
					loop: true,
					centeredSlides: true,
					// followFinger: false,
					// longSwipes: false,
				});
			}

			relatedBookTop.on('slideChange', function () {
				relatedBookThumbs.slideTo(relatedBookTop.realIndex);

				if(galleryThumbsEl.find('.auto_overflow_wrap').hasClass('active')) {
					galleryThumbsEl.find('.auto_overflow_wrap').removeClass('active');
					galleryThumbsEl.find('.auto_overflow_wrap .btn_more_body .text').text('펼치기');
				}

				relatedBookThumbs.update();
			});

			$('.btn_more_body', that).on('click.uiRelatedBook', function(){
				relatedBookThumbs.update();
			});
		});
	}
}

// 상단 자동롤링 배너
function autoRollingSwiperInit(){
	var autoPlaySwiperEl = $('.showcase_banner_swiper_wrap');

	if( $('.swiper-slide', autoPlaySwiperEl).length > 1 ) {
		var autoPlaySwiper = new CustomSwiper(autoPlaySwiperEl, {
			init: false,
			slidesPerView: 1,
			speed: 800,
			observer: true,
			observeParents: true,
			initialSlide: 0,
			loop: true,
			autoplay: {
				delay: 3000,
			},
			navigation: {
				nextEl: $('.swiper_auto_control_area .swiper-button-next', autoPlaySwiperEl)[0],
				prevEl: $('.swiper_auto_control_area .swiper-button-prev', autoPlaySwiperEl)[0],
			},
			pagination: {
				el: $('.swiper_auto_control_area .swiper-pagination', autoPlaySwiperEl)[0],
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
				}
			},
		});
		autoPlaySwiper.init();

		if(autoPlaySwiper.autoplay.running){
			// auto play swiper - prev, next 버튼 클릭 event
			$('.swiper-button-next, .swiper-button-prev', autoPlaySwiperEl).on('click', function(){
				if ($('.btn_auto_control', autoPlaySwiperEl).hasClass('pause')) return;

				$('.btn_auto_control', autoPlaySwiperEl).addClass('pause');
				$('.btn_auto_control', autoPlaySwiperEl).find('.hidden').html('재생');
				autoPlaySwiper.autoplay.stop();
			});

			// auto play swiper - play, pause control 버튼 클릭 event
			$('.btn_auto_control', autoPlaySwiperEl).on('click', function () {
				if ($(this).hasClass('pause')) {
					$(this).removeClass('pause');
					$(this).find('.hidden').html('멈춤');
					autoPlaySwiper.autoplay.start();
				} else {
					$(this).addClass('pause');
					$(this).find('.hidden').html('재생');
					autoPlaySwiper.autoplay.stop();
				}
			});
		}
	}else{
		$('.swiper_auto_control_area', autoPlaySwiperEl).remove();
	}
}

// 돌출형 배너 닫기
function burstBannerOff(){
	$('.burst_banner_wrap .btn_burst_close').on('click', function (){
		$('.burst_banner_wrap').addClass('banner_hidden');
	});
}

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

