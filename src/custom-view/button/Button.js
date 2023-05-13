import ItemView from "@core/frame/view/base/ItemView";
import {ViewBuilder} from "@core/frame/view/base/ViewManager";
import View from "@core/frame/view/base/View";
import VSize from "@core/frame/util/VSize";

import html from "./button.html"

export default class Button extends ItemView {
    constructor(viewManager, listenerLocation) {
        super(viewManager, listenerLocation);

        this.focusEle = null;
        this._sizeType = "small";

        this._buttonSize = new VSize(0, 0);
        this._buttonType = "plain";


        this.props.concat({
            "size-type": "",
            "size": "",
        })
    }

    get ele() {
        return this._ele;
    }

    set ele(value) {
        this._ele = value;

        var firstFocus = this.setAttributeParam()

        if (firstFocus && !this.viewManager.focusView) {
            this.viewManager.focusView = this;
        }

        require("./button.css")
        this.html = require("./button.html");
    }

    /**
     * 给对应的ele设置布局
     * @param html
     */
    set html(html) {
        this.ele.innerHTML = html;
        this.ele.appendChild(this.focusEle);

        initStyle(this);//初始化样式

        //绑定TextView和ImageView
        this.bindImage();
        this.bindText();
    }

    get buttonSize() {
        return this._buttonSize;
    }

    set buttonSize(value) {
        this._buttonSize = value;
    }

    get sizeType() {
        return this._sizeType;
    }

    set sizeType(value) {
        this._sizeType = value;

        if (this.sizeType == "medium") {
            this.buttonSize = new VSize(160, 80)
        } else if (this.sizeType == "mini") {
            this.buttonSize = new VSize(80, 40)
        } else {
            this.buttonSize = new VSize(120, 60);
        }
    }

    setAttributeParam() {
        var firstFocus = super.setAttributeParam();
        var sizeType = this.props["size-type"];
        if (!sizeType) {
            sizeType = "small";
        }

        this.sizeType = sizeType;

        var buttonSize = this.props["size"];
        if (buttonSize) {
            var sizeStrs = buttonSize.split(",");
            if (sizeStrs.length == 2) {
                this.buttonSize = new VSize(parseInt(sizeStrs[0]), parseInt(sizeStrs[1]));
            }
        }

        var focusEle = this.findEleById("focus");
        if (focusEle) {
            this.focusEle = focusEle;
            var width = View.getWidth(this.focusEle);
            var height = View.getHeight(this.focusEle);
            this.size = new VSize(width, height);

            if (this.focusEle.className != "focus") {
                this.focusEle.className += "focus";
            }

            this.focusEle.style.zIndex = "2";
        } else {
            this.focusEle = buildDefaultFocusEle(this);
            this.size = new VSize(this.buttonSize.width, this.buttonSize.height);
        }

        //将left、top设置到style中，left、top有可能在css中
        this.left = this.left;
        this.top = this.top;

        if (this.ele.className != "item") {
            //上焦的className
            this.focusStyle = this.ele.className + " item item_focus";
            //选中的className
            this.selectStyle = this.ele.className + " item item_select";
            //失焦的className
            this.unFocusStyle = this.ele.className + " item";

            this.setUnFocusStyle();
        }


        return firstFocus;
    }

    static parseByEle(ele, viewManager, listenerLocation) {
        var button = new Button(viewManager, listenerLocation);
        button.ele = ele;
        return button;
    }
}

export class ButtonBuilder extends ViewBuilder {
    constructor() {
        super();
        this.viewType = "button";
    }

    buildView(ele, viewManager, listenerLocation) {
        return Button.parseByEle(ele, viewManager, listenerLocation);
    }
}

var initStyle = function (button) {
    var buttonSize = button.buttonSize;

    var children = button.ele.children;

    var left = Math.round((button.width - buttonSize.width) / 2);
    var top = Math.round((button.height - buttonSize.height) / 2);

    // console.log("initStyle",left,top)

    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (child == button.focusEle) {
            continue;
        }

        child.style.width = buttonSize.width + "px";
        child.style.height = buttonSize.height + "px";
        child.style.left = left + "px";
        child.style.top = top + "px";
    }

    if (button.left >= left) {
        button.left -= left;
    } else {
        button.left = 0;
    }

    if (button.top >= top) {
        button.top -= top;
    } else {
        button.top = 0;
    }
}

var buildDefaultFocusEle = function (button) {
    require("./focus.css")
    var focus = require("./focus.html");

    return View.parseEle(focus)[0];
}
