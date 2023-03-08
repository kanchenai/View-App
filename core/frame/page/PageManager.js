import LocalData from "../util/LocalData";

/**
 * Page的管理者
 * 操作Page在内存中的动作，对应信息的本地交互
 */
export default class PageManager {
    constructor(application) {
        this.application = application;
        this.pageInfoKey = "PAGE_INFO";
        this.pageInfoList = this.getPageInfo() || [];

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
        var page = this._pageTypeCallback(pageName);
        if(!page){
            console.error("pageTypeCallback方法中未定义'"+pageName+"'");
        }
        return page;
    }

    /**
     * 恢复page栈
     */
    recoveryPageList() {
        for (var pageInfo of this.pageInfoList) {
            var page = this.createPageByName(pageInfo.pageName);
            page.application = this.application;
            page.param = pageInfo.param;//将数据保存在爬格子中
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
        if (!pageName) {//未设置pageName时，不会将当前页面保存信息保存
            console.error("pageName未设置");
            return;
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

    /**
     * 把param对应的pageInfo从pageInfoList中删除
     * @param param 这个param是从pageInfoList中获取的，属于是同一个对象、同一个内存地址
     */
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

    /**
     * 从LocalData获取PageInfo
     * @returns {*[]}
     */
    getPageInfo() {
        var data = LocalData.getData(this.pageInfoKey) || "[]";
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

    /**
     * 清除PageInfo
     */
    clearPageInfo() {
        LocalData.setData(this.pageInfoKey, "");
    }

    /**
     * 把pageInfoList保存到LocalData
     */
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

/**
 * pageName和对应Page的参数
 * 用于LocalData，获取或存储
 */
export class PageInfo {
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

}
