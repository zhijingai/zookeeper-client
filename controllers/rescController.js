var config = require('../config');
var rescDAO = require('../dao/rescDAO');
var validator = require('validator');
var async = require('async');
var eventproxy = require('eventproxy');
var ResponseObject = require('../middlewares/ResponseObject');
var Page=require('../middlewares/Page');
var commonUtil = require('../common/commonUtil');
var tools = require('../common/tools');
var fs = require('fs');

// 按角色取资源(初始化左侧菜单)
exports.getRescList = function (req, res, next) {
    var proxy = new eventproxy();
    proxy.fail(next);

    var user = req.session.user;
    var userId = user['id'];

    rescDAO.getRescListByUserRole(next, userId, proxy.done(function (data) {
        if (data.length > 0) {
           //取根路径id
           var rootId = null;
           data.forEach(function (rescView) {
               if (rescView.parentId == null) {
                   rootId = rescView.id;
                   return;
               }
           });
           //父父节点
           var resc=[];
           data.forEach(function(rescView){
               rescView['resc']=[];
               if(rootId===rescView.parentId){
                   rescView['childCount']=0;
                   resc.push(rescView);
               }
           });

            //判断父节点下的子节点
            resc.forEach(function(parentView){
                var rc=[];
                data.forEach(function(rescView){
                   if(rescView.parentId===parentView.id){
                       rc.push(rescView);
                       parentView['childCount']=parentView['childCount']+1;
                   }
                })
                //排序 降序

                //三级节点
                rc.forEach(function(_parentView){
                    if(_parentView['childCount']===null){
                        _parentView['childCount']=0;
                    }
                    var rcs=[];
                    data.forEach(function(rescView){
                        if(rescView.parentId===_parentView.id){
                            rcs.push(rescView);
                            _parentView['childCount']=_parentView['childCount']+1;
                        }
                    });
                    //降序
                    _parentView['resc']=rcs;
                });
                parentView['resc']=rc;
            });

            return res.json(ResponseObject.ro(ResponseObject.status_200, resc, null));
       }
   }));
};

//取全部节点
exports.getAllRescs = function (req, res, next) {
    var proxy = new eventproxy();
    proxy.fail(next);

    rescDAO.getAllRescs(next, proxy.done(function (data) {
        return res.json(ResponseObject.ro(ResponseObject.status_200, data, null));
    }));
};

//根据父节点取得子节点
exports.getRescListByParentId = function (req, res, next) {
    var proxy = new eventproxy();
    proxy.fail(next);

    var parentId = null;
    if(typeof req.query.parentId !== 'undefined'){
        parentId = req.query.parentId;
    }

    rescDAO.getRescListByParentId(next, parentId, proxy.done(function (data) {
        if(data.length>0){
            var ids=[];
            data.forEach(function(rc){
                ids.push(rc['id']);
                rc['childCount']=0;
            });
            rescDAO.getPidByParent(next, ids, proxy.done(function(idsDate){
                data.forEach(function(rc){
                    idsDate.forEach(function(_ids){
                        if(_ids.parentId===rc['id']){
                            rc['childCount']=rc['childCount']+1;
                        }
                    });
                    if(rc['childCount']>0){
                        rc['type']='folder';
                    }else{
                        rc['type']='item';
                    }
                });
                return res.json(ResponseObject.ro(ResponseObject.status_200, data, null));
            }));
        }else{
            return res.json(ResponseObject.ro(ResponseObject.status_200, data, null));
        }
    }));
};

//修改状态
exports.updateRescStatus = function (req, res, next) {
    var proxy = new eventproxy();
    proxy.fail(next);

    var params=[];
    params.push(req.body.status);
    params.push(req.body.id);

    rescDAO.updateRescStatus(next, params,proxy.done(function (data) {
        return res.json(ResponseObject.ro(ResponseObject.status_200, data, null));
    }));
};

//修改信息
exports.updateResc = function (req, res, next) {
    var proxy = new eventproxy();
    proxy.fail(next);

    rescDAO.updateResc(next, req, proxy.done(function (data) {
        return res.json(ResponseObject.ro(ResponseObject.status_200, data, null));
    }));
};

//新增资源
exports.addResc = function (req, res, next) {
    var proxy = new eventproxy();
    proxy.fail(next);

    rescDAO.getItem(next, req.body.parentId, proxy.done(function (resc) {

        var params=[];
        params.push(commonUtil.getTimeFormatUUid());
        params.push(req.body.name);
        params.push(req.body.parentId);
        params.push(req.body.nodeOrder);
        params.push(req.body.url);
        params.push(parseInt(resc['0']['level'])+1);

        rescDAO.addResc(next, params, proxy.done(function (data) {
            return res.json(ResponseObject.ro(ResponseObject.status_200, data, null));
        }));
    }));


};

//取全部资源
exports.selectAllResNodeByRoleId = function (req, res, next) {
    var proxy = new eventproxy();
    proxy.fail(next);

    var roleId =req.query.roleId;

    rescDAO.getAllRescs(next, proxy.done(function (data) {
        if (data.length > 0) {
            rescDAO.getRescByRole(next, roleId, proxy.done(function (roleResc) {
                //判断是否选中
                if(roleResc.length>0){
                    data.forEach(function (rescView) {
                        rescView['checked']='true';
                        //反选
                        rescView['uncheck']='true';
                        roleResc.forEach(function(rv){
                            if(rescView.id===rv.id){
                                rescView['uncheck']='false';
                            }
                        });
                    });
                }

                //父子节点
                //取根路径id
                var rootId = null;
                data.forEach(function (rescView) {
                    if (rescView.parentId == null) {
                        rootId = rescView.id;
                        return;
                    }
                });
                //父父节点
                var resc=[];
                data.forEach(function(rescView){
                    rescView['children']=[];
                    if(rootId===rescView.parentId){
                        rescView['childCount']=0;
                        rescView['text']=rescView.name;
                        resc.push(rescView);
                    }
                });

                //判断父节点下的子节点
                resc.forEach(function(parentView){
                    var rc=[];
                    data.forEach(function(rescView){
                        if(rescView.parentId===parentView.id){
                            rescView['text']=rescView.name;
                            rc.push(rescView);
                            parentView['childCount']=parentView['childCount']+1;
                        }
                    })
                    //排序 降序

                    //三级节点
                    rc.forEach(function(_parentView){
                        if(_parentView['childCount']===null){
                            _parentView['childCount']=0;
                        }
                        var rcs=[];
                        data.forEach(function(rescView){
                            if(rescView.parentId===_parentView.id){
                                rescView['text']=rescView.name;
                                rcs.push(rescView);
                                _parentView['childCount']=_parentView['childCount']+1;
                            }
                        });
                        //降序
                        _parentView['children']=rcs;
                    });
                    parentView['children']=rc;
                });

                return res.json(ResponseObject.ro(ResponseObject.status_200, resc, null));
            }));
        }

    }));
};