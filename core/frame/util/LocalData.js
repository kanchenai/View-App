export default class LocalData {
    static setDataByJson(key, valueObject) {
        var value = JSON.stringify(valueObject);
        if (value.length > 200) {
            console.warn("注意数据长度，有可能造成数据存储失败或异常！")
        }
        this.setData(key, value);
    }

    /**
     *
     * @param key
     * @param valueObject 只支持单层结构
     */
    static setDataByForm(key, valueObject) {
        var keys = Object.keys(valueObject);
        var valueStr = "";
        for (var i = 0; i < keys.length; i++) {
            var _key = keys[i];
            var value = valueObject[_key];
            if (value && typeof (value) != "string") {
                console.error("LocalData.setDataByForm不支持多层结构的数据");
                return;
            }
            valueStr += _key + "=" + value;
            if (i < keys.length - 1) {
                valueStr += "&";
            }
        }
        this.setData(key, valueStr);
    }

    static setData(key, value) {
        document.cookie = key + "=" + escape(value) + ";path=/";
    }

    static deleteData(key) {
        var date = new Date();
        date.setTime(date.getTime() - 10000);
        document.cookie = key + "=;expires=" + date.toGMTString() + ";path=/";
    }

    static getData(key) {
        var arr = null;
        if (document.cookie != null && document.cookie.length > 0)
            arr = document.cookie.match(new RegExp("(^| )" + key + "=([^;]*)(;|$)"));
        if (arr != null)
            return unescape(arr[2]);
        return null;
    }
}
