import RecycleView, {Adapter, centerScroller} from "@core/frame/view/group/RecycleView";
import ViewManager, {ViewBuilder} from "@core/frame/view/base/ViewManager";

import VMargin from "@core/frame/util/VMargin";
import VSize from "@core/frame/util/VSize";
import View from "@core/frame/view/base/View";
import VMap from "@core/frame/util/VMap";
import {ScrollEnd} from "@core/frame/view/base/ScrollView";

export default class KeyboardView extends RecycleView {
    constructor(viewManager, listenerLocation) {
        super(viewManager, listenerLocation);

        this._col = 6;
        this.margin = new VMargin(0, 5, 0, 5);

        this._sizeType = "small";

        this.props.concat({
            "size-type": "",
            "size": "",
            "focus-color": "",
            "value-color": "",
        })
    }

    get sizeType() {
        return this._sizeType;
    }

    set sizeType(value) {
        this._sizeType = value;

        if (this.sizeType == "medium") {
            this.size = new VSize(390, 390)
        } else if (this.sizeType == "mini") {
            this.size = new VSize(270, 270)
        } else {
            this.size = new VSize(330, 330);
        }
    }

    setAttributeParam() {
        var firstFocus = super.setAttributeParam();
        //T获取大小类型
        var sizeType = this.props["size-type"];
        if (!sizeType) {
            sizeType = "small";
        }

        this.sizeType = sizeType;

        var size = this.props["size"];
        if (size) {
            var sizeStrs = size.split(",");
            if (sizeStrs.length == 2) {
                this.size = new VSize(parseInt(sizeStrs[0]), parseInt(sizeStrs[1]));
            }
        }

        this.setStyle("overflow", "hidden");//自动加上超出隐藏

        return firstFocus;
    }

    static parseByEle(ele, viewManager, listenerLocation) {
        var keyboardView = new KeyboardView(viewManager, listenerLocation);
        keyboardView.ele = ele;

        keyboardView.scroller.init();
        keyboardView.measure();
        centerScroller(keyboardView);//让滚动器居中

        return keyboardView;
    }
}

export class KeyboardViewBuilder extends ViewBuilder {
    constructor() {
        super();
        this.viewType = "keyboard";
    }

    buildView(ele, viewManager, listenerLocation) {
        var keyboardView = KeyboardView.parseByEle(ele, viewManager, listenerLocation);
        //TODO 优化：使用外部设置的布局，外不未设置则使用默认的
        keyboardView.adapter = new TextAdapter(keyboardView);
        keyboardView.data = keyboardData;
        return keyboardView;
    }
}

var keyboardData = [
    "A", "B", "C", "D", "E", "F",
    "G", "H", "I", "J", "K", "L",
    "M", "N", "O", "P", "Q", "R",
    "S", "T", "U", "V", "W", "X",
    "Y", "Z", "0", "1", "2", "3",
    "4", "5", "6", "7", "8", "9"]

class TextAdapter extends Adapter {
    constructor(keyboardView) {
        super();
        if(keyboardView.template){
            this.template = keyboardView.template;
        }else{
            this.template = require("./keyboard.html");
        }

        //将keyboardView的属性透传到button中
        var margin = keyboardView.margin;
        var width = Math.floor(keyboardView.width / 6 - margin.left - margin.right);
        var height = Math.floor(keyboardView.height / 6 - margin.top - margin.bottom);
        var size = width + "," + height;

        var map = new VMap();
        map.set("size", size);
        if(keyboardView.props["focus-color"]){
            map.set("focus-color", keyboardView.props["focus-color"]);
        }
        if(keyboardView.props["value-color"]){
            map.set("value-color", keyboardView.props["value-color"]);
        }

        this._template = ViewManager.addAttributeToHtml(this.template, map);
    }

    bindHolder(holder, data) {
        var button = holder.findViewById("button");
        button.value = data;
    }
}

