import Fragment from "@core/frame/view/group/Fragment";

import html from "../html/fragment/fragment_0.html"
import VideoPlayer from "@core/frame/player/VideoPlayer";
import PlayInfo from "@core/frame/player/PlayInfo";

export default class Fragment_0 extends Fragment{
    onCreate() {
        console.log("Fragment_0","-onCreate");
        this.html = html;

        this.player = new VideoPlayer(this);

        var playUrl = "http://live.ynurl.com/video/s10027-LCDST/index.m3u8"
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
        console.log("Fragment_0 position",position,"duration",duration);
    }

    onVolumeChangeListener(volume) {
        console.log("Fragment_0 volume", volume);
    }

    onPlayStart() {
        console.log("Fragment_0 onPlayStart");
        this.page.bg.hide();
    }

    onPlayPause() {
        console.log("Fragment_0 onPlayPause");
        this.page.bg.show();
    }

    onPlayResume() {
        console.log("Fragment_0 onPlayResume");
        this.page.bg.hide();
    }

    onPlayStop() {
        console.log("Fragment_0 onPlayStop");
        this.page.bg.show();
    }

    onPlayByTime(time) {
        console.log("Fragment_0 onPlayByTime", time);
    }


    onResume() {
        console.log("Fragment_0","-onResume");

        if(!this.player.isPlaying){
            this.player.resume();
        }
    }

    onPause() {
        console.log("Fragment_0","-onPause");
        this.player.pause();
    }

    onStop() {
        // console.log("Fragment_0","-onStop");
        if (this.player) {
            this.player.stop();
        }
    }

    onDestroy() {
        // console.log("Fragment_0","-onDestroy");
        if (this.player) {
            this.player.destroy();
        }
    }
}
