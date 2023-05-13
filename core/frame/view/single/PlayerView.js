import View from "@core/frame/view/base/View";
import {ViewBuilder} from "@core/frame/view/base/ViewManager";
import VideoPlayer from "@core/frame/player/VideoPlayer";
import PlayInfo from "@core/frame/player/PlayInfo";

export default class PlayerView extends View{
    constructor(viewManager, listenerLocation) {
        super(viewManager, listenerLocation);

        //未播放时的遮挡图，可以是loading，也可以是内容图
        //播放器
        this.videoPlayer = new VideoPlayer(listenerLocation);

        //监听,默认在listenerLocation中寻找
        this.videoPlayer.onPositionChangeListener = "onPositionChangeListener";
        this.videoPlayer.onVolumeChangeListener = "onVolumeChangeListener";
        this.videoPlayer.onPlayStart = "onPlayStart";
        this.videoPlayer.onPlayComplete = "onPlayComplete";
        this.videoPlayer.onPlayPause = "onPlayPause";
        this.videoPlayer.onPlayResume = "onPlayResume";
        this.videoPlayer.onPlayStop = "onPlayStop";
        this.videoPlayer.onPlayError = "onPlayError";
        this.videoPlayer.onPlayByTime = "onPlayByTime";
    }

    play(startTime, playUrl, code, epgDomain) {
        var position = this.positionAbsolute;
        var playInfo = new PlayInfo(playUrl,position.left,position.top,this.width,this.height);
        console.log(playInfo)
        this.videoPlayer.play(startTime,playInfo,code,epgDomain)
    }

    replay() {
        this.videoPlayer.play(0);
    }

    playByTime(time) {
        this.videoPlayer.playByTime(time);
    }

    pause() {
        this.videoPlayer.pause();
    }

    resume() {
        this.videoPlayer.resume();
    }

    stop() {
        this.videoPlayer.stop();
    }

    destroy() {
        this.videoPlayer.destroy();
    }

    get isPlaying(){
        return this.videoPlayer.isPlaying;
    }

    get playInfo(){
        return this.videoPlayer.playInfo;
    }

    get currentPosition() {
        return this.videoPlayer.currentPosition;
    }


    get duration() {
        return this.videoPlayer.duration;
    }

    static parseByEle(ele, viewManager, listenerLocation){
        var playerView = new PlayerView(viewManager,listenerLocation);
        playerView.ele = ele;
        return playerView;
    }
}
