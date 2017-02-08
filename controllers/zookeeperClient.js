function ZkClient(hosts) {
    this.zk = newZk(hosts, this);
}

function newZk(hosts, zkClient) {
    var zk = new ZOOKEEPER();
    var timeout = 60000;
    var options = {
        connect: hosts,
        timeout: timeout,
        debug_level: ZOOKEEPER.ZOO_LOG_LEVEL_INFO,
        host_order_deterministic: false
    };
    zk.init(options);
    zk.on('connect', function (zkk) {
        console.log('zk session established, id = %s', zkk.client_id);
    });
    zk.on('close', function (zkk) {
        console.log("zk session close...");
        //zkClient.zk = newZk(hosts, zkClient);
    });
    return zk;
}

var zk = new ZkClient(hosts).zk;

/**
 * @path /thrift_services/nodis
 * @node 192.168.126:9998
 */

exports.registerService = function (path, node) {
    // EPHEMERAL：创建临时节点，ZooKeeper在感知连接机器宕机后会清除它创建的瞬节点
    zk.a_create(path + '/' + node, '', ZOOKEEPER.ZOO_EPHEMERAL, function (rc, error, path) {
        if (rc != 0) {//error occurs
            console.log('node create result: %d, error: "%s", path: %s', rc, error, path);
        }
        else {
            console.log('node create result: ok, path: %s', path);
        }
    });
};