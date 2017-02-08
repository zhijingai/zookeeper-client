/*
var ldap = require('ldapjs');
var config = require('../config');
var eventproxy = require('eventproxy');
var validator = require('validator');

var client = ldap.createClient({
    url: config.ldap_url
});

client.bind(config.ldap_baseDC, config.ldap_password, function (err, res1) {
});

var addEntity = function (next, entity, callback) {
    var proxy = new eventproxy();
    proxy.fail(next);

    client.add('uid=' + entity.uid + ',' + config.ldap_user_dn, entity, proxy.done(function (results) {
        var errorMessage = validator.trim(results.errorMessage);
        if (errorMessage.length > 0) {
            console.log(err);
            next(err);
        }
        callback(null, 1);
    }));
}

module.exports = {
    addEntity: addEntity
}*/
