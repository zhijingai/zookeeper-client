var config = require('../config');
var roleDAO = require('../dao/roleDAO');
var validator = require('validator');
var async = require('async');
var eventproxy = require('eventproxy');
var ResponseObject = require('../middlewares/ResponseObject');
var Page=require('../middlewares/Page');
var commonUtil = require('../common/commonUtil');
var tools = require('../common/tools');
var fs = require('fs');

//角色分页
exports.getRoleList = function (req, res, next) {
    var proxy = new eventproxy();
    proxy.fail(next);

    roleDAO.getRoleList(next, proxy.done(function (data) {
        return res.json(Page(data, 1, 1, 10));
    }));
};

//保存角色资源
exports.insertRoleResc = function (req, res, next) {
    var proxy = new eventproxy();
    proxy.fail(next);

    var roleId=req.body.roleId;
    var rescIds=req.body.rescIds

    if(roleId!=''){
        roleDAO.delRoleResc(next,roleId, proxy.done(function () {
            roleDAO.insertRoleResc(next,roleId,rescIds, proxy.done(function (data) {
                return res.json(ResponseObject.ro(ResponseObject.status_200, data, null));
            }));
        }));
    }else{
        return res.json(ResponseObject.ro(ResponseObject.status_512, null, '请检查网络后重试'));
    }
};
