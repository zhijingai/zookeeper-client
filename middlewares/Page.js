var validator = require('validator');

//{"total":2,"rows":[{"id":"1","clusterName":"172.16.1.250","hosts":"172.16.1.250:2181","business":"","deleted":0},
// {"id":"2","clusterName":"12311","hosts":"1.1.1.1:8080","business":"123331","deleted":0}]}

function Page(items, totalCount, currentPage,pageSize ) {
    var ro = {};
    if (totalCount > 0) {
        ro.totalCount = totalCount;
        ro.total = Math.ceil(totalCount/pageSize);
    } else {
        ro.totalCount = 0;
        ro.total = 0;
    }
    ro.rows = items;
    ro.pageSize = pageSize;
    ro.currentPage = currentPage;

    return ro;
}

module.exports = Page;
