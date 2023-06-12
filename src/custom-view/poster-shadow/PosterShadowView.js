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
        this.nameEle = null;
    }

    set name(value) {
        this.data.name = value;
        var name = this.findViewById("name");
        name.text = this.data.name;
    }

    set data(value) {
        this._data = value;
        if (!this._data) {
            return;
        }
        var name = this.findViewById("name");
        name.text = this.data.name;

        super.data = value;
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
        super.ele = value;

        initValue(this);
        initStyle(this);
        this.bindText();
    }

    setAttributeParam() {
        var firstFocus = super.setAttributeParam();

        var shadowEle = this.findEleById("shadow");
        if (shadowEle) {
            this.shadowEle = shadowEle;
        } else {
            this.shadowEle = buildShadowEle(this);
        }

        var nameEle = this.findEleById("name");
        if (nameEle) {
            this.nameEle = nameEle;
        } else {
            this.nameEle = buildNameEle(this);
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
    var html = '<div style="opacity: 0.5;background: #333333;" view-id="shadow"></div>';

    var shadowEle = View.parseEle(html)[0];
    shadowEle.style.width = size.width + "px";
    shadowEle.style.height = posterView.textHeight + "px";
    return shadowEle;
}

var buildNameEle = function (posterView) {
    var html = '<div view-type="view-text" style="white-space: nowrap;text-align: center;color: white;" view-id="name"></div>';

    var nameEle = View.parseEle(html)[0];

    nameEle.style.fontSize = posterView.textHeight - 5 + "px";
    return nameEle;
}

var initValue = function (posterView) {
    posterView.ele.appendChild(posterView.shadowEle);
    posterView.ele.appendChild(posterView.nameEle);
}

var initStyle = function (posterView) {
    var posterSize = posterView.posterSize;
    var top = Math.round((posterView.height - posterSize.height) / 2);
    posterView.nameEle.style.top = top + posterSize.height - posterView.textHeight + "px";
    posterView.shadowEle.style.top = top + posterSize.height - View.getHeight(posterView.shadowEle) + "px";


    posterView.nameEle.style.width = posterSize.width - 10 + "px";
    posterView.nameEle.style.height = posterView.textHeight + "px";

    var left = Math.round((posterView.width - posterSize.width) / 2);
    posterView.nameEle.style.left = left + 5 + "px";
    posterView.shadowEle.style.left = left + "px";
}
