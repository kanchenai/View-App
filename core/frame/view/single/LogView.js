import RecycleView, {Adapter, Holder} from "@core/frame/view/group/RecycleView";
import {ScrollEnd} from "@core/frame/view/base/ScrollView";
import html from "@core/frame/view/html/log_adapter.html"

export default class LogView extends RecycleView {
    constructor(viewManager) {
        super(viewManager);

        // this.animation = false;

        // this.scrollLocate = ScrollEnd;

        //默认位置：右上角
        this._positionMode = LEFT_TOP;


        //1.布局最外层的ele
        this.ele = buildEle(500, 200);
        this.page.appendChild(this.ele);
        this.html = "";

        refreshPosition(this, this._positionMode);

        this.adapter = new LogAdapter();
    }

    i(info){
        this.addLog(info,"i")
    }

    w(info){
        this.addLog(info,"w")
    }

    e(info){
        this.addLog(info,"e")
    }

    addLog(info,level) {
        if (!this.isShowing) {
            return;
        }

        var date = new Date();
        var time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + " " + date.getMilliseconds();
        var item = {
            time: time,
            info: info,
            level:level
        }

        var baseHolder = this.activeHolderMap.get(this.baseIndex);
        if(baseHolder){
            baseHolder.component.findViewById("info").clearMarquee();
        }

        this.push(item);

        this.scrollByIndex(this.data.length - 1)
        var component = this.activeHolderMap.get(this.data.length - 1).component;
        component.findViewById("info").marquee();
    }

    set positionMode(value) {
        this._positionMode = value;
        refreshPosition(this, this._positionMode);
    }

    get positionMode() {
        return this._positionMode;
    }
}

//控件显示位置
export var LEFT_TOP = "0";
export var LEFT = "1";
export var LEFT_BOTTOM = "2";

export var TOP = "3";
export var CENTER = "4";
export var BOTTOM = "5";

export var RIGHT_TOP = "6";
export var RIGHT = "7";
export var RIGHT_BOTTOM = "8";

/**
 * 创建外层ele
 * @param page
 */
var buildEle = function (width, height) {
    var div = document.createElement("div");

    var style = div.style;
    style.width = width + "px";
    style.height = height + "px";
    style.overflow = "hidden";
    style.zIndex = "101";

    var mode = process.env.NODE_ENV || "production";//获取当前的模式,development:开发模式；production：生产模式
    if (mode != "development") {
        style.display = "none";
    }

    return div;
}

var refreshPosition = function (logView, positionMode) {
    var page = logView.page;
    var pageWidth = page.width;
    var pageHeight = page.height;
    var viewWidth = logView.width;
    var viewHeight = logView.height;

    var left = 0;
    var top = 0;

    var padding = 30;
    switch (positionMode) {
        case LEFT_TOP:
            left = padding;
            top = padding;
            break;
        case LEFT:
            left = padding;
            top = (pageHeight - viewHeight) / 2;
            break;
        case LEFT_BOTTOM:
            left = padding;
            top = pageHeight - padding - viewHeight;
            break;
        case TOP:
            left = (pageWidth - viewWidth) / 2;
            top = padding;
            break;
        case CENTER:
            left = (pageWidth - viewWidth) / 2;
            top = (pageHeight - viewHeight) / 2;
            break;
        case BOTTOM:
            left = (pageWidth - viewWidth) / 2;
            top = pageHeight - padding - viewHeight;
            break;
        case RIGHT_TOP:
            left = pageWidth - padding - viewWidth;
            top = padding;
            break;
        case RIGHT:
            left = pageWidth - padding - viewWidth;
            top = (pageHeight - viewHeight) / 2;
            break;
        case RIGHT_BOTTOM:
            left = pageWidth - padding - viewWidth;
            top = pageHeight - padding - viewHeight;
            break;
    }

    logView.left = left;
    logView.top = top;
}

class LogAdapter extends Adapter {
    constructor() {
        super();
        this.template = html;
    }

    bindHolder(holder, data) {
        var bg = holder.findEleById("bg");
        var time = holder.findEleById("time");
        var info = holder.findViewById("info");

        var index = holder.dataIndex;

        bg.style.width = this.width + "px";
        bg.style.opacity = "0.6";
        if (index % 2 == 1) {
            bg.style.background = "#D2D2D2";
        } else {
            bg.style.background = "#777777";
        }

        time.innerText = data.time;
        info.text = data.info;

        var level = data.level;

        switch (level){
            case "i":
                time.style.color = "#01ab01";
                info.setStyle("color","#01ab01");
                break;
            case "w":
                time.style.color = "#fff500";
                info.setStyle("color","#fff500");
                break;
            case "e":
                time.style.color = "red";
                info.setStyle("color","red");
                break;
            default:
                time.style.color = "white";
                info.setStyle("color","white");
                break;
        }
    }
}
