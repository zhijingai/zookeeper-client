var config = require('../config');
var userDAO = require('../dao/userDAO');
var eventproxy = require('eventproxy');

// 存储cookie信息
var set_cookie_object = function gen_session(res, cookieObj) {
    var auth_token = cookieObj + '$$$$'; // 以后可能会存储更多信息，用 $$$$ 来分隔
    var opts = {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 30,
        signed: true,
        httpOnly: true
    };
    res.cookie(config.auth_cookie_name, auth_token, opts); //cookie 有效期30天
}

// 获取cookie存储信息
var get_cookie_object = function (req, res, cookieName, index) {
    var auth_token = req.signedCookies[cookieName];
    if (auth_token) {
        var auth = auth_token.split('$$$$');
        var obj = auth[index];
        if (obj) {
            return obj;
        }
    }
    return null;
}

// 验证用户是否登录
var authUser = function (req, res, next) {
    var ep = new eventproxy();
    ep.fail(next);

    if (!req.session || !req.session.user) {
        // 读取cookie用户信息进行登录
        var userId = get_cookie_object(req, res, config.auth_cookie_name, 0);
        if (userId) {
            var proxy = new eventproxy();
            proxy.fail(next);
            // session user
            // 查询
            userDAO.getById(next, userId, proxy.done(function (data) {
                proxy.emit('getById', data);
            }));

            proxy.all('getById', function (data) {
                if (data.length > 0) {
                    req.session.user = data[0];
                    next();
                }
            });
        }else{
            next();
        }
    }
}

/**
 * 需要登录
 */
var userRequired = function (req, res, next) {

    if (!req.session || !req.session.user) {

        // 读取cookie用户信息进行登录
        var userId = get_cookie_object(req, res, config.auth_cookie_name, 0);
        if (userId) {
            var proxy = new eventproxy();
            proxy.fail(next);
            // session user
            // 查询
            userDAO.getById(next, userId, proxy.done(function (data) {
                proxy.emit('getById', data);
            }));

            proxy.all('getById', function (data) {
                if (data.length > 0) {
                    req.session.user = data[0];
                    next();
                } else {
                    return res.status(403).send('forbidden!');
                }
            });
        } else {
            return res.status(403).send('forbidden!');
        }
    } else {
        next();
    }

};

// 用户被管理员屏蔽
var blockUser = function () {
    return function (req, res, next) {
        // 退出
        if (req.path === '/signout') {
            return next();
        }

        if (req.session.user && req.session.user.is_block && req.method !== 'GET') {
            return res.status(403).send('您已被管理员屏蔽了。有疑问请联系 @alsotang。');
        }
        next();
    };
};

module.exports = {
    set_cookie_object: set_cookie_object,
    get_cookie_object: get_cookie_object,
    userRequired: userRequired,
    authUser: authUser,
    blockUser: blockUser
}

