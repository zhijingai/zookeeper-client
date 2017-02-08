
//document.write('<script id="" type="text/javascript" src="/scripts/ajaxDataController.js"></script>' +
//               '<script id="" type="text/javascript" src="/scripts/user/userDataController.js"></script>' +
//               '<script id="" type="text/javascript" src="/tools/layer/layer.js"></script>' +
//               '<script id="" type="text/javascript" src="/scripts/jquery.tmpl.min.js"></script>' +
//               '<script id="" type="text/javascript" src="/tools/pagination/jquery.pagination.js"></script>'
//               );



$.fn.extend({
    /**
     * 日期控件
     * @param {String} [event] 绑定事件
     * @param {Object} [options] 日期控件参数
     *  {  
     *      dateFmt:"yyyy-MM-dd HH:mm:ss",  //日期时间格式化
     *      maxDate: "#F{$dp.$D('date1')",  //最大选取时间
     *      minDate: "#F{$dp.$D('date2')",  //最小选取时间
     *      isShowWeek:false,               //是否显示周
     *      isShowClear:true,               //是否显示清空按钮 
     *      isShowToday:true,               //是否显示今天按钮
     *      readOnly:true,                  //是否只读
     *      ......
     *   }
     */
    datePicker: function (event, options) {
        if (event == null) {
            event = "click";
        }
        $(this).bind(event, function () {
            if (options == null) {
                WdatePicker()
            } else {
                WdatePicker(options);
            }
        });
        return $(this);
    },
    /**
    * 复选框全选操作   
    * @param {Object} [list] 复选框集合
    */
    selectAll: function (list) {
        $(this).bind("click", function () {
            if ($(this).attr("checked") == true || $(this).attr("checked") == "checked") {
                $(list).attr("checked", "checked");
            } else {
                $(list).removeAttr("checked");
            }
        });
        var btn = $(this);
        $(list).live("click", function () {
            if ($(list).not(":checked").length > 0) {
                $(btn).removeAttr("checked");
            } else {
                $(btn).attr("checked", "checked");
            }
        });
        return $(this);
    },
    paginationAsync: function (pageIndex, pageSize, totalCount, callback) {
        $(this).removeClass("pagination").addClass("pagination").pagination(totalCount,
           {
               current_page: pageIndex <= 0 ? 1 : pageIndex,
               items_per_page: pageSize,
               num_edge_entries: 2,
               num_display_entries: 5,
               prev_text: "上一页",
               next_text: "下一页",
               callback: callback,
               link_to: "javascript:void(0);"
           });
        return $(this);
    },
    paginationSync: function (pageIndex, pageSize, totalCount, url, params) {
        url += "?pageIndex=__id__";
        if (params != null) {
            for (var p in params) {
                if (typeof (params[p]) === "object") {
                    for (var i = 0; i < params[p].length; i++) {
                        url += "&" + p + "=" + params[p][i];
                    }
                } else {
                    url += "&" + p + "=" + params[p];
                }

            }
        }
        url = encodeURI(url);
        $(this).removeClass("pagination").addClass("pagination").pagination(totalCount,
           {
               current_page: pageIndex <= 0 ? 1 : pageIndex,
               items_per_page: pageSize,
               num_edge_entries: 2,
               num_display_entries: 5,
               prev_text: "上一页",
               next_text: "下一页",
               link_to: url
           });
        return $(this);
    },

    validate: function (event, displayName, rules, errorMessagePlace) {
        if (typeof (event) === "undefined" || event == null) {
            var isV = true;
            if (typeof ($(this).attr("data-validated")) !== "undefined") {
                $(this).trigger($(this).attr("data-event"),true);
                if ($(this).attr("data-validated") != "true") {
                    {
                        isV = false;
                    }
                }
            } else {

                for (var i = 0; i < $(this).find("[data-validated]").length; i++) {
                    $(this).find("[data-validated]").eq(i).trigger($(this).find("[data-validated]").eq(i).attr("data-event"),true);
                }
                if ($(this).find("[data-validated='false']").length > 0) {
                    isV = false;
                }
                //alert($(this).find("[data-validated='false']").length + "," + isV);
            }
            return isV;
        }

        var regularClass = {
            username: /^[a-zA-Z][a-zA-Z0-9_-]{5,11}$/,//6-12位字符，同时包含字母和数字 ,原来的--->^[a-zA-Z0-9_-]{6,12}$  
            password: /^[^\s]{6,16}$/,//原来的：/^[^\s]{6,16}$/
            email: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
            mobilephone: /^(1|01)([1-9])[0-9]{9}$/,
            verifycode: /^[a-zA-Z0-9]{4}$/,
            //精确到小数点后2位的正数  验证钱
            decimalPrice: /^(([1-9][\d]{0,7})(\.[\d]{1,2})?)|(0\.)(([1-9][0-9]?)|([0-9][1-9]))$/,
            idCard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
            nickname: /^[\u4e00-\u9fa5A-Za-z0-9-_]*$/   
        };

        var rule = {
            required: { required: true, errorMessage: "" },//必填
            maxLength: { maxLength: 0, errorMessage: "" },//最大长度
            minLength: { minLength: 0, errorMessage: "" },//最小长度
            maxValue: { maxValue: 0, errorMessage: "" },//最大值
            minValue: { minValue: 0, errorMessage: "" },//最小值
            regular: { regular: null, errorMessage: "" },//正则
            compare: { compare: null, errorMessage: "", errorMessagePlace: null },//二次确认          
            remote: { remoteUrl: null, data: null, method: "GET", errorMessage: "" }
        };
        var layertips = null;
        var layertips2 = null;
        var $thisObj = $(this);

        //必填
        if (typeof (rules.required) !== "undefined" && rules.required == true) {
            rule.required.errorMessage = "请输入" + displayName;
        } else if (typeof (rules.required) === "object" && rules.required.required == true) {
            if (typeof (rules.required.errorMessage) === "undefined" || rules.required.errorMessage == null) {
                rule.required.errorMessage = "请输入" + displayName;
            } else {
                rule.required.errorMessage = rules.required.errorMessage;
            }
        } else {
            rule.required = null;
        }

        //最大长度
        if (typeof (rules.maxLength) !== "undefined" && typeof (rules.maxLength) === "number" && rules.maxLength > 0) {
            rule.maxLength.maxLength = rules.maxLength;
            rule.maxLength.errorMessage = displayName + "不能超过 " + rules.maxLength + " 个字符";
        } else if (typeof (rules.maxLength) === "object" && typeof (rules.maxLength.maxLength) === "number" && rules.maxLength.maxLength > 0) {
            rule.maxLength.maxLength = rules.maxLength.maxLength;
            if (typeof (rules.maxLength.errorMessage) === "undefined" || rules.maxLength.errorMessage == null) {
                rule.maxLength.errorMessage = displayName + "不能超过 " + rules.maxLength.maxLength + " 个字符";
            } else {
                rule.maxLength.errorMessage = rules.maxLength.errorMessage;
            }
        } else {
            rule.maxLength = null;
        }
        //最小长度
        if (typeof (rules.minLength) !== "undefined" && typeof (rules.minLength) === "number" && rules.minLength > 0) {
            rule.minLength.minLength = rules.minLength;
            rule.minLength.errorMessage = displayName + "不能少于 " + rules.minLength + " 个字符";
        } else if (typeof (rules.minLength) === "object" && typeof (rules.minLength.minLength) === "number" && rules.minLength.minLength > 0) {
            rule.minLength.minLength = rules.minLength.minLength;
            if (typeof (rules.minLength.errorMessage) === "undefined" || rules.minLength.errorMessage == null) {
                rule.minLength.errorMessage = displayName + "不能少于 " + rules.minLength.minLength + " 个字符";
            } else {
                rule.minLength.errorMessage = rules.minLength.errorMessage;
            }
        } else {
            rule.minLength = null;
        }

        //最大值
        if (typeof (rules.maxValue) !== "undefined" && typeof (rules.maxValue) === "number") {
            rule.maxValue.maxValue = rules.maxValue;
            rule.maxValue.errorMessage = displayName + "不能大于 " + rules.maxValue;
        } else if (typeof (rules.maxValue) === "object" && typeof (rules.maxValue.maxValue) === "number") {
            rule.maxValue.maxValue = rules.maxValue.maxValue;
            if (typeof (rules.maxValue.errorMessage) === "undefined" || rules.maxValue.errorMessage == null) {
                rule.maxValue.errorMessage = displayName + "不能大于 " + rules.maxValue.maxValue;
            } else {
                rule.maxValue.errorMessage = rules.maxValue.errorMessage;
            }
        } else {
            rule.maxValue = null;
        }
        //最小值
        if (typeof (rules.minValue) !== "undefined" && typeof (rules.minValue) === "number") {
            rule.minValue.minValue = rules.minValue;
            rule.minValue.errorMessage = displayName + "不能小于 " + rules.minValue;
        } else if (typeof (rules.minValue) === "object" && typeof (rules.minValue.minValue) === "number") {
            rule.minValue.minValue = rules.minValue.minValue;
            if (typeof (rules.minValue.errorMessage) === "undefined" || rules.minValue.errorMessage == null) {
                rule.minValue.errorMessage = displayName + "不能小于 " + rules.minValue.minValue;
            } else {
                rule.minValue.errorMessage = rules.minValue.errorMessage;
            }
        } else {
            rule.minValue = null;
        }
        
      //正则
        if (typeof (rules.regular) !== "undefined" && typeof (rules.regular.regular) === "undefined") {
            rule.regular.regular = rules.regular;
            rule.regular.errorMessage = displayName + "格式输入有误";
        } else if (typeof (rules.regular) !== "undefined" && typeof (rules.regular) === "object") {
            rule.regular.regular = rules.regular.regular;
            if (typeof (rules.regular.errorMessage) === "undefined" || rules.regular.errorMessage == null) {
                rule.regular.errorMessage = displayName + "格式输入有误";
            } else {
                rule.regular.errorMessage = rules.regular.errorMessage;
            }
        } else {

            rule.regular = null;
        }
        if (rule.regular != null && typeof (rule.regular.regular) === "string") {
            rule.regular.regular = regularClass[rule.regular.regular];

        }
        
        //比较
        if (typeof (rules.compare) !== "undefined" && typeof (rules.compare) === "object" && typeof (rules.compare.compare) === "undefined") {
            rule.compare.compare = rules.compare;
            rule.compare.errorMessage = displayName + "输入不一致";
            rule.compare.errorMessagePlace = rules.compare;
        } else if (typeof (rules.compare) !== "undefined" && typeof (rules.compare) === "object" && typeof (rules.compare.compare) === "object") {
            rule.compare.compare = rules.compare.compare;
            if (typeof (rules.compare.errorMessage) === "undefined" || rules.compare.errorMessage == null) {
                rule.compare.errorMessage = displayName + "输入不一致";
            } else {
                rule.compare.errorMessage = rules.compare.errorMessage;
            }
            if (typeof (rules.compare.errorMessagePlace) === "undefined" || rules.compare.errorMessagePlace == null) {
                rule.compare.errorMessagePlace = rules.compare.compare;
            } else {
                rule.compare.errorMessagePlace = rules.compare.errorMessagePlace
            }

        } else {
            rule.compare = null;
        }

        //远程验证
        if (typeof (rules.remote) !== "undefined" && rules.remote != null) {
            rule.remote.remoteUrl = rules.remote.remoteUrl;
            rule.remote.data = rules.remote.data;
            rule.remote.method = rules.remote.method;
            if (typeof (rules.remote.errorMessage) === "undefined" || rules.remote.errorMessage == null) {
                rule.remote.errorMessage = displayName + "远程验证失败";
            } else {
                rule.remote.errorMessage = rules.remote.errorMessage;
            }
        } else {
            rule.remote = null;
        }

        if (errorMessagePlace == null) {
            errorMessagePlace = $(this);
        }

        $(this).attr("data-displayname", displayName).attr("data-event", event);
        $(this).bind(event, function (e, arg) {
        	
        	if (layertips != null) {
                layer.close(layertips);
            }
            if (layertips2 != null) {
                layer.close(layertips2);
            }

            for (var p in rule) {
                if (rule[p] == null) {
                    continue;
                }
                var curRule = rule[p];
                switch (p) {
                    case "required":
                        if ($(this).val().trim() == "") {
                            $(this).attr("data-validated", false).attr("data-msg", curRule.errorMessage);
                            layertips = common.layer.tips($(errorMessagePlace), curRule.errorMessage, 2, 0, true);
                            return;
                        }
                        break;
                    case "maxLength":
                        if ($(this).val().trim().length > curRule.maxLength) {
                            $(this).attr("data-validated", false).attr("data-msg", curRule.errorMessage);
                            layertips = common.layer.tips($(errorMessagePlace), curRule.errorMessage, 2, 0, true);
                            return;
                        }
                        break;
                    case "minLength":
                        if ($(this).val().trim().length < curRule.minLength) {
                            $(this).attr("data-validated", false).attr("data-msg", curRule.errorMessage);
                            layertips = common.layer.tips($(errorMessagePlace), curRule.errorMessage, 2, 0, true);
                            return;
                        }
                        break;
                    case "maxValue":
                        if (!isNaN($(this).val().trim()) && Number($(this).val().trim()) > curRule.maxValue) {
                            $(this).attr("data-validated", false).attr("data-msg", curRule.errorMessage);
                            layertips = common.layer.tips($(errorMessagePlace), curRule.errorMessage, 2, 0, true);
                            return;
                        }
                        break;
                    case "minValue":
                        if (!isNaN($(this).val().trim()) && Number($(this).val().trim()) < curRule.minValue) {
                            $(this).attr("data-validated", false).attr("data-msg", curRule.errorMessage);
                            layertips = common.layer.tips($(errorMessagePlace), curRule.errorMessage, 2, 0, true);
                            return;
                        }
                        break;
                    case "regular":
                        var r = curRule.regular.test($(this).val());
                        if (!r) {
                            $(this).attr("data-validated", false).attr("data-msg", curRule.errorMessage);
                            layertips = common.layer.tips($(errorMessagePlace), curRule.errorMessage, 2, 0, true);
                            return;
                        }
                        break;
                    case "compare":
                        if (layertips2 != null) {
                            layer.close(layertips2);
                        }
                        var compareErrorMessagePlace = curRule.errorMessagePlace;

                        //if ($(curRule.compare).val() == null || $(curRule.compare).val().trim()=="") {
                        //    $(this).attr("data-validated", false).attr("data-msg", curRule.errorMessage);
                        //    return;
                        //}
                        if ($(this).val().trim() != $(curRule.compare).val().trim()) {
                            $(this).attr("data-validated", false).attr("data-msg", curRule.errorMessage);
                            //if ($(curRule.compare).val().trim() != "") {
                            if ($(curRule.compare).val().trim() != ""||arg==true) {
                                layertips2 = common.layer.tips($(compareErrorMessagePlace), curRule.errorMessage, 2, 0, true);
                            }                             
                            //}
                            return;
                        }
                        break;
                    case "remote": 
                    	var thisobj= $(this);
                    	var isP=true;
                        $.ajax({
                            url: curRule.remoteUrl,
                            data: $.extend({ date: new Date().getTime().toString() }, curRule.data),
                            type: curRule.method == null || curRule.method == "" ? "GET" : curRule.method,
                            async: false,
                            dataType: 'json',
                            success: function (data) {                             	
                                if (data.status != 200) {                                	
                                    var errorMessage;
                                    if (data.errorMessage != null) {
                                        errorMessage = data.errorMessage;
                                    } else {
                                        errorMessage = curRule.errorMessage;
                                    }

                                    $(thisobj).attr("data-validated", false).attr("data-msg", errorMessage);
                                    layertips = common.layer.tips($(errorMessagePlace), errorMessage,2, 0, true);                                  
                                    isP=false;
                                }
                              
                            }, error: function (data, textStatus, error) {
                                $(thisobj).attr("data-validated", false).attr("data-msg", curRule.errorMessage);
                                layertips = common.layer.tips($(errorMessagePlace), curRule.errorMessage, 2, 0, true);
                                isP=false;
                            }
                        });
                        if(!isP)
                        	return;
                        break;
                    default:
                        break;
                }
            }
            if (layertips != null) {
                layer.close(layertips);
            }
            $(this).attr("data-validated", true).attr("data-msg", "");
        	
            return;
        });

        if (rule.compare != null) {
            $(rule.compare.compare).bind(event, function () {
                if (layertips2 != null) {
                    layer.close(layertips2);
                }
                var place1 = rule.compare.errorMessagePlace;
                if ($thisObj.val().trim() != $(this).val().trim()) {
                    $thisObj.attr("data-validated", false).attr("data-msg", rule.compare.errorMessage);
                    layertips2 = common.layer.tips($(place1), rule.compare.errorMessage, 2, 0, true);
                    return;
                } else {
                    $thisObj.attr("data-validated", true).attr("data-msg", "");
                    return;
                }
            });
        }
        var isPass = true;
        for (var p in rule) {
            if (rule[p] == null) {
                continue;
            }
            var curRule = rule[p];
            switch (p) {
                case "required":
                    if ($(this).val().trim() == "") {
                        $(this).attr("data-validated", false).attr("data-msg", curRule.errorMessage);
                        var isPass = true;
                    }
                    break;
                case "maxLength":
                    if ($(this).val().trim().length > curRule.maxLength) {
                        $(this).attr("data-validated", false).attr("data-msg", curRule.errorMessage);
                        var isPass = true;
                    }
                    break;
                case "minLength":
                    if ($(this).val().trim().length < curRule.minLength) {
                        $(this).attr("data-validated", false).attr("data-msg", curRule.errorMessage);
                        var isPass = true;
                    }
                    break;
                case "maxValue":
                    if (!isNaN($(this).val().trim()) && Number($(this).val().trim()) > curRule.maxValue) {
                        $(this).attr("data-validated", false).attr("data-msg", curRule.errorMessage);
                        var isPass = true;
                    }
                    break;
                case "minValue":
                    if (!isNaN($(this).val().trim()) && Number($(this).val().trim()) < curRule.minValue) {
                        $(this).attr("data-validated", false).attr("data-msg", curRule.errorMessage);
                        var isPass = true;
                    }
                    break;
                case "regular":
                    var r = curRule.regular.test($(this).val().trim());
                    if (!r) {
                        $(this).attr("data-validated", false).attr("data-msg", curRule.errorMessage);
                        var isPass = true;
                    }
                    break;
                case "compare":
                    if (layertips2 != null) {
                        layer.close(layertips2);
                    }
                    if ($(this).val().trim() != $(curRule.compare).val().trim()) {
                        $(this).attr("data-validated", false).attr("data-msg", curRule.errorMessage);
                        var isPass = true;
                    }
                    break;              
                case "remote":
                    $.ajax({
                        url: curRule.remoteUrl,
                        data: $.extend({ date: new Date().getTime().toString() }, curRule.data),
                        type: curRule.method == null || curRule.method == "" ? "GET" : curRule.method,
                        async: false,
                        dataType: 'json',
                        success: function (data) {
                            if (data.status != 200) {
                                var errorMessage;
                                if (data != null && data.errorMessage != null) {
                                    errorMessage = data.errorMessage;
                                } else {
                                    errorMessage = curRule.errorMessage;
                                }

                                $(this).attr("data-validated", false).attr("data-msg", errorMessage);
                                var isPass = true;
                            }
                        }, error: function (data, textStatus, error) {
                            $(this).attr("data-validated", false).attr("data-msg", curRule.errorMessage);
                            var isPass = true;
                        }
                    });
                    break;
                default:
                    break;
            }
            if (!isPass) {
                break;
            }
        }
        return $(this);
    }
});
/*
*设置图片地址
*   url：图片原地址
*   size：尺寸(_100_100、_60_60、_40_40)
*/
function setImageUrl(url,size) {
    var filePath, fileName, fileExtension;
    if (url != null && url != "") {
        //var photoUrl = data.resultObject.photoUrl
        filePath = url.substring(0, url.lastIndexOf("/"));
        fileName = url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf('.'));
        fileExtension = url.substring(url.lastIndexOf('.') + 1);
    } else {
        filePath = "/images/photoUrl/default",
        fileName = "";
        fileExtension = "jpg"
    }
    return filePath + "/" + fileName + size + "." + fileExtension;
}
//字符串截取
function cutSubstr(str,length){
    if(str.length > length){
        return str.substring(0,length)+"...";
    }else{
        return str;
    }
}
// 去掉字符两端的空白字符
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
};
// 去掉字符右端的空白字符
String.prototype.rightTrim = function () {
    return this.replace(/([\\s]*$)/g, "");
};
// 去掉字符左端的的空白字符
String.prototype.leftTrim = function () {
    return this.replace(/(^[\\s]*)/g, "");
};
// 判断字符串是否以指定的字符串结束
String.prototype.endsWith = function (str) {
    return this.substr(this.length - str.length) == str;
};
// 判断字符串是否以指定的字符串开始
String.prototype.startsWith = function (str) {
    return this.substr(0, str.length) == str;
};
;
Date.prototype.format = function (fmt) {
    /** * 对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
     可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) * eg: * (new
     Date()).pattern("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423      
  * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04      
  * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04      
  * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04      
  * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18      
  */

    var o = {
        "M+": this.getMonth() + 1, //月份         
        "d+": this.getDate(), //日         
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时         
        "H+": this.getHours(), //小时         
        "m+": this.getMinutes(), //分         
        "s+": this.getSeconds(), //秒         
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度         
        "S+": this.getMilliseconds() //毫秒         
    };
    var week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}
