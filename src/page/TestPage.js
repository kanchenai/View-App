import Page from "@core/frame/page/Page";

import html from "@html/test.html"

import pic_001 from "@images-js/pic_001.png"
import {ScrollCenter, ScrollStart, ScrollEnd, ScrollNormal} from "@core/frame/view/group/GroupView";
import {Adapter, HORIZONTAL, VERTICAL} from "@core/frame/view/group/RecycleView";
import {PlayInfo} from "@core/frame/player/VideoPlayer";
import VMargin from "@core/frame/util/VMargin";

export default class TestPage extends Page {
    constructor() {
        super();
        this.pageName = "TestPage";
    }

    onCreate(param) {
        this.html = html;


        this.recycleView = this.findViewById("recycleView");
        console.log(this.recycleView)
        // recycleView.orientation = HORIZONTAL;
        this.recycleView.scrollLocate = ScrollNormal;
        this.recycleView.col = 1;
        this.recycleView.row = 3;
        this.recycleView.circulate = true;
        this.recycleView.margin = new VMargin(5,5,5,5);
        this.recycleView.adapter = adapter;
        this.recycleView.data = new Array(55);

        // var player = this.application.player;
        // var playUrl = "http://cclive2.aniu.tv/live/anzb.m3u8"
        // var playInfo = new PlayInfo(playUrl,0,0,50,50);
        // player.play(0,playInfo);
        //
        // player.onPlayStart = this.onPlayStart;
        // player.onPositionChangeListener = this.onPositionChangeListener;
    }

    onPlayStart() {
        console.log("开始播放")
    }

    onPositionChangeListener = function (position, duration) {
        // console.log("position",position,"duration",duration);
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