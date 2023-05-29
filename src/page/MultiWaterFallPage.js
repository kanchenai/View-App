import Page from "@core/frame/page/Page";
import Fragment_0 from "@fragment/multi_water_fall/Fragment_0";
import {Adapter} from "@core/frame/view/group/RecycleView";

export default class MultiWaterFallPage extends Page {
    onCreate(param) {
        this.html = require("../html/multi_water_fall.html");

        this.initView();
        this.setView();
        this.initUtil();
    }

    initView() {
        this.navigation = this.findViewById("navigation");
        this.navigation.adapter = new NavAdapter();
        this.frame = this.findViewById("frame");
        this.frame.addFragmentList([
            new Fragment_0(this.viewManager),
            new Fragment_0(this.viewManager),
            new Fragment_0(this.viewManager),
            new Fragment_0(this.viewManager),
            new Fragment_0(this.viewManager),
            new Fragment_0(this.viewManager)
        ]);
    }

    setView() {
        this.navigation.onFocusChangeListener = onNavFocusChangeListener;
    }

    initUtil() {
        this.navigation.data = ["推荐", "电视剧", "电影", "少儿", "动漫", "直播"]
    }
}

class NavAdapter extends Adapter {
    bindHolder(holder, data) {
        var button = holder.findViewById("button");
        button.value = data;
    }
}

var onNavFocusChangeListener = function (view, hasFocus) {
    if (!hasFocus) {
        return;
    }

    var index = this.navigation.selectIndex;
    this.frame.switchTo(index);
}