import GroupView from "./GroupView";
import State from "../../util/State";

export default class Fragment extends GroupView {
    constructor(viewManager) {
        super(viewManager, null);
        this.listenerLocation = this;
        this.isForeground = false;
        this.lifeState = FragmentLifeState.BEFORE_CREATE;

        //左右禁止
        this.nextLeft = "none";
        this.nextRight = "none";
    }

    startPage(page,param){
        this.page.startPage(page,param)
    }

    switchToForeground() {
        if (this.lifeState == FragmentLifeState.BEFORE_CREATE) {
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
        this.lifeState = FragmentLifeState.CREATE;
        this.onCreate();
    }

    resume() {
        this.lifeState = FragmentLifeState.RUN;
        // this.show();
        this.onResume();
    }

    pause() {
        this.lifeState = FragmentLifeState.PAUSE;
        // this.hide();
        this.onPause();
    }

    stop() {
        this.lifeState = FragmentLifeState.STOP;
        //TODO 回收
        this.onStop();
    }

    destroy() {
        this.lifeState = FragmentLifeState.DESTROY;
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
            this.setStyle("overflow", "hidden");
        }
    }
}

/**
 * 生命周期状态枚举
 * Page、Fragment
 */
export var FragmentLifeState = {
    //未创建
    BEFORE_CREATE: "BEFORE_CREATE",
    //创建
    CREATE: "CREATE",
    //运行
    RUN: "RUN",
    //暂停
    PAUSE: "PAUSE",
    //停止
    STOP: "STOP",
    //销毁
    DESTROY: "DESTROY"
};
