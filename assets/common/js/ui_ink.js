/*
 * name : ui.js
 * desc : 공통 자바스크립트
 * writer : glim
 * create : 2021/11/12
 * update :
 * -
 */

if (window.NodeList && !NodeList.prototype.forEach) {
	NodeList.prototype.forEach = function (callback, thisArg) {
		thisArg = thisArg || window;
		for (var i = 0; i < this.length; i++) {
			callback.call(thisArg, this[i], i, this);
		}
	};
}

Element.prototype._getBoundingClientRect = Element.prototype.getBoundingClientRect
Element.prototype.getBoundingClientRect = function () {
	var rect = Element.prototype._getBoundingClientRect.call(this);
	rect.x = rect.left;
	rect.y = rect.top;
	return rect;
}

var KyoboBookPub = KyoboBookPub || {};

$(function(){
	$.widget("ui.selectmenu", $.ui.selectmenu, {
		calcMenuWidth: function() {
			var instance;
			instance = this;

			btnWidth = instance.button.outerWidth();
			menuWidth = instance.menuWrap.outerWidth();
			// console.log('calcMenuWidth', this, btnWidth, menuWidth);
			instance.menuWrap.css('width', btnWidth);
		}
	});

	// 상품 옵션 커스터마이징
	$.widget('custom.selectProdOption', $.ui.selectmenu, {
		_renderItem: function (ul, item) {
			var li, wrapper, labelBox, priceBox, isPBProd;
			li = $('<li>');
			wrapper = $('<div>', {
				'class': 'prod_option',
			});

			if (item.disabled) {
				li.addClass('ui-state-disabled');
			}
			isPBProd = item.element.attr('data-prod-pb') !== undefined ? true : false;
			wrapper.data(item.element.data());

			labelBox = $('<span>', {
				'class': 'option_label_box',
				'text': item.label,
			});

			priceBox = $('<span>', {
				'class': 'option_price_box',
			});

			if (item.disabled && isPBProd) {
				$('<button>', {
					'class': 'btn_option_restock' + (isPBProd ? ' prod_pb' : ''),
					'text': '재입고알림',
				}).appendTo(priceBox);
			} else if (!item.disabled) {
				$('<span>', {
					'class': 'option_price' + (isPBProd ? ' prod_pb' : ''),
					'text': item.element.attr('data-price'),
				}).appendTo(priceBox);
				$('<span>', {
					'class': 'option_price_unit',
					'text': item.element.attr('data-unit'),
				}).appendTo(priceBox);
			}

			wrapper.append(labelBox).append(priceBox);
			return li.append(wrapper).appendTo(ul);
		}
	});
});

