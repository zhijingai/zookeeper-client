var publicJs = {
	//浏览器判断
	browser: function() {
		$('body').prepend(
			'<div id="browser_ie">' +
			'<div class="brower_info">' +
			'<div class="notice_info">' +
			'<P>' + '<i>' + '</i>' + '您的浏览器版本过低。为保证最佳体验，请更新高版本浏览器' + '</P>' +
			'</div>' +
			'<div class="browser_list">' +
			'<span>' +
			'<a href="http://www.google.cn/chrome/" target=_blank>' +
			'<dl>' +
			'<dd class="public_img chrome_img">' + '</dd>' +
			'<dt>' + 'Chrome' + '</dt>' +
			'</dl>' +
			'</a>' +
			'</span>' +
			'<span>' +
			'<a href="http://www.firefox.com.cn/" target=_blank>' +
			'<dl>' +
			'<dd class="public_img firefox_img">' + '</dd>' +
			'<dt>' + 'Firefox' + '</dt>' +
			'</dl>' +
			'</a>' +
			'</span>' +
			'<span>' +
			'<a href="http://support.apple.com/kb/DL1531" target=_blank>' +
			'<dl>' +
			'<dd class="public_img safari_img">' + '</dd>' +
			'<dt>' + 'Safari' + '</dt>' +
			'</dl>' +
			'</a>' +
			'</span>' +
			'<span>' +
			'<a href="http://windows.microsoft.com/zh-cn/internet-explorer/download-ie" target=_blank>' +
			'<dl>' +
			'<dd class="public_img ie_img">' + '</dd>' +
			'<dt>' + 'IE9及以上' + '</dt>' +
			'</dl>' +
			'</a>' +
			'</span>' +
			'</div>' +
			'</div>' +
			'<div class="brower_close">' +
			'以后再说' +
			'<a href="#">' + 'x' + '</a>' +
			'</div>' +
			'</div> '
		)
	},
	
	//分页插件
	page: function(){
			$("#Pagination").pagination(300, {
				items_per_page:9,//每页显示行数
				num_edge_entries: 2,//省略号前后显示页数
				num_display_entries: 2,//省略号前默认显示页数
				link_to:"#",//页数链接
				prev_text:"上一页",
				next_text:"下一页"
			});
			$("#Pagination2").pagination(300, {
				items_per_page:9,//每页显示行数
				num_edge_entries: 2,//省略号前后显示页数
				num_display_entries: 2,//省略号前默认显示页数
				link_to:"#",//页数链接
				prev_text:"上一页",
				next_text:"下一页"
			});
	},		
    scrollFuc:function(){
        $('#scroll').delay("slow").toggleClass('scrolled', $(window).scrollTop() > 164);
    },
	init: function() {
        var scrollTimer = null;
		$(window).scroll(function() {
            if(scrollTimer){
                clearTimeout(scrollTimer);
            }
            scrollTimer = setTimeout('publicJs.scrollFuc()',100);
		});
	},

	//全局地图
	mapToggle: function() {
		$('.mapDw').hover(function() {
			$(this).children('ul').stop().slideDown('fast');
		}, function() {
			$(this).children('ul').stop().slideUp('fast');
		});
	},

	//search 切换
	searchTab: function() {
		$('.navMove>li').on('click', function() {
			$(this).addClass('current').siblings().removeClass('current')
		})

	},
	//contentTab 切换
	contentTab: function() {
		$('.tabbox .tab a').mouseover(function() {
			$(this).addClass('on').siblings().removeClass('on');
			var index = $(this).index();
			$(this).parent('.tab').next('.content').find('li').hide();
			$(this).parent('.tab').next('.content').find('li:eq(' + index + ')').show();
		});
	},

	//tabOut 切换
	tabOut: function() {
		$('.tabboxout .tabout label').on('click', function() {
			$(this).addClass('on').siblings().removeClass('on');
			$(this).children().css('display', 'block').end().siblings().children().css('display', 'none');
			var index = $(this).index();
			$(this).parent('.tabout').next('.contentout').find('li.out').hide();
			$(this).parent('.tabout').next('.contentout').find('li.out:eq(' + index + ')').show();
		});
	},

	//课程分类显示
	classList: function() {
		$(".classMenu").children('li').hover(function() {
			$(this).children(".className").css({
				"border-left": "4px solid #31a030",
				"width": "196px"
			});
			$(this).children(".classMenu_content").css("border", "1px solid #F0F0F0").show();
		}, function() {
			$(this).children(".className").css({
				"border-left": "none",
				"width": "200px"
			});
			$(this).children(".classMenu_content").css("border", "0px solid #F0F0F0").hide();
		});
	},
	//左侧菜单栏
	menuSidebar: function() {
		$('#menuSidebar').on('click', 'span', function() {
			var els = $(this).parent('li');
			if (els.hasClass('active')) {
				els.removeClass('active');
				els.find('div').slideUp('fast');
			} else {
				els.addClass('active').find('div').slideDown('fast').end().siblings().removeClass('active').find('div').slideUp('fast');
			}
		})
	},
	meunCur: function() {
		$('#menuSidebar').on('click', 'a', function() {
			$('#menuSidebar').find('a').removeClass('current');
			$(this).addClass('current');
		})
	},
	//排行榜
	rank: function() {
		$('.ranking ul li').each(function() {
			$(this).mouseover(function() {
				$('.ranking ul li').find('span').removeClass('rankingcur');
				$(this).find('span').addClass('rankingcur');
			});
		});
	},

	//取消上传
	remove: function() {
		//发布里的内容删除
		$(".remove").live('click',function() {
			$(this).parents(".remove-body").hide(500,
				function() {
					$(this).remove();
				});
		})
	},
	
	//评论
	comments: function(){
		$(".comment-btn").click(function(){
			var sub = $(this).parents(".f-user-info").next(".hide-submit");
			if (sub.css("display") == "none") {
				$(".hide-submit").hide();
				sub.show()
			} else {
				$(".hide-submit").hide();
			}
		})
		
	},
	
	//赋值
	eval:function(){
		$(".category").live('click',function(){
			var txt = $(this).text();
			$(this).parents(".ui-dropdown-menu").siblings(".ui-dropdown-hd").children("span").text(txt)
		})
	},
	
	//关注
	attention: function(){
		$("#attention").click(function(){
				$(this).val("已关注");
				$(this).css("background","#959595")
			})
	},
	//关注2
	attention2: function() {
		$("#attention2").live('click', function() {
			$(this).val("√  已关注");
			$(this).removeClass("btn10");
			$(this).addClass("btn12")
		})
	},

	//输入
	write: function() {
		$(".write-ipt").keyup(function() {
			var txt = $(this).val();
			if (txt != "") {
				$(this).next(".write-text").hide();
			} else {
				$(this).next(".write-text").show();
			}
		});
		$(".write-text").click(function() {
			$(this).prev(".write-ipt").focus();
		});
	},

	//限定字数
	wordNum: function() {
		(function($) {
			$.fn.fonts = function(option) {
					option = $.extend({}, $.fn.fonts.option, option);
					return this.each(function() {
						var objString = $(this).text(),
							objLength = $(this).text().length,
							num = option.fontNum;
						if (objLength > num) {
							objString = $(this).text(objString.substring(0, num) + "···");
						}
					})
				};
				// default options
			$.fn.fonts.option = {
				fontNum: 100 //font num
			};

		})(jQuery);
	},
	changeHeight:function(){
		var bodyH = $(document.body).height();
		var docuH = $(document).height();
		var winH = $(window).height();
		if(bodyH < winH){
			$(".footer").addClass("footer-position");
			$(".footer").css({"bottom":"-"+(winH-bodyH) + "px"});
		}else{
			$(".footer").removeClass("footer-position")
		}
	},
	resizeHeight:function(){
		var resizeTimer = null;
		$(window).resize(function(){
			if (resizeTimer) {
				clearTimeout(resizeTimer); 
			}
			resizeTimer = setTimeout("publicJs.changeHeight()", 100);
		});
		$(window).resize();
	}

};


