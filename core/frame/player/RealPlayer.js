/**
 * 对接播放器时，需要继承这个类，并重写所有方法
 */
export default class RealPlayer{
    constructor(stbType) {
        this.stbType = stbType;
        this.playInfo = null;
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
