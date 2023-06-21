import ViewManager, {ViewBuilder} from "@core/frame/view/base/ViewManager";
import RecycleView, {Adapter, centerScroller} from "@core/frame/view/group/RecycleView";
import VMap from "@core/frame/util/VMap";

export default class HuarongView extends RecycleView {

    constructor(viewManager, listenerLocation) {
        super(viewManager, listenerLocation);
        this.focusable = false;
        this._pic = null;
        this._showNum = true;

        this.col = 2;

        this.emptyIndex = -1;

        this.props.concat({
            "show-num": "",
            "success": ""
        })
    }

    correct() {
        var success = true;
        for (var i = 0; i < this.col * this.col; i++) {
            if (this.data[i] != i + 1) {
                success = false;
                break;
            }
        }

        if (!success) {
            return;
        }

        this.callSuccessListener();
    }

    callSuccessListener() {
        var onSuccessListener = null;
        if (this.onSuccessListener) {
            if (typeof this.onSuccessListener == "string") {
                onSuccessListener = this.listenerLocation[this.onSuccessListener];
            } else if (this.onSuccessListener instanceof Function) {
                onSuccessListener = this.onSuccessListener;
            } else {
                console.error("成功监听设置错误");
                return;
            }
            onSuccessListener.call(this.listenerLocation, this);
        }
    }

    up() {
        var emptyRow = Math.floor(this.emptyIndex / this.col)

        if (emptyRow >= this.col - 1) {
            return;
        }

        this.data[this.emptyIndex] = this.data[this.emptyIndex + this.col];
        this.emptyIndex = this.emptyIndex + this.col;
        this.data[this.emptyIndex] = this.col * this.col;
        this.render()
        this.correct();
    }

    down() {
        var emptyRow = Math.floor(this.emptyIndex / this.col)

        if (emptyRow == 0) {
            return;
        }

        this.data[this.emptyIndex] = this.data[this.emptyIndex - this.col];
        this.emptyIndex = this.emptyIndex - this.col;
        this.data[this.emptyIndex] = this.col * this.col;
        this.render();
        this.correct();
    }

    left() {
        var emptyCol = this.emptyIndex % this.col;

        if (emptyCol == this.col - 1) {
            return;
        }

        this.data[this.emptyIndex] = this.data[this.emptyIndex + 1];
        this.emptyIndex = this.emptyIndex + 1;
        this.data[this.emptyIndex] = this.col * this.col;
        this.render();
        this.correct();
    }

    right() {
        var emptyCol = this.emptyIndex % this.col;

        if (emptyCol == 0) {
            return;
        }

        this.data[this.emptyIndex] = this.data[this.emptyIndex - 1];
        this.emptyIndex = this.emptyIndex - 1;
        this.data[this.emptyIndex] = this.col * this.col;
        this.render();
        this.correct();
    }

    initData() {
        var data = [];

        for (var i = 0; i < this.col * this.col; i++) {
            data.push(i + 1)
        }
        var gameData = [];
        for (var i = 0; i < this.col * this.col; i++) {
            var index = Math.floor(Math.random() * data.length)
            var num = data.splice(index, 1)[0];
            gameData.push(num);
            if (num == this.col * this.col) {
                this.emptyIndex = i;
            }
        }
        this.data = gameData;
    }

    get pic() {
        return this._pic;
    }

    set pic(value) {
        this._pic = value;
        this.render();
    }

    get showNum() {
        return this._showNum;
    }

    set showNum(value) {
        if (this._showNum == value) {
            return;
        }

        this._showNum = value;
        this.render();
    }

    setAttributeParam() {
        super.setAttributeParam();
        if (this.col < 2) {
            this.col = 2;
        }

        var showNum = this.props["show-num"];
        if (showNum == "0" || showNum == "false") {
            this.showNum = false;
        }

        var success = this.props["success"];//点击
        if (success) {
            this.onSuccessListener = success;
        }

        return false;
    }

    static parseByEle(ele, viewManager, listenerLocation) {
        var view = new HuarongView(viewManager, listenerLocation);
        view.ele = ele;
        view.scroller.init();
        view.measure();
        centerScroller(view);//让滚动器居中
        return view;
    }
}

export class HuarongViewBuilder extends ViewBuilder {
    constructor() {
        super();
        this.viewType = "huarong";
    }

    buildView(ele, viewManager, listenerLocation) {
        var huarongView = HuarongView.parseByEle(ele, viewManager, listenerLocation);
        huarongView.adapter = new HuarongAdapter(huarongView);
        huarongView.initData();
        return huarongView;
    }
}

class HuarongAdapter extends Adapter {
    constructor(huarongView) {
        super();

        this.template = require("./huarong-adapter.html");
        var width = 0;
        if (huarongView.width > huarongView.height) {
            width = huarongView.height / huarongView.col
        } else {
            width = huarongView.width / huarongView.col
        }

        width = Math.floor(width);
        var map = new VMap();
        map.set("size", width + "," + width);

        this._template = ViewManager.addAttributeToHtml(this.template, map);
    }

    bindHolder(holder, data) {
        var button = holder.findViewById("button");
        if (this.recycleView.pic) {
            var buttonWidth = button.width;
            var bg = button.findEleById("bg");
            var img = null;
            if (bg.children.length == 0) {
                img = document.createElement("img");
                img.width = buttonWidth * this.recycleView.col;
                img.src = this.recycleView.pic;
                bg.appendChild(img);
            } else {
                img = bg.children[0];
            }
            var index = data - 1;
            var row = Math.floor(index / this.recycleView.col);
            var col = index % this.recycleView.col;

            img.style.left = 0 - col * buttonWidth + "px";
            img.style.top = 0 - row * buttonWidth + "px";

            if (data != this.recycleView.col * this.recycleView.col) {
                img.style.display = "";
            } else {
                img.style.display = "none";
            }
        }

        if (!this.recycleView.pic || this.recycleView.showNum) {
            if (data != this.recycleView.col * this.recycleView.col) {
                button.value = data;
            } else {
                button.value = "";
            }
        } else {
            button.value = "";
        }
    }
}
