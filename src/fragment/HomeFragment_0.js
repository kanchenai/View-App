import Fragment from "../../core/frame/view/group/Fragment";

import html from "../html/fragment/home_fragment_0.html"
import PlayInfo from "@core/frame/player/PlayInfo";
import VideoPlayer from "@core/frame/player/VideoPlayer";

export default class HomeFragment_0 extends Fragment{
    onCreate() {
        this.html = html;
        console.log("HomeFragment_0",this.page.param)
        this.initView();
        this.setView();
        this.initUtil();
    }

    initView(){
        this.small_video = this.findViewById("small_video");
        if(!this.page.focusView){//page启动，初始焦点不在page，在当前fragment
            this.small_video.requestFocus();
        }

        this.small_view_pic = this.findViewById("small_view_pic");

        var playUrl = "http://live.ynurl.com/video/s10027-LCDST/index.m3u8"

        // this.player = new VideoPlayer(this);
        var rect = this.small_view_pic.ele.getBoundingClientRect();

        var playInfo = new PlayInfo(playUrl, rect.left, rect.top, rect.width, rect.height);
        // this.player.play(0, playInfo);

        // this.player.onPlayStart = "onPlayStart";
        // this.player.onPlayPause = "onPlayPause";
        // this.player.onPlayResume = "onPlayResume";
        // this.player.onPlayStop = "onPlayStop";
    }

    setView(){}

    initUtil(){}

    onPlayStart() {
        console.log("HomeFragment_0 onPlayStart");
        let that = this;
        setTimeout(function (){
            that.page.bgToVideoBg(that.player.playInfo);
        });
        this.small_view_pic.hide();
    }

    onPlayPause() {
        console.log("HomeFragment_0 onPlayPause");
        this.page.videoBgToBg();
        this.small_view_pic.show();
    }

    onPlayResume() {
        console.log("HomeFragment_0 onPlayResume");
        // this.page.bgToVideoBg(this.player.playInfo);
        this.small_view_pic.hide();
    }

    onPlayStop() {
        console.log("HomeFragment_0 onPlayStop");
        this.page.videoBgToBg();
        this.small_view_pic.show();
    }

    onScrollStartListener(scrollView, x, y) {
        // this.player.pause();
    }

    onScrollEndListener(scrollView, x, y) {
        if(y == 0){
            // if(this.player && !this.player.isPlaying){
            //     this.player.resume();
            // }
        }
    }

    onResume() {
        // if(this.player && !this.player.isPlaying){
        //     this.player.resume();
        // }
    }

    onPause() {
        // this.player.pause();
    }

    onStop() {
        // this.player.stop();
    }
}
