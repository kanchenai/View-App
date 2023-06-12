import RecycleView, {Adapter, centerScroller, HORIZONTAL} from "@core/frame/view/group/RecycleView";
import ViewManager, {ViewBuilder} from "@core/frame/view/base/ViewManager";
import {ScrollCenter} from "@core/frame/view/base/ScrollView";
import VMap from "@core/frame/util/VMap";

export default class CarouselView extends RecycleView {
    constructor(viewManager, listenerLocation) {
        super(viewManager, listenerLocation);

        this._orientation = HORIZONTAL;
        this.scrollLocate = ScrollCenter;
        this.loop = true;
        this.circulate = true;

        this.props.concat({
            "poster-size": ""
        })
    }

    set data(value) {
        super.data = value;
        this.scrollByIndex(0);
    }

    get data() {
        return this._data;
    }

    callFocusChangeListener(view, hasFocus, intercept) {
        if (hasFocus) {
            this.refreshEnlarge();
        }

        super.callFocusChangeListener(view, hasFocus, intercept);
    }

    scrollByIndex(index) {
        super.scrollByIndex(index);
        //设置放大缩小
        this.refreshEnlarge();
    }

    refreshEnlarge() {
        var selectIndex = this.selectIndex;
        var num = 6;
        for (var i = selectIndex - num; i <= selectIndex + num; i++) {
            var holder = this.activeHolderMap.get(i);

            if (!holder) {
                continue;
            }

            var disNum = Math.abs(i - selectIndex);
            var poster = holder.findViewById("poster");
            poster.fatherView.setStyle("zIndex", num - disNum + 1);

            var focusEnlarge = (10 - disNum) * 10;
            poster.enlarge(focusEnlarge)
        }
    }

    static parseByEle(ele, viewManager, listenerLocation) {
        var view = new CarouselView(viewManager, listenerLocation);
        view.ele = ele;

        view.scroller.init();
        view.measure();
        centerScroller(view);//让滚动器居中

        return view;
    }
}

export class CarouselViewBuilder extends ViewBuilder {
    constructor(props) {
        super(props);
        this.viewType = "carousel";
    }

    buildView(ele, viewManager, listenerLocation) {
        var carousel = CarouselView.parseByEle(ele, viewManager, listenerLocation);
        carousel.adapter = new PosterAdapter(carousel);
        return carousel;
    }
}

class PosterAdapter extends Adapter {
    constructor(carouselView) {
        super();

        if (carouselView.template) {
            this.template = carouselView.template;
        } else {
            this.template = require("./poster.html");
        }

        var posterSize = carouselView.props["poster-size"]
        var map = new VMap();
        if (posterSize) {
            map.set("size", posterSize);
        }

        this._template = ViewManager.addAttributeToHtml(this.template, map);
    }

    bindHolder(holder, data) {
        var poster = holder.findViewById("poster");
        if (!data) {
            poster.data = {poster: null};
        } else {
            poster.data = data;
        }

    }
}