;





var common = {
	remoteUpload: "http://172.16.1.250:94",//文件上传
	userCenterUrl:"http://172.16.1.174:9999",
		
    browser: {
        availableHtml5: function () { return window.applicationCache; }
    },
    date: function (dt) {
        return {
            format: function (fmt) {
                return new Date(dt).format(fmt);
            }
        }
    },
    global: {
        header: function (whichPage,isSerach) {
            var headhtml = $.ajax({
                type: "GET",
                url: "/header.html",
                data: { date: new Date().getTime().toString() },
                async: false,
                dataType: "html"
            }).responseText;
            var header = $(headhtml);

            if (whichPage !='' && whichPage != false)
            {
            	//给选中的一级导航栏添加选中样式
            	$(header).find("."+whichPage).addClass('selected-page');
            }
           
            if (isSerach != null && !isSerach) {     
                $(header).find(".head_logo").hide();
                $(header).find(".head_search").remove(); 
            }
          
            return $(header);
        },
        footer: function () {
            var foothtml = $.ajax({
                type: "GET",
                url: "/footer.html",
                data: { date: new Date().getTime().toString() },
                async: false,
                dataType: "html"
            }).responseText;
            return $(foothtml);
        },
        sidebar: function () {
        	var sidebarhtml = $.ajax({
                type: "GET",
                url: "/sidebar.html",
                data: { date: new Date().getTime().toString() },
                async: false,
                dataType: "html"
            }).responseText;
            return $(sidebarhtml);
        },
        userCenterMenu: function (navigate, menu, menu1) {
            var htmlText = $.ajax({
                type: "GET",
                url: "/views/userCenter/ucmenu.html",
                data: { date: new Date().getTime().toString() },
                async: false,
                dataType: "html"
            }).responseText;
            var html = $(htmlText);
            if (navigate == null || navigate == "") {
                navigate = "home";
            }

            navigate = navigate.toLowerCase();
            $(html).find(".menuSidebar[data-id!='" + navigate + "']").remove();
            $(html).find("#navigate_menu li a[data-id='" + navigate + "']").addClass("current");
            if (menu != null && menu != "") {
                $(html).find(".menuSidebar[data-id='" + navigate + "'] li[data-id='" + menu + "']").addClass("active").find("div").show();
                if (menu1 != null && menu1 != "") {
                    $(html).find(".menuSidebar[data-id='" + navigate + "'] li[data-id='" + menu + "'] a[data-id='" + menu1 + "']").addClass("current");
                }
            }
            
            $(html).find(".menuSidebar li span").bind("click", function () {
               // $(".menuSidebar .active div").slideUp();
                $(".menuSidebar .active").removeClass("active");
               // if ($(this).next().is(":hidden")) {
                  //  $(this).next().slideDown();
                    $(this).parent("li").addClass("active")
                //}
            });
            //alert($("body").html());
            $(html).find("#main_content").append($("body").children().show());
            $("body").html($(html));           
            $("body").prepend(common.global.header(false)).append(common.global.footer()).append(common.global.sidebar());


        },
        login: function (callback) {
            return layer.open({
                type: 2,
                closeBtn: 1,
                title: false,
                skin: 'layui-layer-rim',
                shade: [0.5, '#000', true],
                border: [6, 0.3, '#000000', true],
                area: ['330px', '400px'],
                offest: ($(window).height() - 400) / 2 + 'px',
                content: "/loginbox.html?" + (callback != null || callback == "" ? "cb=" + callback + "&" : "") + "date=" + new Date().getTime()
            });
        }
    },
    request: {
        url: function () {
            return window.location
        },
        getParam: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape( r[2]);
            }
            else{
                return null;
            }
        }
    },
    mapImage: function (path,fileName,big) {
    	if(big==true){
    		return path + fileName + "/1_1.jpg";
    	}else{
    		return path + fileName + "/1_2.jpg";
    	}
    },
    mapVideo: function (path, fileName) {
        return path + fileName + "/1/xml/index.xml";
    },
    layer: {

        //tips框，obj:jquery元素,msg:消息内容，operation:1上，2右(默认)，3下，4左，time:显示时间默认5000毫秒,0为不关闭，tipsMore 是否能显示多个
        tips: function (obj, msg, operation, time, tipsMore) {

            return layer.tips(msg, obj, {
                tips: [operation, '#FF4040'],
                time: time == null ? 5000 : Number(time),
                tipsMore: true
            });
        },
        msg: function (msg, time) {

            if (time == null || isNaN(time) && Number(time) < 0) {
                time = 2000;
            } else {
                time = Number(time);
            }
            return layer.msg(msg, { time: time });
        },
        confirm: function (msg, callback, cancelcallback) {
            return layer.confirm(msg,
                {
                    icon: 3,
                    shadeClose: true,
                    skin: 'layui-layer-rim',
                    shade: [0.5, '#000', true],
                    border: [6, 0.3, '#000000', true],
                    scrollbar: false
                }, function (index) {
                    if (callback != null && typeof (callback) === "function") {
                        callback();
                    }
                    layer.close(index);
                }, function (index) {
                    if (cancelcallback != null && typeof (cancelcallback) === "function") {
                        cancelcallback();
                    }
                });
        },
        alert: function (msg, callback) {
            return layer.alert(msg,
                 {
                     icon: 0,
                     skin: 'layui-layer-rim',
                     shade: [0.5, '#000', true],
                     border: [6, 0.3, '#000000', true],
                     scrollbar: false
                 }, function (index) {
                     if (callback != null && typeof (callback) === "function") {
                         callback();
                     }
                     layer.close(index);
                 });
        },
        success: function (msg, callback) {
            return layer.alert(msg,
                    {
                        icon: 1,
                        skin: 'layui-layer-rim',
                        shade: [0.5, '#000', true],
                        border: [6, 0.3, '#000000', true],
                        scrollbar: false
                    }, function (index) {
                        if (callback != null && typeof (callback) === "function") {
                            callback();
                        }
                        layer.close(index);
                    });
        },
        fail: function (msg, callback) {
            return layer.alert(msg,
                  {
                      icon: 2,
                      skin: 'layui-layer-rim',
                      shade: [0.5, '#000', true],
                      border: [6, 0.3, '#000000', true],
                      scrollbar: false
                  }, function (index) {
                      if (callback != null && typeof (callback) === "function") {
                          callback();
                      }
                      layer.close(index);
                  });
        },
        open: function (url, title, width, height, cancelcallback) {
            if (width == null || width == "" || isNaN(width) || Number(width) <= 0) {
                width = 480;
            }
            if (height == null || height == "" || isNaN(height) || Number(height) <= 0) {
                height = 270;
            }


            return layer.open({
                type: 2,
                closeBtn: 1,
                title: title == null || title == "" ? false : title,
                skin: 'layui-layer-rim',
                shade: [0.5, '#000', true],
                border: [6, 0.3, '#000000', true],
                area: [width + "px", height + "px"],
                //offset: (($(window).height() < height ? height + 40 : $(window).height()) - height) / 2 + 'px',
                //maxmin: true,
                content: url,
                cancel: function (index) {
                    if (cancelcallback != null && typeof (cancelcallback) === "function") {
                        cancelcallback();
                    }
                }
            });
        },
        show: function (content, title, width, height, cancelcallback) {
            if (width == null || width == "" || isNaN(width) || Number(width) <= 0) {
                width = 480;
            }
            if (height == null || height == "" || isNaN(height) || Number(height) <= 0) {
                height = 270;
            }
            //页面层
            return layer.open({
                type: 1,
                closeBtn: 1,
                title: title == null || title == "" ? false : title,
                skin: 'layui-layer-rim', //加上边框
                area: [width + "px", height + "px"],//宽高
                border: [6, 0.3, '#000000', true],
                //offset: (($(window).height() < height ? height + 40 : $(window).height()) - height) / 2 + 'px',
                content: content,
                cancel: function (index) {
                    if (cancelcallback != null && typeof (cancelcallback) === "function") {
                        cancelcallback();
                    }
                }
            });
        }
    },
    ckplayer: {
        mp4: function (id, videoUrl, imageUrl, width, height) {
            if (imageUrl == null || imageUrl == "" || typeof (imageUrl) !== "string") {
                //默认图片
                imageUrl = "/";
            }
            if (width == null || width == "" || isNaN(width) || Number(width) <= 0) {
                width = 480;
            }
            if (height == null || height == "" || isNaN(height) || Number(height) <= 0) {
                height = 270;
            }


            var flashvars = {
                f: videoUrl,
                i: imageUrl,
                s: 2,
                c: 0
            };
            var params = { bgcolor: '#FFF', allowFullScreen: true, allowScriptAccess: 'always', wmode: 'transparent' };
            var video = [videoUrl + '->video/mp4'];
            CKobject.embed('/js/tools/ckplayer6.7/ckplayer/ckplayer.swf', id, 'ckplayer_' + id, "100%", "100%", false, flashvars, video, params);
        }
    },
    ueditor: function (id, simpleMode,fixHeight,pastePlain,maxWords) {
    	//固定高度
    	var fixHeightval = false ;
    	var pastePlainval = false ;
    	if(fixHeight == undefined){
    		fixHeightval = false;
    	}else if( fixHeight == true){
    		fixHeightval = true;
    	}
    	//复制是否带有格式
    	if(pastePlain == undefined){
    		pastePlainval = false;
    	}else if(pastePlain == true){
    		pastePlainval = true;
    	}
    	//最大字数限制
    	if(isNaN(maxWords)){
    		maxWords = 500;
    	}
        var ue;
        if (simpleMode != "simplest" && simpleMode) {
            ue = UE.getEditor(id, {
                enableAutoSave: false,
                pasteplain: pastePlainval,
                scaleEnabled: fixHeightval,
                saveInterval: 5000000,
                elementPathEnabled: false,
                toolbarTopOffset:150,
                maximumWords: maxWords,
                initialFrameHeight: 150,
                wordCountMsg: "您还可以输入{#leave} 个字符",
                wordOverFlowMsg: '<span style="color:red;">字符个数已经超出最大允许值</span>',
                zIndex:99,
                toolbars: [[
                   // 'indent', //首行缩进
                    'bold', //加粗
                    'italic', //斜体
                    'underline', //下划线
                    //'fontborder', //字符边框
                    //'strikethrough', //删除线
                    //'subscript', //下标
                    //'superscript', //上标
                    '|',
                     'justifyleft', //居左对齐
                    'justifyright', //居右对齐
                    'justifycenter', //居中对齐
                    //'justifyjustify', //两端对齐
                   // 'forecolor', //字体颜色
                    //'backcolor', //背景色
                   // '|',
                    //'fontfamily', //字体
                    //'fontsize', //字号
                    //'paragraph', //段落格式
                    '|',
                    //'link', //超链接
                    'emotion', //表情
                    'scrawl',//涂鸦
                    'simpleupload', //单图上传
                    //'insertimage', //多图上传
                   // 'insertvideo', //视频
                    //'attachment', //附件
                   // 'map', //Baidu地图
                   // 'searchreplace', //查询替换
                   // 'horizontal', //分隔线
                   // 'fullscreen', //全屏
                   ""
                ]]
            });
        }else if(simpleMode == "simplest"){
        	ue = UE.getEditor(id, {
                enableAutoSave: false,
                pasteplain: pastePlainval,
                scaleEnabled: fixHeightval,
                saveInterval: 5000000,
                elementPathEnabled: false,
                maximumWords: maxWords,
                initialFrameHeight: 150,
                wordCountMsg: "您还可以输入{#leave} 个字符",
                wordOverFlowMsg: '<span style="color:red;">字符个数已经超出最大允许值</span>',
                zIndex:99,
                toolbars: [[
                   // 'indent', //首行缩进
                    'bold', //加粗
                    'italic', //斜体
                    'underline', //下划线
                    //'fontborder', //字符边框
                    //'strikethrough', //删除线
                    //'subscript', //下标
                    //'superscript', //上标
                    '|',
                     'justifyleft', //居左对齐
                    'justifyright', //居右对齐
                    'justifycenter', //居中对齐
                    //'justifyjustify', //两端对齐
                   // 'forecolor', //字体颜色
                    //'backcolor', //背景色
                   // '|',
                    //'fontfamily', //字体
                    //'fontsize', //字号
                    //'paragraph', //段落格式
                    '|',
                    //'link', //超链接
                    //'emotion', //表情
                   // 'scrawl',//涂鸦
                    'simpleupload', //单图上传
                    //'insertimage', //多图上传
                   // 'insertvideo', //视频
                    //'attachment', //附件
                   // 'map', //Baidu地图
                   // 'searchreplace', //查询替换
                   // 'horizontal', //分隔线
                   // 'fullscreen', //全屏
                   ""
                ]]
            });
        } else {
            ue = UE.getEditor(id, {
                enableAutoSave: false,
                saveInterval: 5000000,
                pasteplain: pastePlainval,
                scaleEnabled: fixHeightval,
                elementPathEnabled: false,
                toolbars: [[
                    'indent', //首行缩进
                    'bold', //加粗
                    'italic', //斜体
                    'underline', //下划线
                    'fontborder', //字符边框
                    'strikethrough', //删除线
                    'subscript', //下标
                    'superscript', //上标
                    '|',
                     'justifyleft', //居左对齐
                    'justifyright', //居右对齐
                    'justifycenter', //居中对齐
                    'justifyjustify', //两端对齐
                    'forecolor', //字体颜色
                    'backcolor', //背景色
                    '|',
                    'fontfamily', //字体
                    'fontsize', //字号
                    'paragraph', //段落格式
                    '|',
                    'link', //超链接
                    'inserttable', //插入表格
                    'deletetable', //删除表格
                    'emotion', //表情
                    'scrawl',//涂鸦
                    'simpleupload', //单图上传
                    //'insertimage', //多图上传
                    //'insertvideo', //视频
                    'attachment', //附件
                    //'map', //Baidu地图
                    'searchreplace', //查询替换
                    'horizontal', //分隔线
                    'fullscreen' //全屏
                ]]
            });
        }

        return ue;
    },
    uploadify: {
        _fileType: {
            image: { limit: "2MB", exts: "*.bmp;*.jpg;*.jpeg;*.png;*.gif;*.tiff;", desc: "Image Files" },
            video: { limit: "1GB", exts: "*.swf;*.flv;*.mp3;*.mp4;*.wav;*.wma;*.wmv;*.mid;*.avi;*.mpg;*.asf;*.rm;*.rmvb;*.mov;", desc: "Video Files" },
            office: { limit: "50MB", exts: "*.doc;*.docx;*.xls;*.xlsx;*.ppt;*.pptx;*.pdf;", desc: "Office Files" },
            other: { limit: "1GB", exts: "*.htm;*.html;*.txt;*.zip;*.rar;*.gz;*.bz2;*.iso;", desc: "Other Files" }
        },
        _onSelectError: function (file, errorCode, errorMsg) {
            var msgText = "上传失败:";
            switch (errorCode) {
                case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
                    //this.queueData.errorMsg = "每次最多上传 " + this.settings.queueSizeLimit + "个文件";  
                    msgText += "每次最多上传 " + this.settings.queueSizeLimit + "个文件";
                    break;
                case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
                    msgText += "文件大小超过限制( " + this.settings.fileSizeLimit + " )";
                    break;
                case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
                    msgText += "文件大小为0";
                    break;
                case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
                    msgText += "文件格式不正确，仅限 " + this.settings.fileTypeExts;
                    break;
                default:
                    msgText += "错误代码：" + errorCode + "\n" + errorMsg;
            }
            common.layer.fail(msgText);
        },
        _onUploadError: function (file, errorCode, errorMsg, errorString) {
            // 手工取消不弹出提示  
            if (errorCode == SWFUpload.UPLOAD_ERROR.FILE_CANCELLED
                    || errorCode == SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED) {
                return;
            }
            var msgText = "上传失败\n";
            switch (errorCode) {
                case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
                    msgText += "HTTP 错误\n" + errorMsg;
                    break;
                case SWFUpload.UPLOAD_ERROR.MISSING_UPLOAD_URL:
                    msgText += "上传文件丢失，请重新上传";
                    break;
                case SWFUpload.UPLOAD_ERROR.IO_ERROR:
                    msgText += "IO错误";
                    break;
                case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
                    msgText += "安全性错误\n" + errorMsg;
                    break;
                case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
                    msgText += "每次最多上传 " + this.settings.uploadLimit + "个";
                    break;
                case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
                    msgText += errorMsg;
                    break;
                case SWFUpload.UPLOAD_ERROR.SPECIFIED_FILE_ID_NOT_FOUND:
                    msgText += "找不到指定文件，请重新操作";
                    break;
                case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
                    msgText += "参数错误";
                    break;
                default:
                    msgText += "文件:" + file.name + "\n错误码:" + errorCode + "\n"
                            + errorMsg + "\n" + errorString;
            }
            common.layer.fail(msgText);
        },
        upload: function (obj, handleUrl, params, callback) {
            $(obj).uploadify({
                multi: true,
                auto: true,
                height: 30,
                width: 120,
                queueSizeLimit: 999,
                formData: params,
                buttonText: '选 择 附 件',
                swf: '/js/tools/uploadify/uploadify.swf',
                uploader: handleUrl,
                fileSizeLimit: "1GB",
                fileTypeExts: "*.*",
                fileTypeDesc: "All Files",
                overrideEvents: ['onDialogClose', 'onUploadSuccess', 'onUploadError', 'onSelectError'],
                onSelectError: this._onSelectError,
                onUploadError: this._onUploadError,
                onUploadSuccess: function (file, data, response) {
                    if (response == true) {
                        if (typeof (data) !== "object" && typeof (data) == "string") {
                            data = eval("(" + data + ")");
                        }
                        callback(file, data);
                    }
                }
            });
        },
        uploadImage: function (obj, handleUrl, params, callback) {
            $(obj).uploadify({
                multi: false,
                auto: true,
                checkExisting: false,
                height: 30,
                width: 120,
                queueSizeLimit: 1,
                //removeTimeout:1,
                //progressData: 'speed',
                formData: params,
                buttonText: '选 择 图 片',
                swf: '/js/tools/uploadify/uploadify.swf',
                uploader: handleUrl,
                fileSizeLimit: this._fileType.image.limit,
                fileTypeExts: this._fileType.image.exts,
                fileTypeDesc: this._fileType.image.desc,
                overrideEvents: ['onDialogClose', 'onUploadSuccess', 'onUploadError', 'onSelectError'],
                onSelectError: this._onSelectError,
                onUploadError: this._onUploadError,
                onUploadSuccess: function (file, data, response) {
                    if (response == true) {
                        if (typeof (data) !== "object" && typeof (data) == "string") {
                            data = eval("(" + data + ")");
                        }
                        callback(file, data);
                    }
                }
            });
        },
        uploadVideo: function (obj, handleUrl, params, callback) {
            $(obj).uploadify({
                multi: false,
                auto: true,
                height: 30,
                width: 120,
                queueSizeLimit: 1,
                formData: params,
                buttonText: '选 择 视 频',
                swf: '/js/tools/uploadify/uploadify.swf',
                uploader: handleUrl,
                fileSizeLimit: this._fileType.video.limit,
                fileTypeExts: this._fileType.video.exts,
                fileTypeDesc: this._fileType.video.desc,
                overrideEvents: ['onDialogClose', 'onUploadSuccess', 'onUploadError', 'onSelectError'],
                onSelectError: this._onSelectError,
                onUploadError: this._onUploadError,
                onUploadSuccess: function (file, data, response) {
                    if (response == true) {
                        if (typeof (data) !== "object" && typeof (data) == "string") {
                            data = eval("(" + data + ")");
                        }
                        callback(file, data);
                    }
                }
            });
        },
        uploadOffice: function (obj, handleUrl, params, callback) {
            $(obj).uploadify({
                multi: false,
                auto: true,
                height: 30,
                width: 120,
                queueSizeLimit: 1,
                formData: params,
                buttonText: '选 择 文 档',
                swf: '/js/tools/uploadify/uploadify.swf',
                uploader: handleUrl,
                fileSizeLimit: this._fileType.office.limit,
                fileTypeExts: this._fileType.office.exts,
                fileTypeDesc: this._fileType.office.desc,
                overrideEvents: ['onDialogClose', 'onUploadSuccess', 'onUploadError', 'onSelectError'],
                onSelectError: this._onSelectError,
                onUploadError: this._onUploadError,
                onUploadSuccess: function (file, data, response) {
                    if (response == true) {
                        if (typeof (data) !== "object" && typeof (data) == "string") {
                            data = eval("(" + data + ")");
                        }
                        callback(file, data);
                    }
                }
            });
        }
    },
    jcrop: function (obj, aspectRatio, showObj) {
        var jcrop_api,
           boundx,
           boundy,
           preview = false,
           ie7 = false;

      
        //$(obj).css({ "width": "auto", "height": "auto" });
        if (typeof (showObj) === "object") {
            $(showObj).css({ "display": "block", overflow: "hidden" }).html('<img src="' + $(obj).attr("src") + '" alt="Preview" />');
            preview = true;
        }

        if (navigator.appName == "Microsoft Internet Explorer") {
            if (document.documentMode < 8 || navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE7.0" || navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE6.0") {
                ie7 = true;
            }
        }
      

        $(obj).Jcrop({
            onChange: updatePreview,
            onSelect: updatePreview,
            keySupport: !ie7,
            bgColor: "#fff",
            shadeColor: "#000",
            bgOpacity: 0.3,
            aspectRatio: aspectRatio,
            onRelease: function () { }
        }, function () {
        
            var bounds = this.getBounds();
            boundx = bounds[0];
            boundy = bounds[1];
            jcrop_api = this;
            jcrop_api.animateTo([0, 0, 1000, 1000]);
           
        });


        function updatePreview(c) {
            if (parseInt(c.w) > 0) {
                if (preview) {
                    $(showObj).each(function (i) {
                        var rx = $(this).width() / c.w;
                        var ry = $(this).height() / c.h;
                        $(this).find("img").css({
                            width: Math.round(rx * boundx) + 'px',
                            height: Math.round(ry * boundy) + 'px',
                            marginLeft: '-' + Math.round(rx * c.x) + 'px',
                            marginTop: '-' + Math.round(ry * c.y) + 'px'
                        });
                    });
                }
            }
        };
        
        return function () { return jcrop_api; };
    },
    /*
     *设置图片地址
     *   url：图片原地址
     *   size：尺寸(_100_100、_80_80、_50_50)
     */
     photo: function (url,size) {
         var filePath, fileName, fileExtension;
         if (url != null && url != "") {
            
             filePath = url.substring(0, url.lastIndexOf("/"));
             fileName = url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf('.'));
             fileExtension = url.substring(url.lastIndexOf('.') + 1);
         } else {
             filePath = "/images/default/photo",
             fileName = "";
             fileExtension = "jpg"
         }
         return filePath + "/" + fileName + size + "." + fileExtension;
     },
    uploadFile:function(id, events, params) {
       
        var plupload_params = {
            browse_button: id,
            url: '/upload/commonUploadFile/upload',
            multipart_params: {},
            flash_swf_url: "/tools/plupload/js/Moxie.swf",
            runtimes: "html5,flash,silverlight,html4",
            multi_selection: true,
            unique_names: true,
            chunk_size: "10MB",                
            filters: {
                mime_types: [
						{
						    title: "All Files",
						    extensions: "docx,doc,ppt,pptx,xls,xlsx,wps,et,dps,pdf,txt,jpg,jpeg,gif,png,bmp,tif,swf,flv,mp3,mp4,wav,wma,wmv,mid,avi,mpg,asf,rm,rmvb,mov,zip,rar,7z"
						}],
                max_file_size: "1GB",
                prevent_duplicates: true
            }
        }
       

        if (typeof (params) !== "undefined" && params != null) {
            if (typeof (params.file_type) !== "undefined" && params.file_type != null) {
                switch (params.file_type) {
                    case "image":
                        plupload_params.filters.mime_types[0].title = "Image Files";
                        plupload_params.filters.mime_types[0].extensions = "jpg,jpeg,gif,png,bmp,tif";
                        plupload_params.filters.max_file_size = "2MB";
                        break;
                    case "video":
                        plupload_params.filters.mime_types[0].title = "Video Files";
                        plupload_params.filters.mime_types[0].extensions = "swf,flv,mp3,mp4,wav,wma,wmv,mid,avi,mpg,asf,rm,rmvb,mov";
                        plupload_params.filters.max_file_size = "1GB";
                        break;
                    case "office":
                        plupload_params.filters.mime_types[0].title = "Office Files";
                        plupload_params.filters.mime_types[0].extensions = "docx,doc,ppt,pptx,xls,xlsx,wps,et,dps,pdf,txt,html";
                        plupload_params.filters.max_file_size = "200MB";
                        break;
                    default:
                        break;
                }
            }
            if (typeof (params.url) !== "undefined" && params.url != null && params.url != "") {                  
                plupload_params.url = params.url;
            }
            if (typeof (params.multipart_params) !== "undefined" && params.multipart_params != null) {
                plupload_params.multipart_params = params.multipart_params;
            }
            if (typeof (params.multi_selection) !== "undefined" && params.multi_selection == false) {
                plupload_params.multi_selection = false;
            }
            if (typeof (params.chunk_size) !== "undefined" && params.chunk_size != null && params.chunk_size!="") {
                plupload_params.chunk_size = params.chunk_size;
            }
           
            if (typeof (params.extensions) !== "undefined" && params.extensions != null && params.extensions != "") {
                plupload_params.filters.mime_types[0].extensions = params.extensions;
            }
            if (typeof (params.max_file_size) !== "undefined" && params.max_file_size != null && params.max_file_size != "") {
                plupload_params.filters.mime_types[0].max_file_size = params.max_file_size;
            }
        }
       
        //实例化一个plupload上传对象
        var up = new plupload.Uploader(plupload_params);
      
        //初始化上传控件
        up.init();
        
        up.bind("Init",function(uploader){
        	 if (typeof (events) !== "undefined" && typeof (events.FilesAdded) != "undefined") {
        		 events.Init(uploader);
             }
        });
        
        //错误异常
        up.bind('Error', function (uploader, error) {
            var message;             
            switch (uploader.settings.filters.mime_types[0].title) {
                case "Image Files":
                    message = "图片";
                    break;
                case "Video Files":
                    message = "视频";
                    break;
                case "Office Files":
                    message = "文档";
                    break;
                default:
                    message = "文件";
                    break;

            }
            switch (error.code) {
                case -600:
                    message = message+"大小限制为" + uploader.settings.filters.max_file_size;
                    break;
                case -601:
                    message = message + "上传格式有误";
                    break;
                case -602:
                    message = error.file.name + "已上传，请勿重复操作";
                    break;
                default:
                    message = message + "上传失败";
                    break;
            }
            up.removeFile(error.file);
            if (typeof (events) !== "undefined" && typeof (events.Error) != "undefined") {
                events.Error(uploader, error.file, message);
            }
        });

        up.bind("BeforeUpload", function (uploader, file) {
            var multipart_params = up.settings.multipart_params
            multipart_params = $.extend(multipart_params, {
                "UniqueCode": file.id,
                "date": new Date().getTime().toString()
            });
            multipart_params["userToken"] = params.userToken;
            
            up.setOption("multipart_params", multipart_params);

            if (typeof (events) !== "undefined" && typeof (events.BeforeUpload) != "undefined") {
                events.BeforeUpload(uploader, file);
            }
        });

        up.bind('FilesAdded', function (uploader, files) {
            if (typeof (events) !== "undefined" && typeof (events.FilesAdded) != "undefined") {
                events.FilesAdded(uploader, files);
            }
        });

        up.bind('FilesRemoved', function (uploader, files) {
            if (typeof (events) !== "undefined" && typeof (events.FilesRemoved) != "undefined") {
                events.FilesRemoved(uploader, files);
            }
        });

        up.bind('FileUploaded', function (uploader, file, responseObject) {
          
        	if (typeof (events) !== "undefined" && typeof (events.FileUploaded) != "undefined") {
                events.FileUploaded(uploader, file, responseObject);
            }
        	
        });
        up.bind('UploadProgress', function (uploader, file) {
            if (typeof (events) !== "undefined" && typeof (events.UploadProgress) != "undefined") {
                if (file.percent != 100) {
                    events.UploadProgress(uploader, file);
                }
            }
        });
        //分片上传事件
        up.bind('ChunkUploaded', function (uploader, file, responseObject) {
            if (typeof (events) !== "undefined" && typeof (events.ChunkUploaded) != "undefined") {
                events.ChunkUploaded(uploader, file, responseObject);
            }
        });
        up.bind('UploadComplete', function (uploader, file) {
            if (typeof (events) !== "undefined" && typeof (events.UploadComplete) != "undefined") {
                events.UploadComplete(uploader, file);
            }
        });
    }


};


/*
获取url
*/
function getUrlPara(paraName) {
	var sUrl = location.href;
	var sReg = "(?:\\?|&){1}" + paraName + "=([^&]*)"
	var re = new RegExp(sReg, "gi");
	re.exec(sUrl);
	return RegExp.$1.split("#")[0];
}
/** 
 * 合并两个json对象属性为一个对象 
 * @param jsonbject1 
 * @param jsonbject2 
 * @returns resultJsonObject 
 */
function mergeJsonObject(jsonbject1, jsonbject2) {
	var resultJsonObject = {};
	for ( var attr in jsonbject1) {
		resultJsonObject[attr] = jsonbject1[attr];
	}
	for ( var attr in jsonbject2) {
		resultJsonObject[attr] = jsonbject2[attr];
	}


	return resultJsonObject;
};

/**
 * 解析时间
 */
function datetimeFormatter(dateStr) {
	if (dateStr == undefined || dateStr == '') {
		return '';
	}
	var date = new Date(dateStr);
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	var d = date.getDate();
	return String.format('{0}-{1}-{2} ', date.getFullYear(),
			date.getMonth() + 1, date.getDate());
}
