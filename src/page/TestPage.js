import Page from "@core/frame/page/Page";

import {ScrollCenter, ScrollStart, ScrollEnd, ScrollNormal} from "@core/frame/view/base/ScrollView";
import {Adapter, HORIZONTAL, VERTICAL} from "@core/frame/view/group/RecycleView";
import VMargin from "@core/frame/util/VMargin";

export default class TestPage extends Page {
    onCreate(param) {
        this.html = require("@html/test.html");

        this.poster_list = this.findViewById("poster_list");
        this.poster_list.margin.right = -100;
        this.poster_list.onFocusChangeListener = onPosterFocusChangeListener;
        this.poster_list.adapter = new PosterAdapter();
        this.poster_list.data = new Array(12);
    }

    onClickListener(view) {
        this.i("点击：" + view.data)
    }

    onScrollStartListener(scrollView, x, y) {
        console.log("start", x, y)
    }

    onScrollingListener(scrollView, x, y) {
        console.log("scrolling", x, y)
    }

    onScrollEndListener(scrollView, x, y) {
        console.log("end", x, y)
    }
}

class PosterAdapter extends Adapter {
    bindHolder(holder, data) {
        var poster = holder.findViewById("poster");
        poster.data = {
            name: ""+holder.index,
            poster: require("@images/poster.png")
        };
    }
}

var onPosterFocusChangeListener = function (view, hasFocus) {
    if (!hasFocus) {
        return;
    }

    var poster_list = this.poster_list;
    var selectIndex = poster_list.selectIndex;
    var num = 6;
    for (var i = selectIndex - num; i <= selectIndex + num; i++) {
        var holder = poster_list.activeHolderMap.get(i);
        if (!holder) {
            holder = poster_list.activeHolderMap.get((i + poster_list.data.length) % poster_list.data.length);
        }

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
