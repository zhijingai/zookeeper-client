var pool = require('./sqlPool');
var eventproxy = require('eventproxy');

//获得全部的节点
exports.getRoleList = function (next, callback) {
    var proxy = new eventproxy();
    proxy.fail(next);

    pool.query('select id,name,description,create_time as createTime from system_role order by create_time asc', proxy.done(function (results) {
        callback(null, results);
    }));
};

exports.delRoleResc = function (next,roleId, callback) {
    var proxy = new eventproxy();
    proxy.fail(next);

    pool.query('delete from system_role_resc where role_id=?',roleId, proxy.done(function (results) {
        callback(null,results);
    }));
};
//保存角色资源
exports.insertRoleResc = function (next,roleId,rescIds, callback) {
    var proxy = new eventproxy();
    proxy.fail(next);

    var sqlParam=[];
    var sql='insert into system_role_resc (resc_id,role_id) values ';
    rescIds.forEach(function(rescId){
        sql+=' (?,?),';
        sqlParam.push(rescId);
        sqlParam.push(roleId);
    });
    sql=sql.substring(0,sql.length-1);

    pool.query(sql,sqlParam, proxy.done(function (results) {
        callback(null, results);
    }));
};