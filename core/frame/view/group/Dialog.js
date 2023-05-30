import GroupView from "./GroupView";

/**
 * 在布局分离写法中，可以继承LoneDialog
 */
export default class Dialog extends GroupView {
    constructor(viewManager, listenerLocation) {
        super(viewManager, listenerLocation);
        this.focusable = false;
        //page的返回事件
        this.pageKeyBack = null;
    }

    show() {
        super.show();
        this.frontView = this.page.focusView;
        this.requestFocus();

        var dialog = this;
        this.pageKeyBack = this.page.key_back_event;
        this.page.key_back_event = function () {
            dialog.hide();
        }
    }

    hide() {
        super.hide();
        this.frontView.requestFocus();
        this.page.key_back_event = this.pageKeyBack;
    }

    requestFocus() {
        if (this.childViews.length == 0) {
            var focusView = this.viewManager.focusView;
            if (focusView && focusView != this) {//焦点存在，并且和当前不是同一个
                focusView.requestUnFocus();
            }
            this.viewManager.focusView = this;
        } else {
            this.childViews[0].requestFocus();
        }
    }

    set ele(value) {
        super.ele = value;
        this.setStyle("zIndex", "100");
        this.setStyle("visibility", "");
        this.setStyle("display", "none");
    }

    get ele() {
        return super.ele;
    }

    setAttributeParam() {
        super.setAttributeParam();
        this.setFocusChange("null", "null", "null", "null");

        return false;
    }

    /**
     * 使用ele创建控件
     * @param{Element} ele
     * @param{ViewManager} viewManager
     * @param{View} listenerLocation
     * @returns {Dialog}
     */
    static parseByEle(ele, viewManager, listenerLocation) {
        var dialog = new Dialog(viewManager, listenerLocation);
        dialog.ele = ele;
        dialog.scroller.init();
        dialog.bindImage();
        dialog.bindText();
        viewManager.eleToObject(dialog.scroller.ele, dialog, listenerLocation);//往内部执行
        return dialog;
    }
}