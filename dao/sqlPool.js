var config = require('../config');
var mysql = require('mysql');
var pool = mysql.createPool({
    connectLimit: config.sql_connectLimit,
    host: config.sql_host,
    user: config.sql_user,
    password: config.sql_password,
    port: config.sql_port,
    debug:true,
    database: config.sql_database
});

pool.on('connection', function (connection) {
    console.log('connection');
});
module.exports = pool;
