var config = require('../config');
var constants = require('../constants');
var zookeeperDAO = require('../dao/zookeeperDAO');
var validator = require('validator');
var async = require('async');
var eventproxy = require('eventproxy');
var authMiddleWare = require('../middlewares/auth');
var ldap = require('../middlewares/ldap');
var ResponseObject = require('../middlewares/ResponseObject');
var Page = require('../middlewares/Page');
var commonUtil = require('../common/commonUtil');
var tools = require('../common/tools');
var fs = require('fs');
var busboy = require('connect-busboy');
var url = require('url');
// 加载编码转换模块
var iconv = require('iconv-lite');
var jschardet = require("jschardet")
var zkClient = require('../common/zkClient');

// 按角色取资源
exports.getZdZookeeperList = function (req, res, next) {
    var proxy = new eventproxy();
    proxy.fail(next);

    var sqlParam = [];
    var param = [];
    if (typeof req.body.filters !== 'undefined' && req.body.filters !== '') {
        var searchs = JSON.parse(req.body.filters.toString()).rules;
        searchs.forEach(function (rule) {
            sqlParam.push(rule.field.replace(/([A-Z])/g, "_$1").toLowerCase());
            param.push(rule.data);
        });
    }

    zookeeperDAO.getZdZookeeperListCount(next, sqlParam, param, proxy.done(function (data) {
        var totalCount = data[0].totalCount;
        if (data != null && totalCount > 0) {
            var pageSize = parseInt(req.body.rows);
            var pageNumber = parseInt(req.body.page);

            var offset = (pageNumber - 1) * pageSize; // 起始下标
            offset = offset > 0 ? offset : 0;
            offset = offset < totalCount ? offset : totalCount;
            param.push(offset);
            param.push(pageSize);

            zookeeperDAO.getZdZookeeperList(next, sqlParam, param, proxy.done(function (data) {
                return res.json(Page(data, totalCount, pageNumber, pageSize));
            }));
        } else {
            return res.json(Page("", 0, 0, 0))
        }
    }));
};

//快照管理-得到快照列表
exports.getSnapShotList = function (req, res, next) {
    var proxy = new eventproxy();
    proxy.fail(next);

    var sqlParam = [];
    var param = [];
    if (typeof req.body.filters !== 'undefined' && req.body.filters !== '') {
        var searchs = JSON.parse(req.body.filters.toString()).rules;
        searchs.forEach(function (rule) {
            sqlParam.push(rule.field.replace(/([A-Z])/g, "_$1").toLowerCase());
            param.push(rule.data);
        });
    }

    zookeeperDAO.getSnapShotListCount(next, sqlParam, param, proxy.done(function (data) {
        var totalCount = data[0].totalCount;
        if (data != null && totalCount > 0) {
            var pageSize = parseInt(req.body.rows);
            var pageNumber = parseInt(req.body.page);

            var offset = (pageNumber - 1) * pageSize; // 起始下标
            offset = offset > 0 ? offset : 0;
            offset = offset < totalCount ? offset : totalCount;

            param.push(offset);
            param.push(pageSize);

            zookeeperDAO.getSnapShotList(next, sqlParam, param, proxy.done(function (data) {
                return res.json(Page(data, totalCount, pageNumber, pageSize));
            }));
        } else {
            return res.json(Page("", 0, 0, 0))
        }
    }));
};

// 配置管理-得到集群名称
exports.getAllClusterName = function (req, res, next) {
    var proxy = new eventproxy();
    proxy.fail(next);

    zookeeperDAO.getAllClusterName(next, proxy.done(function (data) {
        return res.json(ResponseObject.ro(ResponseObject.status_200, data, null));
    }));
}

// 配置管理-得到集群
exports.getConfigureList = function (req, res, next) {
    var proxy = new eventproxy();
    proxy.fail(next);

    var param = [];
    zookeeperDAO.getConfigureList(next, param, proxy.done(function (data) {
        return res.json(ResponseObject.ro(ResponseObject.status_200, data[0], null));
    }));

}

