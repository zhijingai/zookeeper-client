var rescController = {
	_ajaxHander : ajaxDataController(),
	_url : {
		//取角色下全部资源
		GET_RESCLIST : "/resc/getRescList",
		//根据父节点取子节点
		GET_RESCLISTBYPARENTID : "/resc/getRescListByParentId",
		//取全部资源
		GET_ALL : "/resc/getAllRescs",
		//修改状态
		DELETE_RESC : "/resc/updateRescStatus",
		//修改信息
		UPDATE_RESC : "/resc/updateResc",
		//添加节点
		ADD_RESC : "/resc/addResc",
		
	},

	getRescList : function(params, callback) {

		this._ajaxHander.get(this._url.GET_RESCLIST, params, function(data) {
			callback(data);
		}, true);
	},
	getRescListByParentId : function(params, callback) {

		this._ajaxHander.get(this._url.GET_RESCLISTBYPARENTID, params, function(data) {
			callback(data);
		}, true);
	},
	getAll : function(params, callback) {

		this._ajaxHander.get(this._url.GET_ALL, params, function(data) {
			callback(data);
		}, true);
	},
	deleteResc : function(params, callback) {

		this._ajaxHander.post(this._url.DELETE_RESC, params, function(data) {
			callback(data);
		}, true);
	},
	updateResc : function(params, callback) {

		this._ajaxHander.post(this._url.UPDATE_RESC, params, function(data) {
			callback(data);
		}, true);
	},
	addResc : function(params, callback) {

		this._ajaxHander.post(this._url.ADD_RESC, params, function(data) {
			callback(data);
		}, true);
	},
	
}