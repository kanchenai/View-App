import ItemView from "@core/frame/view/base/ItemView";
import {ViewBuilder} from "@core/frame/view/base/ViewManager";
import View from "@core/frame/view/base/View";
import VSize from "@core/frame/util/VSize";

export default class Button extends ItemView {
    constructor(viewManager, listenerLocation) {
        super(viewManager, listenerLocation);

        this.bgEle = null;
        this.focusEle = null;
        this.iconEle = null;
        this._sizeType = "small";

        this._buttonSize = new VSize(0, 0);

        this.props.concat({
            "value": "",
            "size-type": "",
            "size": "",
            "focus-enlarge": "",
            "focus-color": "",
            "value-color": "",
            "radius":"",
        })
    }

    get value() {
        var text = this.findViewById("_text");
        return text.text;
    }

    set value(value) {
        var text = this.findViewById("_text");
        text.text = value;
    }

    get ele() {
        return this._ele;
    }

    set ele(value) {
        super.ele = value;

        require("./button.css")
        this.html = require("./button.html");
    }

    /**
     * 给对应的ele设置布局
     * @param html
     */
    set html(html) {
        super.html = html;
        setValue(this);//设置值
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

    setFocusStyle() {
        super.setFocusStyle();
        var focusEnlarge = this.props["focus-enlarge"];
        focusEnlarge = parseInt(focusEnlarge);
        if (!isNaN(focusEnlarge)) {
            this.enlarge(focusEnlarge);
        }
    }

    setUnFocusStyle() {
        super.setUnFocusStyle();
        var focusEnlarge = this.props["focus-enlarge"];
        focusEnlarge = parseInt(focusEnlarge);
        if (!isNaN(focusEnlarge)) {
            this.restoreEnlarge();
        }
    }

    setSelectStyle() {
        super.setSelectStyle();
        var focusEnlarge = this.props["focus-enlarge"];
        focusEnlarge = parseInt(focusEnlarge);
        if (!isNaN(focusEnlarge)) {
            this.restoreEnlarge();
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

        var bgEle = this.findEleById("bg");
        if (bgEle) {
            this.bgEle = bgEle;
            this.bgEle.style.zIndex = "1";
        } else {
            this.bgEle = buildDefaultBgEle(this);
        }


        var focusEle = this.findEleById("focus");
        if (focusEle) {
            this.focusEle = focusEle;
            var width = View.getWidth(this.focusEle);
            var height = View.getHeight(this.focusEle);
            this.size = new VSize(width, height);

            if (this.focusEle.className != "focus") {
                this.focusEle.className += " focus";
            }

            this.focusEle.style.zIndex = "2";
        } else {
            this.focusEle = buildDefaultFocusEle(this);
            this.size = new VSize(this.buttonSize.width, this.buttonSize.height);
        }

        var iconEle = this.findEleById("icon");
        if (iconEle) {
            this.iconEle = iconEle;
            this.iconEle.style.zIndex = "3";
        }

        if (this.ele.className != "item") {
            if (this.ele.className) {
                //上焦的className
                this.focusStyle = this.ele.className + " item item_focus";
                //选中的className
                this.selectStyle = this.ele.className + " item item_select";
                //失焦的className
                this.unFocusStyle = this.ele.className + " item";
            }

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

/**
 * 设置焦点，文字等信息
 * @param button
 */
var setValue = function (button) {
    button.ele.appendChild(button.bgEle);
    button.ele.appendChild(button.focusEle);
    if (button.iconEle) {
        button.ele.appendChild(button.iconEle);
    }

    var text = button.findViewById("_text");
    text.text = button.props["value"];

    var focusColor = button.props["focus-color"];
    if (focusColor) {
        button.bgEle.style.borderColor = focusColor;
        button.focusEle.style.background = focusColor;

    }

    var valueColor = button.props["value-color"];
    if (valueColor) {
        var value = button.findEleById("_text");
        value.style.color = valueColor;

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

        if (child == button.iconEle) {
            continue;
        }

        if (child == button.focusEle) {
            continue;
        }

        var borderWidth = View.pxToNum(getComputedStyle(child).borderWidth);

        child.style.width = buttonSize.width - borderWidth * 2 + "px";
        child.style.height = buttonSize.height - borderWidth * 2 + "px";
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

    if (button.iconEle) {
        var valueEle = button.findEleById("_text");

        var iconLocate = View.parseAttribute("locate", button.iconEle);
        var iconWidth = View.getWidth(button.iconEle);
        var iconHeight = View.getHeight(button.iconEle);

        button.iconEle.style.top = Math.round((button.height - iconHeight) / 2) + "px";

        if (iconLocate == "right") {
            button.iconEle.style.left = button.width - (left + 8 + iconWidth) + "px";

            valueEle.style.left = 8 + "px";
            valueEle.style.width = button.width - (left + 8 + iconWidth + 8 + 8) + "px";
            valueEle.style.textAlign = "right";
        } else if (iconLocate == "center") {
            button.iconEle.style.left = (button.width - iconWidth) / 2 + "px";
        } else {
            button.iconEle.style.left = left + 8 + "px";

            valueEle.style.left = left + 8 + iconWidth + 8 + "px";
            valueEle.style.width = button.width - (left + 8 + iconWidth + 8 + 8) + "px";
            valueEle.style.textAlign = "left";
        }
    }

    if(button.props["radius"]){
        button.bgEle.style.borderRadius = button.props["radius"] + "px";
        button.focusEle.style.borderRadius = button.props["radius"] + "px";
    }
}

var buildDefaultFocusEle = function (button) {
    require("./focus.css")
    var focus = require("./focus.html");

    var focusEle = View.parseEle(focus)[0];

    var sizeType = button.props["size-type"];
    var size = button.props["size"];//属性中的宽高

    if (size) {
        focusEle.style.width = button.buttonSize.width + "px";
        focusEle.style.height = button.buttonSize.height + "px";
    } else {
        if (!sizeType) {
            sizeType = "small"
        }
        focusEle.className += " " + sizeType;
    }

    return focusEle;
}

var buildDefaultBgEle = function (button){
    require("./bg.css")
    var bg = require("./bg.html");

    var bgEle = View.parseEle(bg)[0];

    var sizeType = button.props["size-type"];
    var size = button.props["size"];//属性中的宽高

    if (size) {
        bgEle.style.width = button.buttonSize.width + "px";
        bgEle.style.height = button.buttonSize.height + "px";
    } else {
        if (!sizeType) {
            sizeType = "small"
        }
        bgEle.className += " " + sizeType;
    }

    return bgEle;
}
