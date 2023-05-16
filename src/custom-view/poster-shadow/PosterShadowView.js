import PosterView from "@src/custom-view/poster/PosterView";
import {ViewBuilder} from "@core/frame/view/base/ViewManager";
import VSize from "@core/frame/util/VSize";
import View from "@core/frame/view/base/View";

export default class PosterShadowView extends PosterView {

    constructor(viewManager, listenerLocation) {
        super(viewManager, listenerLocation);

        this._data = {
            name: "",
            poster: null
        };

        this.shadowEle = null;
    }

    set name(value) {
        this.data.name = value;
        var name = this.findViewById("_name");
        name.text = this.data.name;
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

    get textHeight() {
        return Math.ceil(this.posterSize.height * 0.15);
    }

    get ele() {
        return this._ele;
    }

    set ele(value) {
        this._ele = value;

        var firstFocus = this.setAttributeParam()

        if (this.focusable && firstFocus && !this.viewManager.focusView) {
            this.viewManager.focusView = this;
        }

        require("./poster_shadow.css")
        this.html = require("./poster_shadow.html");
    }

    /**
     * 给对应的ele设置布局
     * @param html
     */
    set html(html) {
        this.ele.innerHTML = html;
        this.ele.appendChild(this.focusEle);
        this.ele.appendChild(this.shadowEle);

        initStyle(this);//初始化样式

        //绑定TextView和ImageView
        this.bindImage();
        this.bindText();
    }

    setAttributeParam() {
        var firstFocus = super.setAttributeParam();

        var shadowEle = this.findEleById("shadow");
        if (shadowEle) {
            shadowEle.style.zIndex = "1";
            this.shadowEle = shadowEle;
        } else {
            this.shadowEle = buildShadowEle(this);
        }

        return firstFocus;
    }

    static parseByEle(ele, viewManager, listenerLocation) {
        var view = new PosterShadowView(viewManager, listenerLocation);
        view.ele = ele;
        return view;
    }
}

export class PosterShadowViewBuilder extends ViewBuilder {
    constructor() {
        super();
        this.viewType = "poster-shadow";
    }

    buildView(ele, viewManager, listenerLocation) {
        return PosterShadowView.parseByEle(ele, viewManager, listenerLocation);
    }
}

var buildShadowEle = function (posterView) {
    var size = posterView.posterSize;
    var html = '<div style="opacity: 0.5;background: #333333;z-index: 1;"></div>';

    var shadowEle = View.parseEle(html)[0];
    shadowEle.style.width = size.width + "px";
    shadowEle.style.height = Math.ceil(size.height * 0.15) + "px";
    return shadowEle;
}

var initStyle = function (posterView) {
    var width = View.getWidth(posterView.focusEle);
    var height = View.getHeight(posterView.focusEle);
    posterView.size = new VSize(width, height);

    var posterSize = posterView.posterSize;

    var poster = posterView.findEleById("_poster");
    var shadow = posterView.shadowEle
    var name = posterView.findEleById("_name");

    poster.style.width = posterSize.width + "px";
    poster.style.height = posterSize.height + "px";

    var textHeight = posterView.textHeight;
    name.style.width = posterSize.width - 10 + "px";
    name.style.height = textHeight + "px";
    name.style.lineHeight = textHeight + "px";
    name.style.fontSize = textHeight - 5 + "px";

    var left = Math.round((posterView.width - posterSize.width) / 2);
    poster.style.left = left + "px";
    shadow.style.left = left + "px";
    name.style.left = left + "px";

    if (posterView.left >= left) {
        posterView.left -= left;
    } else {
        posterView.left = 0;
    }

    var top = Math.round((posterView.height - posterSize.height) / 2);
    poster.style.top = top + "px";
    shadow.style.top = top + posterSize.height - View.getHeight(shadow) + "px";
    name.style.top = top + posterSize.height - textHeight + "px";

    if (posterView.top >= top) {
        posterView.top -= top;
    } else {
        posterView.top = 0;
    }
}
