$(function() {
	if ($('.cart_top_wrap').length > 0) {
		var mutateCartInfoTop;
		// 장바구니 상단 영역 sps offset 설정
		$('.cart_top_wrap').attr('data-sps-offset', $('.header_wrapper').outerHeight() + $('.cart_top_wrap').position().top + parseInt($('.cart_top_wrap').outerHeight()));

		// 장바구니 상단 영역 높이에 따라 sps-blw 처리가 될 때 cart_body 상단 padding 값 적용을 위한 style 태그 생성
		// console.log($('.cart_top_wrap').outerHeight());
		var css = '.cart_top_wrap.sps-blw ~ .cart_body { padding-top: ' + $('.cart_top_wrap').outerHeight() + 'px;}',
		head = document.head || document.getElementsByTagName('head')[0],
		style = document.createElement('style');

		head.appendChild(style);

		style.type = 'text/css';
		if (style.styleSheet){
			style.styleSheet.cssText = css;
		} else {
			style.appendChild(document.createTextNode(css));
		}

		// 장바구니 정보 영역 top 초기화
		if (($('.cart_title_box').outerHeight() - $('.cart_top_inner').outerHeight()) !== 0) {
			$('.cart_info_wrap').css('top', $('.cart_title_box').outerHeight() - $('.cart_top_inner').outerHeight() - 16);
		}

		mutateCartInfoTop = parseInt($('.cart_info_wrap').css('top'));
		setCartBodyObserver();
		$(window).on('resize.orderCartBody', function(){
			if ($('.container_wrapper').outerHeight() > $('.contents_wrap').outerHeight()) {
				$('.cart_body').css('min-height', $('.container_wrapper').outerHeight() - $('.cart_top_wrap').outerHeight());
			}

			setCartBodyObserver();
		});

		// 장바구니 상단 영역 class sps-blw add/remove 체크하여 cart_info_wrap의 위치 설정
		var observer = new MutationObserver(function(mutations, observer) {
			mutations.forEach(function(mutation) {
				if(mutation.attributeName === 'class'){
					var target, currentClassList, cartTop;
					target = mutation.target;
					currentClassList = target.classList;

					mutateCartInfoTop = parseInt($('.cart_info_wrap').css('top'));
					setCartBodyObserver();

					if (currentClassList.contains('sps-blw')){
						$('.cart_info_wrap').css('top', $('.cart_top_wrap').outerHeight() + 40);
						$(window).on('resize.orderCartInfo', setCartInfoPosLeft);
						setCartInfoPosLeft();
					} else {
						if ($('.cart_title_box').outerHeight() - $('.cart_top_inner').outerHeight() !== 0) {
							cartTop = $('.cart_title_box').outerHeight() - $('.cart_top_inner').outerHeight() - 16
						}
						else {
							cartTop = 0;
						}
						$('.cart_info_wrap').css({
							'top': cartTop,
							'left': '',
						});
						$(window).off('resize.orderCartInfo', setCartInfoPosLeft);
					}

					setOrderBoxOffset($('.cart_top_wrap').data('anchorBox'));
				}
			});
		});

		var config = { attributes: true };

		observer.observe($('.cart_top_wrap').get(0), config);
		setCartInfoPosLeft();

		function setCartInfoPosLeft() {
			var bodyMinWidth, deviceWidth, marginHalf;
			bodyMinWidth = 1440;
			deviceWidth = $(window).width() || window.innerWidth || document.body.clientWidth;

			if (bodyMinWidth > deviceWidth) {
				$('.cart_info_wrap').css('left', 1320 - 273);
			} else {
				marginHalf = ((deviceWidth - 1200)) / 2;
				$('.cart_info_wrap').css('left', 1200 + marginHalf - 273);
			}
		}
	}

	setCartBodyAnchor();

	setPointBannerSwiper();

	setPrdPutSwiper();

	setFloatingInput();

	// 장바구니 정보 영역이 장바구니 body 영역을 넘어가지 못하게 하기 위한 IntersectionObserver 설정
	var _interSectionObserver, marginBottom;
	function setCartBodyObserver() {
		if (_interSectionObserver) {
			_interSectionObserver.disconnect();
		}
		marginBottom = Math.floor(window.innerHeight - mutateCartInfoTop - $('.cart_info_wrap').outerHeight());
		// console.log(marginBottom);
		_interSectionObserver = new IntersectionObserver(function (entries, observer) {
			entries.forEach(function (entry) {
				var isIntersecting;
				isIntersecting = entry.isIntersecting;

				// if ($('.contents_wrap').outerHeight() > $('.contents_inner').outerHeight()) {
				// 	return;
				// }

				if (isIntersecting) {
					// console.log('intersecting');
					$('.cart_info_wrap').addClass('reach_bottom');
				} else {
					// console.log('not intersecting');
					$('.cart_info_wrap').removeClass('reach_bottom');
				}
			});
		}, {
			rootMargin: '0px 0px -' + (marginBottom < 1 ? 0 : (marginBottom - 1)) + 'px 0px',
			threshold: [0, 1],
		});
		_interSectionObserver.observe($('.cart_body .observer_target').get(0));
	}

	function setCartBodyAnchor() {
		var anchorBoxList;

		anchorBoxList = [
			{
				boxClass: '.cart_top_wrap .fold_anchor_box',
				targetClass: '.fold_box_wrap.type_order .fold_box.sps',
				offsetTarget: '.cart_top_wrap',
			},
			{
				boxClass: '.recipient_header_area',
				targetClass: '.recipient_list .recipient_item.sps',
				offsetTarget: '.recipient_header_inner',
			},
			{
				boxClass: '.multi_address_wrap',
				targetClass: '.tbl_row_wrap.sps',
				offsetTarget: '.multi_address_inner',
			},
		];

		anchorBoxList.forEach(function(item, index) {
			// console.log(item);
			if ($(item.boxClass).length > 0) {
				var _tagLinks;
				_tagLinks = $(item.boxClass).find('.tag');

				_tagLinks.on('click.cartAnchor', function (event) {
					var targetId, offsetTop;
					event.preventDefault();

					targetId = event.currentTarget.getAttribute('href');
					// console.log('offsetTarget', $(item.offsetTarget).outerHeight());
					offsetTop = $(targetId).offset().top - $(item.offsetTarget).outerHeight();
					$('html, body').stop().animate({scrollTop: offsetTop}, 300);
				});

				$('.cart_top_wrap').data('anchorBox', item);
				setOrderBoxOffset($('.cart_top_wrap').data('anchorBox'));

				// 상세 컨텐츠 블럭별 class 값 변경 Observer
				var observer = new MutationObserver(function (mutations) {
					mutations.forEach(function (mutation) {

						if (mutation.attributeName === 'class') {
							var target, currentClassList;
							target = mutation.target;
							currentClassList = target.classList.value;
							if (target.dataset.prevClass !== currentClassList) {
								target.dataset.prevClass = currentClassList;

								setTabBtnActive($('.cart_top_wrap').data('anchorBox').targetClass);
							}
						}
					});
				});

				// 스크롤에 따라 탭 active 상태 변경
				function setTabBtnActive(targetClass) {
					var activeIndex;
					activeIndex = $(targetClass + '.sps-blw').length - 1;

					_tagLinks.removeClass('active');
					if (activeIndex !== -1) {
						_tagLinks.eq(activeIndex).addClass('active');
					}
				}

				document.querySelectorAll($('.cart_top_wrap').data('anchorBox').targetClass).forEach(function (target) {
					target.dataset.prevClass = target.classList;
					observer.observe(target, {attributes: true});
				});

				if(item.boxClass !== '.cart_top_wrap .fold_anchor_box') {
					var sensorBox, sensorBody;
					sensorBox = new ResizeSensor( $(item.boxClass + ' .tag_wrap'), setBoxHeight);
					sensorBody = new ResizeSensor( $('.cart_body'), setBoxHeight);

					function setBoxHeight() {
						setOrderBoxOffset(item);

						$(item.boxClass).outerHeight(
							$(item.boxClass + ' .tag_wrap').outerHeight()
							+ parseInt($(item.boxClass).css('padding-top'))
							+ parseInt($(item.boxClass).css('padding-bottom'))
							+ parseInt($(item.boxClass + ' .tag_wrap').css('margin-top'))
							+ parseInt($(item.boxClass + ' .tag_wrap').css('margin-bottom'))
						);
						$(item.boxClass).attr('data-sps-offset', $(item.boxClass).position().top + $('.header_wrapper').outerHeight() + $(item.boxClass).outerHeight());

						calculateCartInfoTransform($(item.boxClass), $(item.boxClass).hasClass('sps-blw'));
					}

					var cartBodyObserver = new MutationObserver(function(mutations, observer) {
						mutations.forEach(function(mutation) {
							if(mutation.attributeName === 'class'){
								var target, currentClassList;
								target = mutation.target;
								currentClassList = target.classList;
								// console.log('currentClassList', currentClassList.contains('sps-blw'));

								calculateCartInfoTransform($(mutation.target), currentClassList.contains('sps-blw'));

								// setOrderBoxOffset($('.cart_top_wrap').data('anchorBox'));
							}
						});
					});

					var config = { attributes: true };
					document.querySelectorAll(item.boxClass).forEach(function (target) {
						target.dataset.prevClass = target.classList;
						cartBodyObserver.observe(target, config);
					});

					function calculateCartInfoTransform(target, isApply) {
						if (isApply){
							$('.cart_info_wrap').css({
								'transform': 'translateY(' + target.find('.fixed_target').outerHeight() + 'px)',
							});
							$('.cart_body .observer_target').css({
								'transform': 'translateY(' + -target.find('.fixed_target').outerHeight() + 'px)',
							})
						} else {
							$('.cart_info_wrap, .cart_body .observer_target').css({
								'transform': 'none',
							});
						}
					}
				}
			}

		})
	}
});


