import VideoPlayer, {PlayInfo} from "@core/frame/player/VideoPlayer";

export default class IptvPlayer extends VideoPlayer {
    /**
     *
     * @param{Keyboard} keyboard
     */
    constructor(keyboard) {
        super();
        /**
         * @type {IptvPlayInfo}
         */
        this.playInfo = new IptvPlayInfo();
        //iptv原生播放器本尊，如果不在盒子上跑，这里会报错，try catch之后切换播放器
        this.mp = new MediaPlayer();
        //播放器对应的id
        this.instanceId = this.mp.getNativePlayerInstanceID();
        this._volume = this.mp.getVolume();

        keyboard.key_player_event = key_player_event;//重写播放事件处理
    }

    /**
     * 使用播放json播放
     * 一般播放适配在这个方法中修改的
     * @param json
     */
    playByJson(json) {
        var player = this;
        initMediaPlay(player, json);//初始化播放器

        //调用播放器开始播放的方法
        player.mp.playFromStart();
        setTimeout(function () {//此处为兼容
            player.mp.playByTime(1, startTime, 1);
        }, 200);
        this.startRefreshPlayerState();//开始刷新播放器状态
    }

    /**
     *
     * @param startTime
     * @param{IptvPlayInfo} playInfo
     * @returns {null}
     */
    play(startTime, playInfo) {
        if (this.playInfo.playUrl) {//使用播放地址播放
            this.playByUrl(startTime, playInfo);
        } else if (this.playInfo.code && this.playInfo.epgDomain) {
            this.playByCode(startTime, playInfo);
        } else {
            console.error("播放参数设置错误：" + this.playInfo);
        }

    }

    playByUrl(startTime, playInfo) {
        super.play(startTime, playInfo);

        var json = buildPlayJson(); //组装播放json
        this.playByJson(json);
    }

    playByCode(startTime, playInfo) {
        super.play(startTime, playInfo);
        var player = this;

        var callback = function (json) {
            player.playByJson(json);
        };

        //TODO 暂不实现
    }

    playByTime(time) {
        time = time - 0;//防止time类型为string
        this.mp.playByTime(1, time, 1);
        if (!this.isPlaying) {
            this.resume();
        }
        super.playByTime(time);
    }

    pause() {
        this.mp.pause();
        super.pause();
    }

    resume() {
        this.mp.resume();
        super.resume();
    }

    stop() {
        this.mp.stop();
        super.stop();
    }

    destroy() {
        this.stop();
        super.destroy();
        var player = this;
        //释放终端 MediaPlayer 的对象，结束对应MediaPlayer 的生命周期。
        setTimeout(function () {
            player.mp.releaseMediaPlayer(player.instanceId);
            player.mp = null;
        }, 10);
    }

    mute() {
        if (this.isMute) {//静音
            this.mp.setMuteFlag(0);//关闭静音
        } else {
            this.mp.setMuteFlag(1);
        }

        this.isMute = !this.isMute;

        if (this.isMute) {
            this.callVolumeChangeListener(-1);
        }else{
            this.callVolumeChangeListener(this.volume);
        }
    }

    set volume(value){
        if (value > 100) {
            value = 100;
        }

        if (value < 0) {
            value = 0;
        }
        this.mp.setVolume(value);
        super.volume = value;
    }

    get volume(){
        return this._volume;
    }

    get realPosition() {
        return this.mp.getCurrentPlayTime() - 0;
    }

    get realDuration() {
        return this.mp.getMediaDuration() - 0;
    }
}

/**
 * Iptv播放器的playInfo，存在使用code播放的情况
 */
export class IptvPlayInfo extends PlayInfo {
    constructor(playUrl, code, epgDomain, left, top, width, height) {
        super(playUrl, left, top, width, height);
        this.code = code || "";
        this.epgDomain = epgDomain || "";
    }
}