//快照管理-新增快照
exports.addSnapShot = function (req, res, next) {
    var proxy = new eventproxy();
    proxy.fail(next);

    var params = [];
    params.push(req.body.clusterName);
    params.push(req.body.path);
    params.push(req.body.data);
    params.push(new Date());
    params.push(commonUtil.getTimeFormatUUid());
    params.push(0);
    params.push(0);
    zookeeperDAO.addSnapShotManager(next, params, proxy.done(function (data) {
        return res.json(ResponseObject.ro(ResponseObject.status_200, "生成成功", null));
    }));
}


//配置管理-上传文件
exports.fileUpload = function (req, res, next) {

    var proxy = new eventproxy();
    proxy.fail(next);

    var arg = url.parse(req.url, true).query;

    if (commonUtil.isNotBlank(arg.nodePath)) {

        var nodePath = arg.nodePath.substring(0, arg.nodePath.lastIndexOf("/"));
        if (commonUtil.isBlank(nodePath)) {

            return res.json(ResponseObject.ro(ResponseObject.status_512, null, '请增加下级节点'));
        }
        var filePath = constants.uploadPath + "/" + arg.clusterName + nodePath + "/";
        /*  zookeeperDAO.isCorrectPath()*/
        upload(filePath, nodePath, req, res);

    } else {
        return res.json(ResponseObject.ro(ResponseObject.status_512, null, '节点路径不能为空'));
    }
}

function upload(filePath, nodePath, req, res) {

    var results = [];
    var fileName;
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        console.log("Uploading: " + filename + ";" + fieldname);

        //var filePath=process.cwd() + '/public/upload/';

        fs.exists(filePath, function (exists) {

            if (exists) {
                console.log("文件夹存在，进行上传");
                fstream = fs.createWriteStream(filePath + filename);
                fileName = filename;
                file.pipe(fstream);
                var info = ['file', fieldname, filename, 'utf8', mimetype];
                results.push(info);

            } else {
                commonUtil.mkDirs(filePath, 0777, function (data) {
                    console.log("创建文件夹成功");
                    fstream = fs.createWriteStream(filePath + filename);
                    fileName = filename;
                    file.pipe(fstream);
                    var info = ['file', fieldname, filename, 'utf8', mimetype];
                    results.push(info);
                })
            }
        });

    });

    req.busboy.on('field', function (key, value, keyTruncated, valueTruncated) {
        console.log(key + ";" + value);

        results.push(['field', key, value]);
    });
    //
    req.busboy.on('finish', function () {
        console.log("results:" + results);
        filePath = filePath + fileName;
        ;
        nodePath = nodePath + "/" + fileName.substring(0, fileName.indexOf("."));
        getUploadDetail(filePath, nodePath, 'upload', res, req);
        return res.json(ResponseObject.ro(ResponseObject.status_200, '上传成功', null));
    });
    req.busboy.on('error', function (err) {

    });
}

// 配置管理-得到集群详情
exports.getConfigureDetail = function (req, res, next) {
    var proxy = new eventproxy();
    proxy.fail(next);

    var nodePath = req.body.nodePath;
    var clusterName = req.body.clusterName;
    var filePath = constants.uploadPath + "/" + clusterName + nodePath + ".txt"

    getUploadDetail(filePath, nodePath, 'getDetail', req, res);

    console.log("READ FILE ASYNC END");

}

