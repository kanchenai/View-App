import Page from "@core/frame/page/Page";

import html from "@html/test.html"

import pic_001 from "@images-js/pic_001.png"
import {ScrollCenter, ScrollStart, ScrollEnd, ScrollNormal} from "@core/frame/view/group/GroupView";
import {Adapter, HORIZONTAL, VERTICAL} from "@core/frame/view/group/RecycleView";
import {PlayInfo} from "@core/frame/player/VideoPlayer";

export default class TestPage extends Page {
    constructor() {
        super();
        this.pageName = "TestPage";
    }

    onCreate(param) {
        this.html = html;


        // var recycleView = this.findViewById("recycleView");
        // window.recycleView = recycleView;
        // console.log(recycleView)
        // // recycleView.orientation = HORIZONTAL;
        // recycleView.scrollLocate = ScrollNormal;
        // recycleView.col = 3;
        // recycleView.row = 3;
        // recycleView.circulate = true;
        // recycleView.adapter = adapter;
        //
        //
        // recycleView.data = new Array(3);

        var player = this.application.player;
        var playUrl = "http://cclive2.aniu.tv/live/anzb.m3u8"
        var playInfo = new PlayInfo(playUrl,0,0,50,50);
        player.play(0,playInfo);

        player.onPlayStart = this.onPlayStart;
        player.onPositionChangeListener = this.onPositionChangeListener;
    }

    onPlayStart(){
        console.log("开始播放")
    }

    onPositionChangeListener = function (position,duration){
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
    var image = holder.findViewById("pic");
    image.src = pic_001;

    // holder.findEleById("pic").style.background = data.color
}