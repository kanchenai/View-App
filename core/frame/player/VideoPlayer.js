import Page from "@core/frame/page/Page";
import IptvPlayer from "@core/frame/player/IptvPlayer";
import PlayInfo from "@core/frame/player/PlayInfo";

/**
 * 当切换播放器时（页面跳转或Fragment切换），需要先暂停或停止，然后在进行切换播放器（页面跳转或Fragment切换）
 * 不然会同时触发多个相同的监听（如：onPositionChangeListener）
 */
export default class VideoPlayer {
    constructor(listenerLocation) {
        this.listenerLocation = listenerLocation;
        if (this.listenerLocation instanceof Page) {
            this.page = listenerLocation;
        } else {
            this.page = listenerLocation.page;
        }

        this.player = this.page.application.player;

        var player = this;
        if (this.player instanceof IptvPlayer) {
            this.page.key_player_event = function (eventJson) {
                key_player_event(player, eventJson);
            }
        }

        //音量增减
        this.page.key_volUp_event = function () {
            player.volumeUp();
        };

        this.page.key_volDown_event = function () {
            player.volumeDown();
        };
        this.page.key_mute_event = function () {
            player.mute();
        };

        this.state = "";//
        //每次音量调节幅度
        this.volumeCell = 5;
        this._isMute = false;
        //播放状态
        this._isPlaying = false;
        /**
         * 播放信息
         * @type {PlayInfo}
         */
        this.playInfo = new PlayInfo();
        //定时刷新播放状态的timer
        this.timer = null;
        //延迟调用播放结束监听的timer,一般在播放结束无法正常触发，通过进度方式主动触发的，并避免小概率事件
        this.completeTimer = null;
        //触发播放开始
        this.isOnStart = false;
        //触发播放结束
        this.isOnComplete = false;
        //盒子型号
        this.stbType = "";
        //书签位置，在暂停时记录
        this.bookmark = -1;

        /**
         * 播放进度变化监听
         * @param position 当前进度
         * @param duration 总时长
         */
        this.onPositionChangeListener = "";
        /**
         * 音量变化监听
         * @param volume 变化之后的音量
         */
        this.onVolumeChangeListener = "";
        /**
         * 开始播放监听
         */
        this.onPlayStart = "";
        /**
         * 结束播放监听
         */
        this.onPlayComplete = "";
        /**
         * 暂停播放监听
         */
        this.onPlayPause = "";
        /**
         * 继续播放监听
         */
        this.onPlayResume = "";
        /**
         * 停止播放监听
         */
        this.onPlayStop = "";
        /**
         * 异常播放监听
         */
        this.onPlayError = "";
        /**
         * 调整播放进度监听
         */
        this.onPlayByTime = "";
    }

    /**
     * @param{number} startTime
     * @param{PlayInfo} playInfo
     */
    play(startTime, playInfo) {
        this.bookmark = -1;
        //触发播放开始
        this.isOnStart = false;
        //触发播放结束
        this.isOnComplete = false;
        if (this.completeTimer) {
            clearTimeout(this.completeTimer);//取消触发播放结束
        }
        if (playInfo) {
            this.playInfo = playInfo;
        }
        this.player.play(startTime, playInfo);
        this._isMute = this.player.isMute;

        this.player.playInfo = playInfo;//暂存，用以暂停继续

        this.startRefreshPlayerState();//开始刷新播放转台
    }

    replay() {
        this.play(0);
    }

    playByTime(time) {
        if (!this.isPlaying) {
            this.resume();
        }
        this.player.playByTime(time);
        if (this.completeTimer) {
            clearTimeout(this.completeTimer);//取消触发播放结束
        }
        this.callPlayByTime(time);
    }

    pause() {
        this.player.pause();
        this.bookmark = this.currentPosition;
        this._isPlaying = false;
        if (this.completeTimer) {
            clearTimeout(this.completeTimer);//取消触发播放结束
        }

        if (this.timer) {
            clearTimeout(this.timer);
        }

        this.callPlayPause();
    }

