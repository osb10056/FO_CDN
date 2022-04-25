/*
 * name : ui_product_dig.js
 * desc : ebook 상품 
 * writer : ipg
 * create : 2022/21/03
 * update :
 * -
 */

$(function(){
	
	$('button.btn_more_guide').click(function(){
		const $this = $(this)
		if($this.hasClass('active')){
			$this.removeClass('active')
		}else{
			$this.addClass('active')
		}
	})

	$('#PordEvent').click(function(){
		const $this = $(this).parent()
		const $that = $(this).parent().siblings('.auto_overflow_contents')

		$that.css('max-height','inherit')
		$that.find('ul').css({
			'max-height':'114px',
			'overflow' : 'auto'
		})

		$this.hide()
	})
	
    // 키워드
    var swiper = new CustomSwiper(".prod_detail_keyword .list", {
        slidesPerView: 6,
        spaceBetween: 20,
		speed: 500,
		scrollbar: {
			el: $('.prod_detail_keyword').find('.swiper-scrollbar')[0],
		},
		freeMode: true,
		keyboard: true,
    });

	toggleRadioTextArea();

	// 작품소개 페이지 로딩후 display none 처리
	$('.book_info .round_gray_box').each(function(){
		if(!$(this).is('[style]')){
			$(this).css('display','none')
		}
	})
	
	//이미지 크게보기 스와이퍼
	var galleryThumbs = new CustomSwiper('.gallery_thumbs', {
		slidesPerView: 'auto',
		watchSlidesVisibility: true,
		watchSlidesProgress: true,
		navigation: {
			nextEl: '.gallery_thumbs_wrap .swiper-button-next',
			prevEl: '.gallery_thumbs_wrap .swiper-button-prev',
		}
	});

	if($('.gallery_thumbs .swiper-slide').length > 7){
		$('.gallery_thumbs .swiper-wrapper').removeClass('align_center');
	}else{
		$('.gallery_thumbs_wrap .swiper-button-next').remove();
		$('.gallery_thumbs_wrap .swiper-button-prev').remove();
		$('.gallery_thumbs .swiper-wrapper').addClass('align_center');
	}
	
	if($('.gallery_top .swiper-slide').length > 1){
		var galleryTop = new CustomSwiper('.gallery_top', {  
			navigation: {
				nextEl: '.gallery_top_wrap .swiper-button-next',  
				prevEl: '.gallery_top_wrap .swiper-button-prev',  
			},  
			thumbs: {  
				swiper: galleryThumbs,  
			}, 
	
			pagination: {
				el: '.gallery_top .swiper-pagination',
				type: 'fraction',
				renderFraction: function(currentClass, totalClass){
					return '<span class="' + currentClass + '"></span>' + '<span class="' + totalClass + '"></span>';
				},
				formatFractionCurrent: function (number) {
					return KyoboBookPub.ink.setPrependZero(number, 2);
				},
				formatFractionTotal: function (number) {
					return KyoboBookPub.ink.setPrependZero(number, 2);
				},
			},
		});
		
	}else{
		$('.gallery_top_wrap .swiper-button-next').remove();
		$('.gallery_top_wrap .swiper-button-prev').remove();
		$('.gallery_top .swiper-pagination').remove();
	}

	// 이미지 크게보기 팝업 > 이미지 가로형/세로형 구분
	$('#popImgZoom').on('dialogopen', function(){
		$('.portrait_img_box').each(function(){
			var imgTg = $(this);
			KyoboBookPub.ink.checkImagePortrait(imgTg);
		});
	});
});

// radio 클릭 시 textarea 노출
function toggleRadioTextArea(){
	if ($('.toggle_textarea_list .chk_col_item').length > 0){
		var checkInput, hasTextarea, targetTextarea;

		$('.toggle_textarea_list .chk_col_item').each(function(){
			hasTextarea = $(this).find('.byte_check_wrap').length > 0;

			if (hasTextarea){
				checkInput = $(this).find('> .form_rdo input');
				checkInput.on('change', function(){
					targetTextarea = $(this).closest('.chk_col_item').find('.byte_check_wrap .form_textarea');
					targetTextarea.attr('disabled', false);
				});
			} else {
				checkInput = $(this).find('> .form_rdo input');
				checkInput.on('change', function(){
					if (targetTextarea){
						targetTextarea.attr('disabled', true);
					}
				});
			}
		});
	}
}

// 전권 대여, 소장 이벤트 툴팁
$(document).on('click','#entCol',function(){
	$(this).parent().hide();
})

// 키워드
$(document).on('click','.keyword button',function(){
	$(this).addClass('current').siblings('button').removeClass('current')
})

