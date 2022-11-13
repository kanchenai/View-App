/**
 * 在子类中必需要重写的方法,具体的写法在各个方法中都有注释，
 * 以下方法需要重写：
 * 1.play
 * 2.playByTime
 * 3.pause
 * 4.resume
 * 5.stop
 * 6.destroy
 * 7.mute
 * 8.get realPosition
 * 9.get realDuration
 * 10.set realVolume
 *
 * 按需重写的方法有：
 * 1.startRefreshPlayerState
 *
 */
import VMap from "@core/frame/util/VMap";

export default class VideoPlayer {
    constructor() {
        this.page = null;

        //当前音量
        this._volume = 0;
        //每次音量调节幅度
        this.volumeCell = 5;
        this.isMute = false;
        //播放状态
        this.isPlaying = false;

        /**
         * 播放信息
         * @type {PlayInfo}
         */
        this.playInfo = new PlayInfo();
        //视频总时长
        this._duration = 0;
        //视频当前进度
        this._currentPosition = 0;
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
        //记录各个page设置的listener
        this.listenMap = new VMap();
        // /**
        //  * 播放进度变化监听
        //  * @param position 当前进度
        //  * @param duration 总时长
        //  */
        // this.onPositionChangeListener = "";
        // /**
        //  * 音量变化监听
        //  * @param volume 变化之后的音量
        //  */
        // this.onVolumeChangeListener = "";
        // /**
        //  * 开始播放监听
        //  */
        // this.onPlayStart = "";
        // /**
        //  * 结束播放监听
        //  */
        // this.onPlayComplete = "";
        // /**
        //  * 暂停播放监听
        //  */
        // this.onPlayPause = "";
        // /**
        //  * 继续播放监听
        //  */
        // this.onPlayResume = "";
        // /**
        //  * 停止播放监听
        //  */
        // this.onPlayStop = "";
        // /**
        //  * 异常播放监听
        //  */
        // this.onPlayError = "";
        // /**
        //  * 调整播放进度监听
        //  */
        // this.onPlayByTime = "";
    }

    /**
     * 需要重写，并在方法头部调用super.play方法
     * @param startTime
     * @param playInfo
     */
    play(startTime, playInfo) {
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
        this.isPlaying = true;
        //需要被重写，并调用父类方法，调用之后，补充对应播放器的实际功能
        //在子类中续写实际播放功能，然后调用this.startRefreshPlayerState()方法
        //this.startRefreshPlayerState();//开始刷新播放转台
    }

    replay() {
        this.play(0);
    }

    /**
     * 需要重写，并在方法结尾调用super.playByTime方法
     * @param time
     */
    playByTime(time) {
        if (!this.isPlaying) {
            this.resume();
        }
        if (this.completeTimer) {
            clearTimeout(this.completeTimer);//取消触发播放结束
        }
        this.callPlayByTime(time);
    }

    /**
     * 需要重写，并在方法结尾调用super.pause方法
     */
    pause() {
        this.isPlaying = false;
        if (this.completeTimer) {
            clearTimeout(this.completeTimer);//取消触发播放结束
        }
        this.callPlayPause();
    }

    /**
     * 需要重写，并在方法结尾调用super.resume方法
     */
    resume() {
        this.isPlaying = true;
        this.callPlayResume();
    }

    /**
     * 需要重写，并在方法结尾调用super.stop方法
     */
    stop() {
        this.isPlaying = false;
        if (this.completeTimer) {
            clearTimeout(this.completeTimer);//取消触发播放结束
        }
        this.callPlayStop();
    }

    /**
     * 需要重写，并在方法结尾调用super.destroy方法
     */
    destroy() {
        this.isPlaying = false;
        if (this.completeTimer) {
            clearTimeout(this.completeTimer);//取消触发播放结束
        }

        if (this.timer) {
            clearTimeout(this.timer);//取消触发播放结束
        }
    }

    volumeUp() {
        this.volume += this.volumeCell;
    }

    volumeDown() {
        this.volume -= this.volumeCell;
    }

    /**
     * 需要重写，并在方法结尾调用super.mute方法
     */
    mute() {
        this.isMute = !this.isMute;

        if (this.isMute) {
            this.callVolumeChangeListener(-1);
        } else {
            this.callVolumeChangeListener(this.volume);
        }
    }

