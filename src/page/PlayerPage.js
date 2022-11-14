import Page from "@core/frame/page/Page";

import html from "@html/player.html"

import pic_001 from "@images-js/pic_001.png"
import {Adapter, HORIZONTAL, VERTICAL} from "@core/frame/view/group/RecycleView";
import VideoPlayer from "@core/frame/player/VideoPlayer";
import PlayInfo from "@core/frame/player/PlayInfo";

export default class PlayerPage extends Page {
    constructor() {
        super();
        this.pageName = "PlayerPage";
    }

    onCreate(param) {
        this.html = html;
        this.player = new VideoPlayer(this);
        var playUrl = "http://live.ynurl.com/video/s10037-JCTV/index.m3u8"
        var playInfo = new PlayInfo(playUrl, 0, 0, 640, 360);

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
        this.findViewById("bg").hide();
    }

    onPlayPause() {
        console.log(this.pageName + " onPlayPause");
    }

    onPlayResume() {
        console.log(this.pageName + " onPlayResume");
    }

    onPlayStop() {
        console.log(this.pageName + " onPlayStop");
    }

    onPlayByTime(time) {
        console.log(this.pageName + " onPlayByTime", time);
    }

    onClickListener(view) {
       switch (view.id){
           case "btn_play":
               if(this.player.isPlaying){
                   view.ele.innerText = "播放"
                   this.player.pause();
               }else{
                   view.ele.innerText = "暂停"
                   this.player.resume();
               }
               break;
           case "btn_back":
               this.finish();
               break;
       }
    }

    onPause() {
        if(this.player.isPlaying){
            this.findViewById("btn_play").ele.innerText = "播放"
            this.player.pause();
        }
        this.findViewById("bg").show();
    }

    onStop() {
        if(this.player){
            this.player.stop();
        }
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
