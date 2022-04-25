/*
 * name : ui_welcome_ink.js
 * desc : 웰컴 전용 스크립트
 * writer : glim
 * create : 2022/02/21
 * update :
 * -
 */

var castingBanner,
	picksWrap;
$(function () {

	$('.btn_hot_line').on('click.welcome', function (event) {
		$('.hot_line_wrap').toggleClass('active');
	});

	// 메인 배너
	if ($('.welcome_banner_wrap').length > 0) {
		var welcomeBannerWrap, welcomeBanner, btnBannerGroupItems;

		welcomeBannerWrap = $('.welcome_banner_wrap');
		btnBannerGroupItems = $('.banner_group_item', welcomeBannerWrap);

		welcomeBanner = new CustomSwiper($('.swiper-container', welcomeBannerWrap), {
			slidesPerView: 'auto',
			init: false,
			spaceBetween: 1,
			speed: 1200,
			effect: 'fade',
			fadeEffect: {
				crossFade: true,
			},
			// loop: true,
			autoplay: {
				delay: 5000,
				disableOnInteraction: false,
			},
			navigation: {
				nextEl: $('.swiper-button-next', welcomeBannerWrap)[0],
				prevEl: $('.swiper-button-prev', welcomeBannerWrap)[0],
			},
			pagination: {
				el: $('.swiper-pagination', welcomeBannerWrap)[0],
				type: "fraction",
				formatFractionCurrent: function (number) {
					return KyoboBookPub.ink.setPrependZero(number, 2);
				},
				formatFractionTotal: function (number) {
					return KyoboBookPub.ink.setPrependZero(number, 2);
				},
			},
		});

		var welcomeProgress = setSwiperProgress(welcomeBannerWrap, 5000, 30, 1);

		welcomeBanner.on('autoplayStart', function() {
			// console.log('autoplayStart');
			welcomeProgress.data('start')();
		});
		welcomeBanner.on('transitionStart', function() {
			welcomeProgress.data('reset')();
		})
		welcomeBanner.on('transitionEnd', function() {
			// console.log('transitionEnd');
			// welcomeBannerWrap.data.reset();
			welcomeProgress.data('start')();
		});
		welcomeBanner.on('slideChange', function() {
			setBannerGroupBtnActive();
		});
		welcomeBanner.init();

		$('.btn_swiper_pause').on('click.welcome', function() {
			var that = $(this);
			that.toggleClass('paused');

			if (that.hasClass('paused')) {
				$('.hidden', that).text('재생');
				// console.log('stop');
				welcomeBanner.autoplay.stop();
				welcomeProgress.data('reset')();
			} else {
				$('.hidden', that).text('일시정지');
				// console.log('start');
				welcomeBanner.autoplay.start();
			}
		});

		function setBannerGroupBtnActive() {
			var bannerGroupItem;

			// console.log($('.swiper-slide', welcomeBannerWrap).eq(welcomeBanner.realIndex).data('group'));
			bannerGroupItem = btnBannerGroupItems.eq($('.swiper-slide', welcomeBannerWrap).eq(welcomeBanner.realIndex).data('group'));
			// console.log(bannerGroupItem);
			btnBannerGroupItems.removeClass('active');
			bannerGroupItem.addClass('active');
			// console.log(bannerGroupItem);
		}
		$('.btn_banner_group', btnBannerGroupItems).on('click.welcome', function () {
			var activeGroupIndex;
			activeGroupIndex = $(this).closest('.banner_group_item').index();
			console.log(activeGroupIndex, $('.swiper-slide[data-group="' + activeGroupIndex + '"]', welcomeBannerWrap).eq(0).index());

			welcomeBanner.slideTo($('.swiper-slide[data-group="' + activeGroupIndex + '"]', welcomeBannerWrap).eq(0).index());
		});
	}
	// e : 메인 배너

	// 공통 상품 스와이퍼(ex. 화제의 신상)
	if ($('.welcome_prod_swiper_wrap').length > 0) {
		$('.welcome_prod_swiper_wrap').each(function () {
			var prodSwiperEl,
				prodSwiper;
			prodSwiperEl = $(this);

			prodSwiper = new CustomSwiper($('.swiper-container', prodSwiperEl), {
				slidesPerView: 'auto',
				spaceBetween: 36,
				speed: 500,
				navigation: {
					nextEl: $('.swiper-button-next', prodSwiperEl)[0],
					prevEl: $('.swiper-button-prev', prodSwiperEl)[0],
				},
			});
			$('.swiper-slide', prodSwiperEl).on('mouseover mouseout', function (event) {
				prodSwiper.update();
			})
		});
	}
	// e : 공통 상품 스와이퍼

	// 유연화 영역 스와이퍼(ex HOT ITEM)
	if ($('.fluid_swiper_wrap').length > 0) {
		$('.fluid_swiper_wrap').each(function () {
			var swiperWrap,
				fluidSwiper,
				viewCnt;

			swiperWrap = $(this);
			viewCnt = $('.swiper-container', swiperWrap).data('col') ? $('.swiper-container', swiperWrap).data('col') : 4;
			if ($('.swiper-slide', swiperWrap).length > viewCnt) {
				fluidSwiper = new CustomSwiper($('.swiper-container', swiperWrap), {
					slidesPerView: viewCnt,
					spaceBetween: 36,
					speed: 500,
					navigation: {
						nextEl: $('.swiper-button-next', swiperWrap)[0],
						prevEl: $('.swiper-button-prev', swiperWrap)[0],
					},
				});
			} else {
				$('.swiper-button-next', swiperWrap).remove();
				$('.swiper-button-prev', swiperWrap).remove();
			}
		});
	}

	// 오늘 추천, 지금 뜨는 공영 스와이퍼
	if ($('.expand_related_book_wrap').length > 0) {
		$('.expand_related_book_wrap').each(function () {
			var relatedBookThumbs,
				relatedBookTop;
			var that = $(this);
			var galleryTopEl = $('.thumb_swiper_wrap', that);
			var galleryThumbsEl = $('.detail_swiper_wrap', that);

			if ($('.swiper-slide', galleryThumbsEl).length > 1) {
				relatedBookThumbs = new CustomSwiper($('.swiper-container', galleryThumbsEl), {
					effect: 'fade',
					touchRatio: 0, //드래그 금지
				});
			}

			if ($('.swiper-slide', galleryTopEl).length > 1) {
				relatedBookTop = new CustomSwiper($('.swiper-container', galleryTopEl), {
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
	// e : 오늘 추천, 지금 뜨는 공영 스와이퍼

	// 히트 영역 스와이퍼
	if ($('.hit_item_wrap').length > 0) {
		new CustomSwiper($('.hit_item_wrap .swiper-container'), {
			slidesPerView: 'auto',
			speed: 800,
			navigation: {
				nextEl: $('.hit_wrap .hit_swiper_controller .swiper-button-next')[0],
				prevEl: $('.hit_wrap .hit_swiper_controller .swiper-button-prev')[0],
			},
		});
	}
	// e : 히트 영역 스와이퍼

	// 자동 롤링 스와이퍼(ex. 이벤트 배너 롤링 스와이퍼)
	if ($('.auto_swiper_wrap').length > 0) {

		$('.auto_swiper_wrap').each(function () {

			// swiper 재생/멈춤 버튼 타입 script
			var autoPlaySwiper = $(this);

			if ($('.swiper-slide', autoPlaySwiper).length > 1) {
				var eventSwiper = new CustomSwiper(autoPlaySwiper, {
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
						nextEl: autoPlaySwiper.find('.swiper_auto_control_area .swiper-button-next')[0],
						prevEl: autoPlaySwiper.find('.swiper_auto_control_area .swiper-button-prev')[0],
					},
					pagination: {
						el: autoPlaySwiper.find('.swiper_auto_control_area .swiper-pagination')[0],
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
							console.log('touchEnd')
							swiper.autoplay.stop();
							swiper.$el.find('.btn_auto_control').addClass('pause');
							swiper.$el.find('.btn_auto_control .hidden').html('재생');
						}
					},
				});
				eventSwiper.init();

				if (eventSwiper.autoplay.running) {
					// auto play swiper - prev, next 버튼 클릭 event
					$('.swiper-button-next, .swiper-button-prev', autoPlaySwiper).on('click', function () {
						if ($('.btn_auto_control', autoPlaySwiper).hasClass('pause')) return;

						$('.btn_auto_control', autoPlaySwiper).addClass('pause');
						$('.btn_auto_control', autoPlaySwiper).find('.hidden').html('재생');
						eventSwiper.autoplay.stop();
					});

					// auto play swiper - play, pause control 버튼 클릭 event
					$('.btn_auto_control', autoPlaySwiper).on('click', function () {
						if ($(this).hasClass('pause')) {
							$(this).removeClass('pause');
							$(this).find('.hidden').html('멈춤');
							eventSwiper.autoplay.start();
						} else {
							$(this).addClass('pause');
							$(this).find('.hidden').html('재생');
							eventSwiper.autoplay.stop();
						}
					});
				}
			}
		});
	}
	// e : 자동 롤링 스와이퍼

	// Picks 카드 마우스 오버 스와이퍼
	picksWrap = $('.picks_wrap');
	if (picksWrap.length > 0) {
		$('.picks_item', picksWrap).each(function () {
			var picksBanner,
				picksBlur,
				blurSwiper,
				picksContents,
				contentsSwiper;
			picksBanner = $(this);

			picksBlur = $('.picks_blur', picksBanner);
			picksContents = $('.picks_back_contents', picksBanner);

			blurSwiper = new CustomSwiper(picksBlur, {
				init: false,
				watchSlidesVisibility: true,
				watchSlidesProgress: true,
				effect: 'fade',
				loop: true,
			});

			contentsSwiper = new CustomSwiper($('.swiper-container', picksContents), {
				init: false,
				slidesPerView: 1,
				spaceBetween: 20,
				speed: 500,
				// keyboard: true,
				navigation: {
					nextEl: $('.swiper-button-next', picksContents)[0],
					prevEl: $('.swiper-button-prev', picksContents)[0],
				},
				thumbs: {
					swiper: blurSwiper,
				},
			});

			picksBanner.on('mouseenter focusin', function (event) {
				if (!picksBanner.hasClass('init')) {
					picksBanner.addClass('init');
					blurSwiper.init();
					contentsSwiper.init();
				} else {
					contentsSwiper.update();
				}
			});
		});
	}
	// e : Picks 카드 마우스 오버 스와이퍼

	// 라이브 영역 스와이퍼
	if ($('.welcome_live_list_wrap').length > 0) {
		$('.welcome_live_list_wrap').each(function () {
			var liveSwiper;
			liveSwiper = $(this);

			new CustomSwiper($('.swiper-container', liveSwiper), {
				slidesPerView: 5,
				spaceBetween: 36,
				speed: 500,
				navigation: {
					nextEl: $('.swiper-button-next', liveSwiper)[0],
					prevEl: $('.swiper-button-prev', liveSwiper)[0],
				},
			});
		});
	}
	// e : 라이브 영역 스와이퍼

	// 실시간 통합 스와이퍼
	function setLiveRankSwiper() {
		var rankThumbWrap,
			rankThumbList,
			btnPrev,
			btnNext,
			currentThumbPaging,
			currentIdx,
			viewNum,
			detailSwiper;
		rankThumbWrap = $('.ranking_thumb_wrap');
		rankThumbList = $('.rank_thumb_list', rankThumbWrap);
		btnPrev = $('.btn_rank_arw.prev', rankThumbWrap);
		btnNext = $('.btn_rank_arw.next', rankThumbWrap);

		currentThumbPaging = 0;
		currentIdx = 1;
		viewNum = 5;

		detailSwiper = new Swiper('.ranking_detail_wrap .swiper-container', {
			init: false,
			autoHeight: true,
			loop: true,
			spaceBetween: 0,
			effect: 'fade',
			fadeEffect: {
				crossFade: true,
			},
			autoplay: {
				delay: 4000,
				disableOnInteraction: false,
			},
		});

		detailSwiper.on('slideChange', function () {
			//console.log('slide changed', _detailSwiper.activeIndex);
			changeSlide(detailSwiper.realIndex);
		});

		$('.btn_rank_thumb', rankThumbList).on('click', function (event) {
			detailSwiper.slideTo($(this).parent().index() + 1);
		});

		btnPrev.on('click', function () {
			changePaging((currentThumbPaging - 1 + 2) % 2);
		});
		btnNext.on('click', function () {
			changePaging((currentThumbPaging + 1 + 2) % 2);
		});

		function changeSlide(val) {
			var currentIdx;
			currentIdx = val;
			$('.rank_thumb_item', rankThumbList).removeClass('prev_active').eq(currentIdx - 1).addClass('prev_active');
			$('.rank_thumb_item', rankThumbList).removeClass('active').eq(currentIdx).addClass('active');
			if (parseInt((currentIdx) / viewNum) !== currentThumbPaging) {
				changePaging((currentIdx) / viewNum);
			}
		}

		function changePaging(val) {
			currentThumbPaging = Math.floor(val);
			rankThumbList.css('top', '-' + (currentThumbPaging * 350) + 'px');
		}


		$(rankThumbWrap).on('mouseenter', function () {
			detailSwiper.autoplay.stop();
		}).on('mouseleave', function () {
			detailSwiper.autoplay.start();
		});
		$('.ranking_detail_wrap').on('mouseenter', function () {
			detailSwiper.autoplay.stop();
		}).on('mouseleave', function () {
			detailSwiper.autoplay.start();
		});

		detailSwiper.init();
	}

	setLiveRankSwiper();
	// e : 실시간 통합 스와이퍼

	// 캐스팅 배너 스와이퍼
	castingBanner = $('.casting_banner_wrap');
	var castingBlur = $('.casting_blur', castingBanner);

	var castingBlurSwiper = new CustomSwiper(castingBlur[0], {
		watchSlidesVisibility: true,
		watchSlidesProgress: true,
		effect: 'fade',
		loop: true,
		// allowTouchMove: false,
		// pagination: {
		// 	el: $('.swiper-pagination.fraction', bookcastLive)[0],
		// 	type: 'fraction',
		// 	formatFractionCurrent: function (number) {
		// 		return KyoboBookPub.ink.setPrependZero(number, 2);
		// 	},
		// 	formatFractionTotal: function (number) {
		// 		return KyoboBookPub.ink.setPrependZero(number, 2);
		// 	},
		// },
	});

	var castingContents = $('.casting_contents', castingBanner);
	var castingContentsSwiper = new CustomSwiper($('.swiper-container', castingContents)[0], {
		effect: 'fade',
		slidesPerView: 1,
		spaceBetween: 20,
		speed: 500,
		fadeEffect: {
			crossFade: true,
		},
		// keyboard: true,
		navigation: {
			nextEl: $('.swiper-button-next', castingContents)[0],
			prevEl: $('.swiper-button-prev', castingContents)[0],
		},
		thumbs: {
			swiper: castingBlurSwiper,
		},
	});
	// e : 캐스팅 배너 스와이퍼

	// 문화공간 스와이퍼
	if ($('.culture_item_wrap').length > 0) {
		var cultureSwiper = $('.culture_item_wrap');

		if ($('.swiper-slide', cultureSwiper).length > 1) {
			var eventSwiper = new CustomSwiper($('.swiper-container', cultureSwiper), {
				slidesPerView: 4,
				spaceBetween: 36,
				pagination: {
					el: $('.swiper_control_box .swiper-pagination', cultureSwiper)[0],
					type: 'progressbar',
				},
			});
		}
	}

	function setSwiperProgress(container, milliSeconds, size, strokeWidth) {
		var progressWrap, bar, radius, circumference;
		progressWrap = $('.circle_progress_wrap', container);
		progressWrap.data('ms', milliSeconds);
		progressWrap.data('time', 0);
		bar = $('.bar', progressWrap).get(0);

		radius = size / 2 - strokeWidth;
		circumference = 2 * Math.PI * radius;

		function progress(per) {
			var progress, dashoffset;
			progress = per / 100;
			dashoffset = circumference * (1 - progress);
			bar.style.strokeDashoffset = dashoffset;

		}

		function reset() {
			progress(0);
			progressWrap.data('time', 0);
			clearInterval(progressWrap.data('interval'));
		}

		function start() {
			var interval;
			interval = setInterval(function () {
				progressWrap.data('time', progressWrap.data('time') + 10);
				progress(progressWrap.data('time') / progressWrap.data('ms') * 100);
			}, 10);
			progressWrap.data('interval', interval);
		}
		progressWrap.data('start', start);
		progressWrap.data('reset', reset);

		bar.style.strokeDasharray = circumference;
		return progressWrap;
	}
});

$(window).on('load', function () {
	if (castingBanner.length > 0) {
		$('.blur_img_box', castingBanner).each(function () {
			new blurify({
				images: $(this).find('img'),
				blur: 20,
				mode: 'auto',
			});
		});
	}
	if (picksWrap.length > 0) {
		$('.blur_img_box', picksWrap).each(function () {
			new blurify({
				images: $(this).find('img'),
				blur: 20,
				mode: 'auto',
			});
		});
	}
});