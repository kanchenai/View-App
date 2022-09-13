import Dialog from "@core/frame/view/group/Dialog";

export default class LoneDialog extends Dialog {
    constructor(viewManager) {
        super(viewManager);
    }

    set html(value) {
        //1.布局最外层的ele
        this.ele = buildEle(this.page);
        this.page.appendChild(this.ele);
        //2.加载布局（把html设置进外层ele中）
        super.html = value;
    }

    get html() {
        return this.scroller.html;
    }
}

/**
 * 创建外层ele
 * @param page
 */
var buildEle = function (page) {
    var div = document.createElement("div");
    var width = page.width;
    var height = page.height;

    var style = div.style;
    style.width = width + "px";
    style.height = height + "px";
    style.overflow = "hidden";
    style.display = "none";


    return div;
}