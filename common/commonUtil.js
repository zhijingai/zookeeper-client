var moment = require('moment');

function getRandomNum(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    return (Min + Math.round(Rand * Range));
}

// 生成手机验证码
function getTelephoneCode() {
    var res = '';
    for (var i = 0; i < 4; i++) {
        res += getRandomNum(0, 10);
    }
    return res;
}

function getTimeFormatUUid() {
    var myDate = new Date();
    var lg = myDate.getTime();
    var Rand = Math.random();
    var recordid = 10000 + Math.round(Rand * 90000);
    return lg.toString() + recordid.toString();
}

function getRandomNickName() {
    var res = "ZZ" + formatCurDate('YYYYMMDD');
    for (var i = 0; i < 4; i++) {
        res += getRandomNum(0, 10);
    }
    return res;
}

function formatCurDate(format) {
    return moment().format(format);
}

function isNotBlank(str){
    if(str instanceof Array &&str.length===0){
        return false;
    }
    if(str===''||typeof str === 'undefined' ||str===null){

        return false;
    }else{
        return true;
    }
}
function isBlank(str){
    return !isNotBlank(str);
}

module.exports = {
    getRandomNickName: getRandomNickName,
    getTimeFormatUUid: getTimeFormatUUid,
    getTelephoneCode: getTelephoneCode,
    isNotBlank: isNotBlank,
    isBlank: isBlank
}