function getUploadDetail(filePath, nodePath, type, req, res) {
    fs.exists(filePath, function (exists) {

        if (exists) {

            if ("getDetail" == type) {

                var data = fs.readFileSync(filePath);

                //  data[0] == 0xEF && data[1] == 0xBB && data[2] == 0xBF
                if ("UTF-8" == jschardet.detect(data).encoding) {
                    console.log("encoding = utf-8 ");

                    fs.readFile(filePath, {encoding: 'utf8'}, function (err, data) {
                        return res.json(ResponseObject.ro(ResponseObject.status_200, data, null));
                    });

                } else if ("GB2312" == jschardet.detect(data).encoding) {

                    var str = iconv.decode(data, 'GB2312');
                    return res.json(ResponseObject.ro(ResponseObject.status_200, str, null));
                } else {
                    //jschardet.detect 只能识别 gb2312，无法正确识别其超集 gbk 和 gb1803
                    var str = iconv.decode(data, 'gbk');
                    return res.json(ResponseObject.ro(ResponseObject.status_200, str, null));
                }
            } else if ("upload" == type) {
                var data = fs.readFileSync(filePath);
                zkClient.setData(nodePath, data);
            }

        } else {
            return res.json(ResponseObject.ro(ResponseObject.status_512, null, "文件不存,请上传！"));
        }
    });

}
//配置管理-新增节点
exports.addNode = function (req, res, next) {
    var proxy = new eventproxy();
    proxy.fail(next);

    var param = [];

    var nodePath = req.body.nodePath;
    var clusterName = req.body.clusterName;

    //前台没传父ID，则是新增集群（根目录）
    if (commonUtil.isNotBlank(req.body.parentId)) {
        param.push(param["parentId"] = req.body.parentId);
        if (-1 == req.body.parentPath.indexOf("根目录")) {
            nodePath = req.body.parentPath + nodePath
        }

    } else {
        param.push(param["parentId"] = null);
        nodePath = "/";
    }

    param.push(param["clusterName"] = clusterName);
    param.push(param["nodePath"] = nodePath);
    param.push(param["nodeOrder"] = req.body.nodeOrder);

    zookeeperDAO.getNodeById(next, param, proxy.done(function (data) {

        proxy.emit("parentNodeData", data);

    }));

    zookeeperDAO.getIsExistNode(next, param, proxy.done(function (data) {

        proxy.emit("nodeCount", data);

    }));

    proxy.all("parentNodeData", "nodeCount", function (data, nodeCount) {

        if (nodeCount[0].count > 0) {
            return res.json(ResponseObject.ro(ResponseObject.status_512, null, "节点已存在"));
        } else {

            //如果集群不存在则parentId为空（新建集群）
            if (clusterName !== data[0].clusterName) {
                param.parentId = null;
            }

            zookeeperDAO.addNode(next, param, proxy.done(function (data) {

            }));

            //创建Zookeeper节点
            zkClient.create(param.nodePath);

            return res.json(ResponseObject.ro(ResponseObject.status_200, "新增成功", null));
        }

    });

}

//配置管理-删除节点
exports.delNode = function (req, res, next) {
    var proxy = new eventproxy();
    proxy.fail(next);

    var parentId = req.body.nodeId;

    zookeeperDAO.isParent(next, parentId, proxy.done(function (data) {

       if(data[0].countNum == 1){

           return res.json(ResponseObject.ro(ResponseObject.status_512, null, "请先删除子节点"));

       }else{

           zookeeperDAO.getNodePathById(next, parentId, proxy.done(function (data) {

               zkClient.remove(data[0].nodePath);

           }));
           zookeeperDAO.delNode(next, parentId, proxy.done(function (data) {

               return res.json(ResponseObject.ro(ResponseObject.status_200, "删除成功", null));
           }));
       }

    }));

}

//配置管理-修改配置信息
exports.updateConfig = function (req, res, next) {
    var proxy = new eventproxy();
    proxy.fail(next);

    var nodePath = req.body.nodePath;
    var content = req.body.content;
    var clusterName = req.body.clusterName;

    var filePath = constants.uploadPath + "/" + clusterName + nodePath + ".txt";

    updateConfigMsg(filePath, content, req, res);

    zkClient.setData(nodePath, new Buffer(content));
}

