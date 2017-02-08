function showSelectBox() {
    $(".hdzx_left_info ul .hdzx_tx").click(function() {
        var select_box = $(".hdzx_right").children(".hdzx_right_fy");
        var index = $(this).index();
		if (select_box.eq(index).css("display") == "none") {
            $(".hdzx_right_fy").hide();
			$(".hdzx_left_info ul .hdzx_tx").css("border-color","#eeeeee");
            select_box.eq(index).show();
			$(this).css("border-color","#ff8a00")
        } else {

        }
    });
}
//---------------问题首页头像点击切换内容

function initScreen() {
	var inputselect = $("#inputselectid");
	$(".divselect cite").click(function(){
		var ul = $(this).siblings(".divselect ul");
		if(ul.css("display")=="none"){
			ul.slideDown(300);
		}else{
			ul.slideUp(300);
		}
	});
	$(".divselect ul li a").click(function(){
		var txt = $(this).text();
		$(this).parent().parent().siblings(".divselect  cite").html(txt);
		var value = $(this).attr("selectid");
		inputselect.val(value);
		$(this).parent().parent(".divselect ul").hide();
		
	});

};




var common = {
//编辑器
	editor: function() {
		var editor;
		KindEditor.ready(function(K) {
			editor = K.create('#editor1', {
				resizeType: 0,
				minWidth:200,
				items: ['bold', 'italic', 'underline', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist', 'insertunorderedlist', '|', 'emoticons', 'image', 'link']
			});
		});
	}
}