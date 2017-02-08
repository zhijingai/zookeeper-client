var validator = require('validator');

function ResponseObject(status,resultObject,errorMessage) {
    var ro = {};
    if(status == null){
        ro.status = 200;
    }else{
        ro.status = status;
    }

    if(errorMessage != null){
        ro.errorMessage = errorMessage;
    }

    if(resultObject != null){
        ro.resultObject = resultObject;
    }
    return ro;
}

module.exports = {
    ro: ResponseObject,
    status_400: 400,    //业务异常
    status_511: 511,	//业务错误-未登录
    status_512: 512,	//业务错误-校验失败
    status_512: 513,	//业务错误-手机短信验证码发送失败
    status_200: 200	//正常请求
}