/**
 * 自定义选择表单
 * Created by LtWhite on 2015/7/27.
 */
;
(function($) {
	/**
	 * 下拉选择菜单
	 */
	$.fn.jSelect = function(settings) {
		// 默认参数
		var defaults = {
			viewSelector: ".select-view", // select选择层容器css选择器
			valueSelector: ".select-value", // 存放select的value值的input表单的css选择器
			textSelector: ".select-text", // select显示文本的css选择器
			iconSelector: ".select-icon", // select的icon的css选择器
			iconClickAble: true, // 是否使用点击icon展示下拉项

			itemContainerSelector: ".options", // 下拉层css选择器
			itemSelector: ".options > li", // 下拉项css选择器

			completeFunction: function() {} // 回调函数
		};

		var options = $.extend(defaults, settings || {}); // 使用参数

		var div = this;
		var selectView = div.find(options.viewSelector); // select显示层容器
		var selectValueInput = selectView.find(options.valueSelector); // select的value值的input表单
		var selectText = selectView.find(options.textSelector); // select显示文本
		var selectIcon = selectView.find(options.iconSelector); // select的icon
		var selectItemContainer = div.find(options.itemContainerSelector); // select下拉层
		var items = div.find(options.itemSelector); // select下拉项

		/*----添加事件----*/
		/**
		 * 点击icon或者点击显示层，显示下拉层
		 */

		selectView.off().on("click", function() {
			selectItemContainerToggle();
			div.find(".select-icon").toggleClass("select-icon2");
			return false;
		});


		/**
		 * 点击下拉项，修改value值，改变显示文本
		 */
		items.each(function() {
			var item = $(this);

			item.off().on("click", function() {
				var value = $(this).data("value"); // 获取当前项的value
				var text = $(this).text(); // 获取当前项的文本内容

				selectValueInput.val(value); // 修改value
				selectText.text(text); // 修改文本内容

				selectItemContainer.slideUp("fast"); // 收起下拉层
				
				$(".select-icon").removeClass("select-icon2");
				options.completeFunction(); // 执行回调函数
				return false;
			});
		});

		/*----函数----*/
		/**
		 * 显示或者隐藏下拉层
		 */
		function selectItemContainerToggle() {
			var $allDrop = selectItemContainer.parents('.set-wrap-pt').siblings('.set-wrap-pt');
			if($allDrop !== undefined && $allDrop.length > 0){
				$allDrop.each(function(val,i){
					//$($allDrop[i]).find('.options').slideUp("fast");
				});
			}
			selectItemContainer.slideToggle("fast");

		}
		/**
		 * 设置初始值
		 * 
		 */
		function setValue(value){
			div.find(options.itemSelector+'[data-value='+value+']').triggerHandler('click');
		}
		if(options.defaultsValue !== undefined && options.defaultsValue !== null){
			setValue(options.defaultsValue);
		}
	}

})(jQuery);
//让IE支持placeholder属性
var JPlaceHolder = {
    //检测
    _check : function(){
        return 'placeholder' in document.createElement('input');
    },
    //初始化
    init : function(){
        if(!this._check()){
            this.fix();
        }
    },
    //修复
    fix : function(){
        jQuery(':input[placeholder]').each(function(index, element) {
            var self = $(this), txt = self.attr('placeholder');
            self.wrap($('<div></div>').css({position:'relative', zoom:'1', border:'none', background:'none', padding:'none', margin:'none'}));
            var pos = self.position(), h = self.outerHeight(true), paddingleft = self.css('padding-left');
            var holder = $('<span></span>').text(txt).css({position:'absolute', left:pos.left, top:pos.top, height:33, lineHeight:33+'px', paddingLeft:paddingleft, color:'#aaa'}).appendTo(self.parent());
            self.focusin(function(e) {
                holder.hide();
            }).focusout(function(e) {
                if(!self.val()){
                    holder.show();
                }
            });
            holder.click(function(e) {
                holder.hide();
                self.focus();
            });
        });
    }
};

