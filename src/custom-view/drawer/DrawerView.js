import {ViewBuilder} from "@core/frame/view/base/ViewManager";
import GroupView from "@core/frame/view/group/GroupView";
import View from "@core/frame/view/base/View";

export default class DrawerView extends GroupView {
    constructor(viewManager, listenerLocation) {
        super(viewManager, listenerLocation);

        this.slideFrom = "right";

        this.shadowEle = null;

        this.slideState = "out";
        this.keyBack = true;//slideState为in时，返回默认收起

        this.props.concat({
            "slide-from": "",
            "key-back": ""
        });
    }

    slideIn() {
        this.show();
        var content = this.findViewById("content");
        this.scrollToChild(content);
        this.requestFocus();

        if (this.keyBack) {
            var drawerView = this;
            this.pageKeyBack = this.page.key_back_event;
            this.page.key_back_event = function () {
                drawerView.slideOut();
            }
        }

        this.slideState = "in";
    }

    slideOut() {
        var content = this.findViewById("content");
        switch (this.slideFrom) {
            case "right":
                this.scrollTo(0, 0);
                break;
            case "left":
                var width = content.width;
                this.scrollTo(width, 0);
                break;
            case "bottom":
                this.scrollTo(0, 0);
                break;
            case "top":
                var height = content.height;
                this.scrollTo(0, height);
                break;
        }

        this.slideState = "out";

        this.frontView.requestFocus();
        if (this.keyBack) {
            this.page.key_back_event = this.pageKeyBack;
        }
    }

    callScrollEndListener(scrollView, x, y) {
        super.callScrollEndListener(scrollView, x, y);
        if (this.slideState == "out") {
            this.hide();
        }
    }

    get ele() {
        return this._ele;
    }

    set ele(value) {
        super.ele = value;

        initStyle(this);
    }

    setAttributeParam() {
        var firstFocus = super.setAttributeParam();

        var slideFrom = this.props["slide-from"];
        if (slideFrom) {
            this.slideFrom = slideFrom;
        }

        var shadowEle = this.findEleById("shadow");
        if (shadowEle) {
            this.shadowEle = shadowEle;
        } else {
            this.shadowEle = buildShadowEle();
            this.ele.append(this.shadowEle);
        }

        var keyBack = this.props["key-back"];

        if (keyBack == "false" || keyBack == "0") {
            this.keyBack = false;
        }

        return firstFocus;
    }

    static parseByEle(ele, viewManager, listenerLocation) {
        var drawerView = new DrawerView(viewManager, listenerLocation);
        drawerView.ele = ele;

        drawerView.bindImage();
        drawerView.bindText();
        drawerView.scroller.init();
        viewManager.eleToObject(drawerView.scroller.ele, drawerView, listenerLocation);//往内部执行
        initSlide(drawerView);
        return drawerView;
    }
}

export class DrawerViewBuilder extends ViewBuilder {
    constructor() {
        super();
        this.viewType = "drawer";
    }

    buildView(ele, viewManager, listenerLocation) {
        return DrawerView.parseByEle(ele, viewManager, listenerLocation);
    }
}

var buildShadowEle = function () {
    var html = require("./shadow.html");
    var shadowEle = View.parseEle(html)[0];

    return shadowEle;
}

var initStyle = function (drawer) {
    var page = drawer.page;
    var shadowEle = drawer.shadowEle;

    shadowEle.style.width = page.width + "px";
    shadowEle.style.height = page.height + "px";

    drawer.width = page.width;
    drawer.height = page.height;

    drawer.setStyle("zIndex", "100");
}

var initSlide = function (drawer) {
    var shadowEle = drawer.shadowEle;
    var content = drawer.findViewById("content");
    var page = drawer.page;

    switch (drawer.slideFrom) {
        case "right":
            content.left = page.width;
            break;
        case "left":
            var width = content.width;
            shadowEle.style.left = width + "px";
            drawer.scrollLeft = width;
            break;
        case "bottom":
            content.top = page.height;
            break;
        case "top":
            var height = content.height;
            shadowEle.style.top = height + "px";
            drawer.scrollTop = height;
            break;
    }

    drawer.hide();
}