/**
 * 判断一个变量是否为空，
 * 0不算空
 * @param data
 * @returns {boolean}
 */
var isEmpty = function (data) {
    if (data == null || typeof (data) == "undefined" || data == "undefined" || data == "null" || data == "" || (data instanceof Object && Object.keys(data).length == 0)) {
        return true
    }
    return false;
}


export default {
    isEmpty
}