KyoboBookPub.ink = (function () {
	var _front = {},
		_bodyMinWidth = 1440,
		_dialogCount = 0,
		_deviceWidth = 0,
		_deviceHeight = 0,
		_scrollLeft = 0,
		saveScrollLeft = 0,
		_scrollTop = 0,
		saveScrollTop = 0,
		_headerWrapper,
		_flyMenuEl,
		_floatingEl,
		_container,
		_btnGoTop;

	/**
	 * GNB 메뉴 엑티브 상태 이벤트 설정
	 */
	function setGNB() {
		if(_headerWrapper === undefined){return;}

		var searchIp = $('.search_input_wrap');
		var anbWrap = $('.anb_wrap');
		var serviceMore = $('.gnb_sub_list .gnb_sub_item.more_service');
		var brandMore = $('.service_mall_list .service_mall_item.brand_more');
		var memberBenefitMore = $('.customer_service_list .customer_service_item.member_benefit');
		var autoCompleteLayer = $('.auto_complete_wrap', _headerWrapper);
		var saveScrollLeft = 0;
		var headerFixedOffset = 0;

		// header sps set
		if(_headerWrapper.hasClass('sps')){
			_headerWrapper.attr('data-sps-offset', Math.round($('.gnb_wrap').offset().top));
			headerFixedOffset = parseInt(_headerWrapper.attr('data-sps-offset'));

			$(window).off('scroll.uiGnb resize.uiGnb', headerScrollPosX).on('scroll.uiGnb resize.uiGnb', headerScrollPosX);

			function headerScrollPosX(){
				if(_scrollTop > headerFixedOffset){
					if ( _bodyMinWidth > _deviceWidth && _deviceWidth > 0) {
						_headerWrapper.css({
							'transform': 'translateX(' + -_scrollLeft + 'px)'
						});

						saveScrollLeft = _scrollLeft;
					}
				}else{
					_headerWrapper.css({
						'transform': ''
					});
				}
			}
		}

		if(anbWrap.find('.anb_area .tab_wrap').length > 0){
			// 서비스 전체보기 masonry 적용
			anbWrap.find('.anb_area .tab_wrap').on({
				'tabsactivate': function(event, ui){
					if($(ui.newPanel).hasClass('anb_service')){
						var masonryContainer = $(ui.newPanel).find('.all_service_list');
						var anbAllService = masonryContainer.masonry({
							// options기
							itemSelector: '.anb_service .all_service_list .all_service_item',
							horizontalOrder: true,
							transitionDuration: 0,
							initLayout: false,
						});

						anbAllService.masonry();
					}
				},
			});
		}

		// 통합검색 레이어창
		$('.btn_layer_close', autoCompleteLayer).on('click', function(){
			autoCompleteLayer.removeClass('active');
		});

		// 브랜드 리스트 height
		var brandMenu = $('.brand_more_list_box');
		var brandMenuHeight = 0;

		function setCalcBrandMenuHeight(){
			if(brandMenuHeight === 0){
				$('.brand_more_list .brand_more_item', brandMenu).each(function(i){
					if (i % 2 === 0 && i < 10) {
						brandMenuHeight += $(this).outerHeight(true);
					}
				})

				brandMenu.height((brandMenuHeight));
			}
		}


		// 검색어 입력 시 검색창 x버튼(초기화버튼 노출)
		setSearchInput(searchIp, '.ip_gnb_search');

		// 서비스 더보기 on/off
		moreListToggle(serviceMore, serviceMore.find('.btn_more_service'));

		// 전체메뉴 on/off
		moreListToggle(anbWrap, anbWrap.find('.btn_anb'));

		// 브랜드 더보기 on/off
		moreListToggle(brandMore, brandMore.find('.btn_brand_more'), setCalcBrandMenuHeight);

		// 회원혜택 더보기 on/off
		moreListToggle(memberBenefitMore, memberBenefitMore.find('.btn_member_benefit'));

		// 커튼배너
		curtainBannerOnOff();

		function moreListToggle(container, tg, callback){
			tg.on({
				'click': function(){
					if(container.hasClass('active')){
						container.removeClass('active animated');
					}else{
						container.addClass('active');

						setTimeout(function() {
							container.addClass('animated');

							if ( callback != null && typeof callback === "function" ) {
								callback.apply ( null, [container]);
							}
						}, 30);
					}
				},
			});
		}

		function curtainBannerOnOff() {
			var curtainBanner = $('.curtain_banner_wrap');
			curtainBanner.find('.btn_curtain_expand').on('click', function () {
				curtainBanner.addClass('active');

				setTimeout(function () {
					curtainBanner.addClass('animated');
				}, 30);
			});

			curtainBanner.find('.btn_curtain_close').on('click', function () {
				curtainBanner.removeClass('active animated');
			});
		}



	}

	/**
	 * 플라이 배너, 탑버튼 컨트롤
	 */
	function setFloating() {
		if(_flyMenuEl.length <= 0 && _floatingEl.length <= 0){return ;}

		var headerFixedOffset = 0;
		if(!$('.wrapper').hasClass('member_login') && !$('.wrapper').hasClass('member_info')) {
			headerFixedOffset = Math.round($('.gnb_wrap').offset().top);

			// 윙배너 sps set
			_flyMenuEl.attr('data-sps-offset', headerFixedOffset);
		}

		setFloatingScrollPosX();
		$(window).off('scroll.uiFloating resize.uiFloating', setFloatingScrollPosX).on('scroll.uiFloating resize.uiFloating', setFloatingScrollPosX);

		setFlyBannerEvtSwiper();

		function setFloatingScrollPosX() {
			if (_scrollLeft < (_bodyMinWidth - _deviceWidth)) {
				_floatingEl.css('transform', 'translateX(' + ((_bodyMinWidth - _deviceWidth) - _scrollLeft) + 'px)');

				if(_scrollTop < headerFixedOffset){
					_flyMenuEl.css('transform', '');
				}else{
					_flyMenuEl.add(_floatingEl).css('transform', 'translateX(' + ((_bodyMinWidth - _deviceWidth) - _scrollLeft) + 'px)');
				}
			} else {
				_flyMenuEl.add(_floatingEl).css('transform', '');
			}
		}

		function setFlyBannerEvtSwiper(){
			var flyEvtBanner = $('.fly_menu_wrapper .fly_event_banner');
			if($('.swiper-slide', flyEvtBanner).length > 1){
				var flyBannerEvtSwiper = new CustomSwiper($('.swiper-container', flyEvtBanner), {
					slidesPerView: '1',
					speed: 500,
					navigation: {
						nextEl: $('.swiper_control_box .swiper-button-next', flyEvtBanner)[0],
						prevEl: $('.swiper_control_box .swiper-button-prev', flyEvtBanner)[0],
					},
					pagination: {
						el: $('.swiper_control_box .swiper-pagination', flyEvtBanner)[0],
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
				$('.swiper_control_box', flyEvtBanner).remove();
			}
		}
	}

	/**
	 * footer 패밀리 사이트 더보기
	 */
	function setFamilySiteMore() {
		$('.btn_family_site').on('click', function(){
			if(!$('.family_site_box').hasClass('active')){
				$('.family_site_box').addClass('active');

				setTimeout(function() {
					$('.family_site_box').addClass('animated');
				}, 30);
			}else{
				$('.family_site_box').removeClass('active animated');
			}

		});
	}

	/**
	 * 브래드크럼 메뉴 on/off
	 */
	function setBreadCrumb() {
		$('.breadcrumb_item', '.breadcrumb_wrap').each(function(){
			$(this).on({
				'mouseenter focusin': function(event){
					var tg = $(this);
					tg.siblings('.breadcrumb_item').removeClass('active');
					tg.addClass('active');

					setTimeout(function() {
						tg.addClass('animated');
					}, 30);
				},
				'mouseleave focusout': function(event){
					var item, that;
					that = this;
					item = $(that).closest('.breadcrumb_item');
					setTimeout(function () {
						if ($(item).find('a:focus').length < 1 && $(item).find('button:focus').length < 1) {
							$(that).removeClass('active animated');
						}
					}, 50);
				},
			});
		});
	}

	/**
	 * 검색창 input 입력 시 초기화 버튼 노출
	 * @param wrap 컨테이너 DOM 셀렉터(default : .form_ip_search)
	 * @param input input 셀렉터(default : .form_ip)
	 * 한화면에서 동일 구조가 n개인 경우, 별도 처리 필요하므로 클래스명 각각 다르게 처리필요
	 */
	function setSearchInput(wrap, input) {
		wrap = wrap || '.form_ip_search';
		input = input || '.form_ip';

		var searchWrap, searchIp, clearBtn;

		if($(wrap).length > 0){
			$(wrap).each(function(){
				searchWrap = $(this);
				searchIp = $(this).find(input);
				clearBtn = $(this).find('.btn_ip_clear');
				// console.log(searchIp);

				if (searchIp.length > 0) {
					if (searchIp.val().length > 0) searchWrap.addClass('value');

					clearBtn.off('click').on('click', function () {
						searchWrap = $(this).closest(wrap);
						searchWrap.find(input).val('').focus();
						searchWrap.removeClass('value');

					})

					searchIp.on({
						'propertychange change input paste': function () {
							searchWrap = $(this).closest(wrap);
							if ($(this).val().length > 0) {
								searchWrap.addClass('value');
							} else {
								searchWrap.removeClass('value');
							}
						},
						'focusin': function () {
							searchWrap = $(this).closest(wrap);

							if (!searchWrap.hasClass('focus')) searchWrap.addClass('focus');
						},
						'focusout': function () {
							searchWrap = $(this).closest(wrap);

							if (searchWrap.hasClass('focus')) searchWrap.removeClass('focus');
						}
					});
				}
			});

		}

	}

	/**
	 * 커스텀 디자인 스크롤
	 * @param container 컨테이너 DOM 셀렉터(default : .custom_scroll_wrap)
	 */
	function setCustomScroll(container) {
		if (window.SimpleBar !== undefined) {
			var selector;
			SimpleBar.defaultOptions.autoHide = false;
			selector = container !== undefined ? container + ' .custom_scroll_wrap' : '.custom_scroll_wrap';

			$(selector).each(function (index) {
				if ($(this).closest('.dialog_contents').length === 0) {
					setCustomScrollObj(this);
				}

				// var observer = new MutationObserver(function(mutations, observer) {
				// 	mutations.forEach(function(mutation) {
				// 		if(mutation.attributeName === 'style'){
				// 			target = mutation.target;
				// 			var scrollContWrap = $(target).closest('.custom_scroll_wrap');
				// 			var scrollCont = $(target).find('.custom_scroll_inner');
				// 			var currentHeight = scrollCont.height();
				//
				// 			if(scrollContWrap.height() < scrollCont.height()){
				// 				scrollContWrap.addClass('active');
				// 			} else{
				// 				scrollContWrap.removeClass('active');
				// 			}
				// 		}
				// 	});
				// });
				//
				// var config = { attributes: true, childList: true, characterData: true };
				//
				// if ($(scrollInner[0]).closest('.simplebar-content-wrapper')[0].getAttribute('style').match('overflow: hidden scroll')) {
				// 	$(this).addClass('active');
				// }
				// observer.observe($(scrollInner[0]).closest('.simplebar-content-wrapper')[0], config);

				// console.log(scrollInner[0]);
				// sensor = new ResizeSensor(scrollInner[0], function () {
				// 	simpleBar.recalculate();
				// });
				// this.sensor = sensor;
			});
		}
	}

	function setCustomScrollObj(target) {
		var simpleBar, options, child, scrollInner;
		child = $(target).children();
		$(target).prepend('<div class="custom_scroll_inner" tabIndex="0"></div>');
		scrollInner = $(target).find('.custom_scroll_inner');
		scrollInner.append(child);

		options = SimpleBar.getOptions(target);
		simpleBar = new SimpleBar(target, options);
		target.simpleBar = simpleBar;
		// console.log(target);

		var observer = new MutationObserver(function(mutations, observer) {
			mutations.forEach(function(mutation) {
				if(mutation.attributeName === 'style'){
					target = mutation.target;
					var scrollContWrap = $(target).closest('.custom_scroll_wrap');
					var scrollCont = $(target).find('.custom_scroll_inner');
					var currentHeight = scrollCont.height();

					if(scrollContWrap.height() < scrollCont.height()){
						scrollContWrap.addClass('active');
					} else{
						scrollContWrap.removeClass('active');
					}
				}
			});
		});

		var config = { attributes: true, childList: true, characterData: true };

		// console.log($(scrollInner[0]).closest('.simplebar-content-wrapper')[0].getAttribute('style'));
		if ($(scrollInner[0]).closest('.simplebar-content-wrapper')[0].getAttribute('style').match('overflow: hidden scroll') !== null
			|| $(scrollInner[0]).closest('.simplebar-content-wrapper')[0].getAttribute('style').match('-ms-overflow-y: scroll') !== null) {
			$(target).addClass('active');
		}
		observer.observe($(scrollInner[0]).closest('.simplebar-content-wrapper')[0], config);

		$(target).off('mousewheel DOMMouseScroll').on('mousewheel DOMMouseScroll', function (event) {
			openSelectClose();
		});

		if ($(target).hasClass('horizontal')) {
			$(target).off('mousewheel DOMMouseScroll').on('mousewheel DOMMouseScroll', function (event) {
				var originEvent, delta, scrollElement;
				scrollElement = simpleBar.getScrollElement();

				originEvent = event.originalEvent;
				if (event.originalEvent.wheelDelta) {
					delta = event.originalEvent.wheelDelta / 2;
				} else {
					delta = -originEvent.detail * 20;
				}

				if ((scrollElement.scrollLeft -= delta) <= 0
					|| (scrollElement.getBoundingClientRect().width + scrollElement.scrollLeft - delta) >= scrollElement.scrollWidth) {
					return;
				}

				event.preventDefault();
				scrollElement.scrollLeft -= delta;

			});
		}
	}

	/**
	 * 테이블 캡션 생성
	 */
	function setTableCaption() {
		$('table[class*="tbl_col"], table[class*="tbl_row"], table[class*="tbl_prod"], table[class*="tbl_spec_compare"]').each(function (index) {
			var table, tableClass, captionText, captionComplex, theadHeader, tbodyHeader, bodyToHeadIdxs, hasThead,
				captionSubFix;
			table = $(this);
			tableClass = $(this).attr('class');
			captionTextOrigin = $(this).find('caption').text();
			captionComplex = '';
			captionSubFix = '';
			theadHeader = [];
			tbodyHeader = [];
			bodyToHeadIdxs = [];
			hasThead = false;
			// 180123 수정 : match 값 수정
			if (tableClass.match('tbl-form') && tableClass.match('form-view') !== null) {
				/* console.log('has _ip!!'); */
				captionSubFix = '을(를) 입력하는 표입니다.';
			} else {
				/* console.log('no _ip!!'); */
				captionSubFix = '을(를) 나타낸 표입니다.';
			}


			// thead th값 추출
			if ($(this).find('thead th').length > 0) {
				$(this).find('thead th').each(function (index) {
					theadHeader.push($(this).text());
				});
			}
			// tbody th값 추출
			if ($(this).find('tbody th').length > 0) {
				$(this).find('tbody th').each(function (index) {
					// tbody th가 thead th의 서브 헤더인 경우(thead th와 tbody th가 둘 다 존재하는 경우)
					if (theadHeader.length > 0) {
						if (tbodyHeader[$(this).index()] === undefined) {
							tbodyHeader[$(this).index()] = theadHeader[$(this).index()] + ' 컬럼의 하위로';
						}
						tbodyHeader[$(this).index()] += ' ' + $(this).text();
					} else {
						tbodyHeader.push($(this).text());
					}
				});

				tbodyHeader = tbodyHeader.filter(function (n) {
					return n !== undefined;
				});
			}
			// console.log(theadHeader);
			// console.log(tbodyHeader);

			if (theadHeader.length > 0 && tbodyHeader.length > 0) {
				captionComplex += theadHeader.join(', ') + ' ' + tbodyHeader.join(', ');
			} else if (theadHeader.length > 0) {
				captionComplex += theadHeader.join(', ');
			} else if (tbodyHeader.length > 0) {
				captionComplex += tbodyHeader.join(', ');
			}

			//console.log(captionTextOrigin + ' 목록이며 ' + captionComplex +  ' 을(를) 나타낸 표입니다.');
			$(this).find('caption').text(captionTextOrigin + ' 테이블로 ' + captionComplex + captionSubFix);
		});
	}

	/**
	 * 별점 컴포넌트 생성
	 */
	function setStarRating() {
		if ($('.form_rating').length <= 0) return false;

		$('.form_rating').each(function(){
			var that = $(this);

			that.rating({
				language: 'ko',
				theme: 'krajee-gly',
				clearCaption: 0,
				stars: 4,
				min: 0,
				max: 10,
				step: 2.5,
				starCaptions: function (rating) {
					if(that.data('caption') !== undefined) {
						return '<span class="val">' + rating + '</span>' + '<span class="total">' + 10 + '</span>';
					}else{
						return ' ';
					}
				}
			});
			// that.on('rating:change', function(event, value, caption) {
			// 	console.log(`${value}/10`);
			// });

			if(that.data('caption') !== undefined) {
				that.prev('.rating-container').addClass('has_caption');
			}
		});
	}

	/**
	 * 스크롤 동작시 해당 요소에 도달 시 엘리먼트 상단 고정(sps init)
	 */
	function setSpsOffsetData() {
		var ignoreClassList = [];
		var spsElem;
		var headerH = $('.header_wrapper').hasClass('sps') || $('.header_wrapper').hasClass('fix_header') ? 80 : 0;

		ignoreClassList = [
			// 'header_wrapper',
		];

		spsElem = $('.sps', _container);

		// container_wrapper > sps 엘리먼트 타겟팅
		$('.sps', _container).each(function (index) {

			var that, isIgnore;
			that = this;
			isIgnore = ignoreClassList.some(function (element) {
				return $(that).hasClass(element);
			});
			if (!isIgnore) {
				spsElem.push(that);
			}
		});

		if( spsElem.length === 0 ) return false;

		spsElem.each(function (i) {
			var target = $(this);
			fixData(target);
			// heightChangeTarget.push(target.data('height-change'));

			if (i === spsElem.length - 1) {
				ScrollPosStyler.init();
			}
		});

		// heightChangeTarget.forEach(function (target, idx) {
		// 	var sensor = null;
		// 	sensor = new ResizeSensor( $('.' + target), function() {
		// 		fixData( $('.sps[data-height-change='+heightChangeTarget[idx]+']') );
		// 	});
		// });


		var sensor = null;
		sensor = new ResizeSensor( _container, function() {
			$('.sps[data-height-observe]').each(function(index){
				// console.log('fixData');
				fixData($(this));
			})
		});

		function fixData(tg) {
			var observerCont, addOfs, tgHeight;
			if( tg.find('.sps_observer').length === 0 ) {
				tg.append('<div class="sps_observer" style="top:'+ tg.css('top') +';"></div>');
			}

			// console.log('fixData', tg);

			observerCont = tg.find('.sps_observer');
			addOfs = ( tg.data('add-offset') !== undefined && !isNaN(tg.data('add-offset')) ) ? tg.data('add-offset') : 0;
			tgHeight = tg.outerHeight();

			if( tg.hasClass('sps_ofs_bottom') ) {
				tg.attr('data-sps-offset', Math.round(observerCont.offset().top - headerH + tgHeight - addOfs ));
			}
			else {
				tg.attr('data-sps-offset', Math.round(observerCont.offset().top - headerH - tgHeight - addOfs ));
			}
			// console.log(tg.attr('data-sps-offset'));
			// console.log(observerCont.offset().top, headerH, tgHeight, addOfs);
		}
	}

	/**
	 * fixed 컨텐츠 가로스크롤 시 left값 변경
	 */
	function setFixedElementPosX() {
		var fixedDOMList, forceAddClassList, ignoreClassList;
		fixedDOMList = [];

		// sps를 가지지 않은 엘리먼트 중 추가할 class
		forceAddClassList = [
			'prod_detail_footer',
			'fix_header',
			'cart_top_wrap.sps-blw',
			'cart_info_wrap',
			'wrapper .spec_compare_layer_wrap',
		];

		// 제외할 class
		ignoreClassList = [
			'fly_menu_wrapper',
			'floating_wrapper',
			'tab_content',
		];

		forceAddClassList.forEach(function (element) {
			// console.log(element);
			$('.' + element).each(function (index) {
				this.isForceTransformX = true;
				fixedDOMList.push(this);
			});
		});

		// sps.sps_scroll_fixed 가진 엘리먼트 중 ignoreClassList에 없는 경우 타겟팅
		$('.sps.sps_scroll_fixed').each(function (index) {
			var that, isIgnore;
			that = this;
			isIgnore = ignoreClassList.some(function (element) {
				return $(that).hasClass(element);
			});
			if (!isIgnore) {
				fixedDOMList.push(that);
			}
		});

		// 해상도 영역이 최소 넓이 값보다 작은 경우
		if ( _bodyMinWidth > _deviceWidth && _deviceWidth > 0) {
			// 해상도 영역 작은 경우 : left 스크롤 변경시 작동
			if ( saveScrollLeft !== _scrollLeft ) {
				fixedDOMList.forEach(function (element) {
					if(!$(element).hasClass('sps_scroll_fixed')){
						$(element).css({
							'transform': 'translateX(' + - _scrollLeft + 'px)'
						});
					}else{
						if( $(element).attr('data-sps-offset') <= _scrollTop ) {
							$(element).css({
								'transform': 'translateX(' + - _scrollLeft + 'px)'
							});
						}
					}

				});
				// 고정 컨텐츠 left change
				saveScrollLeft = _scrollLeft;
			}

			// 해상도 영역 작은 경우 : top 스크롤 변경시 작동
			if ( saveScrollTop !== _scrollTop ) {
				fixedDOMList.forEach(function (element) {
					if ($(element).attr('data-sps-offset') <= _scrollTop && element.isForceTransformX) {
						$(element).css({
							'transform': 'translateX(' + -_scrollLeft + 'px)'
						});
						element.isForceTransformX = false;
					} else if ($(element).attr('data-sps-offset') > _scrollTop && !element.isForceTransformX) {
						element.isForceTransformX = true;
					} else if($(element).attr('data-sps-offset') > _scrollTop && element.isForceTransformX) {
						$(element).css('transform', '');
					}
				});

				saveScrollTop = _scrollTop;
			}


		}
	}

	/**
	 * sps init
	 */
	if (window.ScrollPosStyler) {
		ScrollPosStyler.init({
			classAbove: 'sps-abv',
			classBelow: 'sps-blw',
		});
	}

	/**
	 * 레이어 팝업 설정 (jquery UI Dialog)
	 * @param selector {string} 레이어 팝업으로 생성할 컨테이너 셀렉터(default: '.dialog_wrap')
	 * @param btnOpen {string} 레이어 팝업을 띄우기 위한 버튼 셀렉터(default: [data-role=btn-dialog])
	 * @param btnClose {string} 레이어 팝업을 띄우기 위한 버튼 셀렉터(default: [data-dialog-close])
	 */
	var dialogHeight = {};
	function setUIDialog(selector, btnOpen, btnClose) {
		selector = selector || '.dialog_wrap';
		btnOpen = btnOpen || '[data-role=btn-dialog]';
		btnClose = btnClose || '[data-dialog-close]';

		if( $(selector).length > 0 ) {
			var dialogClass, containerId, dialogId, containerClasses;

			$(selector).each(function() {
				if ( $(this).parents('.ui-dialog').length > 0 ) return false;

				containerId = 'body';
				containerClasses = 'dialog_wrapper';
				dialogClass = '';

				// dialog multi class 추가
				if ($(this).data('class') !== undefined) {
					if (isNaN(parseInt($(this).data('class')))) {
						dialogClass = $(this).data('class');
					} else {
						dialogClass = 'auto';
					}
				}

				// resize시, popup 가운데 정렬 css제어를 위해 container append
				dialogId = containerId.replace('#', '') + 'Dialog' + _dialogCount;
				$(containerId).append('<div id="' + dialogId + '" class="' + containerClasses + '"></div>');

				_dialogCount++;

				// 팝업 기본 설정
				$(this).dialog({
					appendTo: containerId + ' #' + dialogId, // resize시, popup 가운데 정렬 css제어를 위해 container append
					autoOpen: false,
					width: 'none',
					minHeight: 'none',
					closeText: "닫기",
					modal: true,
					resize:false,
					resizable:false,
					draggable:false,
					position: null,
					classes: {
						'ui-dialog': dialogClass, // popup case multi class 추가
					},
					open: function( event, ui ) {
						var that = $(this);
						var papa = that.closest('.ui-dialog');
						var container = that.closest('.' + containerClasses);

						if(that.data('nodim') !== undefined){
							var dialogNoDim = true;
						}

						// 팝업 닫기 시, 기존 스크롤 위치로 이동위해 현재 스크롤값 저장(상단 이동 막기)
						if(!dialogNoDim){
							var scrollTop = $(document).scrollTop();
							container.css({'top': scrollTop,});
							$('body').addClass('dialog_open');
						} else{
							container.addClass('no_dim');
						}

						// 팝업 2개 이상 노출 시 z-index 지정(팝업 위 팝업 미구현시 삭제)
						var zNum = 999;
						if ( $('.dialog_wrapper:visible').length > 0 ) {
							$('.dialog_wrapper:visible').each(function (){
								var dialog;
								dialog = $(this);
								zNum = Math.max(zNum, parseInt(dialog.css('z-index')));
							});
						}
						container.addClass('open').css('z-index', zNum+2);
						// console.log(container);

						// popup 최소 높이보다 작은경우 100vh 처리
						if(!dialogNoDim) {
							setTimeout(function(){
								dialogHeight[container.attr('id')] = papa.outerHeight();
								dialogAutoHeight();
							}, 50)
						}

						// 팝업 내 swiper 업데이트
						if ($(this).parent().find('.swiper-container').length > 0) {
							$(this).parent().find('.swiper-container').each(function (index) {
								updateDialogSwiper(this);
							});
						}

						if ($(this).parent().find('.custom_scroll_wrap').length > 0) {
							$(this).parent().find('.custom_scroll_wrap').each(function (index) {
								// console.log('!!', this.simpleBar);
								if (this.simpleBar !== undefined) {
									this.simpleBar.recalculate();
								} else {
									setCustomScrollObj(this);
								}
							});
						}

						// select 열려있으면 닫기
						openSelectClose();

						KyoboBookPub.ink.autoOverflowContents('.dialog_wrapper');

						// 상품 리뷰 팝업 이미지 비율 체크 재실행
						if($(this).hasClass('dialog_review')){
							// 리뷰 이미지 비율 체크
							$('.comment_wrap .comment_swiper_wrap .portrait_img_box').each(function(){
								var imgTg = $(this);
								KyoboBookPub.ink.checkImagePortrait(imgTg);
							});
						}
					},
					close: function( event, ui ) {
						var that = $(this);
						var container = that.closest('.dialog_wrapper')
						var scrollTopPos = container.css('top');
						var dialogNoDim;

						if($('.dialog_wrapper.no_dim.open').length !== 0) {
							dialogNoDim = true;
						}

						// z-index style 삭제
						container.removeClass('open').removeAttr('style');

						// 팝업 닫기 시, 기존 스크롤 위치로 이동(상단 이동 막기)
						if( $('.ui-dialog-content:visible' ).length === 0 || $('[data-nodim]:visible').length > 0) {
							container.removeAttr('style');
							$(containerId).removeClass('dialog_open');

							if(!dialogNoDim) $(window).scrollTop(parseInt(scrollTopPos));
						}

						container.removeClass('no_dim');

						if(!dialogNoDim) delete dialogHeight[container.attr('id')];
					},
				});

				// dim 없는경우 modal false 처리
				if($(this).data('nodim') !== undefined){
					$(this).dialog({modal: false});
				}

				if ($(btnOpen).length > 0) {
					$(btnOpen).each(function (index) {
						$(this).off('click').on('click', function (event) {
							var openTgId = $(this).data('target');

							event.preventDefault();
							dialogOnOff().popOpen(openTgId);
						});
					});
				}

				if ($(btnClose).length > 0) {
					$(btnClose).each(function (index) {
						$(this).off('click').on('click', function (event) {
							var openTgId, closeTgId;
							closeTgId = $(this).closest(selector).attr('id');

							event.preventDefault();
							dialogOnOff().popClose('#' + closeTgId);

							if ($(this).data('role') === 'btn-dialog') {
								openTgId = $(this).data('target');
								dialogOnOff().popOpen(openTgId);
							}
						});
					});
				}
			});
		}
	}

	/**
	 * 레이어 팝업 최소 높이 지정
	 */
	function dialogAutoHeight(){
		if($('.dialog_wrapper.open').length > 0){
			$('.dialog_wrapper.open').each(function(){
				var containerId = $(this).attr('id');
				if($(window).height() < dialogHeight[containerId]){
					$(this).find('.ui-dialog').addClass('h_auto');

					if ($(this).find('.custom_scroll_wrap').length > 0) {
						$(this).find('.custom_scroll_wrap').each(function (index) {
							this.simpleBar.recalculate();
						});
					}

				} else {
					$(this).find('.ui-dialog').removeClass('h_auto');
				}
			})
		}
	}

	/**
	 * 레이어 팝업 On/Off(외부 호출용)
	 */
	function dialogOnOff(){
		var control = {
			/**
			 * 레이어팝업 open
			 * @param tgId {string} 팝업 타겟 id
			 * @param callback {string} 팝업 open 후 callback 함수
			 */
			popOpen : function(tgId, callback){
				$(tgId).dialog('open');
				if ( callback != null && typeof callback === "function" ) {
					callback.apply ( null, [tgId]);
				}

				// console.log($('.form_sel select', $(tgId)).selectmenu);
				$('.form_sel select', $(tgId)).selectmenu('calcMenuWidth');
			},

			/**
			 * 레이어팝업 close
			 * @param tgId {string} 팝업 타겟 id
			 */
			popClose : function(tgId) {
				$(tgId).dialog('close');
			},
		}

		return control;
	}


	/**
	 * 팝업이 오픈된 뒤 실제 브라우저 렌더링이 된 후 swiper 업데이트를 위한 재귀함수
	 */
	function updateDialogSwiper(dialog) {
		if (dialog.clientWidth > 0) {
			if (dialog.swiper !== undefined) {
				// 썸네일 swiper update
				if (dialog.swiper.params.thumbs.swiper !== null) {
					dialog.swiper.params.thumbs.swiper.update();
				}
				dialog.swiper.update();

				if ($(dialog.swiper.$el[0]).find('.custom_scroll_wrap').length > 0) {
					$(dialog.swiper.$el[0]).find('.custom_scroll_wrap').each(function (index) {
						this.simpleBar.recalculate();
					// console.log(this.simpleBar);
					});
				}
			}
		} else {
			setTimeout(function () {
				updateDialogSwiper(dialog);
			}, 10);
		}
	}


	/**
	 * togglePassword : 비밀번호 숨김/보임 toggle
	 * @param selector {string} 실행 대상 element
	 * @param btnSelector {string} 실행 button
	 */
	function togglePassword(wrap, btnSelector){
		wrap = wrap || '.form_ip_pw';
		btnSelector = btnSelector || '.btn_toggle_pw';

		var that, toggleInput;
		$(btnSelector).each(function (index) {
			that = $(this);

			if (that.closest(wrap).find('input').prop('disabled')){
				that.attr("disabled", true);
			}

			that.off('click').on('click', function(){
				toggleInput = $(this).closest(wrap).find('input');

				if ($(this).hasClass('active') && toggleInput.attr('type') === 'text'){
					$(this).removeClass('active');
					toggleInput.attr('type', 'password');
				} else {
					$(this).addClass('active');
					toggleInput.attr('type', 'text');
				}
			});
		});
	}

	/**
	 * select init
	 * @param selector {string} 실행 element
	 */
	function setUISelect(selector) {
		selector = selector || '.form_sel';
		if ($(selector).length > 0) {
			$(selector).each(function () {
				var selectMenuOption, selectClass, selectPosition, isArwType, isCalendarType;
				isArwType = $(this).data('class') === 'type_arw';
				isCalendarType = $(this).data('class') === 'type_calendar';
				selectMenuOption = {};
				selectClass = '';
				selectPosition = {my: 'left top', at: 'left bottom'};

				if (isArwType){
					selectPosition = {my: 'right top+6', at: 'right bottom'};
				} else if (isCalendarType){
					selectPosition = {my: 'right top+6', at: 'right bottom'};
				}
				selectMenuOption.position = selectPosition;

				if ($(this).data('append-to') !== undefined) {
					selectMenuOption.appendTo = $(this).data('append-to');
				}

				// custom select 일 경우
				if ($(this).data('renderer')) {
					setCustomSelect($(this), selectMenuOption);
					return;
				}

				selectMenuOption.create = function (event) {
					var that, instance, btnWidth, menuWidth;
					that = this;

					instance = $(that).selectmenu('instance');
					selectClass = $(that).closest(selector).data('class');

					if (selectClass){
						$(that).closest(selector).addClass(selectClass);
						instance.menuWrap.addClass(selectClass);
					}


					$(that).selectmenu('open');

					btnWidth = instance.button.outerWidth();
					menuWidth = instance.menuWrap.outerWidth();

					if (btnWidth !== menuWidth) {
						if (selectClass === 'type_arw') { // arw 타입은 버튼 크기 크기와 옵션 크기 다름
							$(that).selectmenu('close');
							return false;
						} else if (selectClass === 'type_calendar'){
							$(that).selectmenu('close');
							return false;
						}

						$(that).selectmenu('calcMenuWidth');
					}

					sensor = new ResizeSensor( instance.button, function() {
						if (selectClass !== 'type_arw') {
							$(that).selectmenu('calcMenuWidth');
						} else if (selectClass === 'type_calendar'){
							$(that).selectmenu('calcMenuWidth');
						}
					});
					$(that).selectmenu('close');
				};

				$(this).find('select').selectmenu(selectMenuOption);
			});
		}

		// custom select
		function setCustomSelect(target, defaultOption) {
			var rendererName, widget, widgetClass;
			rendererName = target.data('renderer');
			widgetClass = target.data('widgetClass');

			defaultOption.open = function (event, ui) {
				widget.css('width', target.width());

				if (rendererName === 'selectProdOption') {
					target.css('padding-bottom', widget.outerHeight());
				}
			};

			defaultOption.close = function (event, ui) {
				if (rendererName === 'selectProdOption') {
					target.css('padding-bottom', 0);
				}
			}

			widget = target.find('select')[rendererName](defaultOption)[rendererName]('menuWidget').addClass(widgetClass);
		}
	}

	/**
	 * openSelectClose : 열려있는 select 닫기 처리
	 */
	function openSelectClose(){
		$('.form_sel .ui-selectmenu-button-open').each(function (index) {
			if ($(this).closest('.form_sel').attr('data-renderer') === 'selectProdOption') {
				$(this).closest('.form_sel').find('select').selectProdOption('close');
			}else{
				$(this).closest('.form_sel').find('select').selectmenu('close');
			}
		});
	}

	/**
	 * setUISpinner : spinner set
	 * @param selector {string} 실행 element
	 */
	function setUISpinner(selector) {
		selector = selector || '.form_spinner';

		if ($(selector).length > 0) {
			$(selector).each(function (index) {
				var isDisabled = $(this).attr('disabled');

				$(this).spinner({
					decreseText: '상품 수량 한 개 줄이기',
					increseText: '상품 수량 한 개 늘리기',
					min: $(this).data('min') === undefined ? 0 : $(this).data('min'),
					max: $(this).data('max'),
					disabled: isDisabled,
				});
			});

			// 한글 입력 막기
			$(selector).off('input').on('input', function (event) {
				var val, regExVal;
				val = $(this).spinner('value');
				if (val === null) {
					val = 0;
				}
				regExVal = val.toString().replace(/[^\d+$]/g, '');
				$(this).spinner('value', regExVal);
			});
		}
	}

	/**
	 * jQuery UI 탭 설정
	 * @param selector Tab 생성 DOM 셀렉터(default : .tab_wrap)
	 */
	function setTabs(selector) {
		selector = selector || '.tab_wrap';

		if ($(selector).length > 0) {
			$(selector).each(function (index) {
				var disabledTabs;
				disabledTabs = [];

				if($(this).data('type-btn') !== undefined){
					return;
				}

				$(this).find('> .tab_list_wrap .tabs .tab_link').each(function (index) {
					if ($(this).hasClass('tab_disabled')) {
						disabledTabs.push(index);
					}
				});

				$(this).tabs({
					disabled: disabledTabs,
					beforeActivate: function (event, ui) {
						if ($(ui.newTab).find('a').attr('href').indexOf('#') !== 0) {
							var tg = $(ui.newTab).find('a').attr('target') === undefined ? '_self' : $(ui.newTab).find('a').attr('target');
							event.preventDefault();

							// a 태그에 onclick 선언되어 있는 경우 onclick만 실행
							if ($(ui.newTab).find('a').attr('onclick') !== undefined) {
								// console.log('onClick first');
								return false;
							}

							window.open($(ui.newTab).find('a').attr('href'), tg);
							event.preventDefault();
						}
					},
					activate: function(event, ui){
						if ($(event.target).closest('.custom_scroll_wrap').length > 0) {
							$(event.target).closest('.custom_scroll_wrap').get(0).simpleBar.recalculate();
						}
						if (ui.newPanel.find('.swiper-container').length > 0) {
							ui.newPanel.find('.swiper-container').each(function (index) {
								if (this.swiper === undefined) return;
								this.swiper.update();
							});
						}
						if (ui.newPanel.find('.form_sel').length > 0) {
							$('.form_sel:not(.type_arw) select', $(ui.newPanel)).selectmenu('calcMenuWidth');
						}
					},
					// create: function( event, ui ) {
					// 	$(this).addClass()
					// }
				});

			});
		}
	}

	/**
	 * jQuery UI Datepicker 생성
	 */
	function setDatepicker() {
		$.datepicker.setDefaults({
			dateFormat: 'yy.mm.dd',
			monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
			monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
			dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
			showMonthAfterYear: true,
			showOn: "button",
			buttonImage: "/assets/common/images/datepicker_icon_button@2x.png",
			buttonImageOnly: true,
			buttonText: "날짜 선택",
			currentText: "오늘",
			// showOtherMonths: true,
			// selectOtherMonths: false,
			// yearSuffix: '년',
			changeMonth: true,
			changeYear: true,
		});

		if ($('.date_box').length > 0) {

			$('.date_box input').each(function (index) {
				var minDate, maxDate, isDisabled;
				minDate = $(this).data('minDate') !== undefined ? $(this).data('minDate') : null;
				maxDate = $(this).data('maxDate') !== undefined ? $(this).data('maxDate') : null;
				isDisabled = $(this).attr('disabled');

				$(this).off('input').on('input', function (event) {
					this.value = this.value.replace(/[\ㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
				});

				$(this).datepicker({
					minDate: minDate,
					maxDate: maxDate,
					disabled: isDisabled,
					beforeShow: function (input, inst) {
						setTimeout(function () {
							inst.dpDiv.position({my: "right top+6", at: "right bottom", collision: 'none', of: input});
						}, 1);
					},
					onClose: function(dateText, inst) {
						// 20190908 형태의 날짜 입력에 대한 대응
						if(dateText && dateText.length === 8) {
							$(this).datepicker('setDate', new Date(dateText.substring(0, 4), dateText.substring(4, 6) - 1, dateText.substring(6, 8)));
						}
						// onClose 시 날짜형식을 유지하도록 하는 트릭
						$(this).datepicker('option', 'dateFormat', $(this).datepicker('option', 'dateFormat'));
					},
				});
			})
		}
	}

	/**
	 * fold 설정
	 * @param selector fold 생성 DOM 셀렉터(default : .fold_box_wrap)
	 */
	function setFoldBox(selector) {
		selector = selector ? selector : '.fold_box_wrap';
		if ($(selector).length > 0) {
			$(selector).find('.fold_box .fold_box_header').each(function (index) {
				$(this).find('.btn_fold').off('click.uiFold').on('click.uiFold', function (event) {
					if ($(event.target).is('a') || $(event.currentTarget).closest('.fold_box').is('.no_fold') || $(event.target).is('input')) {
						// console.log('setFoldBox', $(event.target).is('a'), $(event.target).is('button'))
						// event.preventDefault();
						return;
					}

					if($(event.target).is('label')){
						if($(event.target).is('label') || $(event.target).is('input')){
							return;
						}
					}

					var foldBox = $(this).closest('.fold_box');

					var isExpanded;
					isExpanded = foldBox.hasClass('expanded');

					if (!($(event.currentTarget).closest('.fold_box_wrap').data('type') === 'multi')) {
						var allFoldBox;
						if(isExpanded){
							allFoldBox = $(this).closest('.fold_box_wrap').find('.fold_box').not('.expanded');
						}else{
							allFoldBox = $(this).closest('.fold_box_wrap').find('.fold_box');
						}

						allFoldBox.removeClass('expanded');
						allFoldBox.find('.hidden').text('컨텐츠 열기');

						foldTransition(allFoldBox)
					}

					if(isExpanded){
						foldOnOff().foldClose(foldBox);
					}else{
						foldOnOff().foldOpen(foldBox);
					}

					var evtData = {
						index: $(event.currentTarget).closest('.fold_box').index(),
						isExpanded: $(event.currentTarget).closest('.fold_box').hasClass('expanded'),
					};
					var evt = new CustomEvent('headerClick', {'detail': evtData});


					$(event.currentTarget).closest('.fold_box')[0].dispatchEvent(evt);
				});
			});
		}
	}

	/**
	 * fold On/Off
	 */
	function foldOnOff(){
		var control = {
			/**
			 * fold open
			 * @param selector {string} 타겟 foldbox
			 * @param callback {string} fold open 후 callback 함수
			 */
			foldOpen : function(selector, callback){
				selector.addClass('expanded');
				selector.find('.hidden').text('컨텐츠 닫기');

				if(!selector.hasClass('type_floating') && !selector.hasClass('no_fold')) {
					foldTransition(selector);
				}

				if ( callback != null && typeof callback === "function" ) {
					callback.apply ( null, [tgId]);
				}
			},

			/**
			 * fold close
			 * @param tgId {string} 타겟 foldbox
			 */
			foldClose : function(selector) {
				selector.removeClass('expanded');
				selector.find('.hidden').text('컨텐츠 열기');

				if(!selector.hasClass('type_floating') && !selector.hasClass('no_fold')) {
					foldTransition(selector);
				}
			},
		}

		return control;
	}

	/**
	 * fold transition
	 * @param selector - foldbox
	 */
	function foldTransition(selector, isForce){
		var curHeight, changeHeight = 0;
		isForce = isForce || false;
		curHeight = selector.outerHeight();

		selector.css('height', 'auto');

		changeHeight = selector.outerHeight();
		selector.css('height', curHeight).stop().animate({height: changeHeight}, (isForce ? 0 : 150), function(){
			var that;
			that = $(this);
			if (that.closest('.fold_box_wrap').closest('.custom_scroll_wrap').length > 0
				&& that.closest('.fold_box_wrap').closest('.custom_scroll_wrap')[0].simpleBar !== undefined) {
				$(this).closest('.fold_box_wrap').closest('.custom_scroll_wrap')[0].simpleBar.recalculate();
			}

			setTimeout(function() {
				if ((that.find('.fold_box_header').outerHeight() + that.find('.fold_box_contents').outerHeight() + 2) !== changeHeight) {
					foldTransition(that, true);
				}
			}, 100);
		});
	}

	/**
	 * max-height 영역 안에 요소가 넘치는 경우 auto overflow 처리
	 * @param wrap 컨테이너 DOM 셀렉터 (default: '.auto_overflow_wrap')
	 * @param contents 늘어나는 컨텐츠 영역 (default: '.auto_overflow_contents')
	 * @param inner 늘어나는 요소 셀렉터 (default: '.auto_overflow_inner')
	 * @param btn 영역 펼침 버튼 셀렉터 (default: '[data-btn-toggle]')
	 * @param container 컨텐츠영역 / 팝업영역 제어(default: '.wrapper', popup: '.dialog_wrapper')
	 */
	function autoOverflowContents(container, wrap, contents, inner, btn){
		wrap = wrap || '.auto_overflow_wrap';
		contents = contents || '.auto_overflow_contents';
		inner = inner|| '.auto_overflow_inner';
		btn = btn || '> .auto_overflow_footer [data-btn-toggle]';
		container = container || '.wrapper';

		if($(wrap, container).length > 0){
			$(wrap, container).each(function(){
				var isToggle, isOpened, wrapMaxHeight, innerHeight, btnBeforeText, btnAfterText;
				wrapMaxHeight = parseInt($(this).find(contents).css('max-height').replace('px', ''));
				innerHeight = Math.max($(this).find(inner).outerHeight(), $(this).find(inner).get(0).scrollHeight);
				btnBeforeText = $(this).find(btn).text();

				if (innerHeight <= wrapMaxHeight) {
					return;
				}
				$(this).addClass('overflow');

				if ($(this).hasClass('active')){
					isOpened = true;
				}
				if ($(this).find(btn).data('btn-toggle') !== undefined){
					isToggle = true;
				}
				if(isToggle) {
					$(this).find(btn).on('click', function(event){
						if (Boolean(btnBeforeText.match('펼치기'))){
							btnAfterText = btnBeforeText.replace('펼치기', '접기');
						} else if (Boolean(btnBeforeText.match('더보기'))) {
							btnAfterText = btnBeforeText.replace('더보기', '닫기');
						} else if (Boolean(btnBeforeText.match('접기'))) {
							btnAfterText = btnBeforeText.replace('접기', '펼치기');
						} else if (Boolean(btnBeforeText.match('닫기'))) {
							btnAfterText = btnBeforeText.replace('닫기', '더보기');
						}

						if ($(this).closest(wrap).hasClass('active')){
							$(this).closest(wrap).removeClass('active');
							$(this).removeClass('active');

							if (isOpened) {
								$(this).find('.text').text(btnAfterText);
							} else {
								$(this).find('.text').text(btnBeforeText);
							}
						} else {
							$(this).closest(wrap).addClass('active');
							$(this).addClass('active');

							if (isOpened) {
								$(this).find('.text').text(btnBeforeText);
							} else {
								$(this).find('.text').text(btnAfterText);
							}
						}
					});
				}
			});
		}
	}

	/**
	 * selectmenu refresh
	 */
	function callSelectRefresh(tgId){
		// console.log($(tgId).selectmenu('instance'))
		$(tgId).selectmenu('refresh');

		// if($(tgId).parent().data('renderer') === 'selProdOpt') {
		// 	$(tgId).selProdOpt('refresh');
		// }else if($(tgId).parent().data('renderer') === 'selInteriorOpt') {
		// 	$(tgId).selInteriorOpt('refresh');
		// }else{
		// 	$(tgId).selectmenu('refresh');
		// }
	}

	/**
	 * 숫자 number에 대해 n 자릿수 문자열로 치환하여 반환
	 * @param number {number} 정수 숫자 값
	 * @param digits {number} 자릿수(defalut: 2)
	 * @returns {string} 치환 된 문자열
	 */
	function setPrependZero(number, digits) {
		number = number + '';
		digits = digits || 2;
		return number.length >= digits ? number : new Array(digits - number.length + 1).join('0') + number;
	}


	/**
	 * toast message
	 * @param msg 노출되는 메세지 내용
	 * @param timer toast 노출 시간 밀리세컨드로 계산(default: 2000)
	 */
	function setToastMessage(msg, timer){
		if (!timer) { timer = 2000; }
		var toastCont = $("<div class='toast_wrap'><span class='toast_message'>" + msg + "</span></div>");

		if($('body').find('.toast_wrap').length < 1) $('body').append(toastCont);
		toastPopupCalaPos();

		toastCont.slideToggle(200, function() {
			if (!isNaN(timer)) {
				setTimeout(function() {
					toastCont.fadeOut(function() {
						$(this).remove();
					});
				}, timer);
			}
		});


		$(window).off('scroll.uiToast resize.uiToast', toastPopupCalaPos).on('scroll.uiToast resize.uiToast', toastPopupCalaPos);

		function toastPopupCalaPos() {
			if (_bodyMinWidth > _deviceWidth) {
				$('.toast_wrap').css({
					'left': 600+'px',
					'transform': 'translateX(' + - _scrollLeft + 'px)'
				});
			} else {
				$('.toast_wrap').css({
					'left': '',
					'transform': '',
				});
			}
		}
	}


	/**
	 * tooltip hover type on off
	 * @param container tooltip 컨테이너 영역 DOM 셀렉터 (default : .tooltip_wrap)
	 */
	function tooltipOnOff(container){
		container = container || '.tooltip_wrap';

		if ($(container).length > 0){
			$(container).each(function(){
				var that, isToggle;
				that = $(this);

				$(this).find('.btn_tooltip').on('click', function(){
					if ($(this).data('btn-toggle') !== undefined){
						isToggle = true;
					}

					if(isToggle){
						if (that.hasClass('active')) {
							that.removeClass('active').addClass('hide');
							$(this).find('.hidden').text('툴팁열기');
						} else {
							$('.tooltip_wrap.active').removeClass('active').addClass('hide');
							that.removeClass('hide').addClass('active');
							$(this).find('.hidden').text('툴팁닫기');
						}
						return;
					}

					if(that.hasClass('active')) return;
					$('.tooltip_wrap.active').removeClass('active').addClass('hide');
					that.removeClass('hide').addClass('active');
				});

				if (!isToggle){
					$(this).find('.btn_tooltip_close').on('click', function(){
						that.removeClass('active').addClass('hide');
					});
				}

				$(this).on('transitionend', function () {
					$(this).removeClass('hide');
				});
			});
		}
	}


	/**
	 * optMenuOnOff type on off
	 * @param container tooltip 컨테이너 영역 DOM 셀렉터 (default : .opt_menu_wrap)
	 */
	function optMenuOnOff(container){
		container = container || '.opt_menu_wrap';

		if ($(container).length > 0){
			$(container).each(function(){
				var that, isToggle;
				that = $(this);

				$(this).find('.btn_opt_menu').on('click', function(){
					if ($(this).data('btn-toggle') !== undefined){
						isToggle = true;
					}

					if(isToggle){
						if (that.hasClass('active')) {
							that.removeClass('active').addClass('hide');
							$(this).find('.hidden').text('메뉴열기');
						} else {
							$(container + '.active').removeClass('active').addClass('hide');
							that.removeClass('hide').addClass('active');
							$(this).find('.hidden').text('메뉴닫기');
						}
						return;
					}

					if(that.hasClass('active')) return;
					$('.opt_menu_wrap.active').removeClass('active').addClass('hide');
					that.removeClass('hide').addClass('active');
				});

				if (!isToggle){
					$(this).find('.opt_menu_link').on('click', function(){
						that.removeClass('active').addClass('hide');
					});
				}

				$(this).on('transitionend', function () {
					$(this).removeClass('hide');
				});
			});
		}
	}

	/**
	 * img 가로형/세로형 체크
	 * @param container imgTg : $(this)
	 * @param container container : addClass되는 container 타겟
	 */
	function checkImagePortrait(imgTg, container) {
		container === undefined ? container = imgTg : container = container;
		var chkImg = imgTg.find('img').get(0);

		if (chkImg.naturalWidth > chkImg.naturalHeight) { // 가로형
			container.addClass('landscape');
		} else if (chkImg.naturalWidth < chkImg.naturalHeight) { //세로형
			container.addClass('portrait');
		} else { // 정사각형
			container.addClass('even');
		}
	}

	/**
	 * sns 공유하기 공통
	 */
	function shsShareToggle(){
		$('.btn_share').on('click', function(){
			$(this).closest('.sns_share_wrap').addClass('active');
		});

		$('.btn_sns_share_close').on('click', function(){
			$(this).closest('.sns_share_wrap').removeClass('active');
		});
	}

	/**
	 * 우편번호 검색 결과 상세주소보기 영역 on/off
	 */
	function addressDetailAreaOnOff(){
		var btnRoad = $('.btn_road_name');
		var btnLand = $('.btn_land_number');
		var targetDetail = $('.success_detail')

		function DetailOpenClose(btn){
			btn.on('click', function(v){
				targetDetail.removeClass('active');
				targetDetail.eq(btn.index($(this))).addClass('active');
			});
		}

		// 수정 211126 상세검색 영역 없는 경우 조건 처리
		if (targetDetail.length > 0){
			DetailOpenClose(btnRoad)
			DetailOpenClose(btnLand)
		}
	}

	/**
	 * tag button on/off
	 */
	function setTagToggle(){
		$('.tag_wrap').each(function(){
			if($(this).data('tag-toggle') !== undefined) {
				$(this).find('.tag').on('click', function () {
					$(this).siblings().removeClass('active');
					$(this).addClass('active');
				})
			}
		});
	}

	/**
	 * tag multi button on/off
	 */
	function setTagToggleMulti(){
		$('.tag_wrap').each(function(){
			if($(this).data('tag-multi') !== undefined) {
				$(this).find('.tag').on('click', function () {
					$(this).toggleClass('active');
				})
			}
		});
	}

	/**
	 * 상품 리스트로보기/텍스트로보기 토글
	 */
	function setSwitchListBtn(callback) {
		$('.switch_list_btn_wrap').each(function (index){
			var btns, target;
			btns = $(this).find('button');
			target = $($(this).data('target'));

			btns.on('click.switch', function(event) {
				var type;
				btns.removeClass('active');
				$(this).addClass('active');
				type = 'view_type_' + $(this).data('type');
				// console.log(type);
				target.removeClass('view_type_img view_type_txt view_type_list').addClass(type);
				// console.log(target, type);

				if ( callback != null && typeof callback === "function" ) {
					callback(target, type);
				}
			});
		});
	}

	/**
	 * 도메인 자동완성
	 */
	function setDomainAutoComplete() {
		if($('.form_ip[type="email"]').length > 0){
			$('.form_ip[type="email"][data-autocomplete]').each(function(){
				var tg, wrapStr;
				tg = $(this);

				var awesomplete = new Awesomplete(tg.get(0), {
					list: ['naver.com', 'hanmail.net', 'gmail.com', 'nate.com', 'yahoo.co.kr', 'hotmail.com', 'paran.com', 'dreamwiz.com', 'empal.com', 'korea.com', 'freechal.com'],
					data: function (text, input) {
						return input.slice(0, input.indexOf("@")) + "@" + text;
					},
				});

				if (isNaN(parseInt(tg.data('autocomplete')))) {
					wrapStr = '<div class="auto_complete_box"><div class="custom_scroll_wrap"></div></div>';
				} else {
					var boxHeight;
					boxHeight = parseInt(tg.data('autocomplete')) + 'px';
					wrapStr = '<div class="auto_complete_box"><div class="custom_scroll_wrap" style="max-height: ' + boxHeight + '"></div></div>';
				}


				tg.closest('.awesomplete').find('ul').wrap(wrapStr);

				tg.on('awesomplete-open', function(e){
					// The popup just appeared.
					tg.closest('.awesomplete').addClass('active');
				});

				tg.on('awesomplete-close', function(e){
					// The popup just closed.
					tg.closest('.awesomplete').removeClass('active');
				});

				tg.on('awesomplete-highlight', function(e){
					var lists, scrollWrap, scrollTop;
					lists = tg.closest('.awesomplete').find('ul');
					scrollWrap = lists.closest('.custom_scroll_wrap').get(0);
					scrollTop = lists.find('li[aria-selected="true"]').offset().top - lists.offset().top;
					$(scrollWrap.simpleBar.getScrollElement()).scrollTop(scrollTop);
					// console.log($(scrollWrap.simpleBar.getScrollElement()).scrollTop(), scrollTop);
				});
			});

			setCustomScroll('.awesomplete');
		}
	}

	// switch on off
	function setSwitchOnOff(){
		$('.btn_switch').on('click.uiSwitch', function(){
			var tgCont = $(this).attr('data-switch-tg');
			var allCont = $(this).closest('.switch_toggle_wrap').find('.switch_toggle_content');

			$(this).addClass('active');
			$(this).siblings('.btn_switch').removeClass('active');

			allCont.removeClass('active');
			$(tgCont).addClass('active');
		});
	}

	_front.setSpsOffsetData = setSpsOffsetData;
	_front.setCustomScroll = setCustomScroll;
	_front.setTableCaption = setTableCaption;
	_front.setStarRating = setStarRating;
	_front.setUIDialog = setUIDialog;
	_front.dialogOnOff = dialogOnOff;
	_front.setUISelect = setUISelect;
	_front.setUISpinner = setUISpinner;
	_front.setDatepicker = setDatepicker;
	_front.callSelectRefresh = callSelectRefresh;
	_front.togglePassword = togglePassword;
	_front.setTabs = setTabs;
	_front.setFoldBox = setFoldBox;
	_front.setGNB = setGNB;
	_front.setFloating = setFloating;
	_front.setPrependZero = setPrependZero;
	_front.setToastMessage = setToastMessage;
	_front.tooltipOnOff = tooltipOnOff;
	_front.autoOverflowContents = autoOverflowContents;
	_front.checkImagePortrait = checkImagePortrait;
	_front.addressDetailAreaOnOff = addressDetailAreaOnOff;
	_front.setSwitchListBtn = setSwitchListBtn;
	_front.foldOnOff = foldOnOff;
	_front.setDomainAutoComplete = setDomainAutoComplete;
	_front.setSwitchOnOff = setSwitchOnOff;
	_front.setSearchInput = setSearchInput;

	$(window).on('scroll.uiCommon resize.uiCommon', function () {
		_scrollLeft = Math.round(document.documentElement.scrollLeft || window.pageXOffset);
		_scrollTop = Math.round(document.documentElement.scrollTop || window.pageYOffset);

		setFixedElementPosX();
		openSelectClose();
	});

	$(window).on('resize.uiCommon', function () {
		_deviceWidth = $(window).width() || window.innerWidth || document.body.clientWidth;
		_deviceHeight = $(window).height() || window.innerHeight || document.body.clientHeight;
		_deviceHeight = $(window).height() || window.innerHeight || document.body.clientHeight;

		dialogAutoHeight();
	});


	$(document).ready(function () {
		_deviceWidth = $(window).width() || window.innerWidth || document.body.clientWidth;
		_deviceHeight = $(window).height() || window.innerHeight || document.body.clientHeight;
		_scrollLeft = Math.round(document.documentElement.scrollLeft || window.pageXOffset);
		_scrollTop = Math.round(document.documentElement.scrollTop || window.pageYOffset);

		_btnGoTop = $('.btn_go_top');
		_headerWrapper = $('.header_wrapper');
		_flyMenuEl = $('.fly_menu_wrapper');
		_floatingEl = $('.floating_wrapper');
		_container = $('.container_wrapper');

		_btnGoTop.off('click').on('click', function(e) {
			e.preventDefault();
			$('html, body').animate({
				scrollTop: 0
			}, 200, function() {});
		});

		setGNB();
		setFloating();
		setSpsOffsetData();
		setFixedElementPosX()
		setCustomScroll();
		setTableCaption();
		setStarRating();
		setUIDialog();
		setBreadCrumb();
		setUISelect();
		togglePassword();
		setUISpinner();
		setDatepicker();
		setTabs();
		setFoldBox();
		addressDetailAreaOnOff();
		setFamilySiteMore();
		setSearchInput();
		tooltipOnOff();
		shsShareToggle();
		autoOverflowContents();
		setTagToggle();
		setTagToggleMulti();
		setDomainAutoComplete();
		setSwitchOnOff();
		optMenuOnOff();
	});

	return _front;
})() || KyoboBookPub.ink;

// Custom Swiper
var CustomSwiper = function(selector, options) {
	// options = $.extend({keyboard: {enabled: true, onlyInViewport: false}}, options);
	$(selector).on('focusin.swiper', function(event) {
		this.swiper.keyboard.enable();
	}).on('focusout.swiper', function(event){
		this.swiper.keyboard.disable();
	})
	return new Swiper(selector, options);
}