import Page from "@core/frame/page/Page";

import pic_001 from "@images/pic_001.png"
import {ScrollCenter, ScrollStart, ScrollEnd, ScrollNormal} from "@core/frame/view/base/ScrollView";
import {Adapter, HORIZONTAL, VERTICAL} from "@core/frame/view/group/RecycleView";
import VMargin from "@core/frame/util/VMargin";
import PlayerPage from "@page/PlayerPage";
import LogView, {LEFT, LEFT_BOTTOM, RIGHT_TOP} from "@core/frame/view/single/LogView";

export default class TestPage extends Page {
    onCreate(param) {
        this.html = require("@html/test.html");
        this.logView.positionMode = RIGHT_TOP;
        this.bg = this.findViewById("bg");
        this.textView = this.findViewById("text_view");

        this.countdown = this.findViewById("countdown");

        this.recycle = this.findViewById("recycle");
        console.log(this.recycle)
        // this.recycle.orientation = HORIZONTAL;
        this.recycle.scrollLocate = ScrollCenter;
        this.recycle.col = 4;
        this.recycle.row = 4;
        // this.recycle.circulate = true;
        this.recycle.margin = new VMargin(0, 15, 0, 15);
        this.recycle.adapter = adapter;
        this.recycle.data = new Array(10);

        this.keyboard = this.findViewById("keyboard");
        this.keyboard.onClickListener = function (view) {
            this.logView.addLog("12点击：" + view.data)
        }

        this.button_group = this.findViewById("button_group");
        this.button_group.onClickListener = onButtonClickListener;

        this.poster_0 = this.findViewById("poster_0");
        this.poster_0.name = "这是一段文字加长"
        this.poster_0.poster = require("@images/poster.png")

        this.poster_list = this.findViewById("poster_list");
        this.poster_list.adapter = new PosterAdapter();
        this.poster_list.data = new Array(12);

        this.textView.marquee();
        this.countdown.start();

        // this.textView.hide();
        // this.countdown.hide();
        // this.recycle.hide();
        // this.keyboard.hide();
        // this.button_group.hide();
    }

    onClickListener(view) {
        // this.findViewById("dialog").show();

        // var playerPage = new PlayerPage();
        // this.startPage(playerPage, null);

        this.i("点击：" + view.data)
    }

    onCountChangeListener(view, count) {
        this.i(view.id + ":" + count)
    }

    onResume() {
    }

    onPause() {
    }

    onStop() {
    }

    onDestroy() {
    }
}

var adapter = new Adapter();

adapter.bindHolder = function (holder, data) {
    var len = this.recycleView.data.length;
    var index = (holder.index + len) % len;
    var test_div = holder.findEleById("test_div");

    test_div.innerText = index;

    var item = holder.findViewById("post");
    // var image = holder.findViewById("pic");//懒加载，存在已加载的图片，还需要再加载
    var image = holder.findEleById("pic");//这个可以，但不是懒加载
    image.src = pic_001;

    // holder.findEleById("pic").style.background = data.color
}

var onButtonClickListener = function (view) {
    console.log(view.id);
    switch (view.id) {
        case "i":
            this.i("提示信息")
            break;
        case "w":
            this.w("警告信息")
            break;
        case "e":
            this.e("错误信息")
            break;

    }

}

// var onCountChangeListener = function (view,count){
//     this.i(view.id,count)
// }

class PosterAdapter extends Adapter {
    bindHolder(holder, data) {
        var poster = holder.findViewById("poster");
        poster.data = {
            name: "这是一段文字加长",
            poster: require("@images/poster.png")
        };
    }
}
