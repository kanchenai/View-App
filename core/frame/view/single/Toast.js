import View from "@core/frame/view/base/View";
import {PageLifeState} from "@core/frame/page/Page";
import html from "@core/frame/view/html/toast.html"

export default class Toast extends View {
    constructor(page) {
        super(page.viewManager, null);
        this.html = html;

        this.messageList = [];
        this.duration = 3;
    }

    show(info) {
        if(info != undefined){
            this.messageList.push(info);
        }

        if (this.page.lifeState == PageLifeState.RUN && !this.isShowing) {
            if(this.messageList == 0){
                return;
            }

            var str = this.messageList.shift();

            super.show();
            var ele = this.findEleById("info")
            ele.innerText = str;

            var contentEle = this.findEleById("content")
            var width = View.getWidth(contentEle);
            var left = (this.page.width - width) / 2;

            this.left = left;
            var that = this;
            setTimeout(function () {
                that.hide();
                setTimeout(function (){that.show();},200)
            }, this.duration * 1000);
        }
    }


    set html(value) {
        //1.布局最外层的ele
        this.ele = buildEle(this.page);
        this.page.appendChild(this.ele);
        //2.加载布局（把html设置进外层ele中）
        super.html = value;
    }

    get html() {
        return super.html;
    }

    addChild(view) {
    }

    /**
     * 从childViews移除
     * @param view
     */
    removeChild(view) {
    }

    findViewById(id) {
        return null;
    }

    callVisibleChangeListener(view, isShowing) {
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
