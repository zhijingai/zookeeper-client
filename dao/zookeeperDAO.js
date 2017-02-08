var pool = require('./sqlPool');
var eventproxy = require('eventproxy');
var commonUtil = require('../common/commonUtil');

exports.getZdZookeeperListCount = function (next, sqlParam, param, callback) {

    var proxy = new eventproxy();
    proxy.fail(next);

    var sql = 'select count(0) totalCount from zd_zookeeper where deleted="0" ';
    sqlParam.forEach(function (sp) {
        sql += ' and  ' + sp + ' =? ';
    });

    pool.query(sql, param, proxy.done(function (results) {
        callback(null, results);
    }));
};

exports.getZdZookeeperList = function (next, sqlParam, param, callback) {

    var proxy = new eventproxy();
    proxy.fail(next);

    var sql = 'SELECT zd_z.id,zd_z.cluster_name as clusterName,zd_z.hosts,zd_z.business,zd_z.deleted FROM zd_zookeeper zd_z where zd_z.deleted="0" ';
    sqlParam.forEach(function (sp) {
        sql += ' and  ' + sp + ' =? ';
    });
    sql += ' limit ?,? ';

    pool.query(sql, param, proxy.done(function (results) {
        callback(null, results);
    }));


};

exports.getSnapShotListCount = function (next, sqlParam, param, callback) {

    var proxy = new eventproxy();
    proxy.fail(next);

    var sql = 'select count(0) totalCount from zd_snapshot where deleted="0" ';
    sqlParam.forEach(function (sp) {
        sql += ' and  ' + sp + ' =? ';
    });

    pool.query(sql, param, proxy.done(function (results) {
        callback(null, results);
    }));
};

exports.getSnapShotList = function (next, sqlParam, param, callback) {

    var proxy = new eventproxy();
    proxy.fail(next);

    var sql = 'SELECT zd_s.id,zd_s.cluster_name as clusterName,zd_s.path,zd_s.data,zd_s.create_time createTime, zd_s.commit,zd_s.status,zd_s.deleted FROM zd_snapshot zd_s where zd_s.deleted="0" ';
    sqlParam.forEach(function (sp) {
        sql += ' and  ' + sp + ' =? ';
    });
    sql += 'order by  zd_s.create_time desc limit ?,? ';

    pool.query(sql, param, proxy.done(function (results) {
        callback(null, results);
    }));


};


exports.getAllClusterName = function (next, callback) {

    var proxy = new eventproxy();
    proxy.fail(next);
    pool.query('SELECT zd_s_t.id,zd_s_t.cluster_name as clusterName FROM zd_snapshot_tree zd_s_t group by  zd_s_t.cluster_name ', proxy.done(function (results) {
        callback(null, results);
    }));

};

exports.getConfigureList = function (next, callback) {

    var proxy = new eventproxy();
    proxy.fail(next);
    pool.query('SELECT zd_s_t.id,zd_s_t.cluster_name as clusterName FROM zd_snapshot_tree zd_s_t group by  zd_s_t.cluster_name ', proxy.done(function (results) {
        callback(null, results);
    }));


};
exports.isCorrectPath = function (next, param, callback) {

    var proxy = new eventproxy();
    proxy.fail(next);
    var sqlParam = [];
    sqlParam.push(param.nodePath);
    sqlParam.push(param.clusterName);

    pool.query('SELECT count(0) count FROM zd_snapshot_tree zd_s_t where   zd_s_t.node_path = ? and  zd_s_t.cluster_name = ? ', param, proxy.done(function (results) {
        callback(null, results);
    }));


};
exports.getConfigureDetail = function (next, callback) {

    var proxy = new eventproxy();
    proxy.fail(next);
    pool.query('SELECT zd_s_t.id,zd_s_t.cluster_name as clusterName FROM zd_snapshot_tree zd_s_t group by  zd_s_t.cluster_name ', proxy.done(function (results) {
        callback(null, results);
    }));


};

exports.getNodeById = function (next, param, callback) {

    var proxy = new eventproxy();
    proxy.fail(next);

    if (commonUtil.isBlank(param.parentId)) {

        pool.query('select MAX(id) maxId from zd_snapshot_tree  ', param, proxy.done(function (results) {
            callback(null, results);
        }));
    } else {
        var id = param.parentId;

        pool.query('SELECT (select MAX(id) from zd_snapshot_tree) maxId,zd_s_t.id,zd_s_t.cluster_name as clusterName,zd_s_t.node_path as name ,zd_s_t.parent_id parentId '
            + ' FROM zd_snapshot_tree zd_s_t where zd_s_t.id = ?  ', id, proxy.done(function (results) {
            callback(null, results);
        }));
    }


};

