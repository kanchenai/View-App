import RealPlayer from "@core/frame/player/RealPlayer";

export default class AndroidPlayer extends RealPlayer{
    constructor(stbType) {
        super(stbType);
        this.androidKey = "";
        this.player = window[androidKey];
        if(!this.player){
            throw new Error(this.androidKey+"关键字对应的变量获取失败")
        }
    }

    play(startTime, playInfo){

    }

    playByTime(time){

    }

    mute(flag){

    }

    pause(){}

    resume(){}

    stop(){}

    destroy(){}

    get position(){
        return 0;
    }

    get duration(){
        return 0;
    }

    get volume(){
        return 0;
    }

    set volume(value){
    }

    get isMute(){
        return false;
    }
}
