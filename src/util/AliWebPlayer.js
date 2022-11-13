import VideoPlayer from "@core/frame/player/VideoPlayer";

export default class AliWebPlayer extends VideoPlayer{
    constructor() {
        super();

        this.divId = "player-con";
        this.isInit = false;//是否已加载js和css文件
        this.isLive = true;//是否时直播
        initPlayer(this);
        this.player = null;
    }

    play(startTime, playInfo){
        if(this.isInit){
            super.play(startTime, playInfo);
            createPlayer(this);
            this._volume = this.player.getVolume() * 100;
            this.startRefreshPlayerState();
        }else{
            var that = this;
            //延迟之后重试
            setTimeout(function (){
                that.play(startTime, playInfo)
            },500);
        }
    }

    playByTime(time) {
        this.player.seek(time);
        super.playByTime(time);
    }

    pause() {
        this.player.pause();
        super.pause();
    }

    resume() {
        this.player.play();
        super.resume();
    }

    stop() {
        if(this.player){
            this.player.pause();
            super.stop();
        }

    }

    destroy() {
        try{
            this.player.dispose();
        }catch (e){}
        super.destroy();
    }

    mute() {
        if(!this.isMute){
            this.player.mute();
        }else{
            this.realVolume = this.volume;
        }

        super.mute();
    }

    get realPosition() {
        return Math.ceil(this.player.getCurrentTime());
    }

    get realDuration() {
        var duration = this.player.getDuration();
        if(isNaN(duration)){
            duration = -1;
        }

        return Math.ceil(duration);
    }

    set realVolume(value) {
        console.log("set realVolume",value);
        this.player.muted(false);
        this.player.setVolume(value / 100);
    }

}

var createPlayer = function (webPlayer) {
    var playInfo = webPlayer.playInfo;
    var isLive = webPlayer.isLive;

    if(webPlayer.player){
        try{
            webPlayer.player.dispose();
        }catch (e){}
    }

    webPlayer.player = new Aliplayer({
            "id": webPlayer.divId,
            "source": playInfo.playUrl,
            "width": playInfo.width + "px",
            "height": playInfo.height + "px",
            "autoplay": true,
            "isLive": isLive,
            "rePlay": false,
            "playsinline": true,
            "preload": true,
            "controlBarVisibility": "hover",
            "useH5Prism": true,
            "skinLayout": [
                {
                    "name": "controlBar",
                    "align": "blabs",
                    "x": 0,
                    "y": 0,
                    "children": []
                }
            ]
        }, function (player) {
            console.log("The player is created");
        }
    );

}


var initPlayer = function (webPlayer) {
    var jsUrl = "https://g.alicdn.com/de/prismplayer/2.12.1/aliplayer-h5-min.js";
    var cssUrl = "https://g.alicdn.com/de/prismplayer/2.12.1/skins/default/aliplayer-min.css";

    var count = 0;
    loadJs(jsUrl, function () {
        count++;
        if (count == 2) {
            webPlayer.isInit = true;
        }
    });
    loadCss(cssUrl, function () {
        count++;
        if (count == 2) {
            webPlayer.isInit = true;
        }
    });

    var ele = document.createElement("div");
    ele.id = webPlayer.divId;
    ele.style.position = "absolute";
    ele.style.zIndex = "-1";

    document.body.appendChild(ele);
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
