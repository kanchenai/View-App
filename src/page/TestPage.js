import Page from "@core/frame/page/Page";

import html from "@html/test.html"

import pic_001 from "@images-js/pic_001.png"
import {ScrollCenter, ScrollStart, ScrollEnd, ScrollNormal} from "@core/frame/view/base/ScrollView";
import {Adapter, HORIZONTAL, VERTICAL} from "@core/frame/view/group/RecycleView";
import {PlayInfo} from "@core/frame/player/VideoPlayer";
import VMargin from "@core/frame/util/VMargin";
import PlayerPage from "@page/PlayerPage";

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


        this.application.player.onPlayStart = this.onPlayStart;
        this.application.player.onPositionChangeListener = this.onPositionChangeListener;
    }

    onPlayStart() {
        console.log(this.pageName + " 开始播放")
        this.findViewById("bg").hide();
    }

    onPositionChangeListener = function (position, duration) {
        // console.log("position",position,"duration",duration);
    }

    onClickListener(view) {
        // this.findViewById("dialog").show();

        var playerPage = new PlayerPage();
        this.startPage(playerPage,null);
    }

    onResume() {
        var player = this.application.player;
        var playUrl = "http://l.cztvcloud.com/channels/lantian/SXshengzhou1/720p.m3u8"
        var playInfo = new PlayInfo(playUrl,0,0,640,360);
        setTimeout(function (){
            player.play(0,playInfo);
        },500);
    }

    onPause() {
        if(this.application.player.isPlaying){
            this.application.player.pause();
        }
        this.findViewById("bg").show();
    }

    onDestroy() {
        this.application.player.destroy();
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