    resume() {
        if(!this.player.playInfo || !this.isOnStart || this.isPlaying){//从未播放
            return;
        }
        if (this.player.playInfo != this.playInfo) {//playInfo发生变化,播放信息改变了,需要根据书签播放
            console.log("使用书签resume",this.bookmark);
            this.play(this.bookmark, this.playInfo);
            this.isOnStart = true;//不触发播放开始
        } else {//未切换，只是暂停
            this.player.resume();
            this._isPlaying = true;
            this.bookmark = -1;
        }

        this.callPlayResume();
    }

    stop() {
        this.player.stop();
        this._isPlaying = false;
        if (this.completeTimer) {
            clearTimeout(this.completeTimer);//取消触发播放结束
        }

        if (this.timer) {
            clearTimeout(this.timer);
        }

        this.callPlayStop();
    }

    destroy() {
        if (this.completeTimer) {
            clearTimeout(this.completeTimer);//取消触发播放结束
        }

        if (this.timer) {
            clearTimeout(this.timer);//取消触发播放结束
        }
        this.player.destroy();
        this._isPlaying = false;
    }

    volumeUp() {
        this.volume += this.volumeCell;
    }

    volumeDown() {
        this.volume -= this.volumeCell;
    }

    mute() {
        this.player.mute();

        if (this.isMute) {
            this.callVolumeChangeListener(-1);
        } else {
            this.callVolumeChangeListener(this.volume);
        }
    }

    get realPosition() {
        return this.player.position;
    }

    get realDuration() {
        return this.player.duration;
    }

    set realVolume(value) {
        this.player.volume = value;
    }

    /**
     * 开始刷新播放器状态
     * 如果需要主动触发播放异常，请重写改方法
     */
    startRefreshPlayerState() {
        var player = this;
        //在实际的子类中实现
        if (this.timer) {
            clearTimeout(this.timer);
        }

        // 1.获取真实的当前进度，*这里在适配过程中可以加播放异常判断
        // 2.对比进度是否变化,有变化设置
        // 3.获取总时长，*这里在适配过程中可以加播放异常判断
        // 4.主动触发播放开始
        // 5.判断播放进度，在最后3/5秒主动触发播放结束
        this.timer = setInterval(function () {
            var currentPosition = player.realPosition;// 1.获取真实的当前进度
            if (player.currentPosition == currentPosition) {//2.对比进度是否变化
                return;
            }

            player.currentPosition = currentPosition;//设置进度
            var duration = player.realDuration;// 3.获取总时长
            if (duration <= 0) {
                return;
            }
            player.duration = duration;

            if (!player.isOnStart) {//未触发开始播放时
                player.callPlayStart();
            }
            this._isPlaying = true;
            player.callPositionChangeListener(currentPosition, duration);

            if (!player.isOnComplete) {//未触发开始结束时
                var disPosition = duration - currentPosition;// 计算当前进度和总进度的差值
                if (currentPosition >= duration - 3) {//5.判断播放进度,在最后3/5秒主动触发播放结束
                    player.completeTimer = setTimeout(function () {
                        player.callPlayComplete();
                    }, (disPosition * 1000));
                }
            }

        }, 1000);
    }

    callPositionChangeListener(position, duration) {
        var onPositionChangeListener = null;
        if (this.onPositionChangeListener) {
            if (typeof this.onPositionChangeListener == "string") {
                onPositionChangeListener = this.listenerLocation[this.onPositionChangeListener];
            } else if (this.onPositionChangeListener instanceof Function) {
                onPositionChangeListener = this.onPositionChangeListener;
            } else {
                console.error("播放进度变化监听设置错误");
                return;
            }
            onPositionChangeListener.call(this.listenerLocation, position, duration);
        }
    }

    callVolumeChangeListener(volume) {
        var onVolumeChangeListener = null;
        if (this.onVolumeChangeListener) {
            if (typeof this.onVolumeChangeListener == "string") {
                onVolumeChangeListener = this.listenerLocation[this.onVolumeChangeListener];
            } else if (this.onVolumeChangeListener instanceof Function) {
                onVolumeChangeListener = this.onVolumeChangeListener;
            } else {
                console.error("音量变化监听设置错误");
                return;
            }
            onVolumeChangeListener.call(this.listenerLocation, volume);
        }
    }

