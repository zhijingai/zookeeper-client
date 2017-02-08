var pool = require('./sqlPool');
var eventproxy = require('eventproxy');

exports.login = function (next, user, callback) {

    var proxy = new eventproxy();
    proxy.fail(next);
    pool.query('select id, username from user where username = ?  and password = ? limit 1 ', user, proxy.done(function (results) {
        callback(null, results);
    }));
};

exports.getCountByTelePhone = function(next, telephone, callback){
    var proxy = new eventproxy();
    proxy.fail(next);
    pool.query('select count(1) count from user where telephone = ?', telephone, proxy.done(function (results) {
        callback(null, results);
    }));
}

exports.findByEmail = function (next, email, callback) {
    var proxy = new eventproxy();
    proxy.fail(next);
    pool.query('select count(1) count from user where email = ?', email, proxy.done(function (results) {
        callback(null, results);
    }));
}

exports.insert = function (next, user, callback) {
    var proxy = new eventproxy();
    proxy.fail(next);
    pool.query('insert into user(id,username,password,telephone,nickname) values(?,?,?,?,?)', user, proxy.done(function (results) {
        callback(null,results.insertId);
    }));
};
