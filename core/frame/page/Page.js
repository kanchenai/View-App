import ViewManager from "../view/base/ViewManager";
import GroupView from "../view/group/GroupView";

export default class Page extends GroupView {
    constructor() {
        super(null, null);

        this.listenerLocation = this;
        this.focusable = false;
        delete this.data;

        //在子类中设置这个pageName，用以恢复页面时使用
        this.pageName = "";
        this.isForeground = false;
        //Page生命周期标识
        this.lifeState = PageLifeState.BEFORE_CREATE;
        this.viewManager = new ViewManager(this);
        this._application = null;
        //启动该page的参数信息或保存的 该页面的参数信息
        this.param = null;

        //页面finish时，设置，上回到的页面上获取
        this.backResultData = null;
    }

    create(param) {
        this.init();//初始化Page：创建Page对应的节点，并添加到application，创建滚动器
        this.param = param || {};
        this.pageManager.putPageInfo(this, this.param);//保存数据，到本地,与在页面中主动保存参数信息不同
        this.lifeState = PageLifeState.CREATE;//当前生命周期处在Page创建
        this.onCreate(this.param);//Page回调-创建
    }

    resume() {
        this.show();//显示，TODO 这里可以对应不同的动画
        if (this.lifeState == PageLifeState.CREATE) {//创建到继续（显示）
            this.viewManager.init();//给初始焦点上焦
        }

        var page = this;
        setTimeout(function () {
            page.loadImageResource(true);
        }, 50);

        this.lifeState = PageLifeState.RUN;//当前生命周期处在Page运行
        this.application.keyboard.page = page;
        this.onResume();//Page回调-继续
    }

    pause() {
        this.lifeState = PageLifeState.PAUSE;//当前生命周期处在Page暂停
        this.isForeground = false;//设置当前Page前台状态改为false，标识当前Page不在前台
        this.hide();//隐藏，TODO 这里可以对应不同的动画
        this.onPause();//Page回调-暂停
        this.application.keyboard.page = null;//保护，防止异常触发按键
    }

    stop() {
        this.lifeState = PageLifeState.STOP;//当前生命周期处在Page停止
        this.onStop();//Page回调-停止
    }

    destroy() {
        this.lifeState = PageLifeState.DESTROY;//当前生命周期处在Page销毁
        this.onDestroy();//Page回调-销毁
        this.ele.remove();//将当前节点从application中移除
        //兼容ele.remove无效
        if (this.application.ele.contains(this.ele)) {
            this.application.ele.removeChild(this.ele);
        }
        this.pageManager.pageList.removeEle(this);//将当前Page从application的pageList中移除
        this.clearParam();//清除参数
    }