exports.getIsExistNode = function (next, param, callback) {

    var proxy = new eventproxy();
    proxy.fail(next);

    var sqlParam = [];
    sqlParam.push(param.clusterName);
    sqlParam.push(param.nodePath);

    pool.query('SELECT count(0) count FROM zd_snapshot_tree zd_s_t where zd_s_t.cluster_name = ? and  zd_s_t.node_path = ? ', sqlParam, proxy.done(function (results) {
        callback(null, results);
    }));


};
exports.isParent = function (next, parentId, callback) {

    var proxy = new eventproxy();
    proxy.fail(next);
    pool.query('select count(0) countNum from zd_snapshot_tree where parent_id = ? ', parentId, proxy.done(function (results) {
        callback(null, results);
    }));


};
exports.addNode = function (next, param, callback) {

    var proxy = new eventproxy();
    proxy.fail(next);

    var sqlParam = [];
    //sqlParam.push(commonUtil.getTimeFormatUUid());
    sqlParam.push(param.clusterName);
    sqlParam.push(param.nodePath);
    sqlParam.push(param.parentId);
    sqlParam.push(param.nodeOrder);

    pool.query(' insert into zd_snapshot_tree (cluster_name, node_path, parent_id,node_order)values(?,?,?,?)', sqlParam, proxy.done(function (results) {
        callback(null, results);
    }));


};
exports.delNode = function (next, id, callback) {

    var proxy = new eventproxy();
    proxy.fail(next);
    pool.query('delete FROM zd_snapshot_tree  where id = ?  ', id, proxy.done(function (results) {
        callback(null, results);
    }));


};
exports.getNodePathById = function (next, id, callback) {

    var proxy = new eventproxy();
    proxy.fail(next);

    pool.query('select node_path  nodePath FROM zd_snapshot_tree  where id = ?  ', id, proxy.done(function (results) {
        callback(null,results);
    }));

};

exports.getListByParentId = function (next, param, callback) {

    var proxy = new eventproxy();
    proxy.fail(next);


    if (0 == param.parentId) {

        //查根目录
        if (commonUtil.isBlank(param.clusterName)) {

            pool.query('SELECT  (select count(0)  from zd_snapshot_tree where parent_id = zd_s_t.id) countNum ,zd_s_t.parent_id parentId,zd_s_t.id,zd_s_t.cluster_name as clusterName,zd_s_t.node_path as name ,zd_s_t.parent_id parentId '
                + ' FROM zd_snapshot_tree zd_s_t where zd_s_t.parent_id is null  ', proxy.done(function (results) {
                callback(null, results);
            }));
            //根据集群名称搜索节点
        } else {

            var sqlParam = [];
            sqlParam.push(param.clusterName);
            pool.query('SELECT  (select count(0)  from zd_snapshot_tree where parent_id = zd_s_t.id) countNum ,zd_s_t.parent_id parentId,zd_s_t.id,zd_s_t.cluster_name as clusterName,zd_s_t.node_path as name ,zd_s_t.parent_id parentId '
                + ' FROM zd_snapshot_tree zd_s_t where zd_s_t.parent_id is null  and zd_s_t.cluster_name = ?  ', sqlParam, proxy.done(function (results) {
                callback(null, results);
            }));
        }


    } else {

        var sqlParam;


        //搜索节点
        if (param.parentId == -1) {

            sqlParam = [];

            sqlParam.push(param.nodePath);
            sqlParam.push(param.clusterName);

            pool.query('SELECT (select count(0)  from zd_snapshot_tree where parent_id = zd_s_t.id) countNum ,zd_s_t.parent_id parentId,zd_s_t.id,zd_s_t.cluster_name as clusterName,zd_s_t.node_path as name  ' +
                ' FROM zd_snapshot_tree zd_s_t where  zd_s_t.node_path = ?  and zd_s_t.cluster_name = ?  ', sqlParam, proxy.done(function (results) {
                callback(null, results);
            }));

        }

        //根据上级节点查询
        if (param.parentId != -1) {

            sqlParam = [];

            sqlParam.push(param.parentId);

            pool.query('SELECT  (select count(0)  from zd_snapshot_tree where parent_id = zd_s_t.id) countNum ,zd_s_t.parent_id parentId ,zd_s_t.id,zd_s_t.cluster_name as clusterName,zd_s_t.node_path as name  ' +
                ' FROM zd_snapshot_tree zd_s_t where  zd_s_t.parent_id = ? ', sqlParam, proxy.done(function (results) {
                callback(null, results);
            }));
        }


    }


};

//新增zdzookeeper
exports.addZdZookeeperManager = function (next, params, callback) {
    var proxy = new eventproxy();
    proxy.fail(next);

    pool.query('insert into zd_zookeeper (cluster_name,hosts,business) values (?,?,?)', params, proxy.done(function (results) {
        callback(null, results);
    }));
};

//修改zdzookeeper
exports.updateZdZookeeperManager = function (next, params, callback) {
    var proxy = new eventproxy();
    proxy.fail(next);

    pool.query('update zd_zookeeper set cluster_name=?,hosts=?,business=? where id=?', params, proxy.done(function (results) {
        callback(null, results);
    }));
};

//删除
exports.delZdZookeeperManager = function (next, params, callback) {
    var proxy = new eventproxy();
    proxy.fail(next);

    pool.query('update zd_zookeeper set deleted="1" where id in (?)', params, proxy.done(function (results) {
        callback(null, results);
    }));
};

//新增SnapShot
exports.addSnapShotManager = function (next, params, callback) {
    var proxy = new eventproxy();
    proxy.fail(next);

    pool.query('insert into zd_snapshot (cluster_name,path,data,create_time,commit,status,deleted) values (?,?,?,?,?,?,?)', params, proxy.done(function (results) {
        callback(null, results);
    }));
};

//修改SnapShot
exports.updateSnapShotManager = function (next, params, callback) {
    var proxy = new eventproxy();
    proxy.fail(next);

    pool.query('update zd_snapshot set cluster_name =?,path =?,data =?,commit=? where id=?', params, proxy.done(function (results) {
        callback(null, results);
    }));
};

//删除SnapShot
exports.delSnapShotManager = function (next, params, callback) {
    var proxy = new eventproxy();
    proxy.fail(next);

    pool.query('update zd_snapshot set deleted="1" where id in (?)', params, proxy.done(function (results) {
        callback(null, results);
    }));
};
