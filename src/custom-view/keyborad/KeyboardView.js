import RecycleView, {Adapter, centerScroller} from "@core/frame/view/group/RecycleView";
import {ViewBuilder} from "@core/frame/view/base/ViewManager";

import VMargin from "@core/frame/util/VMargin";
import VSize from "@core/frame/util/VSize";
import View from "@core/frame/view/base/View";

export default class KeyboardView extends RecycleView {
    constructor(viewManager, listenerLocation) {
        super(viewManager, listenerLocation);

        this._col = 6;
        this.margin = new VMargin(0, 5, 0, 5);

        this._sizeType = "small";

        this.props.concat({
            "size-type": ""
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
        //T获取大小类型
        var sizeType = View.parseAttribute("size-type", this.ele);
        if (!sizeType) {
            sizeType = "small";
        }

        this.sizeType = sizeType;

        this.setStyle("overflow", "hidden");//自动加上超出隐藏

        return super.setAttributeParam();
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
        keyboardView.adapter = new TextAdapter();

        //TODO 使用button组件来实现，可以根据计算字母按键大小来设置

        //由于字母的按键是在，adapter中设置，所以需要在这里设置大小，字母大小+margin
        if (keyboardView.sizeType == "medium") {
            keyboardView.seatSize = new VSize(65, 65)
        } else if (keyboardView.sizeType == "mini") {
            keyboardView.seatSize = new VSize(45, 45)
        } else {
            keyboardView.seatSize = new VSize(55, 55);
        }

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
    constructor() {
        super();
        require("./keyboard.css")
        this.template = require("./keyboard.html");
    }

    bindHolder(holder, data) {
        var button = holder.findViewById("button");
        var text = holder.findEleById("text");
        var focus = holder.findEleById("focus");

        text.innerText = data;

        var width = 0;
        var height = 0;

        var fontSize = 0;

        if (this.recycleView.sizeType == "medium") {
            width = 60;
            height = 60;
            fontSize = 38;
        } else if (this.recycleView.sizeType == "mini") {
            width = 40;
            height = 40;
            fontSize = 18;
        } else {
            width = 50;
            height = 50;
            fontSize = 28;
        }

        button.width = width;
        button.height = height;

        focus.style.width = width + "px";
        focus.style.height = height + "px";

        text.style.width = width + "px";
        text.style.height = height + "px";
        text.style.lineHeight = height + "px";
        text.style.fontSize = fontSize + "px";
    }
}
