var bcrypt = require('bcryptjs');
var moment = require('moment');
var crypto = require('crypto');

moment.locale('zh-cn'); // 使用中文

// 格式化时间
exports.formatDate = function (date, friendly) {
  date = moment(date);

  if (friendly) {
    return date.fromNow();
  } else {
    return date.format('YYYY-MM-DD HH:mm');
  }

};

exports.validateId = function (str) {
  return (/^[a-zA-Z0-9\-_]+$/i).test(str);
};

exports.bhash = function (str, callback) {
  bcrypt.hash(str, 10, callback);
};

exports.bcompare = function (str, hash, callback) {
  bcrypt.compare(str, hash, callback);
};

exports.hashDigest = function(str) {
  var hash = crypto.createHash("md5");
  hash.update(new Buffer(str));
  var encode = hash.digest('hex');
  console.log(encode);
  return encode;
};