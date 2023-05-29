import ScrollView from "@core/frame/view/base/ScrollView";
import {ViewBuilder} from "@core/frame/view/base/ViewManager";
import View from "@core/frame/view/base/View";
import bg from "@src/custom-view/button/bg";

export default class ProgressView extends ScrollView {
    constructor(viewManager, listenerLocation) {
        super(viewManager, listenerLocation);

        this.bgEle = null;
        this.progressEle = null;

        this._total = 100;
        this._progress = 0;

        this.props.concat({
            "total": "",
            "progress-color":"",
            "bg-color":"",
        })
    }

    set progress(value) {
        if (value > this.total) {
            value = this.total;
        }
        this._progress = value;

        var scrollLeft = parseInt(this.size.width - this.size.width * value / this.total);

        this.scrollLeft = scrollLeft;

    }

    get progress() {
        return this._progress;
    }


    set total(value) {
        this._total = value;
        //TODO
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

        var bgColor = this.props["bg-color"];
        if(bgColor){
            this.bgEle.style.background = bgColor;
        }

        var progressColor = this.props["progress-color"];
        if(progressColor){
            this.progressEle.style.background = progressColor;
        }

        return false;
    }


    static parseByEle(ele, viewManager, listenerLocation) {
        var view = new ProgressView(viewManager, listenerLocation);
        view.ele = ele;
        view.scroller.init();
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
    var bg = require("./progress.html");

    return View.parseEle(bg)[0];
}

var setValue = function (view) {
    view.ele.appendChild(view.bgEle);
    view.ele.appendChild(view.progressEle);
}

var initStyle = function (view) {
    view.setStyle("overflow", "hidden");

    var size = view.size;
    view.bgEle.style.width = size.width * 2 + "px";
    view.bgEle.style.height = size.height + "px";

    view.progressEle.style.width = size.width + "px";
    view.progressEle.style.height = size.height + "px";


}

var initSlide = function (view) {
    view.scrollLeft = view.size.width;
}