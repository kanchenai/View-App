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
    constructor() {
        super();
        this.pageName = "TestPage";
    }

    onCreate(param) {
        this.html = html;

        this.bg = this.findViewById("bg");

        this.recycleView = this.findViewById("recycleView");
        console.log(this.recycleView)
        // recycleView.orientation = HORIZONTAL;
        this.recycleView.scrollLocate = ScrollNormal;
        this.recycleView.col = 1;
        this.recycleView.row = 3;
        this.recycleView.circulate = true;
        this.recycleView.margin = new VMargin(5, 5, 5, 5);
        this.recycleView.adapter = adapter;
        this.recycleView.data = new Array(55);

        this.player = new VideoPlayer(this);

        var playUrl = "http://live.ynurl.com/video/s10027-LCDST/index.m3u8"
        var playInfo = new PlayInfo(playUrl, 0, 0, 1280, 720);
        this.player.play(0, playInfo);

        this.player.onPositionChangeListener = this.onPositionChangeListener;
        this.player.onVolumeChangeListener = "onVolumeChangeListener";
        this.player.onPlayStart = this.onPlayStart;
        this.player.onPlayComplete = "";
        this.player.onPlayPause = "onPlayPause";
        this.player.onPlayResume = "onPlayResume";
        this.player.onPlayStop = "onPlayStop";
        this.player.onPlayError = "";
        this.player.onPlayByTime = "onPlayByTime";
    }

    onPositionChangeListener = function (position, duration) {
        console.log(this.pageName + " position",position,"duration",duration);
    }

    onVolumeChangeListener(volume) {
        console.log(this.pageName + " volume", volume);
    }

    onPlayStart() {
        console.log(this.pageName + " onPlayStart");
        this.bg.hide();
    }

    onPlayPause() {
        console.log(this.pageName + " onPlayPause");
        this.bg.show();
    }

    onPlayResume() {
        console.log(this.pageName + " onPlayResume");
        this.bg.hide();
    }

    onPlayStop() {
        console.log(this.pageName + " onPlayStop");
        this.bg.show();
    }

    onPlayByTime(time) {
        console.log(this.pageName + " onPlayByTime", time);
    }

    onClickListener(view) {
        // this.findViewById("dialog").show();

        var playerPage = new PlayerPage();
        this.startPage(playerPage, null);
    }

    onResume() {
        if(!this.player.isPlaying){
            this.player.resume();
        }
    }

    onPause() {
        if (this.player.isPlaying) {
            this.player.pause();
        }
    }

    onStop() {
        if (this.player) {
            this.player.stop();
        }
    }

    onDestroy() {
        this.player.destroy();
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