    callPlayStart() {
        if (this.isOnStart) {
            return;
        }

        this.isOnStart = true;
        var onPlayStart = null;
        if (this.onPlayStart) {
            if (typeof this.onPlayStart == "string") {
                onPlayStart = this.listenerLocation[this.onPlayStart];
            } else if (this.onPlayStart instanceof Function) {
                onPlayStart = this.onPlayStart;
            } else {
                console.error("播放开始监听设置错误");
                return;
            }
            onPlayStart.call(this.listenerLocation);
        }
    }

    callPlayComplete() {
        if (this.isOnComplete) {
            return;
        }
        this.isOnComplete = true;
        var onPlayComplete = null;
        if (this.onPlayComplete) {
            if (typeof this.onPlayComplete == "string") {
                onPlayComplete = this.listenerLocation[this.onPlayComplete];
            } else if (this.onPlayComplete instanceof Function) {
                onPlayComplete = this.onPlayComplete;
            } else {
                console.error("播放结束监听设置错误");
                return;
            }
            onPlayComplete.call(this.listenerLocation);
        }
    }

    callPlayPause() {
        var onPlayPause = null;
        if (this.onPlayPause) {
            if (typeof this.onPlayPause == "string") {
                onPlayPause = this.listenerLocation[this.onPlayPause];
            } else if (this.onPlayPause instanceof Function) {
                onPlayPause = this.onPlayPause;
            } else {
                console.error("播放暂停监听设置错误");
                return;
            }
            onPlayPause.call(this.listenerLocation);
        }
    }

    callPlayResume() {
        var onPlayResume = null;
        if (this.onPlayResume) {
            if (typeof this.onPlayResume == "string") {
                onPlayResume = this.listenerLocation[this.onPlayResume];
            } else if (this.onPlayResume instanceof Function) {
                onPlayResume = this.onPlayResume;
            } else {
                console.error("播放继续监听设置错误");
                return;
            }
            onPlayResume.call(this.listenerLocation);
        }
    }

    callPlayStop() {
        var onPlayStop = null;
        if (this.onPlayStop) {
            if (typeof this.onPlayStop == "string") {
                onPlayStop = this.listenerLocation[this.onPlayStop];
            } else if (this.onPlayStop instanceof Function) {
                onPlayStop = this.onPlayStop;
            } else {
                console.error("播放停止监听设置错误");
                return;
            }
            onPlayStop.call(this.listenerLocation);
        }
    }

    callPlayError() {
        var onPlayError = null;
        if (this.onPlayError) {
            if (typeof this.onPlayError == "string") {
                onPlayError = this.listenerLocation[this.onPlayError];
            } else if (this.onPlayError instanceof Function) {
                onPlayError = this.onPlayError;
            } else {
                console.error("播放异常监听设置错误");
                return;
            }
            onPlayError.call(this.listenerLocation);
        }
    }

    callPlayByTime(position) {
        var onPlayByTime = null;
        if (this.onPlayByTime) {
            if (typeof this.onPlayByTime == "string") {
                onPlayByTime = this.listenerLocation[this.onPlayByTime];
            } else if (this.onPlayByTime instanceof Function) {
                onPlayByTime = this.onPlayByTime;
            } else {
                console.error("调整播放进度监听设置错误");
                return;
            }
            onPlayByTime.call(this.listenerLocation, position);
        }
    }

    get currentPosition() {
        return this._currentPosition;
    }

    set currentPosition(value) {
        this._currentPosition = value;
    }

    get duration() {
        return this._duration;
    }

    set duration(value) {
        this._duration = value;
    }

    set volume(value) {
        if (value > 100) {
            value = 100;
        }

        if (value < 0) {
            value = 0;
        }
        this.realVolume = value;//实际设置
        this.callVolumeChangeListener(value);
    }

    get volume() {
        return this.player.volume;
    }

    get isMute() {
        return this._isMute;
    }

    get isPlaying() {
        return this._isPlaying;
    }
}

/**
 *
 * @param{VideoPlayer} player
 * @param{String} eventJson
 */
var key_player_event = function (player, eventJson) {
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
