var zookeeperController = {
	_ajaxHander : ajaxDataController(),
	_url : {
        // 配置管理-查询集群配置节点
		GET_CONFIGURE_LIST : "/zooManager/zookeeper/getConfigureList",
		// 配置管理-查询集群配置节点详情
		GET_CONFIGURE_DETAIL : "/zooManager/zookeeper/getConfigureDetail",
        // 配置管理-得到集群名称
		GET_ALL_CLUSTER_NAME : "/zooManager/zookeeper/getAllClusterName",
        //配置管理-通过父ID得到配置信息
		GET_LIST_BY_PARENTID : "/zooManager/zookeeper/getListByParentId",
		//配置管理-删除
		DELETE_RESC : "/common/resc/updateRescStatus",
        //配置管理-修改配置信息
		UPDATE_CONFIG : "/zooManager/zookeeper/updateConfig",
        //配置管理-新增节点
		ADD_NODE : "/zooManager/zookeeper/addNode",
        //配置管理-删除节点
		DEL_NODE: "/zooManager/zookeeper/delNode",
        //快照管理-新增快照
		ADD_SNAP_SHOT: "/zooManager/zookeeper/addSnapShot",
	},

	getConfigureList : function(params, callback) {

		this._ajaxHander.get(this._url.GET_CONFIGURE_LIST, params, function(data) {
			callback(data);
		}, true);
	},

	getConfigureDetail : function(params, callback) {

		this._ajaxHander.post(this._url.GET_CONFIGURE_DETAIL, params, function(data) {
			callback(data);
		}, true);
	},

	getAllClusterName : function(params,callback) {

		this._ajaxHander.get(this._url.GET_ALL_CLUSTER_NAME,params, function(data) {

			callback(data);
		}, true);
	},

	getListByParentId : function(params, callback) {

		this._ajaxHander.post(this._url.GET_LIST_BY_PARENTID, params, function(data) {
			callback(data);
		}, true);
	},

	deleteResc : function(params, callback) {

		this._ajaxHander.post(this._url.DELETE_RESC, params, function(data) {
			callback(data);
		}, true);
	},

	updateConfig : function(params, callback) {

		this._ajaxHander.post(this._url.UPDATE_CONFIG, params, function(data) {
			callback(data);
		}, true);
	},

	addNode : function(params, callback) {

		this._ajaxHander.post(this._url.ADD_NODE, params, function(data) {
			callback(data);
		}, true);
	},

	delNode : function(params, callback) {

		this._ajaxHander.post(this._url.DEL_NODE, params, function(data) {
			callback(data);
		}, true);
	},

	addSnapShot : function(params, callback) {

		this._ajaxHander.post(this._url.ADD_SNAP_SHOT, params, function(data) {
			callback(data);
		}, true);
	},
	
}