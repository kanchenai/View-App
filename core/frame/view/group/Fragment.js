import GroupView from "./GroupView";
import State from "../../util/State";

export default class Fragment extends GroupView {
    constructor() {
        super("");
        this.isForeground = false;
        this.lifeState = State.LifeState.BEFORE_CREATE;
    }

    switchToForeground() {
        if (this.lifeState == State.LifeState.BEFORE_CREATE) {
            this.create();
        }
        this.isForeground = true;
        this.resume();
    }

    switchToBackground() {
        if (this.isForeground) {
            this.isForeground = false;
            this.pause();
        }
    }

    create() {
        this.lifeState = State.LifeState.CREATE;
        this.onCreate();
    }

    resume() {
        this.lifeState = State.LifeState.RUN;
        // this.show();
        this.onResume();
    }

    pause() {
        this.lifeState = State.LifeState.PAUSE;
        // this.hide();
        this.onPause();
    }

    stop() {
        this.lifeState = State.LifeState.STOP;
        //TODO 回收
        this.onStop();
    }

    destroy() {
        this.lifeState = State.LifeState.DESTROY;
        this.onDestroy();
    }

    onCreate() {
    }

    onResume() {
    }

    onPause() {
    }

    onStop() {
    }

    onDestroy() {
    }

    /**
     * 创建Page对应的节点和滚动器
     */
    init() {
        //创建Page对应的节点，并添加到Application中
        if (!this.ele) {
            var ele = document.createElement("div");
            ele.className = "fragment";
            this.ele = ele;
            this.width = this.fatherView.width;
            this.height = this.fatherView.height;
            this.setStyle("overflow","hidden");
        }
    }
}
