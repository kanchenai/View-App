import View from "@core/frame/view/base/View";
import {ViewBuilder} from "@core/frame/view/base/ViewManager";
import VSize from "@core/frame/util/VSize";
import PosterView from "@src/custom-view/poster/PosterView";

export default class PosterWhiteView extends PosterView {
    constructor(viewManager, listenerLocation) {
        super(viewManager, listenerLocation);

        this._data = {
            name: "",
            poster: null
        };

        this.nameBgEle = null;
        this.nameEle = null;

        this.props.concat({
            "poster-size": "",
        })
    }

    set name(value) {
        this.data.name = value;
        var name = this.findViewById("name");
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

        var name = this.findViewById("name");
        name.text = this.data.name;

        super.data = value;
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

    get textHeight() {
        return Math.ceil(this.posterSize.height * 0.15);
    }

    get ele() {
        return this._ele;
    }

    set ele(value) {
        super.ele = value;

        initValue(this);
        initStyle(this);//初始化样式

        this.bindText();
    }

    /**
     * 给对应的ele设置布局
     * @param html
     */

    setAttributeParam() {
        var firstFocus = super.setAttributeParam();

        //父类中的焦点高度在这里不适用，需要重新设置
        var focusEle = this.findEleById("focus");
        if (focusEle) {
            this.focusEle = focusEle;
            if (this.focusEle.className != "focus") {
                this.focusEle.className += " focus";
            }
        } else {
            this.focusEle = buildDefaultFocusEle(this);
        }

        var posterSize = this.props["poster-size"];
        if (posterSize) {
            var sizeStrs = posterSize.split(",");
            if (sizeStrs.length == 2) {
                var posterWidth = parseInt(sizeStrs[0]);
                var posterHeight = parseInt(sizeStrs[1]);
                this.posterSize = new VSize(posterWidth, posterHeight);
            }
        }

        var nameBgEle = this.findEleById("name_bg");
        if (nameBgEle) {
            this.nameBgEle = nameBgEle;
        } else {
            this.nameBgEle = buildNameBgEle(this);
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

    var html = '<div class="focus" style="border: white 3px solid;border-radius: 7px;" view-id="focus"></div>'
    var focusEle = View.parseEle(html)[0];
    focusEle.style.width = size.width + "px";
    focusEle.style.height = size.height + posterWhiteView.textHeight + "px";

    return focusEle;
}

var buildNameBgEle = function (posterView) {
    var size = posterView.posterSize;
    var html = '<div style="background: white;border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;" view-id="shadow"></div>';

    var nameBgEle = View.parseEle(html)[0];
    nameBgEle.style.width = size.width + "px";
    nameBgEle.style.height = posterView.textHeight + "px";
    return nameBgEle;
}

var buildNameEle = function (posterWhiteView) {
    var html = '<div view-type="view-text" style="white-space: nowrap;text-align: center;color: black;" view-id="name"></div>';
    var nameEle = View.parseEle(html)[0];
    nameEle.style.fontSize = posterWhiteView.textHeight - 5 + "px";
    return nameEle;
}

var initValue = function (posterWhiteView){
    posterWhiteView.ele.appendChild(posterWhiteView.nameBgEle);
    posterWhiteView.ele.appendChild(posterWhiteView.nameEle);
}

var initStyle = function (posterWhiteView) {
    var textHeight = posterWhiteView.textHeight;
    var posterSize = posterWhiteView.posterSize;

    var poster = posterWhiteView.picEle;
    var name_bg = posterWhiteView.nameBgEle;
    var name = posterWhiteView.nameEle;


    var left = Math.round((posterWhiteView.width - posterSize.width) / 2);
    name_bg.style.left = left + "px";
    name.style.left = left + 5 + "px";

    name.style.width = posterSize.width - 10 + "px";
    name.style.height = posterWhiteView.textHeight + "px";

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