// 작가소개 Tab
$(document).on('click','.book_info .tab button',function(){
	const $this = $(this)
	const tbNm = $(this).attr('tabTarget')

	$this.addClass('current').siblings('button').removeClass('current')

	$('#'+tbNm).show().siblings('.round_gray_box').hide()
})

// 하단 플로팅 선물하기
$(document).on('click','.gift.btn_line_gray, .cart.btn_line_gray',function(){
	const $this = $(this)
	const str = $(this).attr('class')
	var rpl_str = str.substr(21,4)

	if($this.hasClass('active')){
		$(this).removeClass('active')
		$('.prod_option_info_wrap, .overlap.'+rpl_str).removeClass('active')
		$('.overlap.'+rpl_str).siblings('.overlap').removeAttr('style');
		$this.siblings('.btn_line_gray').prop('disabled',false)
		$('.txtBox.'+rpl_str).hide();

		$('[name=prodSelect]').prop('checked',false)
	}else{
		$(this).addClass('active')
		$('.prod_option_info_wrap, .overlap.'+rpl_str).addClass('active');
		$('.overlap.'+rpl_str).siblings('.overlap').hide();
		$this.siblings('.btn_line_gray').prop('disabled',true)
		$('.txtBox.'+rpl_str).show();
	}
});

$(document).on('click','button.btn_option_more',function(){
	$('.right_area .btn_line_gray.active').trigger('click')
});

// 총서 게시판 TYPE 변경
$(document).on('click','.product_series .switch_list_btn_wrap button',function(){
	const $this = $(this)

	$this.addClass('active').siblings('button').removeClass('active')

	if($this.hasClass('ico_img')){
		$('.product_series .prod_swiper_wrap').addClass('swiper-container');
		$('.product_series .prod_list').addClass('swiper-wrapper').removeClass('type-list');
		$('.product_series .prod_item').addClass('swiper-slide');
		$('.product_series .prod_thumb_box').show()
	}else{
		$('.product_series .swiper-container').removeClass('swiper-container');
		$('.product_series .swiper-wrapper').removeClass('swiper-wrapper').removeAttr('style').addClass('type-list');
		$('.product_series .swiper-slide').removeClass('swiper-slide');
		$('.product_series .prod_thumb_box').hide()
	}
});

// 미리듣기
function callPreview(obj){
	// play_time - 재생시간
	// file_url - 파일 경로
	// barcode - 바코드
	// img_url - 재생될때 보여질 도서 이미지
	// prd_name - 상품 이름
	// actor_name - 낭독자 이름
	var play_time   ="05:00";
	var file_url    ="";
	var barcode     ="";
	var img_url     ="";
	var prd_name    ="";
	var actor_name  ="";

	barcode = $(obj).parent().find("input[name=preview_barcode]").val();
	file_url = $(obj).parent().find("input[name=preview_file_url]").val();
	img_url = $(obj).parent().find("input[name=preview_img_url]").val();
	prd_name = $(obj).parent().find("input[name=preview_prd_name]").val();
	actor_name = $(obj).parent().find("input[name=preview_actor_name]").val();
	$(obj).parent().find("input[name=preview_barcode]").val();

	_EKYOBO.fileChange(
			 play_time
			,file_url
			,barcode
			,img_url
			,prd_name
			,actor_name
			);
}

// 리뷰 답글 작성 수정
$(document).on('click','button.replyModify',function(){
	var html = '';
		html += '<div class="reply_write_area">';
		html += '	<div class="byte_check_wrap">';
		html += '		<textarea class="form_textarea" title="답글 입력"></textarea>';
		html += '		<div class="byte_check_footer">';
		html += '			<div class="byte_check">';
		html += '				<span class="count">0</span>';
		html += '				<span class="total">1000</span>';
		html += '			</div>';
		html += '			<div class="btn_wrap">';
		html += '				<button type="button" class="btn_xs btn_light_gray replyCancel"><span class="text">취소</span></button>';
		html += '				<button type="button" class="btn_xs btn_primary replyMoReg"><span class="text">수정</span></button>';
		html += '			</div>';
		html += '		</div>';
		html += '	</div>';
		html += '</div>';
	
		const $this = $(this).closest('.reply_item')
		const text = $(this).closest('.reply_item').find('.reply_text').text()
	
		$this.hide().after(html)
		$this.next().find('textarea').text(text)
})

// 리뷰 답글 작성 수정 취소
$(document).on('click','button.replyCancel',function(){
	const $this = $(this).closest('.reply_write_area')
	
	$this.prev().show()
	$this.remove()
})
	
// 리뷰 답글 작성 수정 완료
$(document).on('click','button.replyMoReg',function(){
	const $this = $(this).closest('.reply_write_area')
	
	$this.prev().show()
	$this.remove()
})