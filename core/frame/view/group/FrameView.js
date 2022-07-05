import GroupView from "./GroupView";
import Fragment from "./Fragment";
import State from "../../util/State";

export default class FrameView extends GroupView {
    constructor(viewManager) {
        super(viewManager);
        delete this.selectView;

        /**
         * 子控件
         * @type {Fragment[]}
         */
        this.childViews = [];
        /**
         * 前台状态的碎片
         * @type{Fragment}
         */
        this.foregroundView = null;
        //切换碎片的方式
        this.switchType = "";
    }

    requestFocus() {
        if(!this.isScrolling){
            super.requestFocus();
        }
    }

    /**
     * 将fragment添加到当前FrameView
     * @param{Fragment} fragment
     */
    addChild(fragment) {
        //添加碎片
        if (!fragment instanceof Fragment) {
            console.error("FrameView 的子控件类型错误");
            return;
        }
        if (this.childViews.indexOf(fragment) > -1) {
            return;
        }

        super.addChild(fragment);

        fragment.viewManager = this.viewManager;

        //以下两个操作不执行，在FrameView执行measure时，报错
        fragment.init();//创建fragment的节点
        fragment.scroller.init();//创建fragment的滚动器节点，

        this.scroller.ele.appendChild(fragment.ele);

        fragment.left = this.width * (this.childViews.length - 1) * 1.1;

        if (!this.foregroundView && fragment.childViews.length > 0 && this.page.lifeState == State.LifeState.RUN) {
            this.switchTo(0);
        }
    }

    /**
     * 将fragment添加到当前FrameView
     * @param{Fragment} fragment
     */
    addFragment(fragment) {
        this.addChild(fragment);
    }

    /**
     *
     * @param{Fragment[]} fragmentList
     */
    addFragmentList(fragmentList) {
        if (fragmentList.length <= 0) {
            return;
        }
        for (var fragment of fragmentList) {
            if (fragment instanceof Fragment) {
                this.addChild(fragment);
            }
        }
    }

    /**
     * 将fragment切换到前台
     * @param{Fragment|number} fragment
     */
    switchTo(fragment) {
        if (this.page.lifeState != State.LifeState.RUN) {
            return;
        }

        if (typeof fragment == "number") {
            fragment = this.childViews[fragment];
        } else {
            if (this.childViews.indexOf(fragment) == -1) {
                this.addChild(fragment);
            }
        }

        if (this.foregroundView == fragment) {
            return;
        }

        if (this.foregroundView) {
            this.foregroundView.switchToBackground();
        }
        this.foregroundView = fragment;
        fragment.switchToForeground();
        this.scroller.measure();
        this.scrollToChild(fragment);
    }

    /**
     * 劫持Page的onResume、onPause、onStop、onDestroy
     * 在执行上述几个回调后只从frameView的对应操作
     */
    bindPageLife() {
        var frameView = this;

        var pageOnResume = this.page.onResume;
        this.page.onResume = function () {
            pageOnResume.call(frameView.page);
            setTimeout(function () {
                if (frameView.foregroundView) {
                    frameView.switchTo(frameView.foregroundView);
                } else {
                    if (frameView.childViews.length > 0) {
                        frameView.switchTo(0);
                    }
                }
            }, 1);

        }

        var pageOnPause = this.page.onPause;
        this.page.onPause = function () {
            pageOnPause.call(frameView.page);
            setTimeout(function () {
                if (frameView.foregroundView && frameView.foregroundView.lifeState == State.LifeState.RUN) {
                    frameView.foregroundView.pause();
                }
            }, 1);
        }

        var pageOnStop = this.page.onStop;
        this.page.onStop = function () {
            pageOnStop.call(frameView.page);
            setTimeout(function () {
                for (var fragment of frameView.childViews) {
                    if (fragment.lifeState == State.LifeState.PAUSE) {
                        fragment.stop();
                    }
                }
            }, 1);
        }

        var pageOnDestroy = this.page.onDestroy;
        this.page.onDestroy = function () {
            pageOnDestroy.call(frameView.page);
            setTimeout(function () {
                for (var fragment of frameView.childViews) {
                    if (fragment.lifeState == State.LifeState.STOP) {
                        fragment.destroy();
                    }
                }
            }, 1);
        }
    }

    /**
     * 使用ele创建控件
     * @param{Element} ele
     * @param{ViewManager} viewManager
     * @returns {FrameView}
     */
    static parseByEle(ele,viewManager){
        var frameView = new FrameView(viewManager);
        frameView.ele = ele;
        frameView.setAttributeParam(ele);
        frameView.scroller.init();
        frameView.bindPageLife();//必须在addView之后执行
        frameView.bindImage();//必须在addView之后执行
        //TODO 需要考虑FrameView是否需要默认焦点功能
        return frameView;
    }

}