function updateConfigMsg(filePath, content, req, res) {

    fs.exists(filePath, function (exists) {
        //修改
        if (exists) {

            var data = fs.readFileSync(filePath);


            if ("UTF-8" == jschardet.detect(data).encoding) {
                content = iconv.encode(content, 'utf-8');
            } else if ("GB2312" == jschardet.detect(data).encoding) {
                content = iconv.encode(content, 'GB2312');
            } else {
                content = iconv.encode(content, 'gbk');
            }

            fs.writeFile(filePath, content, function (err) {
                if (err)
                    console.log("fail " + err);
                else
                    return res.json(ResponseObject.ro(ResponseObject.status_200, null, null));
            });

            //新增
        } else {

            return res.json(ResponseObject.ro(ResponseObject.status_512, null, "文件不存在"));
            /*fs.mkdir(filePath, function (err) {

             if (err) {
             return res.json(ResponseObject.ro(ResponseObject.status_512, null, "创建目录失败"));
             } else {

             fs.writeFile(filePath, arr, function (err) {
             if (err)
             console.log("fail " + err);
             else
             return res.json(ResponseObject.ro(ResponseObject.status_200, null, null));
             });
             }

             });*/

        }
    });
}
//配置管理-通过父ID得到配置信息
exports.getListByParentId = function (req, res, next) {
    var proxy = new eventproxy();
    proxy.fail(next);

    var param = [];
    param.push(param["parentId"] = req.body.parentId);
    param.push(param["clusterName"] = req.body.clusterName);
    param.push(param["nodePath"] = req.body.nodePath);

    zookeeperDAO.getListByParentId(next, param, proxy.done(function (data) {

        if (commonUtil.isNotBlank(data)) {

            data.forEach(function (zdSnapshotTree) {

                if (0 == zdSnapshotTree.countNum) {

                    zdSnapshotTree["type"] = "item";

                    if (commonUtil.isBlank(zdSnapshotTree.parentId)) {
                        zdSnapshotTree["name"] = "根目录:" + zdSnapshotTree.clusterName;
                    }

                } else {
                    if (commonUtil.isBlank(zdSnapshotTree.parentId)) {
                        zdSnapshotTree["name"] = "根目录:" + zdSnapshotTree.clusterName;
                    }
                    zdSnapshotTree["type"] = "folder";

                }

            });

            return res.json(ResponseObject.ro(ResponseObject.status_200, data, null));

        } else {
            return res.json(ResponseObject.ro(ResponseObject.status_512, null, "资源未找到"));
        }

    }));

}

//zdzookeeper
exports.zdZookeeperManager = function (req, res, next) {
    var proxy = new eventproxy();
    proxy.fail(next);

    var params = [];
    if (req.body.oper === 'add') {

        //新增
        params.push(req.body.clusterName);
        params.push(req.body.hosts);
        params.push(req.body.business);

        zookeeperDAO.addZdZookeeperManager(next, params, proxy.done(function (data) {
            return res.json(ResponseObject.ro(ResponseObject.status_200, data, null));
        }));
    } else if (req.body.oper === 'edit') {
        //修改
        params.push(req.body.clusterName);
        params.push(req.body.hosts);
        params.push(req.body.business);
        params.push(req.body.id);

        zookeeperDAO.updateZdZookeeperManager(next, params, proxy.done(function (data) {
            return res.json(ResponseObject.ro(ResponseObject.status_200, data, null));
        }));
    } else if (req.body.oper === 'del') {
        //修改
        var ids = req.body.id;
        //数组里嵌套数组  实现mysql in
        params.push(ids.split(','));

        zookeeperDAO.delZdZookeeperManager(next, params, proxy.done(function (data) {
            return res.json(ResponseObject.ro(ResponseObject.status_200, data, null));
        }));
    }

}

//快照管理-修改快照列表
exports.getSnapShotManager = function (req, res, next) {
    var proxy = new eventproxy();
    proxy.fail(next);

    var params = [];
    if (req.body.oper === 'add') {
        /*  //新增
         params.push(req.body.clusterName);
         params.push(req.body.hosts);
         params.push(req.body.business);

         zookeeperDAO.addSnapShotManager(next, params, proxy.done(function (data) {
         return res.json(ResponseObject.ro(ResponseObject.status_200, data, null));
         }));*/
    } else if (req.body.oper === 'edit') {
        //修改
        params.push(req.body.clusterName);
        params.push(req.body.path);
        params.push(req.body.data);
        params.push(req.body.commit);
        params.push(req.body.id);

        zookeeperDAO.updateSnapShotManager(next, params, proxy.done(function (data) {

        }));

        var filePath = constants.uploadPath + "/" + req.body.clusterName + req.body.path + ".txt";

        updateConfigMsg(filePath, req.body.data, req, res);

        zkClient.setData(req.body.path, new Buffer(req.body.data));

    } else if (req.body.oper === 'del') {
        //修改
        var ids = req.body.id;
        //数组里嵌套数组  实现mysql in
        params.push(ids.split(','));

        zookeeperDAO.delSnapShotManager(next, params, proxy.done(function (data) {
            return res.json(ResponseObject.ro(ResponseObject.status_200, data, null));
        }));
    }
}