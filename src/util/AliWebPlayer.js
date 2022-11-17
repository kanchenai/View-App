import RealPlayer from "@core/frame/player/RealPlayer";

export default class AliWebPlayer extends RealPlayer {
    constructor() {
        super();

        this.divId = "player-con";
        this.isInit = false;//是否已加载js和css文件
        this.isLive = true;//是否时直播
        initPlayer(this);//加载js和css
        this.player = null;
        this._mute = false;

        this.needPlay = false;

        //记录宽高，用以继续播放时，设置
        this.width = 0;
        this.height = 0;
    }

    play(startTime, playInfo) {
        this.width = playInfo.width;
        this.height = playInfo.height;
        if (this.isInit) {
            this.needPlay = true;
            createPlayer(this, playInfo);
        } else {
            var that = this;
            //延迟之后重试
            setTimeout(function () {
                that.play(startTime, playInfo)
            }, 500);
        }
    }

    playByTime(time) {
        this.needPlay = true;
        this.player.seek(time);
    }

    pause() {
        this.needPlay = false;
        if (this.player) {
            this.player.pause();
        }
    }

    resume() {
        this.needPlay = true;
        if(this.isInit){
            this.player.play();
            if (this.player._el) {
                var style = this.player._el.style;
                style.width = this.width + "px";
                style.height = this.height + "px";
            }
        }
    }

    stop() {
        this.needPlay = false;
        if (this.player) {
            this.player.pause();
        }
    }

    destroy() {
        this.needPlay = false;
        try {
            if (this.player) {
                if (this.player._el) {
                    var style = this.player._el.style;
                    style.width = "10px";
                    style.height = "10px";
                    style.left = "-20px";
                    style.top = "-20px";
                }
                this.player.dispose();
            }
        } catch (e) {
        }
    }

    mute() {
        if (!this.isMute) {
            if(this.player){
                this.player.mute();
            }
            this._mute = true
        } else {
            this.volume = this.volume;
            this._mute = false;
        }
    }

    get position() {
        var value = -1;
        if(this.player){
            value = Math.ceil(this.player.getCurrentTime())
        }
        return value;
    }

    get duration() {
        var value = -1;
        if(this.player){
            value = this.player.getDuration();
            if (isNaN(value)) {
                value = -1;
            }
        }
        return Math.ceil(value);
    }

    set volume(value) {
        console.log("set realVolume", value);
        if(this.player){
            this.player.muted(false);
            this.player.setVolume(value / 100);
        }
    }

    get volume() {
        var value = 100;
        if(this.player){
            value = Math.ceil(this.player.getVolume() * 100);
        }
        return value;
    }

    get isMute() {
        return this._mute;
    }

}

var createPlayer = function (webPlayer, playInfo) {
    var isLive = webPlayer.isLive;

    if (webPlayer.player) {
        try {
            webPlayer.player.dispose();
        } catch (e) {
        }
    }

    var aliplayer = new Aliplayer({
            "id": webPlayer.divId,
            "source": playInfo.playUrl,
            "width": playInfo.width + "px",
            "height": playInfo.height + "px",
            "autoplay": false,
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
            webPlayer.player = player
            console.log("The player is created");
            setTimeout(function () {
                if (webPlayer.needPlay) {
                    player.play();
                }
            }, 0);

        }
    );

    if (aliplayer._el) {
        var style = aliplayer._el.style;
        style.width = playInfo.width + "px";
        style.height = playInfo.height + "px";
        style.left = playInfo.left + "px";
        style.top = playInfo.top + "px";
    }
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
