/*
 * name : ui_product_mdig.js
 * desc : 상품 공통 자바스크립트
 * writer : glim
 * create : 2021/11/26
 * update :
 * -
 */

$(function(){
    // 하단 고정영역 가격보기 토글팝업
    $('.footer_contents_inner .btn_toggle').on('click', function(event) {
        KyoboBookPub.mdig.setToggleClass('.infoToggleBox','open');
    });
});
