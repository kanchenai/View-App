import Page from "@core/frame/page/Page";

import html from "@html/player.html"

import pic_001 from "@images-js/pic_001.png"
import {Adapter, HORIZONTAL, VERTICAL} from "@core/frame/view/group/RecycleView";
import {PlayInfo} from "@core/frame/player/VideoPlayer";

export default class PlayerPage extends Page {
    constructor() {
        super();
        this.pageName = "PlayerPage";
    }

    onCreate(param) {
        this.html = html;

        var player = this.application.player;
        var playUrl = "http://l.cztvcloud.com/channels/lantian/SXxiaoshan2/720p.m3u8"
        var playInfo = new PlayInfo(playUrl, 0, 0, 640, 360);

        setTimeout(function () {
            player.play(0, playInfo);
        }, 500);

        player.onPlayStart = this.onPlayStart;
        player.onPositionChangeListener = this.onPositionChangeListener;
    }

    onPlayStart() {
        console.log(this.pageName + " 开始播放")
        this.findViewById("bg").hide();
    }

    onPositionChangeListener = function (position, duration) {
        // console.log("position",position,"duration",duration);
    }

    onClickListener(view) {
       switch (view.id){
           case "btn_play":
               if(this.application.player.isPlaying){
                   view.ele.innerText = "播放"
                   this.application.player.pause();
               }else{
                   view.ele.innerText = "暂停"
                   this.application.player.resume();
               }
               break;
           case "btn_back":
               this.finish();
               break;
       }
    }

    onPause() {
        if(this.application.player.isPlaying){
            this.findViewById("btn_play").ele.innerText = "播放"
            this.application.player.pause();
        }
        this.findViewById("bg").show();
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
