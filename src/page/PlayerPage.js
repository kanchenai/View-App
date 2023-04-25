import Page from "@core/frame/page/Page";

import html from "@html/player.html"

import utils from "@src/util/utils";

export default class PlayerPage extends Page {
    onCreate(param) {
        this.html = html;
        this.bg = this.findViewById("bg");

        this.player = this.findViewById("player");
        var playUrl = "http://live.ynurl.com/video/s10037-JCTV/index.m3u8"
        this.player.play(0, playUrl);

        console.log("PlayerPage")
    }

    onPositionChangeListener = function (position, duration) {
        // console.log(this.pageName + " position",position,"duration",duration);
    }

    onVolumeChangeListener(volume) {
        console.log(this.pageName + " volume", volume);
    }

    onPlayStart() {
        console.log(this.pageName + " onPlayStart");
        // this.bg.hide();
        utils.bgToVideoBg(this.bg.ele.parentNode,this.bg.ele,this.player.playInfo);
    }

    onPlayPause() {
        console.log(this.pageName + " onPlayPause");
        utils.videoBgToBg(this.bg.ele.parentNode,this.bg.ele)
    }

    onPlayResume() {
        console.log(this.pageName + " onPlayResume");
        utils.bgToVideoBg(this.bg.ele.parentNode,this.bg.ele,this.player.playInfo);
    }

    onPlayStop() {
        console.log(this.pageName + " onPlayStop");
        utils.videoBgToBg(this.bg.ele.parentNode,this.bg.ele)
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
        this.findViewById("btn_play").ele.innerText = "播放"
        this.player.pause();
    }

    onStop() {
        if(this.player){
            this.player.stop();
        }
    }
}
