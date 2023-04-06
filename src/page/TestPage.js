import Page from "@core/frame/page/Page";

import html from "@html/test.html"

import pic_001 from "@images-js/pic_001.png"
import {ScrollCenter, ScrollStart, ScrollEnd, ScrollNormal} from "@core/frame/view/base/ScrollView";
import {Adapter, HORIZONTAL, VERTICAL} from "@core/frame/view/group/RecycleView";
import VideoPlayer from "@core/frame/player/VideoPlayer";
import VMargin from "@core/frame/util/VMargin";
import PlayerPage from "@page/PlayerPage";
import PlayInfo from "@core/frame/player/PlayInfo";

export default class TestPage extends Page {
    onCreate(param) {
        this.html = html;

        this.bg = this.findViewById("bg");

        this.recycle = this.findViewById("recycle");
        console.log(this.recycle)
        // recycle.orientation = HORIZONTAL;
        this.recycle.scrollLocate = ScrollNormal;
        this.recycle.col = 1;
        this.recycle.row = 3;
        this.recycle.circulate = true;
        this.recycle.margin = new VMargin(5, 5, 5, 5);
        this.recycle.adapter = adapter;
        this.recycle.data = new Array(55);

        console.log(this.childViews);
    }

    onClickListener(view) {
        // this.findViewById("dialog").show();

        var playerPage = new PlayerPage();
        this.startPage(playerPage, null);
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
