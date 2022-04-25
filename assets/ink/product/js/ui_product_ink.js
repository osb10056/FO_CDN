/*
 * name : ui_product_ink.js
 * desc : 상품 공통 자바스크립트
 * writer : glim
 * create : 2021/11/30
 * update :
 * -
 */

$(window).on('load', function () {
	prodInfoThumbSwiper();
});

$(function () {
	setProdDetailAnchor();
	reviewTabAnchor();

	setProdTitleMoreBtn();
	setCommentList();
	prodSwiperCommon();
	

	// 뷰 토글 버튼 이벤트 설정
	KyoboBookPub.ink.setSwitchListBtn(function(tg) {
		if(tg.hasClass('view_type_img')){
			if($('.prod_swiper_wrap').get(0).swiper !== undefined)  $('.prod_swiper_wrap').get(0).swiper.update();
		}else{
			if($('.prod_swiper_text').get(0).swiper !== undefined) $('.prod_swiper_text').get(0).swiper.update();
		}
	});

	// 옵션 선택시 폴딩 닫힘
	$('.fold_select_item').add('.fold_select_prd').on('click', function(){
		var foldBox = $(this).closest('.fold_box');
		KyoboBookPub.ink.foldOnOff().foldClose(foldBox);
	});

	// event swiper
	if($('.event_swiper_wrap').length > 0){
		$('.event_swiper_wrap').each(function () {
			var eventSwiperEl = $(this);
			if ($('.swiper-slide', eventSwiperEl).length > 1) {
				var eventSwiper = new CustomSwiper(eventSwiperEl.find('.swiper-container').get(0), {
					slidesPerView: 'auto',
					speed: 500,
					scrollbar: {
						el: $('.swiper-scrollbar', eventSwiperEl)[0],
					},
				});
			} else{
				$('.swiper-scrollbar', eventSwiperEl).remove();
			}
		});
	}

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

	// 북카드
	var bookCardSwiper = new CustomSwiper('.book_card_swiper .swiper-container', {
		slidesPerView: 'auto',
		slidesPerGroup: 2,
		observer: true,
		observeParents: true,
		loop: true,
		speed: 500,
		navigation: {
			nextEl: '.book_card_swiper .swiper-button-next',
			prevEl: '.book_card_swiper .swiper-button-prev',
		},
	});

	// 함께 구매한 책
	var withThisSwiper = new CustomSwiper('.slide_list_with_this', {
		slidesPerView: 'auto',
		speed: 500,
		freeMode: true,
		scrollbar: {
			el: $('.slide_list_with_this').find('.swiper-scrollbar')[0],
		},
	});

	// 이 책의 시리즈
	var writerBooksSwiper = new CustomSwiper('.slide_writer_books', {
		slidesPerView: 'auto',
		speed: 500,
		freeMode: true,
		scrollbar: {
			el: $('.slide_writer_books').find('.swiper-scrollbar')[0],
		},
	});

	// 문장수집
	var killingPartSwiper = new CustomSwiper('.killing_part_swiper .swiper-container', {
		slidesPerView: 'auto',
		loop: true,
		speed: 500,
		observer: true,
		observeParents: true,
		navigation: {
			nextEl: '.killing_part_swiper .swiper-button-next',
			prevEl: '.killing_part_swiper .swiper-button-prev',
		},
	});

	// 다른 강연 / 동영상 등 컨텐츠 텍스트 링크 리스트
	if($('.person_contents_swiper .swiper-slide').length > 1){
		var personContentsSwiper = new CustomSwiper('.person_contents_swiper', {
			slidesPerView: 1,
			spaceBetween: 20,
			speed: 500,
			navigation: {
				nextEl: $('.control_person_contents').find('.swiper_control_box .swiper-button-next')[0],
				prevEl: $('.control_person_contents').find('.swiper_control_box .swiper-button-prev')[0],
			},
			pagination: {
				el: $('.control_person_contents').find('.swiper_control_box .swiper-pagination')[0],
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
		$('.control_person_contents').css('display', 'none');
	}

	// 인물 리스트 (강연자 / 제작자 / 공연 / 동행자 등)
	if($('.person_list_area .swiper-container .swiper-slide').length > 1){
			var personListSwiper = new CustomSwiper('.person_list_area .swiper-container', {
			slidesPerView: 1,
			spaceBetween: 20,
			speed: 500,
			navigation: {
				nextEl: $('.person_list_area').find('.swiper_control_box .swiper-button-next')[0],
				prevEl: $('.person_list_area').find('.swiper_control_box .swiper-button-prev')[0],
			},
		});
	} else {
		$('.person_list_area').find('.swiper_control_box').css('display', 'none');
	}

	// 함께 하는 상품
	if($('.prod_related_swiper .swiper-slide').length > 1){
		var personContentsSwiper = new CustomSwiper('.prod_related_swiper', {
			slidesPerView: 1,
			spaceBetween: 20,
			speed: 500,
			navigation: {
				nextEl: $('.control_prod_related').find('.swiper_control_box .swiper-button-next')[0],
				prevEl: $('.control_prod_related').find('.swiper_control_box .swiper-button-prev')[0],
			},
			pagination: {
				el: $('.control_prod_related').find('.swiper_control_box .swiper-pagination')[0],
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
		$('.control_prod_related').css('display', 'none');
	}

	// 결합상품 팝업
	$('#popCombineProdDetail').on('dialogopen', function(){
		var popContainer = $(this);
		$('.portrait_img_box', popContainer).each(function () {
			var imgTg = $(this);
			KyoboBookPub.ink.checkImagePortrait(imgTg);
		});

		$('.detail_view_control .btn_view_control', popContainer).on('click', function(){
			$('.detail_view_control .btn_view_control', popContainer).removeClass('active');
			$(this).addClass('active');
			var activeContents = $('.'+$(this).data('combine-contents'));

			activeContents.siblings().removeClass('active');
			activeContents.addClass('active');

			if ($(this).data('combine-contents') === 'combine_prod_review'){
				setCommentList();
				KyoboBookPub.ink.autoOverflowContents(popContainer);
			}
		});
	});
});

// 상품 정보 영역 swiper
function prodInfoThumbSwiper() {
	var prodThumbContainer = $('.prod_thumb_swiper_wrap');

	$('.portrait_img_box').each(function () {
		var imgTg = $(this);
		var imgContainer = $(this).closest('.blur_img_wrap');
		KyoboBookPub.ink.checkImagePortrait(imgTg, imgContainer);
	});

	$('.blur_img_wrap').each(function () {
		if ($(this).hasClass('landscape')) {
			new blurify({
				images: $(this).find('.blur_img_box img'),
				blur: 6,
				mode: 'auto',
			});
		}
	});

	var prodThumbSwiper;
	if ($('.swiper-slide', prodThumbContainer).length > 1) {
		prodThumbContainer.addClass('active');
		prodThumbSwiper = new CustomSwiper(prodThumbContainer.find('.swiper-container'), {
			init: false,
			slidesPerView: 1,
			effect: 'fade',
			navigation: {
				nextEl: prodThumbContainer.find('.swiper_control_box .swiper-button-next')[0],
				prevEl: prodThumbContainer.find('.swiper_control_box .swiper-button-prev')[0],
			},
			pagination: {
				el: prodThumbContainer.find('.swiper_control_box .swiper-pagination')[0],
				type: 'fraction',
				formatFractionCurrent: function (number) {
					return KyoboBookPub.ink.setPrependZero(number, 2);
				},
				formatFractionTotal: function (number) {
					return KyoboBookPub.ink.setPrependZero(number, 2);
				},
			},
		});

		prodThumbSwiper.init();

		prodThumbSwiper.on('slideChange', function () {
			if (prodThumbSwiper.activeIndex === 0) {
				$('.btn_swiper_floating.prev', prodThumbContainer).addClass('disabled');
				$('.btn_swiper_floating.next', prodThumbContainer).removeClass('disabled');
			} else if (prodThumbSwiper.activeIndex === $('.swiper-slide', prodThumbContainer).length - 1) {
				$('.btn_swiper_floating.next', prodThumbContainer).addClass('disabled');
				$('.btn_swiper_floating.prev', prodThumbContainer).removeClass('disabled');
			} else {
				$('.btn_swiper_floating.next', prodThumbContainer).removeClass('disabled');
				$('.btn_swiper_floating.prev', prodThumbContainer).removeClass('disabled');
			}
		})

		$('.btn_swiper_floating', prodThumbContainer).on('click', function () {
			if ($(this).hasClass('prev')) {
				$(this).siblings().removeClass('disabled');

				if ($(this).hasClass('disabled')) $(this).removeClass('disabled');
				prodThumbSwiper.slideTo(prodThumbSwiper.activeIndex - 1);

				if (prodThumbSwiper.activeIndex === 0) {
					$(this).addClass('disabled');
				}
			} else {
				$(this).siblings().removeClass('disabled');

				if ($(this).hasClass('disabled')) $(this).removeClass('disabled');
				prodThumbSwiper.slideTo(prodThumbSwiper.activeIndex + 1);

				if (prodThumbSwiper.activeIndex === $('.swiper-slide', prodThumbContainer).length - 1) {
					$(this).addClass('disabled');
				}
			}
		});
	} else {
		$('.btn_swiper_floating', prodThumbContainer).remove();
		$('.swiper_control_box', prodThumbContainer).remove();
	}

	prodThumbContainer.on({
		'mouseenter': function () {
			prodThumbContainer.addClass('hover');
		},
		'mouseleave': function () {
			prodThumbContainer.removeClass('hover');
		}
	});
}

// 상품 상단 - 리뷰 영역 선택 시 하단 리뷰로 이동
function reviewTabAnchor() {
	if ($('.prod_review_box .btn_go_review').length > 0) {
		$('.prod_review_box .btn_go_review').on('click', function () {
			var reviewOffsetTop;
			reviewOffsetTop = Math.floor($('#scrollSpyProdReview').offset().top) - 71;
			console.log(reviewOffsetTop)
			$('html, body').stop().animate({scrollTop: reviewOffsetTop}, 300);
		});
	}
}

// 상품상세 앵커탭 기능
function setProdDetailAnchor() {
	if ($('.tab_wrap.prod_detail_body').length > 0) {
		var _tabLinks;
		_tabLinks = $('.tab_wrap.prod_detail_body > .tab_list_wrap .tabs .tab_item .tab_link');

		// 옵션영역 펼치기
		$('.btn_option_more', '.prod_option_info_wrap').on('click', function () {
			var optionSelectBox = $(this).closest('.prod_option_info_wrap');

			if (optionSelectBox.hasClass('active')) {
				optionSelectBox.removeClass('active');
				$(this).find('.hidden').text('옵션 선택 영역 접기');
			} else {
				optionSelectBox.addClass('active');
				$(this).find('.hidden').text('옵션 선택 영역 펼치기');
			}
		});

		// 상품 상세 탭 링크 클릭시 해당 위치로 이동
		_tabLinks.on('click.product', function (event) {
			var targetId, offsetTop;
			event.preventDefault();

			targetId = event.currentTarget.getAttribute('href');
			offsetTop = $(targetId).offset().top - 71;
			$('html, body').stop().animate({scrollTop: offsetTop}, 300);
		});

		// 상세 컨텐츠 블럭별 class 값 변경 Observer
		var observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				if (mutation.attributeName === 'class') {
					var target, currentClassList;
					target = mutation.target;
					currentClassList = target.classList.value;
					if (target.dataset.prevClass !== currentClassList) {
						target.dataset.prevClass = currentClassList;

						setTabBtnActive();
					}
				}
			});
		});

		// 스크롤에 따라 탭 active 상태 변경
		function setTabBtnActive() {
			var activeIndex;
			activeIndex = $('.prod_detail_contents .tab_content.sps-blw').length - 1;

			_tabLinks.parent().removeClass('active');
			if (activeIndex !== -1) {
				_tabLinks.eq(activeIndex).parent().addClass('active');
			}
		}

		document.querySelectorAll('.prod_detail_contents .tab_content.sps').forEach(function (target) {
			target.dataset.prevClass = target.classList;
			observer.observe(target, {attributes: true});
		});
	}
}

// 상품 상세 상단 타이틀 더보기 버튼 - 한 개만 노출 되도록
function setProdTitleMoreBtn() {
	var overflowEl, overflowElCnt;
	overflowEl = $('.prod_detail_title_wrap .auto_overflow_wrap.overflow');
	overflowElCnt = overflowEl.length;

	if (overflowElCnt > 1) {
		overflowEl.each(function (index) {
			if (index < overflowElCnt - 1) {
				$(this).find('> .auto_overflow_footer .btn_more_detail').remove();
			}
		});
	}

}

// 리뷰(댓글) 목록
function setCommentList(){
	console.log('리뷰 : 0')
	var reviewContents, reviewText, contentsOverflow, textOverflow, btnToggle;
	if ($('.comment_wrap').closest('.dialog_wrap.dialog_review').length > 0) return false; // 리뷰 팝업 내에선 실행 X

	
	console.log('리뷰 : 1')
	if($('.comment_wrap .comment_item').length > 0){
		console.log('리뷰 : 2')
		$('.comment_wrap .comment_item').each(function(){
			var that = $(this);
			btnToggle = $(this).find('.comment_footer .btn_more_body');
			reviewContents = $(this).find('.comment_contents .comment_contents_inner');

			// 리뷰 목록 toggle overflow
			if (reviewContents.length > 0) {
				reviewText = reviewContents.find('.comment_text');
				textOverflow = reviewText[0].scrollHeight > reviewText.height();
				contentsOverflow = reviewContents[0].scrollHeight > reviewContents.height();

				console.log(reviewText,textOverflow,contentsOverflow)

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

	// 스크롤
	if($('.prod_swiper_text').length > 0) {
		$('.prod_swiper_text').each(function () {
			var prodTextSwiperEl = $(this);
			if ($('.swiper-slide', prodTextSwiperEl).length > 2) {
				var prodTextwiper = new CustomSwiper(prodTextSwiperEl, {
					slidesPerView: 'auto',
					speed: 500,
					scrollbar: {
						el: $('.swiper-scrollbar', prodTextSwiperEl)[0],
					},
					freeMode: true,
					keyboard: true,
				});

			}
		});
	}
}
