import ScrollView from "@core/frame/view/base/ScrollView";
import {ViewBuilder} from "@core/frame/view/base/ViewManager";
import View from "@core/frame/view/base/View";
import GroupView from "@core/frame/view/group/GroupView";

export default class ProgressView extends GroupView {
    constructor(viewManager, listenerLocation) {
        super(viewManager, listenerLocation);
        this.focusable = false;
        this.dx = 5;//point比bg多出的一边像素

        this.bgEle = null;
        this.progressEle = null;
        this.progressEmptyEle = View.parseEle("<div></div>")[0];//用来撑开scroller的节点
        this.pointEle = null;

        this.scroller = null;

        this._total = 100;
        this._progress = 0;

        this.props.concat({
            "total": "",
            "progress-color": "",
            "bg-color": "",
            "point-color": "",
            "progress-change": ""
        })
    }

    callProgressChangeListener() {
        var onProgressChangeListener = null;
        if (this.onProgressChangeListener) {
            if (typeof this.onProgressChangeListener == "string") {
                onProgressChangeListener = this.listenerLocation[this.onProgressChangeListener];
            } else if (this.onVisibleChangeListener instanceof Function) {
                onProgressChangeListener = this.onProgressChangeListener;
            } else {
                console.error("进度变化监听设置错误");
                return;
            }
            onProgressChangeListener.call(this.listenerLocation, this, this.progress, this.total);
        }
    }

    set progress(value) {
        if (value > this.total) {
            value = this.total;
        }

        if (value < 0) {
            value = 0;
        }

        this._progress = value;
        if (this.scroller) {
            var scrollLeft = Math.round(this.scroller.size.width - this.scroller.size.width * value / this.total);
            this.scroller.scrollTo(scrollLeft, 0);
        }

        this.callProgressChangeListener();
    }

    get progress() {
        return this._progress;
    }


    set total(value) {
        if (value < 5) {
            value = 5;
        }
        this._total = value;

        if (this.progress > this.total) {
            this._progress = this.total;
        }

        if (this.scroller) {
            var scrollLeft = Math.round(this.scroller.size.width - this.scroller.size.width * value / this.total);
            this.scroller.scrollTo(scrollLeft, 0);
        }
    }

    get total() {
        return this._total;
    }

    get ele() {
        return this._ele;
    }

    set ele(value) {
        super.ele = value;
        setValue(this);
        initStyle(this);
    }

    callScrollingListener(scrollView, x, y) {
        super.callScrollingListener(scrollView, x, y);
        this.pointEle.style.left = this.scroller.width - x + "px";
    }

    callScrollEndListener(scrollView, x, y) {
        super.callScrollEndListener(scrollView, x, y);
        this.pointEle.style.left = this.scroller.width - x + "px";
    }

    setAttributeParam() {
        super.setAttributeParam();

        var total = this.props["total"]
        if (total) {
            this.total = parseInt(total);
        }

        var bgEle = this.findEleById("bg");
        if (bgEle) {
            this.bgEle = bgEle;
        } else {
            this.bgEle = buildBgEle();
        }

        var progressEle = this.findEleById("progress_bg");
        if (progressEle) {
            this.progressEle = progressEle;
        } else {
            this.progressEle = buildProgressEle();
        }

        var pointEle = this.findEleById("point");
        if (pointEle) {
            this.pointEle = pointEle;
        } else {
            this.pointEle = buildPointEle();
        }

        var bgColor = this.props["bg-color"];
        if (bgColor) {
            this.bgEle.style.background = bgColor;
        }

        var progressColor = this.props["progress-color"];
        if (progressColor) {
            this.progressEle.style.background = progressColor;
        }

        var pointColor = this.props["point-color"]
        if (pointColor) {
            this.pointEle.style.background = pointColor;
        }

        var progressChange = this.props["progress-change"];
        if(progressChange){
            this.onProgressChangeListener = progressChange;
        }

        return false;
    }


    static parseByEle(ele, viewManager, listenerLocation) {
        var view = new ProgressView(viewManager, listenerLocation);
        view.ele = ele;
        initSlide(view);
        return view;
    }
}

export class ProgressViewBuilder extends ViewBuilder {
    constructor(props) {
        super(props);
        this.viewType = "progress";
    }

    buildView(ele, viewManager, listenerLocation) {
        return ProgressView.parseByEle(ele, viewManager, listenerLocation);
    }
}

var buildBgEle = function () {
    var bg = require("./bg.html");

    return View.parseEle(bg)[0];
}

var buildProgressEle = function () {
    var bg = require("./progress_bg.html");

    return View.parseEle(bg)[0];
}

var buildPointEle = function () {
    var point = require("./point.html");

    return View.parseEle(point)[0];
}

var buildScroller = function () {
    var scroller = require("./scroller.html");

    return View.parseEle(scroller)[0];
}

var setValue = function (view) {
    view.ele.appendChild(view.bgEle);
    var scrollerEle = buildScroller();
    scrollerEle.appendChild(view.progressEle);
    scrollerEle.appendChild(view.progressEmptyEle);
    view.ele.appendChild(scrollerEle);

    view.scroller = new ScrollView(view.viewManager, view.listenerLocation);
    view.scroller.ele = scrollerEle;

    view.addChild(view.scroller);

    view.ele.appendChild(view.pointEle);
}

var initStyle = function (view) {
    view.setStyle("overflow", "hidden");

    var num = view.dx;
    var width = view.width;
    var height = view.height;

    view.width += height + (num * 2)
    view.height += 2 * num

    view.bgEle.style.width = width + "px";
    view.bgEle.style.height = height + "px";
    view.bgEle.style.left = num + "px";
    view.bgEle.style.top = num + "px";

    view.progressEle.style.width = width + "px";
    view.progressEle.style.height = height + "px";

    view.progressEmptyEle.style.width = width + "px";
    view.progressEmptyEle.style.height = height + "px";
    view.progressEmptyEle.style.left = width + "px";

    view.scroller.width = width;
    view.scroller.height = height;
    view.scroller.left = num;
    view.scroller.top = num;
    view.scroller.scroller.init();
    view.scroller.measure();

    view.pointEle.style.width = height + (num * 2) + "px";
    view.pointEle.style.height = height + (num * 2) + "px";
    view.pointEle.style.borderRadius = (height + (num * 2)) / 2 + "px";

    var left = view.left - Math.round(height / 2 + num);
    if (left < 0) {
        left = 0;
    }
    view.left = left;

    var top = view.top - num;
    if (top < 0) {
        top = 0
    }
    view.top = top;
}

var initSlide = function (view) {
    view.scroller.scrollLeft = view.scroller.size.width;
}