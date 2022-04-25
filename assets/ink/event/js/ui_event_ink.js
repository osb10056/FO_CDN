/*
 * name : ui_myroom_ink.js
 * desc : 마이룸 공통 실행 자바스크립트
 * writer : glim
 * create : 2021/02/04
 * update :
 * -
 */

$(function(){
	// 리스트형보기/썸네일형보기 토글 버튼 이벤트 설정
	KyoboBookPub.ink.setSwitchListBtn(function(tg){
		if(tg.hasClass('view_type_img')){
			tg.find('.prod_area').removeClass('horizontal');
		}else{
			tg.find('.prod_area').addClass('horizontal');
		}
	});
});
