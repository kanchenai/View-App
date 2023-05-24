import View from "@core/frame/view/base/View";
import {ViewBuilder} from "@core/frame/view/base/ViewManager";
import VSize from "@core/frame/util/VSize";
import bg from "./bg.html";

export default class CountdownView extends View {
    constructor(viewManager, listenerLocation) {
        super(viewManager, listenerLocation);

        this.bgEle = null;

        this._count = 3;
        this.timer = null;
        this.counting = false;

        this._sizeType = "small";

        this.props.concat({
            "size-type": "",
            "size": "",
            "count": "",
            "count-change": ""
        })
    }

    start() {
        this.counting = true;

        var that = this;

        this.timer = setInterval(function () {
            that.count--;
            that.findEleById("count").innerText = that.count;
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
    }

    get ele() {
        return this._ele;
    }

    set ele(value) {
        super.ele = value;
        this.html = require("./countdown.html");
    }

    set html(value) {
        super.html = value;
        setValue(this);
        initStyle(this);
    }

    get count() {
        return this._count;
    }

    set count(value) {
        this._count = value;
        var countEle = this.findEleById("count")
        if (countEle) {
            countEle.innerText = this.count;
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

        var size = this.props["size"];
        if (size) {
            var sizeStrs = size.split(",");
            if (sizeStrs.length == 2) {
                this.size = new VSize(parseInt(sizeStrs[0]), parseInt(sizeStrs[1]));
            }
        }

        var bgEle = this.findEleById("bg");
        if (bgEle) {
            this.bgEle = bgEle;
            this.bgEle.style.zIndex = "";
        } else {
            this.bgEle = buildDefaultBgEle(this);
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

/**
 * 设置文字等信息
 * @param button
 */
var setValue = function (countdown) {
    countdown.ele.appendChild(countdown.bgEle);
    var countEle = countdown.findEleById("count");
    countEle.innerText = countdown.count;
}

var initStyle = function (countdown) {
    var bgEle = countdown.findEleById("bg");
    var countEle = countdown.findEleById("count");
    countdown.bgEle.style.width = countdown.size.width + "px";
    countdown.bgEle.style.height = countdown.size.height + "px";

    countEle.style.width = countdown.size.width + "px";
    countEle.style.height = countdown.size.height + "px";
    countEle.style.lineHeight = countdown.size.height + "px";
}

var buildDefaultBgEle = function (countdown) {
    var bg = require("./bg.html");

    var bgEle = View.parseEle(bg)[0];

    bgEle.style.width = countdown.width + "px";
    bgEle.style.height = countdown.height + "px";

    return bgEle;
}
