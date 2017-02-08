var config = require('../config');

var env = process.env.NODE_ENV || "development";

var log4js = require('log4js');
log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: 'logs/userCenter.log', category: 'userCenter' }
  ]
});

var logger = log4js.getLogger('userCenter');
logger.setLevel(config.debug && env !== 'test' ? 'DEBUG' : 'ERROR')

module.exports = logger;
