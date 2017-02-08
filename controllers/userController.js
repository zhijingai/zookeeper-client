var config = require('../config');
var userDAO = require('../dao/userDAO');
var validator = require('validator');
var async = require('async');
var eventproxy = require('eventproxy');
var authMiddleWare = require('../middlewares/auth');
var ldap = require('../middlewares/ldap');
var ResponseObject = require('../middlewares/ResponseObject');
var commonUtil = require('../common/commonUtil');
var tools = require('../common/tools');
var fs = require('fs');
var busboy = require('connect-busboy');

// 登录
exports.login = function (req, res, next) {
    var proxy = new eventproxy();
    proxy.fail(next);

    var username = validator.trim(req.body.username);
    var password = validator.trim(req.body.password);

    // 密码加密
    password = tools.hashDigest(password);
    var user = [username, password];
    userDAO.login(next, user, proxy.done(function (data) {
        if (data.length > 0) {
            // cookie 存储用户id
            //authMiddleWare.set_cookie_object(res, data[0].id);
            // session user
            req.session.user = data[0];
            //return res.json(ResponseObject.ro(ResponseObject.status_200, data[0], null));
            res.render('main');
        }else {
            res.render('login');
        }
    }));
};

// 发送短信
exports.getSMSCode = function (req, res, next) {
    var referer = req.headers['referer'];
    var telephone = validator.trim(req.body.telephone);
    // 发送短信
    var telephoneCode = commonUtil.getTelephoneCode();

    // TODO 调用java服务生成验证码
    req.session[config.session_user_tel_code_key + telephone + referer] = telephoneCode;
    console.log(req.session[config.session_user_tel_code_key + telephone + referer]);
    return res.json(ResponseObject.ro(ResponseObject.status_200, telephoneCode, null));
}

// 注册
exports.registerUser = function (req, res, next) {
    var proxy = new eventproxy();
    proxy.fail(next);

    var telephone = validator.trim(req.body.telephone);
    var password = validator.trim(req.body.password);
    var telephoneCode = req.body.telephoneCode;

    userDAO.getCountByTelePhone(next, telephone, proxy.done(function (data) {
        if (data[0].count === 0) {

            // 新增注册信息
            var uuidRandom = commonUtil.getTimeFormatUUid();
            console.log(uuidRandom);
            var randomNickName = commonUtil.getRandomNickName();
            var user = [uuidRandom, telephone, password, telephone, randomNickName];

            // 串行执行，一个函数数组中的每个函数，每一个函数执行完成之后才能执行下一个函数。
            async.series([
                function (cb) {
                    // ldap操作
                    var entity = {
                        uid: uuidRandom,
                        userPassword: password,
                        cn: telephone,
                        nickName: randomNickName,
                        activationState: 0,
                        telephoneNumber: telephone,
                        status: 1,
                        operate: 1,
                        sn: randomNickName,
                        ou: config.ldap_user_attr_ou,
                        objectClass: config.ldap_user_objectClass_wanTingOrgPerson
                    };
                    ldap.addEntity(next, entity, cb);
                }, function (cb) {
                    userDAO.insert(next, user, cb);
                }
            ], function (err, results) {
                console.log('1.1 err: ', err);
                console.log('1.1 results: ', results);
                if (err != null) {
                    // 只用保存一个成功就ok, 优先ldap，后面定时器从ldap同步到数据库
                }
                return res.json(ResponseObject.ro(ResponseObject.status_200, results, null));
            });
        } else {
            return res.json(ResponseObject.ro(ResponseObject.status_512, null, '手机号码已经被注册'));
        }
    }));
};