var buildPlayJson = function (playUrl) {
    //拼接json
    var json = '[{mediaUrl:"' + playUrl + '",';
    json += 'mediaCode:"code1",';
    json += 'mediaType:2,';
    json += 'audioType:1,';
    json += 'videoType:1,';
    json += 'streamType:1,';
    json += 'drmType:1,';
    json += 'fingerPrint:0,';
    json += 'copyProtection:1,';
    json += 'allowTrickmode:1,'; //允许快进快退
    json += 'startTime:0,';
    json += 'endTime:20000,';
    json += 'entryID:"jsonentry1"}]';
    return json;
};

/**
 * 初始化播放器
 * @param{IptvPlayer} player
 * @param left
 * @param top
 * @param width
 * @param height
 * @param json
 */
var initMediaPlay = function (player, json) {
    var left = player.playInfo.left;
    var top = player.playInfo.top;
    var width = player.playInfo.width;
    var height = player.playInfo.height;

    var playListFlag = 0;
    var videoDisplayMode = 0;
    var muteFlag = 0;
    var subtitleFlag = 0;
    var videoAlpha = 0;
    var cycleFlag = 0;
    var randomFlag = 0;
    var autoDelFlag = 0;
    var useNativeUIFlag = 0;
    player.mp.initMediaPlayer(player.instanceId, playListFlag, videoDisplayMode, height, width, left, top, muteFlag, useNativeUIFlag, subtitleFlag, videoAlpha, cycleFlag, randomFlag, autoDelFlag);
    player.mp.setNativeUIFlag(0);

    player.mp.setMuteUIFlag(0);//设置是否显示默认静音UI

    player.mp.setAudioVolumeUIFlag(0);//设置是否显示默认音量UI

    player.mp.setAudioTrackUIFlag(0);//设置音轨的本地UI显示标志 0:不允许 1：允许

    player.mp.setProgressBarUIFlag(0);//设置是否显示默认滚动条

    player.mp.setChannelNoUIFlag(0);//设置是否显示默认频道号UI
    //设置视频是否循环播放


    player.mp.setAllowTrickmodeFlag(0);//是否开启播放器暂停时移功能

    //TODO 这里可以封装一个改变播放位置的方法，方便修改播放位置
    if ((width == 1280 && height == 720) || (width == 1920 && height == 1080)) {
        player.mp.setVideoDisplayMode(1);//视频显示模式 全屏模式设置为1，0为窗口
    } else {
        player.mp.setVideoDisplayArea(left, top, width, height);//窗口模式设置属性
        player.mp.setVideoDisplayMode(0);//视频显示模式 全屏模式设置为1，0为窗口
    }

    //刷新视频显示模式
    player.mp.refreshVideoDisplay();
    //是单播还是组播
    player.mp.setSingleOrPlaylistMode(0);
    //为播放器加入播放字符串
    player.mp.setSingleMedia(json);
    player.mp.setCycleFlag(1);//1单次播放 0循环播放

    initVolume(player);		//初始化音量
};

/**
 * 初始化播放音量
 * @param{IptvPlayer} player
 */
var initVolume = function (player) {
    var muteFlag = player.mp.getMuteFlag();
    if (muteFlag == 1) {//静音
        player.mp.setMuteFlag(1);
        player.isMute = true;
    } else {
        player.mp.setMuteFlag(0);//适配兼容新疆电信 华为EC6108V9 默认静音
        player.isMute = false
        if (player.volume >= 100) {
            player.volume = 100;
        }
    }

}

/**
 *
 * @param{IptvPlayer} player
 * @param{String} eventJson
 */
var key_player_event = function (player,eventJson) {
    var typeStr = eventJson.type;
    switch (typeStr) {
        case "EVENT_TVMS":
        case "EVENT_TVMS_ERROR":
            return;
        case "EVENT_MEDIA_ERROR":
            player.callPlayError();
            return;
        case "EVENT_MEDIA_END":
            player.callPlayComplete();
            return;
        case "EVENT_PLTVMODE_CHANGE":
            return;
        case "EVENT_PLAYMODE_CHANGE":
            //播放模式改变，在switch外处理
            break;
        case "EVENT_MEDIA_BEGINING":
            player.callPlayStart();
            return;
        case "EVENT_GO_CHANNEL":
            return;
        default:
            break;
    }
};