    onCreate(param) {
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
     * 设置反馈到上一个页面的数据
     * @param{Object} data 返回到上一个页面的数据
     */
    setResult(data) {
        this.backResultData = data;
    }

    onResult(data) {
        console.log("返回数据：", data);
    }

    /**
     * 缓存数据，覆盖开始页面传递的参数
     * 当页面stop之后，重新创建时使用的数据
     * @param{Object} param
     */
    saveParam(param) {
        var newData = (param || {}).clone();
        this.pageManager.coverPageInfo(this.param, newData);
        this.param = newData
    }

    /**
     * Page默认的点击监听
     * Page的监听是方法
     * @param view
     */
    onClickListener(view) {
        // console.log("page","onClickListener",view);
    }

    /**
     * Page默认的焦点变化监听
     * Page的监听是方法
     * @param view
     * @param hasFocus
     */
    onFocusChangeListener(view, hasFocus) {
        // console.log("page","onFocusChangeListener",view);
    }


    /**
     * Page默认的显示变化监听
     * Page的 监听的方法
     * @param view
     * @param isShowing
     */
    onVisibleChangeListener(view, isShowing) {
        // console.log("page","onVisibleChangeListener",view);
    }

    /**
     * Page默认的滚动开始监听
     * Page的 监听的方法
     * @param scrollView
     * @param x
     * @param y
     */
    onScrollStartListener(scrollView, x, y) {
        // console.log("开始滚动", scrollView, x, y);
    }

    /**
     * Page默认的滚动中监听
     * Page的 监听的方法
     * @param scrollView
     * @param x
     * @param y
     */
    onScrollingListener(scrollView, x, y) {
        // console.log("滚动中", scrollView, x, y);
    }

    /**
     * Page默认的滚动结束监听
     * Page的 监听的方法
     * @param scrollView
     * @param x
     * @param y
     */
    onScrollEndListener(scrollView, x, y) {
        // console.log("滚动结束", scrollView, x, y);
    }

    /**
     * 创建Page对应的节点和滚动器
     */
    init() {
        //创建Page对应的节点，并添加到Application中
        if (!this.ele) {
            var ele = document.createElement("div");
            ele.className = "page";
            this.ele = ele;
            this.application.scroller.ele.appendChild(ele);
        }
    }

    /**
     * 触发焦点变化监听器
     * 去除调用application的callFocusChangeListener调用
     */
    callFocusChangeListener(view, hasFocus, intercept) {
        if (intercept) {
            return;
        }
        if (this.onFocusChangeListener && typeof this.onFocusChangeListener == "string") {
            this.onFocusChangeListener = this[this.onFocusChangeListener];
        }
        if (this.onFocusChangeListener) {
            this.onFocusChangeListener(view, hasFocus);
        }
    }

    get pageManager() {
        return this.application.pageManager;
    }

    /**
     * 清除页面缓存
     */
    clearParam() {
        console.log("清除页面缓存：", this.param);
        //清除数据
        this.pageManager.removePageInfo(this.param);
    }

    /**
     * 跳转到page
     * @param{Page} page
     */
    startPage(page, param) {
        this.application.startPage(page, param);
    }

    finish() {
        this.application.finishPage(this);
    }

    set html(html) {
        this.viewManager.clear();
        super.html = html;
    }

    get html() {
        return super.html;
    }

    get focusView() {
        return this.viewManager.focusView;
    }

    get application() {
        return this._application;
    }

    set application(value) {
        this._application = value;
        this.fatherView = value;
    }

    //确定
    key_ok_event() {
        if (this.focusView) {
            this.focusView.callClickListener(this.focusView);
        }
    };

    //上下左右
    key_up_event() {
        if (!this.focusView) {
            return;
        }

        var nextUp = this.focusView.nextUp;

        if (nextUp) {//控件/方法
            this.viewManager.next(nextUp);
        }
    };

    key_down_event() {
        if (!this.focusView) {
            return;
        }
        var nextDown = this.focusView.nextDown;

        if (nextDown) {
            this.viewManager.next(nextDown);
        }
    };

    key_left_event() {
        if (!this.focusView) {
            return;
        }
        var nextLeft = this.focusView.nextLeft;

        if (nextLeft) {
            this.viewManager.next(nextLeft);
        }
    };

    key_right_event() {
        if (!this.focusView) {
            return;
        }
        var nextRight = this.focusView.nextRight;

        if (nextRight) {
            this.viewManager.next(nextRight);
        }
    };

    //数字
    key_number_event(number) {
    };

    //返回
    key_back_event() {
        this.finish();
    };

    key_pageUp_event() {
    };

    key_pageDown_event() {
    };

    key_mute_event() {
    };

    //删除
    key_del_event() {
    };

    //音量增减
    key_volUp_event() {
    };

    key_volDown_event() {
    };

    //四色
    key_red_event() {
    };

    key_green_event() {
    };

    key_yellow_event() {
    };

    key_blue_event() {
    };

    /**
     * 播放事件,
     * @param player_event 播放的具体信息
     */
    key_player_event(player_event) {
    };

    //其他
    key_default_event(keyCode) {
    };
}

/**
 * 生命周期状态枚举
 * Page、Fragment
 */
export var PageLifeState = {
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
