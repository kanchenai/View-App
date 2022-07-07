import VideoPlayer from "@core/frame/player/VideoPlayer";

export default class WebPlayer extends VideoPlayer {
    constructor() {
        super();
        window.HELP_IMPROVE_VIDEOJS = false;
        this._ready = false;
        this.player = null;
        initPlayer(this);
    }

    play(startTime, playInfo) {
        if(this.ready){
            super.play(startTime, playInfo);
            this.player.el_.style.left = this.playInfo.left + "px";
            this.player.el_.style.top = this.playInfo.top + "px";

            this.player.width(this.playInfo.width);
            this.player.height(this.playInfo.height);

            this.player.src(this.playInfo.playUrl);

            this.startRefreshPlayerState();
        }else{
            var that = this;
            setTimeout(function (){
                that.play(startTime, playInfo)
            },500);
        }
    }



    playByTime(time) {
        this.player.currentTime(time);
        super.playByTime(time);
    }

    pause() {
        this.player.pause();
        super.pause();
    }

    resume() {
        this.player.resume();
        super.resume();
    }

    stop() {
        this.player.pause();
        super.stop();
    }

    destroy() {
        this.player.dispose();
        super.destroy();
    }

    mute() {
        this.player.muted(!this.isMute);
        super.mute();
    }

    get realPosition() {
        return Math.ceil(this.player.currentTime());
    }

    get realDuration() {
        return Math.ceil(this.player.duration());;
    }

    set realVolume(value) {
        this.player.muted(false);
        this.player.volume(value / 100);
    }

    get ready(){
        return this._ready;
    }

    set ready(value){
        this._ready = value;
    }
}

var initPlayer = function (webPlayer) {
    var jsUrl = "https://vjs.zencdn.net/7.20.1/video.min.js";
    var cssUrl = "https://vjs.zencdn.net/7.20.1/video-js.css";

    var player = null;

    var count = 0;
    loadJs(jsUrl, function () {
        count++;
        continueInit(count, webPlayer);
    });
    loadCss(cssUrl, function () {
        count++;
        continueInit(count, webPlayer);
    });

}

var continueInit = function (count, webPlayer) {
    if (count < 2) {//js或css未加载完
        return;
    }
    var ele = document.createElement("video")
    ele.setAttribute('class', 'video-js');
    ele.setAttribute('controls', 'true');
    ele.setAttribute('preload', 'none');

    document.body.appendChild(ele);
    var player = videojs(ele, {
        muted: true,//
        controls: false,
        autoPlay: true,
        loop: false,
        autoSetup: false,
        width: 0,
        height: 0
    }, onPlayerReady)
    webPlayer.player = player;
    webPlayer._volume = parseInt(player.volume() * 100);
    webPlayer.ready = true;
    player.on('loadeddata', function () {
        webPlayer.callPlayStart();
    });

    player.on("volumechange", function () {
        var muteFlag = player.muted();
        webPlayer.callVolumeChangeListener(muteFlag == 1 ? -1 : webPlayer.volume)
    });

    player.on("error", function () {
        webPlayer.callPlayError();
    });

    player.on("ended", function () {
        webPlayer.callPlayComplete();
    });
}

var onPlayerReady = function () {
    this.play()
}

var loadJs = function (jsUrl, callback) {
    var script = document.createElement('script');
    script.setAttribute("type", "text/javascript");
    script.src = jsUrl;
    document.getElementsByTagName("head")[0].appendChild(script);

    script.onload = script.readystatechange = function () {
        if (!script.readyState || /loaded|complete/.test(script.readyState)) {
            // console.log('jsScript.readyState', script.readyState);
            script.onload = script.readystatechange = null;
            callback();
        }
    }
}

var loadCss = function (cssUrl, callback) {
    var link = document.createElement('link');
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("type", "text/css");
    link.setAttribute("href", cssUrl);
    document.getElementsByTagName("head")[0].appendChild(link);

    link.onload = link.readystatechange = function () {
        if (!link.readyState || /loaded|complete/.test(link.readyState)) {
            // console.log('jsScript.readyState', link.readyState);
            link.onload = link.readystatechange = null;
            callback();
        }
    }
}