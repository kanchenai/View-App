import View from "@core/frame/view/base/View";
import {ViewBuilder} from "@core/frame/view/base/ViewManager";
import VSize from "@core/frame/util/VSize";

export default class CountdownView extends View {
    constructor(viewManager, listenerLocation) {
        super(viewManager, listenerLocation);

        this._count = 3;
        this.timer = null;
        this.counting = false;

        this.bgEle = null;
        this.countEle = null;

        this._sizeType = "small";

        this.props.concat({
            "size-type": "",
            "count": "",
            "count-change": ""
        })
    }

    start() {
        this.counting = true;

        var that = this;

        this.timer = setInterval(function () {
            that.count--;
            that.countEle.innerText = that.count;
            that.callCountChangeListener();

            if (that.count <= 0) {
                that.stop();
            }
        }, 1000);
    }

    stop() {
        if (this.timer) {
            clearTimeout(this.timer);
        }

        this.counting = false;
    }

    callCountChangeListener() {
        var onCountChangeListener = null;
        if (this.onCountChangeListener) {
            if (typeof this.onCountChangeListener == "string") {
                onCountChangeListener = this.listenerLocation[this.onCountChangeListener];
            } else if (this.onCountChangeListener instanceof Function) {
                onCountChangeListener = this.onCountChangeListener;
            } else {
                console.error("计时监听设置错误");
                return;
            }
            onCountChangeListener.call(this.listenerLocation, this, this.count);
        }
    }

    get sizeType() {
        return this._sizeType;
    }

    set sizeType(value) {
        this._sizeType = value;

        if (this.sizeType == "medium") {
            this.size = new VSize(60, 60)
        } else if (this.sizeType == "mini") {
            this.size = new VSize(40, 40)
        } else {
            this.size = new VSize(50, 50);
        }

        this.bgEle.style.width = this.size.width + "px";
        this.bgEle.style.height = this.size.height + "px";

        this.countEle.style.width = this.size.width + "px";
        this.countEle.style.height = this.size.height + "px";
        this.countEle.style.lineHeight = this.size.height + "px";
    }

    get ele() {
        return this._ele;
    }

    set ele(value) {
        this._ele = value;
        this.html = require("./countdown.html");
        this.bgEle = this.findEleById("bg");
        this.countEle = this.findEleById("count");
    }

    get count() {
        return this._count;
    }

    set count(value) {
        this._count = value;
        if (this.countEle) {
            this.countEle.innerText = this.count;
        }
    }

    setAttributeParam() {
        super.setAttributeParam()
        //T获取大小类型
        var sizeType = this.props["size-type"];
        if (!sizeType) {
            sizeType = "small";
        }

        this.sizeType = sizeType;

        var count = this.props["count"];//点击
        if (count) {
            this.count = parseInt(count);
        }


        var countChange = this.props["count-change"];//点击
        if (countChange) {
            this.onCountChangeListener = countChange;
        }

        return false;
    }

    static parseByEle(ele, viewManager, listenerLocation) {
        var countdownView = new CountdownView(viewManager, listenerLocation);
        countdownView.ele = ele;
        return countdownView;
    }
}

export class CountdownViewBuilder extends ViewBuilder {
    constructor() {
        super();
        this.viewType = "countdown"
    }

    buildView(ele, viewManager, listenerLocation) {
        return CountdownView.parseByEle(ele, viewManager, listenerLocation);
    }
}
