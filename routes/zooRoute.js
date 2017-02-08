var express = require('express');

var zooManager = require('../controllers/zookeeperController');
var router = express.Router();

/* GET users listing. */
router.post('/zookeeper/getZdZookeeperList', zooManager.getZdZookeeperList);

//快照管理-得到快照列表
router.post('/zookeeper/getSnapShotList', zooManager.getSnapShotList);

//快照管理-修改快照列表
router.post('/zookeeper/getSnapShotManager', zooManager.getSnapShotManager);

//快照管理-新增快照
router.post('/zookeeper/addSnapShot', zooManager.addSnapShot);

// 配置管理-得到集群名称
router.get('/zookeeper/getAllClusterName', zooManager.getAllClusterName);

// 配置管理-得到集群
router.get('/zookeeper/getConfigureList', zooManager.getConfigureList);

// 配置管理-得到集群详情
router.post('/zookeeper/getConfigureDetail', zooManager.getConfigureDetail);

//配置管理-通过父ID得到配置信息
router.post('/zookeeper/getListByParentId', zooManager.getListByParentId);

//
router.post('/zookeeper/zdZookeeperManager', zooManager.zdZookeeperManager);

//配置管理-修改配置信息
router.post('/zookeeper/updateConfig', zooManager.updateConfig);

//配置管理-新增节点
router.post('/zookeeper/addNode', zooManager.addNode);

//配置管理-删除节点
router.post('/zookeeper/delNode', zooManager.delNode);

//配置管理-上传文件
router.post('/zookeeper/fileUpload', zooManager.fileUpload);



module.exports = router;
