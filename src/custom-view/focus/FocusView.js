import ItemView from "@core/frame/view/base/ItemView";
import {ViewBuilder} from "@core/frame/view/base/ViewManager";
import View from "@core/frame/view/base/View";
import VSize from "@core/frame/util/VSize";

/**
 * focusEle在创建时size固定，如果修改控件size，需要手动修改focusEle的size
 */
export default class FocusView extends ItemView {
    constructor(viewManager, listenerLocation) {
        super(viewManager, listenerLocation);

        this.focusEle = null;

        this.visibleSize = new VSize(0, 0);//可见部分宽高，不算焦点部分的

        this.props.concat({
            "size": "",
            "focus-enlarge": ""
        })
    }

    setFocusStyle() {
        super.setFocusStyle();
        var focusEnlarge = this.props["focus-enlarge"];
        focusEnlarge = parseInt(focusEnlarge);
        if (!isNaN(focusEnlarge)) {
            this.setStyle("webkitTransform", "scale(" + focusEnlarge + "%)");
            this.setStyle("transform", "scale(" + focusEnlarge + "%)");
        }
    }

    setUnFocusStyle() {
        super.setUnFocusStyle();
        var focusEnlarge = this.props["focus-enlarge"];
        focusEnlarge = parseInt(focusEnlarge);
        if (!isNaN(focusEnlarge)) {
            this.setStyle("webkitTransform", "scale(100%)");
            this.setStyle("transform", "scale(100%)");
        }
    }

    setSelectStyle() {
        super.setSelectStyle();
        var focusEnlarge = this.props["focus-enlarge"];
        focusEnlarge = parseInt(focusEnlarge);
        if (!isNaN(focusEnlarge)) {
            this.setStyle("webkitTransform", "scale(100%)");
            this.setStyle("transform", "scale(100%)");
        }
    }

    get ele() {
        return this._ele;
    }

    set ele(value) {
        super.ele = value;

        initStyle(this);//初始化样式

        //绑定TextView和ImageView
        this.bindImage();
        this.bindText();
    }

    get focusBorderInfo() {
        var width = View.getWidth(this.focusEle);
        var height = View.getHeight(this.focusEle);
        var borderHeight = Math.round((height - this.visibleSize.height) / 2);
        var borderWidth = Math.round((width - this.visibleSize.width) / 2);

        return {
            width: width,
            height: height,
            borderHeight: borderHeight,
            borderWidth: borderWidth
        }
    }

    /**
     * 获取left
     */
    get left() {
        return View.getLeft(this.ele) + this.focusBorderInfo.borderWidth;
    }

    set left(value) {
        let left  = value - this.focusBorderInfo.borderWidth;
        this.position.left = left;
        this.setStyle("left", left + "px");
    }

    /**
     * 获取top
     */
    get top() {
        return View.getTop(this.ele) + this.focusBorderInfo.borderHeight;
    }

    set top(value) {
        let top  = value - this.focusBorderInfo.borderHeight;
        this.position.top = top;
        this.setStyle("top", top + "px");
    }

    /**
     * 获取width
     */
    get width() {
        return this.visibleSize.width;
    }

    set width(value) {
        this.visibleSize.width = value;
        var width = value + 2 * this.focusBorderInfo.borderWidth;
        super.setStyle("width", width + "px");
    }

    /**
     * 获取height
     */
    get height() {
        return this.visibleSize.height;
    }

    set height(value) {
        this.visibleSize.height = value;
        var height = value + 2 * this.focusBorderInfo.borderHeight;
        super.setStyle("height", height + "px");
    }

    setAttributeParam() {
        var firstFocus = super.setAttributeParam();

        var size = this.props["size"];
        if (size) {
            var sizeStrs = size.split(",");
            if (sizeStrs.length == 2) {
                var width = parseInt(sizeStrs[0]);
                var height = parseInt(sizeStrs[1]);
                this.visibleSize = new VSize(width, height);
            }
        } else {
            this.visibleSize = this.size;
        }

        var focusEle = this.findEleById("focus");
        if (focusEle) {
            this.focusEle = focusEle;
            if (this.focusEle.className != "focus") {
                this.focusEle.className += " focus";
            }
        } else {
            this.focusEle = buildFocusEle(this);
            this.ele.append(this.focusEle);
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
        var view = new FocusView(viewManager, listenerLocation);
        view.ele = ele;

        return view;
    }
}

export class FocusViewBuilder extends ViewBuilder {
    constructor() {
        super();
        this.viewType = "focus";
    }

    buildView(ele, viewManager, listenerLocation) {
        return FocusView.parseByEle(ele, viewManager, listenerLocation);
    }
}

var buildFocusEle = function (view) {
    var size = view.visibleSize;

    var html = '<div class="focus" style="border: white 3px solid;border-radius: 7px;" view-id="focus"></div>'
    var focusEle = View.parseEle(html)[0];
    focusEle.style.width = size.width + "px";
    focusEle.style.height = size.height + "px";
    focusEle.style.zIndex = "-1";

    return focusEle;
}

var initStyle = function (view) {
    view.size =  view.visibleSize;

    var focusBorderInfo = view.focusBorderInfo;

    if (View.getLeft(view.ele) >= focusBorderInfo.borderWidth) {
        view.left = View.getLeft(view.ele);
    } else {
        view.left = focusBorderInfo.borderWidth;
    }

    if (View.getTop(view.ele) >= focusBorderInfo.borderHeight) {
        view.top = View.getTop(view.ele);
    } else {
        view.top = focusBorderInfo.borderHeight;
    }

    var children = view.ele.children;

    for (var i = 0; i < children.length; i++) {
        var ele = children[i];
        if (ele == view.focusEle) {
            continue;
        }
        ele.style.left = View.getLeft(ele) + focusBorderInfo.borderWidth + "px";
        ele.style.top = View.getTop(ele) + focusBorderInfo.borderHeight + "px";
    }
}