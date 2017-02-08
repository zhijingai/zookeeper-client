var express = require('express');

var resc = require('./../controllers/rescController');
var router = express.Router();

// 按角色取资源(初始化左侧菜单)
router.get('/getRescList', resc.getRescList);

//取全部节点
router.get('/getAllRescs', resc.getAllRescs);

//根据父节点取得子节点
router.get('/getRescListByParentId', resc.getRescListByParentId);

//修改状态
router.post('/updateRescStatus', resc.updateRescStatus);

//修改信息
router.post('/updateResc', resc.updateResc);

//新增资源
router.post('/addResc', resc.addResc);

//取全部资源
router.get('/resc/selectAllResNodeByRoleId', resc.selectAllResNodeByRoleId);

module.exports = router;