    /**
     * 在子类中重写
     * @returns {number}
     */
    get realPosition() {
        console.error("realPosition未在子类中实现");
        return 0;
    }

    /**
     * 在子类中重写
     * @returns {number}
     */
    get realDuration() {
        console.error("realDuration未在子类中实现");
        return 0;
    }

    /**
     * 在子类中重写
     */
    set realVolume(value) {
        console.error("set realVolume未在子类中实现")
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
                if (this.page) {
                    onPositionChangeListener = this.page[this.onPositionChangeListener];
                }
            } else if (this.onPositionChangeListener instanceof Function) {
                onPositionChangeListener = this.onPositionChangeListener;
            } else {
                console.error("播放进度变化监听设置错误");
                return;
            }
            onPositionChangeListener.call(this.page, position, duration);
        }
    }

    callVolumeChangeListener(volume) {
        var onVolumeChangeListener = null;
        if (this.onVolumeChangeListener) {
            if (typeof this.onVolumeChangeListener == "string") {
                if (this.page) {
                    onVolumeChangeListener = this.page[this.onVolumeChangeListener];
                }
            } else if (this.onVolumeChangeListener instanceof Function) {
                onVolumeChangeListener = this.onVolumeChangeListener;
            } else {
                console.error("音量变化监听设置错误");
                return;
            }
            onVolumeChangeListener.call(this.page, volume);
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
                if (this.page) {
                    onPlayStart = this.page[this.onPlayStart];
                }
            } else if (this.onPlayStart instanceof Function) {
                onPlayStart = this.onPlayStart;
            } else {
                console.error("播放开始监听设置错误");
                return;
            }
            onPlayStart.call(this.page);
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
                if (this.page) {
                    onPlayComplete = this.page[this.onPlayComplete];
                }
            } else if (this.onPlayComplete instanceof Function) {
                onPlayComplete = this.onPlayComplete;
            } else {
                console.error("播放结束监听设置错误");
                return;
            }
            onPlayComplete.call(this.page);
        }
    }

    callPlayPause() {
        var onPlayPause = null;
        if (this.onPlayPause) {
            if (typeof this.onPlayPause == "string") {
                if (this.page) {
                    onPlayPause = this.page[this.onPlayPause];
                }
            } else if (this.onPlayPause instanceof Function) {
                onPlayPause = this.onPlayPause;
            } else {
                console.error("播放暂停监听设置错误");
                return;
            }
            onPlayPause.call(this.page);
        }
    }

    callPlayResume() {
        var onPlayResume = null;
        if (this.onPlayResume) {
            if (typeof this.onPlayResume == "string") {
                if (this.page) {
                    onPlayResume = this.page[this.onPlayResume];
                }
            } else if (this.onPlayResume instanceof Function) {
                onPlayResume = this.onPlayResume;
            } else {
                console.error("播放继续监听设置错误");
                return;
            }
            onPlayResume.call(this.page);
        }
    }

    callPlayStop() {
        var onPlayStop = null;
        if (this.onPlayStop) {
            if (typeof this.onPlayStop == "string") {
                if (this.page) {
                    onPlayStop = this.page[this.onPlayStop];
                }
            } else if (this.onPlayStop instanceof Function) {
                onPlayStop = this.onPlayStop;
            } else {
                console.error("播放停止监听设置错误");
                return;
            }
            onPlayStop.call(this.page);
        }
    }

    callPlayError() {
        var onPlayError = null;
        if (this.onPlayError) {
            if (typeof this.onPlayError == "string") {
                if (this.page) {
                    onPlayError = this.page[this.onPlayError];
                }
            } else if (this.onPlayError instanceof Function) {
                onPlayError = this.onPlayError;
            } else {
                console.error("播放异常监听设置错误");
                return;
            }
            onPlayError.call(this.page);
        }
    }

    callPlayByTime(position) {
        var onPlayByTime = null;
        if (this.onPlayByTime) {
            if (typeof this.onPlayByTime == "string") {
                if (this.page) {
                    onPlayByTime = this.page[this.onPlayByTime];
                }
            } else if (this.onPlayByTime instanceof Function) {
                onPlayByTime = this.onPlayByTime;
            } else {
                console.error("调整播放进度监听设置错误");
                return;
            }
            onPlayByTime.call(this.page, position);
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
        this._volume = value;
        this.realVolume = value;//实际设置
        this.callVolumeChangeListener(this._volume);
    }

    get volume() {
        return this._volume;
    }

    get listener(){
        return this.listenMap.get(this.page.id);
    }

    /**
     * 播放进度变化监听
     * @param position 当前进度
     * @param duration 总时长
     */
    set onPositionChangeListener(value) {
        var listener = this.listener;
        if (listener) {
            listener.onPositionChangeListener = value;
        } else {
            listener = {onPositionChangeListener: value}
            this.listenMap.set(this.page.id, listener)
        }
    }

    get onPositionChangeListener() {
        var listener = "";
        if (this.listener) {
            listener = this.listener.onPositionChangeListener;
        }

        return listener;
    }

    /**
     * 音量变化监听
     * @param volume 变化之后的音量
     */
    set onVolumeChangeListener(value) {
        var listener = this.listener;
        if (listener) {
            listener.onVolumeChangeListener = value;
        } else {
            listener = {onVolumeChangeListener: value}
            this.listenMap.set(this.page.id, listener)
        }
    }

    get onVolumeChangeListener() {
        var listener = "";
        if (this.listener) {
            listener = this.listener.onVolumeChangeListener;
        }

        return listener;
    }

    /**
     * 开始播放监听
     */
    set onPlayStart(value) {
        var listener = this.listener;
        if (listener) {
            listener.onPlayStart = value;
        } else {
            listener = {onPlayStart: value}
            this.listenMap.set(this.page.id, listener)
        }
    }

    get onPlayStart() {
        var listener = "";
        if (this.listener) {
            listener = this.listener.onPlayStart;
        }

        return listener;
    }

    /**
     * 结束播放监听
     */
    set onPlayComplete(value) {
        var listener = this.listener;
        if (listener) {
            listener.onPlayComplete = value;
        } else {
            listener = {onPlayComplete: value}
            this.listenMap.set(this.page.id, listener)
        }
    }

    get onPlayComplete() {
        var listener = "";
        if (this.listener) {
            listener = this.listener.onPlayComplete;
        }

        return listener;
    }

    /**
     * 暂停播放监听
     */
    set onPlayPause(value) {
        var listener = this.listener;
        if (listener) {
            listener.onPlayPause = value;
        } else {
            listener = {onPlayPause: value}
            this.listenMap.set(this.page.id, listener)
        }
    }

    get onPlayPause() {
        var listener = "";
        if (this.listener) {
            listener = this.listener.onPlayPause;
        }

        return listener;
    }

    /**
     * 继续播放监听
     */
    set onPlayResume(value) {
        var listener = this.listener;
        if (listener) {
            listener.onPlayResume = value;
        } else {
            listener = {onPlayResume: value}
            this.listenMap.set(this.page.id, listener)
        }
    }

    get onPlayResume() {
        var listener = "";
        if (this.listener) {
            listener = this.listener.onPlayResume;
        }

        return listener;
    }

    /**
     * 停止播放监听
     */
    set onPlayStop(value) {
        var listener = this.listener;
        if (listener) {
            listener.onPlayStop = value;
        } else {
            listener = {onPlayStop: value}
            this.listenMap.set(this.page.id, listener)
        }
    }

    get onPlayStop() {
        var listener = "";
        if (this.listener) {
            listener = this.listener.onPlayStop;
        }

        return listener;
    }

    /**
     * 异常播放监听
     */
    set onPlayError(value) {
        var listener = this.listener;
        if (listener) {
            listener.onPlayError = value;
        } else {
            listener = {onPlayError: value}
            this.listenMap.set(this.page.id, listener)
        }
    }

    get onPlayError() {
        var listener = "";
        if (this.listener) {
            listener = this.listener.onPlayError;
        }

        return listener;
    }

    /**
     * 调整播放进度监听
     */
    set onPlayByTime(value) {
        var listener = this.listener;
        if (listener) {
            listener.onPlayByTime = value;
        } else {
            listener = {onPlayByTime: value}
            this.listenMap.set(this.page.id, listener)
        }
    }

    get onPlayByTime() {
        var listener = "";
        if (this.listener) {
            listener = this.listener.onPlayByTime;
        }

        return listener;
    }
}

/**
 * 按需继承
 */
export class PlayInfo {
    constructor(playUrl, left, top, width, height) {
        this.playUrl = playUrl || "";
        this.left = left || 0;
        this.top = top || 0;
        this.width = width || 0;
        this.height = height || 0;
    }
}

