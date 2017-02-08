var express = require('express');

var resc = require('./../controllers/roleController');
var router = express.Router();

// 角色分页
router.post('/role/getRoleList', resc.getRoleList);

//保存角色资源
router.post('/role/insertRoleResc', resc.insertRoleResc);

module.exports = router;


