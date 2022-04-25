/*
 * name : ui.js
 * desc : 공통 자바스크립트
 * writer : glim
 * create : 2021/11/12
 * update :
 * -
 */

var KyoboBookPub = KyoboBookPub || {};

$(function(){

});

KyoboBookPub.mok = KyoboBookPub.mok || (function () {
	var _front = {},
		_dialogCount = 0,
		_scrollTop = 0,
		saveScrollTop = 0,
		_headerWrapper,
		_dockerWrap,
		_floatingFixed,
		_container,
		_btnGoTop,
		_isMacLike,
		_isAndroid,
		_transitionEnd = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend',
		_fisHeight = 0,
		_vh,
		_resizeVh;

	/**
	 * 헤더 엑티브 상태 이벤트 설정
	 */
	function setHeader() {
		if(_headerWrapper === undefined || _headerWrapper.hasClass('header_static')){return;}

		var gnb, nextScrollTop, currentScrollTop, gnbOffset, pageHeight, headerH;
		headerH = _headerWrapper.outerHeight();
		pageHeight = $('.wrapper').outerHeight() - $(window).height() - headerH;
		$(window).off('resize.uiGNB scroll.uiGNB', setScrollUp).on('resize.uiGNB scroll.uiGNB', setScrollUp);

		setScrollUp();
		setHeaderMain();

		// scrollUp/down check
		function setScrollUp() {
			var offset;
			offset = _headerWrapper.height() / 2;

			currentScrollTop = _scrollTop;

			if ($('.header_wrapper').hasClass('force_scroll')) return;

			if (_scrollTop === 0) {
				_headerWrapper.removeClass('scroll_up scroll_down');
			}

			if (saveScrollTop <= currentScrollTop && _scrollTop > offset) { // 스크롤 내릴 때
				if(!_headerWrapper.hasClass('header_main')) _headerWrapper.removeClass('scroll_up').addClass('scroll_down');

				if (!_dockerWrap.hasClass('docker_fixed') && !$('.wrapper').hasClass('member')) {
					_dockerWrap.removeClass('scroll_up').addClass('scroll_down');
				}
			} else { // 스크롤 올릴 때
				if(_scrollTop < pageHeight){
					if (_headerWrapper.hasClass('scroll_down')) {
						if(!_headerWrapper.hasClass('header_main') && !_headerWrapper.hasClass('scroll_up')) _headerWrapper.addClass('scroll_up');

						if (!_dockerWrap.hasClass('docker_fixed') && !$('.wrapper').hasClass('member')) {
							_dockerWrap.addClass('scroll_up');
						}
					}

					_dockerWrap.removeClass('scroll_down');
					_headerWrapper.removeClass('scroll_down');
				}else{
					if (_scrollTop !== 0) {
						if(!_headerWrapper.hasClass('header_main') && !_headerWrapper.hasClass('scroll_down')) _headerWrapper.removeClass('scroll_up').addClass('scroll_down');

						if (!_dockerWrap.hasClass('docker_fixed') && !$('.wrapper').hasClass('member')) {
							_dockerWrap.removeClass('scroll_up').addClass('scroll_down');
						}
					}
				}
			}



			saveScrollTop = currentScrollTop;

		}

		function setHeaderMain(){
			// if(!_headerWrapper.hasClass('header_main')) return;

			var searchIp = $('.search_input_wrap');

			_headerWrapper.find('.btn_brand_more').on('click', function(){
				var serviceAllList = $(this).closest('.service_mall_wrap');
				if(serviceAllList.hasClass('active')) {
					serviceAllList.removeClass('active animated');
				}else{
					serviceAllList.addClass('active');

					setTimeout(function () {
						serviceAllList.addClass('animated');
					}, 30);
				}
			});

			// 검색어 입력 시 검색창 x버튼(초기화버튼 노출)
			setSearchInput(searchIp, '.ip_gnb_search');
		}
	}

	/**
	 * top버튼
	 */
	function setGoTop(){
		if (_scrollTop > 50) {
			_btnGoTop.addClass('active');
		} else {
			_btnGoTop.removeClass('active');
		}

		_btnGoTop.off('click').on('click', function(e) {
			e.preventDefault();
			$('html, body').animate({
				scrollTop: 0
			}, 200, function() {});
		});

		_btnGoTop.on(_transitionEnd, function(){
			if(!_btnGoTop.hasClass('active')) _btnGoTop.addClass('hidden');
		})

		$(window).on('scroll', function (event) {
			if (_scrollTop > 50) {
				_btnGoTop.removeClass('hidden').addClass('active');
			} else {
				_btnGoTop.removeClass('active');
			}
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

				if(searchIp.val().length > 0 ) searchWrap.addClass('value');

				clearBtn.off('click').on('click', function(){
					searchWrap = $(this).closest(wrap);
					searchWrap.find(input).val('').focus();
					searchWrap.removeClass('value');

				})

				searchIp.on({
					'propertychange change input paste': function () {
						searchWrap = $(this).closest(wrap);
						if($(this).val().length > 0 ) {
							searchWrap.addClass('value');
						} else{
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
			});

		}

	}

	/**
	 * 테이블 캡션 생성
	 */
	function setTableCaption() {
		$('table[class*="tbl_col"], table[class*="tbl_row"]').each(function (index) {
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
					return n != undefined
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
					// console.log()
					var t
					if(rating === null) rating = 0;

					if(that.data('caption') !== undefined) {
						return '<span class="val">' + rating + '</span>' + '<span class="total">' + 10 + '</span>';
					}else{
						return ' ';
					}
				}
			});

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
		$('.sps', _headerWrapper).each(function (index) {
			var that, isIgnore;
			that = this;
			isIgnore = ignoreClassList.some(function (element) {
				return $(that).hasClass(element);
			});
			if (!isIgnore) {
				spsElem.push(that);
			}
		});
		// console.log(spsElem);

		if( spsElem.length === 0 ) return false;

		spsElem.each(function (i) {
			var target = $(this);
			fixData(target);
			// heightChangeTarget.push(target.data('height-change'));
		});

		// heightChangeTarget.forEach(function (target, idx) {
		// 	var sensor = null;
		// 	sensor = new ResizeSensor( $('.' + target), function() {
		// 		fixData( $('.sps[data-height-change='+heightChangeTarget[idx]+']') );
		// 	});
		// });

		var sensorHeader, sensorContents = null;
		sensorHeader = new ResizeSensor( $('.header_wrapper.header_main'), function() {
			$('.sps[data-height-observe]').each(function(index){
				fixData($(this));
			})
		});
		sensorContents = new ResizeSensor( _container, function() {
			$('.sps[data-height-observe]').each(function(index){
				fixData($(this));
			})
		});

		// tab active 시, sps fixData 재계산
		$('.tab_wrap').on('tabsactivate', function( event, ui ) {
			$(ui.newPanel).find('.sps').each(function(){
				fixData($(this));
			})
		});

		function fixData(tg) {
			var observerCont, addOfs, tgHeight;
			if( tg.find('.sps_observer').length === 0 ) {
				tg.append('<div class="sps_observer" style="top:'+ tg.css('top') +';"></div>');
			}

			observerCont = tg.find('.sps_observer');
			addOfs = ( tg.data('add-offset') !== undefined && !isNaN(tg.data('add-offset')) ) ? tg.data('add-offset') : 0;
			tgHeight = tg.outerHeight();
			// console.log(observerCont.offset().top, $(window).scrollTop());

			if( tg.hasClass('sps_ofs_bottom') ) {
				tg.attr('data-sps-offset', Math.round(observerCont.offset().top + tg.outerHeight() - addOfs ));
			}
			else {
				tg.attr('data-sps-offset', Math.round(observerCont.offset().top - tgHeight - addOfs ));
			}
		}
	}

	/**
	 * class 변화감지 옵저버
	 * @param mutationTg 타겟
	 * @param observerClassName 변화를 체크 할 클래스명
	 * @param callback 변화 감지 후 콜백
	 */
	function observerMutation(mutationTg, observerClassName, callback){
		var prevClassState = mutationTg;
		var observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				if(mutation.attributeName === "class"){
					var currentClassState = mutation.target.classList.contains(observerClassName);
					if(prevClassState !== currentClassState)    {
						prevClassState = currentClassState;

						if(currentClassState){
							if ( callback != null && typeof callback === "function" ) {
								callback.apply ( null, [prevClassState]);
							}
						} else{
							if ( callback != null && typeof callback === "function" ) {
								callback.apply ( null, [prevClassState]);
							}
						}
					}
				}
			});
		});

		// 감시자 옵션 포함, 대상 노드에 전달
		var config = {
			attributes: true,
		};

		observer.observe(mutationTg, config);
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
	 * @param btnClose {string} 레이어 팝업을 띄우기 위한 버튼 셀렉터(default: [data-role=btn-dialog-close])
	 */
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
							console.log(container);
							container.addClass('no_dim');
						}

						// 팝업 닫기 시, 기존 스크롤 위치로 이동위해 현재 스크롤값 저장(상단 이동 막기)
						if($('.ui-dialog-content:visible').length === 0){
							var scrollTop = $(document).scrollTop();
							$('html').addClass('dialog_open');
							$('body').css({'top': (scrollTop * -1),});
						}

						// 팝업 2개 이상 노출 시 z-index 지정(팝업 위 팝업 미구현시 삭제)
						var zNum = 99;
						if ( $('.dialog_wrapper:visible').length > 0 ) {
							$('.dialog_wrapper:visible').each(function (){
								var dialog;
								dialog = $(this);
								zNum = Math.max(zNum, parseInt(dialog.css('z-index')));
							});
						}
						container.addClass('open').css('z-index', zNum+2);

                        // 팝업 내 swiper 업데이트
                        if ($(this).parent().find('.swiper-container').length > 0) {
                            $(this).parent().find('.swiper-container').each(function (event) {
                                updateDialogSwiper(this);
                            });
                        }

						KyoboBookPub.mok.autoOverflowContents('.dialog_wrapper');
					},
					close: function( event, ui ) {
						var that = $(this);
						var container = that.closest('.dialog_wrapper')
						var scrollTopPos = $('body').css('top');

						// z-index style 삭제
						container.removeClass('open').removeAttr('style');

						// 팝업 닫기 시, 기존 스크롤 위치로 이동(상단 이동 막기)
						if( $('.ui-dialog-content:visible' ).length === 0 ) {
							$('html').removeClass('dialog_open');
							$(containerId).removeAttr('style');
							$(window).scrollTop(parseInt(scrollTopPos) * -1);
						}
					},
					create: function (event, ui) {
						$(this).addClass('initialized');
					}
				});

				// floating 타입일 경우 modal false 처리
				if($(this).data('class') === 'dialog_floating'){
					$(this).dialog({modal: false});
				}

				if ($(btnOpen).length > 0) {
					$(btnOpen).each(function (index) {
						$(this).off('click').on('click', function (event) {
							var popTgId = $(this).data('target');

							event.preventDefault();
							dialogOnOff().popOpen(popTgId);
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

		var that, toggleInput, btnBeforeText, btnAfterText;
		$(btnSelector).each(function (index) {
			that = $(this);

			if (that.closest(wrap).find('input').prop('disabled')){
				that.attr("disabled", true);
			}

			that.off('click').on('click', function(){
				toggleInput = $(this).closest(wrap).find('input');
				btnBeforeText = $(this).text();

				if ($(this).hasClass('active') && toggleInput.attr('type') === 'text'){
					$(this).removeClass('active');
					toggleInput.attr('type', 'password');

					btnAfterText = btnBeforeText.replace('보임', '숨김');
					$(this).find('.hidden').text(btnAfterText);
				} else {
					$(this).addClass('active');
					toggleInput.attr('type', 'text');

					btnAfterText = btnBeforeText.replace('숨김', '보임');
					$(this).find('.hidden').text(btnAfterText);
				}
			});
		});
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
							window.open($(ui.newTab).find('a').attr('href'), '_self');
						}
					},
					activate: function(event, ui){

					},
				});
			});
		}
	}

	/**
	 * fold 설정
	 * @param selector Tab 생성 DOM 셀렉터(default : .tab_wrap)
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
			},
		}

		return control;
	}

	/**
	 * max-height 영역 안에 요소가 넘치는 경우 auto overflow 처리
	 * @param wrap 컨테이너 DOM 셀렉터 (default: '.auto_overflow_wrap')
	 * @param contents 늘어나는 컨텐츠 영역 (default: '.auto_overflow_contents')
	 * @param inner 늘어나는 요소 셀렉터 (default: '.auto_overflow_inner')
	 * @param btn 영역 펼침 버튼 셀렉터 (default: '[data-btn-toggle]')
	 */
	function autoOverflowContents(container, wrap, contents, inner, btn){
		wrap = wrap || '.auto_overflow_wrap';
		contents = contents || '.auto_overflow_contents';
		inner = inner|| '.auto_overflow_inner';
		btn = btn || '> .auto_overflow_footer [data-btn-toggle]';
		container = container || '.wrapper';

		if($(wrap, container).length > 0){
			$(wrap, container).each(function(){
				var tg, isToggle, isOpened, wrapMaxHeight, innerHeight, btnBeforeText, btnAfterText;
				tg = $(this);
				wrapMaxHeight = parseInt(tg.find(contents).css('max-height').replace('px', ''));
				btnBeforeText = tg.find(btn).text();

				function overflowChk() {
					innerHeight = Math.max(tg.find(inner).outerHeight(), tg.find(inner).get(0).scrollHeight);//tg.find(inner).outerHeight();
					// console.log(innerHeight, wrapMaxHeight);
					if (innerHeight > wrapMaxHeight) {
						tg.addClass('overflow');
					} else {
						if (tg.hasClass('overflow')) tg.removeClass('overflow');
					}
				}

				overflowChk();

				if(tg.hasClass('overflow')) {
					if (tg.hasClass('active')) {
						isOpened = true;
					}

					if (tg.find(btn).data('btn-toggle') !== undefined) {
						isToggle = true;
					}

					if (isToggle) {
						tg.find(btn).on('click.uiAutoOverflow', function (event) {
							if (Boolean(btnBeforeText.match('펼치기'))) {
								btnAfterText = btnBeforeText.replace('펼치기', '접기');
							} else if (Boolean(btnBeforeText.match('더보기'))) {
								btnAfterText = btnBeforeText.replace('더보기', '닫기');
							} else if (Boolean(btnBeforeText.match('접기'))) {
								btnAfterText = btnBeforeText.replace('접기', '펼치기');
							} else if (Boolean(btnBeforeText.match('닫기'))) {
								btnAfterText = btnBeforeText.replace('닫기', '더보기');
							}

							if ($(this).closest(wrap).hasClass('active')) {
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
				}

				$(window).off('resize.uiAutoOverflow', overflowChk).on('resize.uiAutoOverflow', overflowChk);
			});
		}
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

		var toastCont, dockerHeight, bottomMargin;
		toastCont = $("<div class='toast_wrap'><span class='toast_message'>" + msg + "</span></div>");
		dockerHeight = $('.docker_wrapper').height();
		bottomMargin = 36;

		if($('body').find('.toast_wrap').length < 1) $('body').append(toastCont);
		// toastPopupCalaPos();

		toastCont.slideToggle(200, function() {
			if (!isNaN(timer)) {
				setTimeout(function() {
					toastCont.fadeOut(function() {
						$(this).remove();
					});
				}, timer);
			}
		});

		// $(window).off('scroll.uiToast resize.uiToast', toastPopupCalaPos).on('scroll.uiToast resize.uiToast', toastPopupCalaPos);

		function toastPopupCalaPos() {
			if ($('body').hasClass('dialog_open')) return;

			if ($('.header_wrapper').hasClass('scroll_down')){
				// console.log('scroll_down')
				$('.toast_wrap').css({
					'bottom': '30px',
				});
				return false;
			}
			$('.toast_wrap').css({
				'bottom': dockerHeight + bottomMargin + 'px',
			});
		}
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
	 * 우편번호 검색 결과 상세주소보기 영역 on/off
	 */
	function addressDetailAreaOnOff(){
		var btnRoad = $('.btn_road_name');
		var btnLand = $('.btn_land_number');

		btnRoad.add(btnLand).on('click', function(){
			$(this).closest('.address_success_item').siblings().find('.success_detail').removeClass('active');
			$(this).closest('.address_success_item').find('.success_detail').addClass('active');
		});
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
							$(this).find('.hidden').text('상세내용 열기');
						} else {
							$('.tooltip_wrap.active').removeClass('active').addClass('hide');
							that.removeClass('hide').addClass('active');
							$(this).find('.hidden').text('상세내용 열기');
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

				$(this).on(_transitionEnd, function(){
					$(this).removeClass('hide');
				});
			});
		}
	}

	/**
	 * img 가로형/세로형 체크
	 * @param container tooltip 컨테이너 영역 DOM 셀렉터 (default : [data-role=tooltip-click])
	 */
	function checkImagePortrait(imgTg) {
		var chkImg = imgTg.find('img').get(0);

		if (chkImg.naturalWidth > chkImg.naturalHeight) { // 가로형
			imgTg.addClass('landscape');
		} else if (chkImg.naturalWidth < chkImg.naturalHeight) { //세로형
			imgTg.addClass('portrait');
		} else { // 정사각형
			imgTg.addClass('even');
		}
	}

	/**
	 * ios safari 키패드 노출 후 페이지 스크롤시 하단 여백 생성 버그 처리
	 */
	function setIpFocusBlur(){
		$(document).on("touchend", function (e) {
			/* ios safari 키보드 노출 된 상태로 스크롤 발생 시, 하단 고정 nav bar 만큼 스크롤 영역이 추가로 발생하여
				 키보드 노출상태에서 touchend 이벤트 발생 시, input에서 focusout하여 키보드 미노출 함 */
			if($(':focus').is('textarea, input')) {
				if(!$('.wrapper').hasClass('member') && !$(':focus').is('input[type="email"')){
					$(':focus').blur();
				}
			}

		});
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
					wrapStr = '<div class="auto_complete_box"></div>';
				} else {
					var boxHeight;
					boxHeight = parseInt(tg.data('autocomplete')) + 'px';
					wrapStr = '<div class="auto_complete_box" style="max-height: ' + boxHeight + '"></div>';
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
			})
		}
	}

	/**
	 * dropdown 토글
	 */
	function dropdownToggle(){
		var toggleBoxEl = $('.dropdown_toggle_box');

		$('.btn_dropdown_toggle', toggleBoxEl).on('click', function(){
			if(toggleBoxEl.hasClass('active')){
				toggleBoxEl.removeClass('active');
				$(this).find('.hidden').text('닫기');
			}else{
				toggleBoxEl.addClass('active');
				$(this).find('.hidden').text('열기');
			}
		});
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

	// header search
	function headerSearch() {
		var headerWrapper = $('.header_wrapper'),
			headerSearchWrap = headerWrapper.find('.header_search_wrap'),
			searchOpenBtn = headerWrapper.find('.btn_search_open'),
			searchCloseBtn = headerSearchWrap.find('.btn_search_close');

		searchOpenBtn.on('click', function(){
			headerSearchWrap.show();

			return false;
		});

		searchCloseBtn.on('click', function(){
			headerSearchWrap.hide();
		});
	}

	_front.setSpsOffsetData = setSpsOffsetData;
	_front.setTableCaption = setTableCaption;
	_front.setStarRating = setStarRating;
	_front.setUIDialog = setUIDialog;
	_front.dialogOnOff = dialogOnOff;
	_front.togglePassword = togglePassword;
	_front.setTabs = setTabs;
	_front.setHeader = setHeader;
	_front.setPrependZero = setPrependZero;
	_front.setToastMessage = setToastMessage;
	_front.setFoldBox = setFoldBox;
	_front.tooltipOnOff = tooltipOnOff;
	_front.checkImagePortrait = checkImagePortrait;
	_front.autoOverflowContents = autoOverflowContents;
	_front.setDomainAutoComplete = setDomainAutoComplete;
	_front.foldOnOff = foldOnOff;
	_front.dropdownToggle = dropdownToggle;
	_front.setSwitchOnOff = setSwitchOnOff;
	_front.optMenuOnOff = optMenuOnOff;

	_front.headerSearch = headerSearch;

	// 회전변경 이벤트 발생 시 : 100vh 스타일 지정
	$(window).on('orientationChange ', function () {

		if (isMacLike) {
			_vh = getBodyHeight * 0.01;
			_resizeVh = getBodyHeight * 0.01;
			document.documentElement.style.setProperty('--vh', _vh + 'px');
			document.documentElement.style.setProperty('--reVh', _resizeVh + 'px');
		}
		if (_isAndroid) {
			_vh = window.outerHeight;
			_resizeVh = window.outerHeight;
			document.documentElement.style.setProperty('--vh', _vh + 'px');
			document.documentElement.style.setProperty('--reVh', _resizeVh + 'px');
		}else {
			_vh = window.innerHeight;
			_resizeVh = window.innerHeight;
			document.documentElement.style.setProperty('--vh', _vh + 'px');
			document.documentElement.style.setProperty('--reVh', _resizeVh + 'px');
		}


	});

	// 회전변경 이벤트 발생 시 : 100vh 스타일 지정
	$(window).on('resize.uiCommon', function () {

		_resizeVh = window.outerHeight;

		if (_isMacLike) {
			_resizeVh = getBodyHeight * 0.01;
			document.documentElement.style.setProperty('--reVh', _resizeVh + 'px');
		}
		if (_isAndroid) {
			_resizeVh = window.outerHeight;
			document.documentElement.style.setProperty('--reVh', _resizeVh + 'px');
		}else {
			_resizeVh = window.innerHeight;
			document.documentElement.style.setProperty('--reVh', _resizeVh + 'px');
		}

	});

	$(document).on('touchstart', function (e) {
		_fisHeight = window.innerHeight;
	});

	clearTimeout($(document).data('scrollEnd'));

	$(window).on('scroll.uiCommon', function (event) {
		_scrollTop = $(window).scrollTop();

		$(document).data('scrollEnd', setTimeout(function () {
			if (_isMacLike && window.innerHeight !== _fisHeight) {
				_resizeVh = (window.innerHeight + 1);
				document.documentElement.style.setProperty('--reVh', _resizeVh + 'px');
			} else if (_isAndroid && window.outerHeight !== _fisHeight) {
				_resizeVh = window.outerHeight;
				document.documentElement.style.setProperty('--reVh', _resizeVh + 'px');
			}
		}, event));

	});

	function getBodyHeight() {
		var myHeight = 0;
		if( typeof( window.innerWidth ) == 'number' ) {
			//Non-IE
			myHeight = window.innerHeight;
		} else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
			//IE 6+ in 'standards compliant mode'
			myHeight = document.documentElement.clientHeight;
		} else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
			//IE 4 compatible
			myHeight = document.body.clientHeight;
		}
		return myHeight;
	}

	$(window).on('load.uiCommon', function () {
		/* 맥 OS 또는 iOS / android 디바이스 체크 */
		_isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
		_isAndroid = /Android/i.test(navigator.userAgent);

		if (_isMacLike) {
			_vh = getBodyHeight * 0.01;
			_resizeVh = getBodyHeight * 0.01;
			document.documentElement.style.setProperty('--vh', _vh + 'px');
			document.documentElement.style.setProperty('--reVh', _resizeVh + 'px');
		}
		if (_isAndroid) {
			_vh = window.outerHeight;
			_resizeVh = window.outerHeight;
			document.documentElement.style.setProperty('--vh', _vh + 'px');
			document.documentElement.style.setProperty('--reVh', _resizeVh + 'px');
		}else {
			_vh = window.innerHeight;
			_resizeVh = window.innerHeight;
			document.documentElement.style.setProperty('--vh', _vh + 'px');
			document.documentElement.style.setProperty('--reVh', _resizeVh + 'px');
		}

	});

	$(document).ready(function () {
		_btnGoTop = $('.btn_go_top');
		_headerWrapper = $('.header_wrapper');
		_floatingFixed = $('.floating_fixed');
		_container = $('.container_wrapper');
		_scrollTop = $(window).scrollTop();
		_dockerWrap = $('.docker_wrapper');

		_btnGoTop.off('click').on('click', function(e) {
			e.preventDefault();
			$('html, body').animate({
				scrollTop: 0
			}, 200, function() {});
		});

		setSpsOffsetData();
		setHeader();
		setGoTop();
		setTableCaption();
		setUIDialog();
		togglePassword();
		setTabs();
		setSearchInput();
		setUISpinner();
		setStarRating();
		addressDetailAreaOnOff();
		setIpFocusBlur();
		setFoldBox();
		tooltipOnOff();
		autoOverflowContents();
		setTagToggle();
		setTagToggleMulti();
		setDomainAutoComplete();
		dropdownToggle();
		setSwitchOnOff();
		optMenuOnOff();

		headerSearch();
	});

	// 이하 각 화면에서 호출하는 영역
	function setSwitchListBtn(callback) {
		$('.switch_list_btn_wrap').each(function (index){
			var btns, target, that;
			that = $(this);
			btns = $(this).find('button');
			target = $($(this).data('target'));

			btns.on('click.switch', function(event) {
				var type;
				if(!that.hasClass('type_toggle')){
					btns.removeClass('active');
					$(this).addClass('active');
					type = 'view_type_' + $(this).data('type');
				}else{
					$(this).removeClass('active');
					$(this).siblings().addClass('active');
					type = 'view_type_' + $(this).siblings().data('type');
				}
				target.removeClass('view_type_img view_type_txt view_type_list').addClass(type);

				if ( callback != null && typeof callback === "function" ) {
					callback(target, type);
				}
			});
		});
	}

	_front.setSwitchListBtn = setSwitchListBtn;
	_front.setUISpinner = setUISpinner;
	_front.setUIDialog = setUIDialog;

	return _front;
})();

// Custom Swiper
var CustomSwiper = function(selector, options) {
	options = $.extend(options, {containerModifierClass: 'swiper-'});
	return new Swiper(selector, options);
}