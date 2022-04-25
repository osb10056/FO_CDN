/*
 * name : ui.js
 * desc : 공통 자바스크립트
 * writer : ipg
 * create : 2021/00/00
 * update :
 * -
 */

$(function(){
    // 첫번째 카테고리 높이
    const that = '.category_inner.first'

    $(that).each(function(i){
        const target = $(this).find('.category_menu')

        const len = $(this).find('.category_menu li').length * 23
        target.css('height', len+'px').attr('sub',len)
    })

});

// gnb - 1depth
$(document).on('click','.gnb_item a',function(e){
    const $this = $(this)
    const parent = $(this).parent()
    if(!$this.is(':only-child')){
        e.preventDefault()
        if(parent.hasClass('active')){
            $this.parent().removeClass('active')
            $('header.header_wrapper > .gnb_bg').remove()
        }else{
            if(!$('.gnb_item').hasClass('active')){
                $('header.header_wrapper').append('<div class="gnb_bg"></div>')
            }
            $this.parent().addClass('active').siblings('.gnb_item').removeClass('active')
        }        
    }
});

// gnb(버거메뉴)
$(document).on('click','.category_tab button',function(){
    const $this = $(this).parent()
    const idx = $this.index()
    const that = '.category_wrap'

    if(!$this.hasClass('current')){
        $this.addClass('current').siblings('li').removeClass('current')
    
        $(that).hide()
        $(that).eq(idx).css('display','flex')
        $('.category_menu li > a').removeClass('open').next().slideUp('fast')
    }
});
// gnb(버거메뉴) - 하위
$(document).on('click','.category_menu li > a',function(e){
    const $this = $(this)
    const $parent = $(this).parents('.category_menu')
    const tg = $(this).attr('href')
    const h = $parent.height()
    const h2 = parseInt($parent.attr('sub'))

    if(tg == '#'){
        e.preventDefault()
        if($this.hasClass('open')){
            $this.removeClass('open').next().slideUp('fast',function(){
                $parent.css('height', h2+'px')
            })
        }else{
            $('.category_menu li > a').removeClass('open').next().slideUp('fast')
            $this.addClass('open').next().slideDown('fast',function(){

                $parent.css('height', h2+$this.next().height()+'px')
            })
            
            
            
        }

    }
});


// 찜
$(document).on('click','button[data-class=like]',function(){
    const $this = $(this)
    if($this.hasClass('active')){
        $this.removeClass('active')
    }else{
        $this.addClass('active')
    }
})

// 게시판 유형 변경
$(document).on('click','.switch_list_btn_wrap button',function(){
    const $this = $(this)
    $this.addClass('active').siblings('button').removeClass('active')
    if($this.hasClass('ico_list')){
        $('.eBook_list_body').removeClass('thumbnail')
    }else{
        $('.eBook_list_body').addClass('thumbnail')
    }
});