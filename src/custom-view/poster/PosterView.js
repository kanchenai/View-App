import ItemView from "@core/frame/view/base/ItemView";
import {ViewBuilder} from "@core/frame/view/base/ViewManager";
import VSize from "@core/frame/util/VSize";
import View from "@core/frame/view/base/View";

export default class PosterView extends ItemView {
    constructor(viewManager, listenerLocation) {
        super(viewManager, listenerLocation);

        this._data = {
            poster: null
        };

        this.focusEle = null;
        this.picEle = null;

        this._sizeType = "small";
        this.posterSize = new VSize(0, 0);

        this.props.concat({
            "size-type": "",
            "size": "",
            "focus-enlarge": ""
        })
    }

    set poster(value) {
        this.data.poster = value;
        this.picEle.src = this.data.poster;
    }

    set data(value) {
        this._data = value;
        if (!this._data) {
            return;
        }

        this.picEle.src = this.data.poster;
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

        initValue(this);
        initStyle(this);//初始化样式

        //绑定TextView和ImageView
        this.bindImage();
    }

    setAttributeParam() {
        var firstFocus = super.setAttributeParam();
        var sizeType = this.props["size-type"];
        if (!sizeType) {
            sizeType = "small";
        }

        this.sizeType = sizeType;

        var posterSize = this.props["size"];
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
            if (this.focusEle.className != "focus") {
                this.focusEle.className += " focus";
            }
        } else {
            this.focusEle = buildDefaultFocusEle(this);
        }

        var picEle = this.findEleById("pic");
        if (picEle) {
            this.picEle = picEle;
        } else {
            this.picEle = buildPicEle();
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
        var poster = new PosterView(viewManager, listenerLocation);
        poster.ele = ele;
        return poster;

    }
}

export class PosterViewBuilder extends ViewBuilder {
    constructor() {
        super();
        this.viewType = "poster";
    }

    buildView(ele, viewManager, listenerLocation) {
        return PosterView.parseByEle(ele, viewManager, listenerLocation);
    }
}

var buildPicEle = function (){
    var html = '<img style="border-radius: 7px;" view-id="pic">';
    var picEle = View.parseEle(html)[0];

    return picEle;
}

var buildDefaultFocusEle = function (posterView) {
    var size = posterView.posterSize;

    var html = '<div class="focus" style="border: white 3px solid;border-radius: 7px;" view-id="focus"></div>'
    var focusEle = View.parseEle(html)[0];
    focusEle.style.width = size.width + "px";
    focusEle.style.height = size.height + "px";

    return focusEle;
}

var initValue = function (posterView){
    posterView.ele.appendChild(posterView.focusEle);
    posterView.ele.appendChild(posterView.picEle);
}

var initStyle = function (posterView) {
    var width = View.getWidth(posterView.focusEle);
    var height = View.getHeight(posterView.focusEle);
    posterView.size = new VSize(width, height);

    var posterSize = posterView.posterSize;

    var poster = posterView.picEle;

    poster.style.width = posterSize.width + "px";
    poster.style.height = posterSize.height + "px";

    var left = Math.round((posterView.width - posterSize.width) / 2);
    poster.style.left = left + "px";

    if (posterView.left >= left) {
        posterView.left -= left;
    } else {
        posterView.left = 0;
    }

    var top = Math.round((posterView.height - posterSize.height) / 2);
    poster.style.top = top + "px";
    if (posterView.top >= top) {
        posterView.top -= top;
    } else {
        posterView.top = 0;
    }
}
