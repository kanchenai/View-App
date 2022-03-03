import LocalData from "../util/LocalData";

export default class PageManager {
    constructor(application) {
        this.application = application;
        this.pageInfoList = this.getPageInfo() || [];
        this.pageInfoKey = "PAGE_INFO";

        this._pageTypeCallback = function (pageName) {
            console.error("请在Application的子类中设置该回调！")
            return {};
        };
    }

    /**
     * 通过pageName创建Page对象
     * @param pageName
     * @returns {{}}
     */
    createPageByName(pageName) {
        return this._pageTypeCallback(pageName);
    }

    /**
     * 恢复page栈
     */
    recoveryPageList() {
        for (var pageInfo of this.pageInfoList) {
            var page = this.createPageByName(pageInfo.pageName);
            this.application.pageList.push(page);
        }
    }

    /**
     * 将页面参数信息入栈
     * @param page
     * @param param
     */
    putPageInfo(page, param) {
        var pageName = page.pageName;
        if (!pageName) {
            console.error("pageName未设置");
        }
        this.pageInfoList.push(new PageInfo(pageName, param));

        this.savePageInfo();
    }

    /**
     * 将栈顶页面参数信息出栈
     */
    popPageInfo() {
        var pageInfo = this.pageInfoList.pop();
        this.savePageInfo();
        return pageInfo;
    }

    /**
     * 获取栈顶页面参数信息，不出栈
     */
    peekPageInfo() {
        return this.pageInfoList.peek();
    }

    removePageInfo(param) {
        for (var i = 0; i < this.pageInfoList.length; i++) {
            var pageInfo = this.pageInfoList[i];
            if (pageInfo.param == param) {
                this.pageInfoList.splice(i, 1);
                break;
            }
        }
        this.savePageInfo();
    }

    /**
     * 将当前需要保存的参数信息，覆盖
     * @param param
     */
    coverPageInfo(oldData, newData) {
        for (var i = 0; i < this.pageInfoList.length; i++) {
            var _pageInfo = this.pageInfoList[i];
            if (_pageInfo.param == oldData) {
                _pageInfo.param = newData;
                break;
            }
        }
        this.savePageInfo();
    }

    getPageInfo() {
        var data = LocalData.getData(this.pageInfoKey);
        // data = '[{"pageName":"HomePage","param":{}},{"pageName":"ListPage","param":{"data":"llllll"}},{"pageName":"TestPage","param":{"data":"tttttt"}}]';
        var objects = JSON.parse(data);
        if (!objects || objects.length == 0) {
            return [];
        }
        var pageInfoList = [];
        for(var object of objects){
            pageInfoList.push(PageInfo.parse(object));
        }
        return pageInfoList;
    }

    clearPageInfo() {
        LocalData.setData(this.pageInfoKey, "");
    }

    savePageInfo(){
        LocalData.setDataByJson(this.pageInfoKey, this.pageInfoList);
    }

    set pageTypeCallback(value) {
        this._pageTypeCallback = value;
    }

    get pageList() {
        return this.application.pageList;
    }
}

class PageInfo {
    constructor(pageName, param) {
        this.pageName = pageName;
        this.param = param;
    }

    /**
     * 将对象转成PageInfo对象
     * @param object
     */
    static parse(object){
        return new PageInfo(object.pageName,object.param);
    }
    //
    // parseLocalData(){
    // }
}