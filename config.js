var path = require('path');

var config = {

    name: 'zookeeper管理系统',
    description: 'zookeeper管理系统',
    keywords: 'zookeeper管理系统',

    // 数据库配置
    sql_connectLimit: 10,
    sql_host: '127.0.0.1',
    sql_user: 'root',
    sql_password: 'root',
    sql_port: '3306',
    sql_database: 'zookeeper_test',

    debug: true,
    session_secret: 'zookeeper_secret', // 务必修改
    auth_cookie_name: 'zookeeper_user',
    auth_session_name: 'zookeeper'
}

module.exports = config;