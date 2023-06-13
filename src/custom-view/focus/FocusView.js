import ItemView from "@core/frame/view/base/ItemView";
import {ViewBuilder} from "@core/frame/view/base/ViewManager";
import View from "@core/frame/view/base/View";
import VSize from "@core/frame/util/VSize";

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
        }else{
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
            if(this.ele.className){
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
    var width = View.getWidth(view.focusEle);
    var height = View.getHeight(view.focusEle);
    view.size = new VSize(width, height);

    var left = Math.round((view.width - view.visibleSize.width) / 2);

    if (view.left >= left) {
        view.left -= left;
    } else {
        view.left = 0;
    }

    var top = Math.round((view.height - view.visibleSize.height) / 2);
    if (view.top >= top) {
        view.top -= top;
    } else {
        view.top = 0;
    }

    var children = view.ele.children;

    for(var i=0;i<children.length;i++){
        var ele = children[i];
        if(ele == view.focusEle){
            continue;
        }
        ele.style.left = View.getLeft(ele) + left + "px";
        ele.style.top = View.getTop(ele) + top + "px";
    }
}