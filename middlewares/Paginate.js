/**
 * 分页插件类
 * @param currentPage {Number} 当前页
 * @param pageSize {Number} 每页记录数
 * @param totalCount {Number} 总记录数
 * @param items {Object} 查询结果
 * @constructor
 */
function Paginate(items, totalCount, pageSize, currentPage) {
    this.items = items; // 结果
    if (!currentPage || currentPage < 1) {
        currentPage = 1;
    }
    this.pageSize = pageSize > 1 ? pageSize : 1;
    this.currentPage = currentPage > 0 ? currentPage : 1;

    if (totalCount > 0) {
        this.totalCount = totalCount;
        this.totalPageCount = parseInt(totalCount / this.pageSize);
        if (this.totalCount % this.pageSize > 0){
            this.totalPageCount++;
        }
    } else {
        this.totalCount = 0;
        this.totalPageCount = 0;
    }

    if (currentPage > this.totalPageCount) {
        this.currentPage = this.totalPageCount;
    } else {
        this.currentPage = currentPage;
    }
}

/*
 * 当前开始的条数
 */
Paginate.prototype.first = function () {
    var first = (this.currentPage - 1) * this.pageSize;
    if (first > this.totalCount) {
        return (this.totalPageCount - 1) * this.pageSize;
    }
    return first;
}

/*
 * 当前页最大的条数
 */
Paginate.prototype.last = function () {
    var last = this.first() + this.pageSize;
    if (last > this.totalCount) {
        return this.totalCount;
    }
    return last;
}
/**
 * 上一页
 * @returns {number}
 */
Paginate.prototype.prev = function () {
    if (this.currentPage <= 1) {
        return 1;
    }
    return this.currentPage - 1;
}

/**
 * 下一页
 * @returns {*}
 */
Paginate.prototype.next = function () {
    if (this.currentPage >= this.totalPageCount) {
        return this.totalPageCount;
    }
    return (parseInt(this.currentPage) + 1);
}
module.exports = Paginate;