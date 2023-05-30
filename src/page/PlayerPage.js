import Page from "@core/frame/page/Page";

import utils from "@src/util/utils";

export default class PlayerPage extends Page {
    onCreate(param) {
        this.html = require("@html/player.html");

        this.initView();
        this.setView();
        this.initUtil();
    }

    initView() {
        this.bg = this.findViewById("bg");
        this.player = this.findViewById("player");
        this.progress_drawer = this.findViewById("progress_drawer");
        this.play_progress = this.findViewById("play_progress");
        this.play_info = this.progress_drawer.findEleById("play_info");
    }

    setView() {
    }

    initUtil() {
        this.progress_drawer.slideIn();

        var playUrl = "http://live.ynurl.com/video/s10037-JCTV/index.m3u8"
        this.player.play(0, playUrl);
    }

    onPositionChangeListener = function (position, duration) {
        console.log(this.pageName + " position", position, "duration", duration);

        this.play_progress.total = duration;
        this.play_progress.progress = position;
        this.play_info.innerText = numToTime(position) + "/" + numToTime(this.player.duration);
    }

    onVolumeChangeListener(volume) {
        console.log(this.pageName + " volume", volume);
    }

    onPlayStart() {
        console.log(this.pageName + " onPlayStart");
        // this.bg.hide();
        utils.bgToVideoBg(this.bg.ele.parentNode, this.bg.ele, this.player.playInfo);
        this.findViewById("btn_play").ele.innerText = "暂停"

        this.play_progress.total = this.player.duration;
        this.play_info.innerText = numToTime(0) + "/" + numToTime(this.player.duration);
    }

    onPlayComplete() {
        console.log(this.pageName + " onPlayComplete");
    }

    onPlayPause() {
        console.log(this.pageName + " onPlayPause");
        utils.videoBgToBg(this.bg.ele.parentNode, this.bg.ele)
        this.findViewById("btn_play").ele.innerText = "播放"
    }

    onPlayResume() {
        console.log(this.pageName + " onPlayResume");
        utils.bgToVideoBg(this.bg.ele.parentNode, this.bg.ele, this.player.playInfo);
        this.findViewById("btn_play").ele.innerText = "暂停"
    }

    onPlayStop() {
        console.log(this.pageName + " onPlayStop");
        utils.videoBgToBg(this.bg.ele.parentNode, this.bg.ele)
    }

    onPlayByTime(time) {
        console.log(this.pageName + " onPlayByTime", time);
    }

    onClickListener(view) {
        switch (view.id) {
            case "btn_play":
                if (this.player.isPlaying) {
                    this.player.pause();
                } else {
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
        if (this.player) {
            this.player.stop();
        }
    }
}

var numToTime = function (num) {
    var minute = Math.floor(num / 60);
    var second = num % 60;

    if (minute < 10) {
        minute = "0" + minute;
    }

    if (second < 10) {
        second = "0" + second;
    }

    return minute + ":" + second;
}