// tab같은 버튼 활성화 (.astab)
$(document).on('click','.astab > .item',function() {
	$(this).addClass('active');
	$(this).siblings('.item').removeClass('active');

	let selector = "#" + $(this).attr("id") + "_con";
	// $(document).find('.tab_con').hide();
	// $(document).find(selector).show();
	$(document).find(selector).addClass('active').siblings().removeClass('active');
	return false;
});

// foldering
$(document).on('click','.btn_fold',function(){
	let target = "#" + $(this).attr("data-target");
	if($(this).hasClass('opened')){
		$(this).removeClass('opened')
		$(document).find(target).slideToggle('500')		
	}else{
		$(this).addClass('opened')
		$(document).find(target).slideToggle('500')		
	}
})

// 결제관련 rd버튼
$(document).on('click','.amt-opt',function() {
	$(this).addClass('active').find('input[type=radio]').prop('checked',true);
	// $(this).siblings('.amt-opt').removeClass('active').find('input[type=radio]').prop('checked',false);
	$(this).siblings('.amt-opt').removeClass('active');
});

// 상품리스트 편집
$(document).on('click','.modify_product_btn',function() {
	if($(this).closest('.product_list_wrap').hasClass('product_modify_on')){
		$(this).closest('.product_list_wrap').removeClass('product_modify_on')
	}else{
		$(this).closest('.product_list_wrap').addClass('product_modify_on')
	}
});
$(document).ready(function() {
    $("#prod_all_ckd").click(function() {
        if($("#prod_all_ckd").is(":checked")) $("input[name=product_sel]").prop("checked", true);
        else $("input[name=product_sel]").prop("checked", false);
    });
});
$(document).on('click','.modify_product > li',function() {
	$(this).find('input[type=checkbox]').prop('checked',function(){
		return !$(this).prop('checked');
	});
});

// $(document).ready(function() {
//     $("input[type=checkbox]").click(function() {
// 		if($(this).hasClass('allckd')) {
// 			const target = $(this).attr('name')
// 			for(i = 0; i < $(`input[name=${target}]`).length; i++){
// 				if($(`input[name=${target}]`).eq(i).prop("checked")){
// 					$(`input[name=${target}]`).eq(i).prop("checked", false);
// 				} else {
// 					$(`input[name=${target}]`).eq(i).prop("checked", true);
// 				}
// 			}
// 		}


// 		// const allCkd = $(this).attr('name')
// 		// console.log(allCkd)
// 		// console.log($('input[name=allCkd]').length)

// 	});
// 	// 	// $("input[name=allCkd]").addClass('hidden').prop("checked", true);
// 	// 	console.log($("input[name=allCkd]"))

// 		// $('input[type=checkbox]').on('click', function(){
// 		// 	//값들의 갯수 -> 배열 길이를 지정
// 		// 	var grpl = $("input[name=allCkd]").length;
// 		// 	//배열 생성
// 		// 	var grparr = new Array(grpl);
// 		// 	//배열에 값 주입
// 		// 	for(var i=0; i<grpl; i++){                          
// 		// 		grparr[i] = $("input[name=allCkd]").eq(i).val();
// 		// 		alert(grparr[i]);
// 		// 	}
// 		// });

		
// 		// $("input[name=allCkd]").prop("checked", true);
// 		// const allCkdTarget = "#" + allCkd + "_all_ckd"

//         // if($(allCkd).is(":checked")) $("input[name=allCkd]").prop("checked", true);
//         // else $(allCkd).prop("checked", false);
// 		// return false;
// });

// toggle btn
$(document).on('click','.toggle_btn',function() {
	if($(this).find('.icon').hasClass('reverse')){
		$(this).find('.icon').removeClass('reverse')
	}else{
		$(this).find('.icon').addClass('reverse')
	}
});


// .rd-list
$(document).on('click','.rd-list > li',function() {
	if($(this).find('input[type=checkbox]').prop('checked')) {
		$(this).addClass('active').prop('checked',false)
	} else {
		$(this).removeClass('active').prop('checked',true)
	}
	// $(this).addClass('active').find('input[type=radio]').prop('checked',true);
});

// $(document).on('click','.tooltip_banner .btn-close',function() {
// 	if($(this).closest('.tooltip_banner').hasClass('hidden')){
// 		$(this).closest('.tooltip_banner').removeClass('hidden')
// 	}else{
// 		$(this).closest('.tooltip_banner').addClass('hidden')
// 	}
// });


$(document).on('click','.ck-list > li',function() {
	$(this).addClass('active').find('input[type=radio]').prop('checked',true);
	// $(this).siblings('.ck-opt').removeClass('active').find('input[type=radio]').prop('checked',false);
	$(this).siblings('.ck-opt').removeClass('active');
});

$(document).on('click','.btn-close',function() {
	$(this).parent().addClass('hidden');
});
