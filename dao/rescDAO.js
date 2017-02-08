var pool = require('./sqlPool');
var eventproxy = require('eventproxy');

//获得角色对应的资源
exports.getRescListByUserRole = function (next, userId, callback) {

    var proxy = new eventproxy();
    proxy.fail(next);
    pool.query('select c.id,c.name,c.status,c.parent_id as parentId,c.node_order as nodeOrder,c.url,c.create_time as createTime,c.level '
        + ' from user_role a '
        + ' left join system_role_resc b on a.role_id=b.role_id '
        + ' left join system_resc c on b.resc_id=c.id '
        + ' where a.user_id= ? and c.status=1 '
        + ' order by c.node_order,c.create_time ', userId, proxy.done(function (results) {
        callback(null, results);
    }));
};

//获得全部的节点
exports.getAllRescs = function (next, callback) {
    var proxy = new eventproxy();
    proxy.fail(next);

    pool.query('select id,name,parent_id as parentId,node_order as nodeOrder,url,create_time as createTime,modify_time as modifyTime,level,status ' +
        ' from system_resc where status=1 order by node_order,create_time desc', proxy.done(function (results) {
        callback(null, results);
    }));
};

//通过父节点取子节点
exports.getRescListByParentId = function (next, parentId, callback) {
    var proxy = new eventproxy();
    proxy.fail(next);

    var sql='select id,name,parent_id as parentId,node_order as nodeOrder,url,create_time as createTime,modify_time as modifyTime,level,status' +
        ' from system_resc where status=1 ';
    if(parentId === null){
        sql+=' and parent_id is null ';
    }else{
        sql+=' and parent_id = '+parentId;
    }
    sql+=' order by node_order ';
    pool.query(sql, proxy.done(function (results) {
        callback(null, results);
    }));
};

//根据父节点id统计子节点个数
exports.getPidByParent = function (next, ids, callback) {
    var proxy = new eventproxy();
    proxy.fail(next);

    var sqlParam='select parent_id as parentId from system_resc where status=1 and parent_id in (';
    ids.forEach(function(id){
        sqlParam+='?,';
    });
    sqlParam=sqlParam.substring(0,sqlParam.length-1);
    sqlParam+=')';
    pool.query(sqlParam,ids, proxy.done(function (results) {
        callback(null, results);
    }));
};

//修改状态
exports.updateRescStatus = function (next, params, callback) {
    var proxy = new eventproxy();
    proxy.fail(next);

    pool.query('update system_resc set status=? where id=?',params, proxy.done(function (results) {
        callback(null, results);
    }));
};

//修改信息
exports.updateResc = function (next, req, callback) {
    var proxy = new eventproxy();
    proxy.fail(next);

    var params=[];
    var sql='update system_resc set id=id ';
    if(typeof req.body.status!=='undefined'&&req.body.status!==null){
        sql+=' ,status=? ';
        params.push(req.body.status);
    }
    if(typeof req.body.name!=='undefined'&&req.body.name!==null){
        sql+=' ,name=? ';
        params.push(req.body.name);
    }
    if(typeof req.body.url!=='undefined'&&req.body.url!==null){
        sql+=' ,url=? ';
        params.push(req.body.url);
    }
    if(typeof req.body.nodeOrder!=='undefined'&&req.body.nodeOrder!==null){
        sql+=' ,node_order=? ';
        params.push(req.body.nodeOrder);
    }
    sql+=' where id=? ';
    params.push(req.body.id);

    pool.query(sql,params, proxy.done(function (results) {
        callback(null, results);
    }));
};

//新增资源
exports.addResc = function (next, params, callback) {
    var proxy = new eventproxy();
    proxy.fail(next);

    pool.query('insert into system_resc (id,name,parent_id,node_order,url,create_time,level) ' +
        ' values (?,?,?,?,?,now(),?) ',params, proxy.done(function (results) {
        callback(null, results);
    }));
};

//取实体
exports.getItem = function (next, id, callback) {
    var proxy = new eventproxy();
    proxy.fail(next);

    pool.query('select id,name,parent_id as parentId,node_order as nodeOrder,url,create_time as createTime,modify_time as modifyTime,level,status ' +
        ' from system_resc where id=? ',id, proxy.done(function (results) {
        callback(null, results);
    }));
};

//获得角色对应的资源
exports.getRescByRole = function (next, roleId, callback) {

    var proxy = new eventproxy();
    proxy.fail(next);
    pool.query('select c.id,c.name,c.status,c.parent_id as parentId,c.node_order as nodeOrder,c.url,c.create_time as createTime,c.level '
        + ' from system_role_resc a '
        + ' left join system_resc c on a.resc_id=c.id '
        + ' where a.role_id= ? and c.status=1 '
        + ' order by c.node_order,c.create_time ', roleId, proxy.done(function (results) {
        callback(null, results);
    }));
};