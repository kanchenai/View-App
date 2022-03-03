export default class ViewUtils {
    static isNull(data) {
        if (data == null || typeof (data) == "undefined" || data == "undefined" || data == "null" || data == "" || Object.keys(data).length == 0) {
            return true
        }
        return false;
    }
};