function setOrderBoxOffset(anchorBox) {
	if (anchorBox !== undefined) {
		$(anchorBox.targetClass).each(function (index) {
			var offset;
			offset = $(this).position().top + $('.cart_top_wrap').outerHeight();
			if (anchorBox.targetClass !== '.fold_box_wrap.type_order .fold_box.sps') {
				offset += $(anchorBox.boxClass).outerHeight() + parseInt($('.cart_body').css('padding-top'));
			}
			$(this).attr('data-sps-offset', offset);
			$(this).attr('data-add-offset', -$('.cart_top_wrap').outerHeight());
		});
	}
}

function setPointBannerSwiper() {
	
	// 상품 상단 - 알림신청 영역 텍스트 swiper
	if ( $('.point_banner_wrap').length > 0 ) {
		var pagingWrapSwiper = new CustomSwiper('.point_banner_wrap .swiper-container', {
			slidesPerView: '3',
			spaceBetween: 18,
			speed: 500,
			pagination: {
				el: $('.point_banner_wrap').find('.swiper-pagination')[0],
				clickable: true,
			},
		});
	}
}

function setPrdPutSwiper() {
	// 함께 많이 담은 상품
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
}

// 해외배송 입력 특수 input
function setFloatingInput(wrap, input) {
	wrap = wrap || '.floating_input_item';
	input = input || '.form_ip';

	var floatingWrap, floatingIp;

	if($(wrap).length > 0){
		$(wrap).each(function(){
			floatingWrap = $(this);
			floatingIp = $(this).find(input);

			if(floatingIp.val().length > 0 ) floatingWrap.addClass('value');

			floatingIp.on({
				'propertychange change input paste': function () {
					floatingWrap = $(this).closest(wrap);
					if($(this).val().length > 0 ) {
						floatingWrap.addClass('value');
					} else{
						floatingWrap.removeClass('value');
					}
				},
				'focusin': function () {
					floatingWrap = $(this).closest(wrap);

					if (!floatingWrap.hasClass('focus')) {
						floatingWrap.addClass('focus');
					}
				},
				'focusout': function () {
					floatingWrap = $(this).closest(wrap);

					if (floatingWrap.hasClass('focus')) {
						floatingWrap.removeClass('focus');
					}

					if ($(this).val().length > 0 ) {
						floatingWrap.addClass('value');
					} else{
						floatingWrap.removeClass('value');
					}
				}
			});
		});

	}

}