/*微课大赛public.js*/
/*
 * by yangzheyu 2016-02
 */
var Common = {
	//字数限制，提示已输入的字数
    //超出限制则 validate = 1
	numberLimit: function(){
        return $(".limit-input").each(function(index, el) {
                    var $this = $(el);
                    var maxNumber = $this.attr('data-number');
                    if(isNaN(maxNumber)){
                       var maxNumber = 500;
                    }
                    $this.on('keydown keyup blur',function(){
                        var $msg = $this.parent().siblings('.limit-msg');
                        var howmany = $this.val().trim().length;
                        if(howmany <= maxNumber){
                            $this.attr('validate','0');
                            $msg.removeClass('red').addClass('gray').html(howmany+'/'+maxNumber);
                        }else if(howmany > maxNumber){
                            $this.attr('validate','1');
                            $msg.removeClass('gray').addClass('red').html(howmany+'/'+maxNumber);
                        }
                    });
                });
	},
    //课程详情切换
    Tabclassify: function(){
        $('.tab_list>h2>a').each(function(index){
            $(this).on('click',function(){
                var oli=$(this);
                $('.tab_list>h2>a').removeClass('current');
                oli.addClass('current');
                $('.tab_content_1').removeClass('classify_show');
                $('.tab_content_1').eq(index).addClass('classify_show');
            })

        })
    },
    //排行榜
    rack_list: function(){
        $('.tab_list>ul>li>a').each(function(index){
            $(this).on('click',function(){
                var oli=$(this);
                $('.tab_list>ul>li>a').removeClass('current');
                oli.addClass('current');
                $('.tab_content').removeClass('tab_show');
                $('.tab_content').eq(index).addClass('tab_show');
            })
        })
    },
    //地图
    map: function(){
        var timer = {};
        $('#m_btn').delegate('span', 'mouseenter', function(){
            var self = $(this);
            var tp = self.attr('data-type');
            clearTimeout(timer[tp]);
            timer[tp] = setTimeout(function(){
                self.addClass('hover');
                $('div[data-panel=' + tp + ']').removeClass('hide');
            },100);
        }).delegate('span', 'mouseleave', function(){
            var self = $(this);
            var tp = self.attr('data-type');
            clearTimeout(timer[tp])
            timer[tp] = setTimeout(function(){
                self.removeClass('hover');
                $('div[data-panel=' + tp + ']').addClass('hide');
            },100);
        });

        $(document.body).delegate('div.m_content', 'mouseenter', function(){
            clearTimeout(timer[$(this).attr('data-panel')]);
        }).delegate('div.m_content', 'mouseleave', function(){
            $(this).addClass('hide');
            $('span[data-type='+ $(this).attr('data-panel') +']').removeClass('hover');
        });
    },
    //时间轴
    time_line:function(){
        $(document).ready(function(){
            autoclick();
            $(".screening-select").click(function () {
                var _parent = $(this);
                var _postX = _parent.position().left;
                if(_parent.hasClass('select-3')){
                    /*_parent.siblings(".screening-select").removeClass("current");
                    _parent.addClass("current");*/
                    _parent.siblings(".project-screening-yellow").animate({ width: _postX }, 1000);
                    _parent.siblings(".select-1-yellow").animate({ left: _postX-12 }, 1000);
                    _parent.prevAll(".screening-select").css("background", "none");
                    _parent.nextAll().removeAttr("style");
                }
            });
            function autoclick(){
                $(".screening-select").trigger('click');
                $autoFun = setTimeout( autoclick, 1000 );
                clearTimeout('$autoFun');
            }

        });
    },
    //获取高度
    get_hei:function(){
        $(function(){
            var _h1=$('.divi_first_img').height();
            var _h2=$('.divi_first_shu').height();
            var _h3=$('.divi_secend_img').height();
            var _h4=$('.divi_secend_shu').height();
            var _h5=$('.divi_third_img').height();
            var _h6=$('.divi_third_shu').height();
            var _h12=(_h1+_h2+20)+"px";
            var _h34=(_h3+_h4+20)+"px";
            var _h56=(_h5+_h6+20)+"px";
            $('.divi_first_num').css('bottom',_h12);
            $('.divi_secend_num').css('bottom',_h34);
            $('.divi_third_num').css('bottom',_h56);
            });
    },
    //赛区选择
    choose_area:function(){
        $(function(){
            $('.step_1_content>ul>li').on('click',function(){
                $(this).addClass('current').siblings().removeClass('current');
            })
        })
    },
    //注册页面的提示文字
    tips: function(){
        //注册页面的提示文字
        $(function(){
            //输入框获得焦点
            $(".verify").focus(function(){
                $(this).addClass("checkedN");
            });
            //输入框失去焦点
            $(".verify").blur(function(){
                reg=/^1[3|4|5|8][0-9]\d{4,8}$/i;//验证手机正则(输入前7位至11位)
                if( $(this).val()=="")
                {
                    $(this).addClass("errorC");
                    $(this).next(".error0").html("不能为空");
                    $(this).next(".error1").html("邀请码不正确");
                    $(this).next(".error0").css("display","block");
                }
                else
                {
                    $(this).next(".error0").removeClass("errorC");
                    $(this).next(".error1").removeClass("errorC");
                    $(this).next(".error0").css("display","none");
                    $(this).next(".error1").css("display","none");
                }
            });
        })
    },
    //新增和删除
    add:function(){
        $(function () {
            $(".add").on("click", function () {
                var father =$(this).parent('.infor');
                var child =
                        "<li class='infor clearfix ueser_infor'>"+
                        '<label>'+'</label>'+
                        "<div class='input-box'>"+
                        '<input type="text" placeholder="姓名"  class="verify user" name="partName"/>'+
                        '</div>'+
                        "<div class='input-box'>"+
                        '<input type="text" placeholder="手机号码" class="verify phone" maxlength="11" name="partMob"/>'+
                        '</div>'+
                        '<i class="del">'+'&times;'+'</i>'+
                        '<span class="error error0">'+'</span>'+
                        "</li>"
                    ;
                $(father).parent().append(child);
            });
            $('.del').live('click', function () {
                $(this).parent('.infor').remove();
            });
        });
    },
    //展开和收缩
    slide:function(){
            $(function(){
                var objHide=$('dl.small_school dd:gt(5)');
                objHide.hide();
                $('span.school_open').click(function(){
                    if(objHide.is(':visible')){
                        objHide.hide();
                        $(this).text('∨展开');
                    }else{
                        objHide.show();
                        $(this).text('∧收起');
                    }
                })
            })
    },
    //遮罩层
    shade:function(){
        $(function(){
           /* $('.bm_now').on('click',function(){
                $(".px_mask,.px_bm").show();
            });*/
            $('.px_qx').on('click',function(){
                $(".px_mask,.px_bm").hide();
            })
        })

    }
};