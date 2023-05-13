import ItemView from "@core/frame/view/base/ItemView";
import View from "@core/frame/view/base/View";
import {ViewBuilder} from "@core/frame/view/base/ViewManager";
import VSize from "@core/frame/util/VSize";

/**
 * 海报控件，标题背景为白色
 * 如果外部设置焦点框：
 *  1.需要设置宽高，id为focus
 *  2.下方的文字高度为海报高度的15%，宽度相同
 *  3.控件大小会改成焦点框大小，内部的海报文字自动调整为居中
 *  4.焦点框大小要包含文字部分
 */
export default class PosterWhiteView extends ItemView {
    constructor(viewManager, listenerLocation) {
        super(viewManager, listenerLocation);

        this._data = {
            name: "",
            poster: null
        };

        this.focusEle = null;

        this._sizeType = "small";

        this._posterSize = new VSize(0, 0);

        this.props.concat({
            "size-type": "",
            "poster-size": ""
        })
    }

    set name(value) {
        this.data.name = value;
        var name = this.findViewById("_name");
        name.text = this.data.name;
    }

    set poster(value) {
        this.data.poster = value;
        var poster = this.findViewById("_poster");
        poster.src = this.data.poster;
    }

    set data(value) {
        this._data = value;
        if (!this._data) {
            return;
        }

        var name = this.findViewById("_name");
        name.text = this.data.name;

        var poster = this.findViewById("_poster");
        poster.src = this.data.poster;
    }

    get data() {
        return this._data;
    }

    get sizeType() {
        return this._sizeType;
    }

    set sizeType(value) {
        this._sizeType = value;

        if (this.sizeType == "medium") {
            this.posterSize = new VSize(216, 280)
        } else if (this.sizeType == "mini") {
            this.posterSize = new VSize(136, 176)
        } else {
            this.posterSize = new VSize(176, 232);
        }
    }

    get posterSize() {
        return this._posterSize;
    }

    set posterSize(value) {
        this._posterSize = value;
    }

    get textHeight() {
        return Math.ceil(this.posterSize.height * 0.15);
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
        require("./poster_white.css")
        this.html = require("./poster_white.html");
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

    setAttributeParam() {
        var sizeType = this.props["size-type"];
        if (!sizeType) {
            sizeType = "small";
        }

        this.sizeType = sizeType;

        var posterSize = this.props["poster-size"];
        if (posterSize) {
            var sizeStrs = posterSize.split(",");
            if (sizeStrs.length == 2) {
                var posterWidth = parseInt(sizeStrs[0]);
                var posterHeight = parseInt(sizeStrs[1]);
                this.posterSize = new VSize(posterWidth, posterHeight);
            }
        }

        var focusEle = this.findEleById("focus");
        if (focusEle) {
            this.focusEle = focusEle;
            var width = View.getWidth(this.focusEle);
            var height = View.getHeight(this.focusEle);
            this.size = new VSize(width, height);

            this.focusEle.className = "focus";
        } else {
            this.focusEle = buildDefaultFocusEle(this);
            this.size = new VSize(this.posterSize.width + 6, this.posterSize.height + this.textHeight + 6);
        }

        //将left、top设置到style中，left、top有可能在css中
        this.left = this.left;
        this.top = this.top;

        this.ele.className = "item"

        return super.setAttributeParam();
    }


    static parseByEle(ele, viewManager, listenerLocation) {
        var view = new PosterWhiteView(viewManager, listenerLocation);
        view.ele = ele;
        return view;
    }
}

export class PosterWhiteViewBuilder extends ViewBuilder {
    constructor() {
        super();
        this.viewType = "poster-white";
    }

    buildView(ele, viewManager, listenerLocation) {
        return PosterWhiteView.parseByEle(ele, viewManager, listenerLocation);
    }
}

var buildDefaultFocusEle = function (posterWhiteView) {
    var size = posterWhiteView.posterSize;

    var html = '<div class="focus" style="border: white 3px solid;" view-id="focus"></div>'
    var focusEle = View.parseEle(html)[0];
    focusEle.style.width = size.width + "px";
    focusEle.style.height = size.height + posterWhiteView.textHeight + "px";
    return focusEle;
}

var initStyle = function (posterWhiteView) {
    var textHeight = posterWhiteView.textHeight;
    var posterSize = posterWhiteView.posterSize;


    var poster = posterWhiteView.findEleById("_poster");
    var name_bg = posterWhiteView.findEleById("_name_bg");
    var name = posterWhiteView.findEleById("_name");

    poster.style.width = posterSize.width + "px";
    poster.style.height = posterSize.height + "px";

    name_bg.style.width = posterSize.width + "px";
    name_bg.style.height = textHeight + "px";

    name.style.width = posterSize.width - 10 + "px";
    name.style.height = textHeight + "px";
    name.style.lineHeight = textHeight + "px";
    name.style.fontSize = textHeight - 5 + "px";

    var left = Math.round((posterWhiteView.width - posterSize.width) / 2);
    poster.style.left = left + "px";
    name_bg.style.left = left + "px";
    name.style.left = left + 5 + "px";

    if (posterWhiteView.left >= left) {
        posterWhiteView.left -= left;
    } else {
        posterWhiteView.left = 0;
    }

    var top = Math.round((posterWhiteView.height - posterSize.height - textHeight) / 2);
    poster.style.top = top + "px";
    if (posterWhiteView.top >= top) {
        posterWhiteView.top -= top;
    } else {
        posterWhiteView.top = 0;
    }


    name_bg.style.top = top + posterSize.height + "px";
    name.style.top = top + posterSize.height + "px";

}

