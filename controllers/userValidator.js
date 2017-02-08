var validator = require('validator');
var eventproxy = require('eventproxy');
var ResponseObject = require('../middlewares/ResponseObject');

// 登录校验
exports.uloginValidate = function (req, res, next) {
    var username = validator.trim(req.body.username);
    var password = validator.trim(req.body.password);
/*    var verificationCode = req.body.verificationCode;*/

    var proxy = new eventproxy();
    proxy.fail(next);

    proxy.on('loginValidate_err', function (msg) {
        return res.render("login");
    });

    // 验证信息的正确性
    if ([username, password].some(function (item) {
            return item === '';
        })) {
        proxy.emit('loginValidate_err', '用户名或密码不能为空。');
        return;
    }
    // 验证码校验
    next();
}

// 校验手机验证码
function checkTelephoneCode(telephoneCode, next) {
    var proxy = new eventproxy();
    proxy.fail(next);

    // 调用java服务，通过socket发送验证码
    return true;
}

// 注册校验
exports.registerUserValidate = function (req, res, next) {
    var telephone = validator.trim(req.body.telephone);
    var password = validator.trim(req.body.password);
    var telephoneCode = req.body.telephoneCode;

    var proxy = new eventproxy();
    proxy.fail(next);

    proxy.on('loginValidate_err', function (msg) {
        return res.json(ResponseObject.ro(ResponseObject.status_512, null, msg));
    });

    if ([telephone, password, telephoneCode].some(function (item) {
            return item === '';
        })) {
        proxy.emit('loginValidate_err', '用户名或密码不能为空。');
        return;
    }

    // 校验手机验证码
    next();
}