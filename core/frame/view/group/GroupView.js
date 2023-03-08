import ScrollView, {
    ScrollCenter,
    ScrollEnd,
    ScrollNormal,
    ScrollStart
} from "@core/frame/view/base/ScrollView";
import Keyboard from "@core/frame/app/Keyboard";
import VPosition from "@core/frame/util/VPosition";
import View from "@core/frame/view/base/View";
import ItemView from "@core/frame/view/base/ItemView";

export default class GroupView extends ScrollView {
    constructor(viewManager, listenerLocation) {
        super(viewManager, listenerLocation);
        this.focusable = true;

        this._data = [];
        this.selectView = null;
        //上焦前的焦点
        this.frontView = null;
        this.select = false;

        /**
         * @type{string|object}
         * @private
         */
        this._scrollLocate = ScrollNormal;

        //焦点向上的view或方法的命名
        this.nextUp = "";
        //焦点向下的view或方法
        this.nextDown = "";
        //焦点向左的view或方法
        this.nextLeft = "";
        //焦点向右的view或方法
        this.nextRight = "";
    }

    set html(html) {
        //初始化滚动器
        this.scroller.init();
        //将html设置到节点中
        this.scroller.html = html;
        //业务层触发的，listenerLocation为this
        this.listenerLocation = this;
        //构建控件
        this.viewManager.buildView(this);
        //测量滚动器实际大小，并设置
        this.measure();
        //绑定ImageView
        this.bindImage();
        //绑定TextView
        this.bindText();

    }

    get html() {
        return this.scroller.html;
    }

    requestFocus() {
        if (!this.isShowing) {
            return;
        }
        if (this.childViews.length == 0) {
            return;
        }

        var frontView = this.viewManager.focusView;

        if (this.select && this.selectView) {
            this.selectView.requestFocus();
        } else {
            GroupView.focusViewGroup(this.page.focusView, this);
        }

        if (frontView && frontView != this) {//焦点存在，并且和当前不是同一个
            this.frontView = frontView;
        }
    }

    /**
     * 没有失焦动作
     */
    requestUnFocus() {
    }

    /**
     * 方向键规则设置
     * 由于ScrollView继承的View所以这个需要代码冗余
     * @param nextUp
     * @param nextDown
     * @param nextLeft
     * @param nextRight
     */
    setFocusChange(nextUp, nextDown, nextLeft, nextRight) {
        this.nextUp = nextUp;
        this.nextDown = nextDown;
        this.nextLeft = nextLeft;
        this.nextRight = nextRight;
    }

    /**
     * 和ItemView中的方法相同
     * 由于继承的View所以这个需要代码冗余
     * @param{View} view
     * @param{boolean} isShowing
     */
    callVisibleChangeListener(view, isShowing) {
        this.loadImageResource(true);//这个方法会向子控件迭代加载图片
        var onVisibleChangeListener = null;
        if (this.onVisibleChangeListener) {
            if (typeof this.onVisibleChangeListener == "string") {
                onVisibleChangeListener = this.listenerLocation[this.onVisibleChangeListener];
            } else if (this.onVisibleChangeListener instanceof Function) {
                onVisibleChangeListener = this.onVisibleChangeListener;
            } else {
                console.error("显示变化监听设置错误");
                return;
            }
            onVisibleChangeListener.call(this.listenerLocation, view, isShowing);
        } else {
            if (this.fatherView) {
                this.fatherView.callVisibleChangeListener(view, isShowing);
            }
        }
    }

    /**
     * 触发焦点变化监听器
     * 当前控件上焦/失焦
     * 和ItemView中的方法相同
     * 由于继承的View所以这个需要代码冗余
     * @param{ItemView} view
     * @param{boolean} hasFocus
     * @param{boolean} intercept 是否拦截（在子控件中已设置监听，不需要触发父控件的）
     */
    callFocusChangeListener(view, hasFocus, intercept) {
        this.loadImageResource(false);//GroupView本身不会上焦，都是由子控件触发，不需要向子控件迭代加载图片
        var onFocusChangeListener = null;
        if (this.onFocusChangeListener && !intercept) {
            if (typeof this.onFocusChangeListener == "string") {
                onFocusChangeListener = this.listenerLocation[this.onFocusChangeListener];
            } else if (this.onFocusChangeListener instanceof Function) {
                onFocusChangeListener = this.onFocusChangeListener;
            } else {
                console.error("焦点变化监听设置错误");
                return;
            }
            onFocusChangeListener.call(this.listenerLocation, view, hasFocus);
            intercept = true;
        }

        if (this.fatherView) {
            this.fatherView.callFocusChangeListener(view, hasFocus, intercept);
        }

        if (this.fatherView && hasFocus) {//不能instanceof GroupView
            this.fatherView.scrollToChild(this, this.fatherView.scrollLocate);
        }


        //设置驻留效果
        if (hasFocus) {
            if (this.select
                && this.selectView
                && this.selectView != this.page.focusView
                && this.selectView instanceof ItemView) {
                this.selectView.setUnFocusStyle();
            }
            this.selectView = view;
        } else {
            if (this.select
                && this.selectView instanceof ItemView) {
                view.setSelectStyle();
            }
        }
    }

    /**
     * 和ItemView中的方法相同
     * 由于继承的View所以这个需要代码冗余
     * @param{ItemView} view
     */
    callClickListener(view) {
        var onClickListener = null;
        if (this.onClickListener) {
            if (typeof this.onClickListener == "string") {
                onClickListener = this.listenerLocation[this.onClickListener];
            } else if (this.onClickListener instanceof Function) {
                onClickListener = this.onClickListener;
            } else {
                console.error("点击监听设置错误");
                return;
            }
            onClickListener.call(this.listenerLocation, view);
        } else {
            if (this.fatherView) {
                this.fatherView.callClickListener(view);
            }
        }
    }

    /**
     * 数据绑定
     * @param{Object[]} data
     */
    set data(value) {
        this._data = value;
        for (var i = 0; i < this._data.length && i < this.childViews.length; i++) {
            this.childViews[i].data = this._data[i];
        }
    }

    get data() {
        return this._data;
    }

    /**
     * TODO 待优化，网格原则，和内部焦点变化规则方法合并
     * @param{View} view
     */
    addChild(view) {
        if (!view) {
            return;
        }
        if (this.data && this.data.length > this.childViews.length) {
            view.data = this.data[this.childViews.length];
        }
        super.addChild(view);
        if (view instanceof ItemView || view instanceof GroupView) {
            var groupView = this;
            if (!view.nextUp) {
                view.nextUp = function () {
                    var nextUp = GroupView.getMinUpDistanceChild(groupView, view);
                    if (!nextUp) {
                        nextUp = groupView.nextUp;
                    }
                    groupView.viewManager.next(nextUp);
                }
            }
            if (!view.nextDown) {
                view.nextDown = function () {
                    var nextDown = GroupView.getMinDownDistanceChild(groupView, view);
                    if (!nextDown) {
                        nextDown = groupView.nextDown;
                    }
                    groupView.viewManager.next(nextDown);
                }
            }
            if (!view.nextLeft) {
                view.nextLeft = function () {
                    var nextLeft = GroupView.getMinLeftDistanceChild(groupView, view);
                    if (!nextLeft) {
                        nextLeft = groupView.nextLeft;
                    }
                    groupView.viewManager.next(nextLeft);
                }
            }
            if (!view.nextRight) {
                view.nextRight = function () {
                    var nextRight = GroupView.getMinRightDistanceChild(groupView, view);
                    if (!nextRight) {
                        nextRight = groupView.nextRight;
                    }
                    groupView.viewManager.next(nextRight);
                }
            }
        }
    }

    set scrollLocate(value) {
        this._scrollLocate = value;
    }

    get scrollLocate() {
        return this._scrollLocate;
    }

    /**
     * 加载当前控件绑定的图片资源
     * 就是把图片url设置到对应节点的src
     * @param{boolean} intoChild 是否调用子控件的loadImageResource
     */
    loadImageResource(intoChild) {
        super.loadImageResource(false);

        if (intoChild) {
            for (var child of this.childViews) {
                if (child instanceof ScrollView) {
                    child.loadImageResource(true);
                } else if(child instanceof ItemView){
                    child.loadImageResource();
                }
            }
        }
    }

    setAttributeParam() {
        super.setAttributeParam();

        var firstFocus = this.ele.hasAttribute("first-focus");

        var up = View.parseAttribute("view-up", this.ele);//上
        var down = View.parseAttribute("view-down", this.ele);//下
        var left = View.parseAttribute("view-left", this.ele);//左
        var right = View.parseAttribute("view-right", this.ele);//右
        var change = View.parseAttribute("view-change", this.ele);//上、下、左、右
        if (change) {
            var strs = change.split(",");
            if (strs.length == 4) {
                up = strs[0];
                down = strs[1];
                left = strs[2];
                right = strs[3];
            }
        }

        var click = View.parseAttribute("view-click", this.ele);//点击
        var focus = View.parseAttribute("view-focus", this.ele);//焦点变化
        this.setFocusChange(up, down, left, right);

        this.onClickListener = click || "";
        this.onFocusChangeListener = focus || "";

        var select = View.parseAttribute("view-select", this.ele);//离开是是否驻留

        if (select == "1" || select == "true") {
            this.select = true;
        }

        var scrollLocate = View.parseAttribute("view-locate",this.ele);
        if(scrollLocate == "start"){
            this.scrollLocate = ScrollStart;
        }else if(scrollLocate == "center"){
            this.scrollLocate = ScrollCenter;
        }else if(scrollLocate == "end"){
            this.scrollLocate = ScrollEnd;
        }else{
            if(scrollLocate){
                console.warn("view-locate值 错误")
            }
        }

        return firstFocus;
    }

    /**
     * 获取区域内向上最近的子view，如果返回null，表示到达边界
     * @param groupView
     * @param currentChild
     * @returns {*}
     */
    static getMinUpDistanceChild(groupView, currentChild) {
        var upMiddlePosition = GroupView.getUpMiddlePosition(currentChild);

        var nextUp = null;

        var distance = 1920 * 1920 * 4;//超过二屏的距离
        for (var i = 0; i < groupView.childViews.length; i++) {
            var child = groupView.childViews[i];

            if (!child.ele) {//不存在时
                continue;
            }

            if (child == currentChild) {
                continue;
            }

            if (!child.focusable) {
                continue;
            }

            if (!child.isShowing) {
                continue;
            }

            if (child instanceof GroupView && child.childViews.length == 0) {
                continue;
            }

            var nextUpMiddle = GroupView.getUpMiddlePosition(child);
            if (upMiddlePosition.top <= nextUpMiddle.top) {//在当前的下方
                continue;
            }

            var nextDownMiddle = GroupView.getDownMiddlePosition(child);

            if (nextUp && nextDownMiddle.left == GroupView.getDownMiddlePosition(nextUp).left) {//中点在同一垂直线时
                if (nextDownMiddle.top > GroupView.getDownMiddlePosition(nextUp).top) {//越靠下的优先级越高
                    nextUp = child;
                    distance = GroupView.getDistance(upMiddlePosition, nextDownMiddle);
                }
            } else {
                var distance_1 = GroupView.getDistance(upMiddlePosition, nextDownMiddle);
                if (distance_1 < distance) {
                    nextUp = child;
                    distance = distance_1;
                }
            }
        }

        return nextUp;

    }

    /**
     * 获取区域内向下最近的子view，如果返回null，表示到达边界
     * @param groupView
     * @param currentChild
     * @returns {*}
     */
    static getMinDownDistanceChild(groupView, currentChild) {
        var downMiddlePosition = GroupView.getDownMiddlePosition(currentChild);

        var nextDown = null;

        var distance = 1920 * 1920;//超过一屏的距离
        for (var i = 0; i < groupView.childViews.length; i++) {
            var child = groupView.childViews[i];

            if (!child.ele) {//不存在时
                continue;
            }

            if (child == currentChild) {
                continue;
            }

            if (!child.focusable) {
                continue;
            }

            if (!child.isShowing) {
                continue;
            }

            if (child instanceof GroupView && child.childViews.length == 0) {
                continue;
            }

            var nextDownMiddle = GroupView.getDownMiddlePosition(child);
            if (downMiddlePosition.top >= nextDownMiddle.top) {//在当前的上方
                continue;
            }

            var nextUpMiddle = GroupView.getUpMiddlePosition(child);

            if (nextDown && nextUpMiddle.left == GroupView.getUpMiddlePosition(nextDown).left) {//中点在同一垂直线时，越靠上的优先级越高
                if (nextUpMiddle.top < GroupView.getUpMiddlePosition(nextDown).top) {
                    nextDown = child;
                    distance = GroupView.getDistance(downMiddlePosition, nextUpMiddle);
                }
            } else {//中点不在同一垂直线
                var distance_1 = GroupView.getDistance(downMiddlePosition, nextUpMiddle);

                if (distance_1 < distance) {
                    nextDown = child;
                    distance = distance_1;
                }
            }
        }

        return nextDown;
    }

    /**
     * 获取区域内向左最近的子view，如果返回null，表示到达边界
     * @param groupView
     * @param currentChild
     * @returns {*}
     */
    static getMinLeftDistanceChild(groupView, currentChild) {
        var leftMiddlePosition = GroupView.getLeftMiddlePosition(currentChild);

        var nextLeft = null;

        var distance = 1920 * 1920;//超过一屏的距离
        for (var i = 0; i < groupView.childViews.length; i++) {
            var child = groupView.childViews[i];

            if (!child.ele) {//不存在时
                continue;
            }

            if (child == currentChild) {
                continue;
            }

            if (!child.focusable) {
                continue;
            }

            if (!child.isShowing) {
                continue;
            }

            if (child instanceof GroupView && child.childViews.length == 0) {
                continue;
            }

            var nextLeftMiddle = GroupView.getLeftMiddlePosition(child);
            if (leftMiddlePosition.left <= nextLeftMiddle.left) {//在当前的右边
                continue;
            }

            var nextRightMiddle = GroupView.getRightMiddlePosition(child);

            if (nextLeft && nextRightMiddle.top == GroupView.getRightMiddlePosition(nextLeft).top) {//中点在同一水平线时
                if (nextRightMiddle.left > GroupView.getRightMiddlePosition(nextLeft).left) {//越靠右的优先级越高
                    nextLeft = child;
                    distance = GroupView.getDistance(leftMiddlePosition, nextRightMiddle);
                }
            } else {
                var distance_1 = GroupView.getDistance(leftMiddlePosition, nextRightMiddle);
                if (distance_1 < distance) {
                    nextLeft = child;
                    distance = distance_1;
                }
            }
        }

        return nextLeft;

    }

    /**
     * 获取区域内向右最近的子view，如果返回null，表示到达边界
     * @param groupView
     * @param currentChild
     * @returns {*}
     */
    static getMinRightDistanceChild(groupView, currentChild) {
        var rightMiddlePosition = GroupView.getRightMiddlePosition(currentChild);

        var nextRight = null;

        var distance = 1920 * 1920;//超过一屏的距离
        for (var i = 0; i < groupView.childViews.length; i++) {
            var child = groupView.childViews[i];

            if (!child.ele) {//不存在时
                continue;
            }

            if (child == currentChild) {
                continue;
            }

            if (!child.focusable) {
                continue;
            }

            if (!child.isShowing) {
                continue;
            }

            if (child instanceof GroupView && child.childViews.length == 0) {
                continue;
            }


            var nextRightMiddle = GroupView.getRightMiddlePosition(child);
            if (rightMiddlePosition.left >= nextRightMiddle.left) {//在当前的左边
                continue;
            }

            var nextLeftMiddle = GroupView.getLeftMiddlePosition(child);

            if (nextRight && nextRightMiddle.top == GroupView.getLeftMiddlePosition(nextRight).top) {//中点在同一水平线时
                if (nextLeftMiddle.left < GroupView.getLeftMiddlePosition(nextRight).left) {//越靠左的优先级越高
                    nextRight = child;
                    distance = GroupView.getDistance(rightMiddlePosition, nextLeftMiddle);
                }
            } else {
                var distance_1 = GroupView.getDistance(rightMiddlePosition, nextLeftMiddle);
                if (distance_1 < distance) {
                    nextRight = child;
                    distance = distance_1;
                }
            }


        }

        return nextRight;

    }

    /**
     * 获取上边框中点坐标
     * @returns {{top: number, left: number}}
     */
    static getUpMiddlePosition(view) {
        var positionByFather = view.positionByFather;
        var left = positionByFather.left + view.width / 2;
        var top = positionByFather.top;
        return new VPosition(left, top);
    };

    /**
     * 获取下边框中点坐标
     * @returns {{top: number, left: number}}
     */
    static getDownMiddlePosition(view) {
        var positionByFather = view.positionByFather;
        var left = positionByFather.left + view.width / 2;
        var top = positionByFather.top + view.height;
        return new VPosition(left, top);
    };

    /**
     * 获取左边框中点坐标
     * @returns {{top: number, left: number}}
     */
    static getLeftMiddlePosition(view) {
        var positionByFather = view.positionByFather;
        var left = positionByFather.left;
        var top = positionByFather.top + view.height / 2;
        return new VPosition(left, top);
    };

    /**
     * 获取右边框中点坐标
     * @returns {{top: number, left: number}}
     */
    static getRightMiddlePosition(view) {
        var positionByFather = view.positionByFather;
        var left = positionByFather.left + view.width;
        var top = positionByFather.top + view.height / 2;
        return new VPosition(left, top);
    };

    static focusViewGroup(view, groupView) {
        if (Keyboard.KEY_CODE != Keyboard.KEY_UP
            && Keyboard.KEY_CODE != Keyboard.KEY_DOWN
            && Keyboard.KEY_CODE != Keyboard.KEY_LEFT
            && Keyboard.KEY_CODE != Keyboard.KEY_RIGHT) {//非方向键触发
            for (var i = 0; i < groupView.childViews.length; i++) {
                var child = groupView.childViews[i];
                if (child.focusable) {
                    if (child instanceof GroupView && child.childViews.length == 0) {
                        continue;
                    } else {
                        child.requestFocus();
                    }
                    break;
                }
            }
            return;
        }

        if (!view) {
            console.log("error:view为空！");
            return;
        }

        if (!groupView) {
            console.log("error:groupView为空");
            return;
        }

        if (groupView.childViews.length <= 0) {
            console.log("error:groupView内部没有子view");
            return;
        }

        var next = null;
        var fromMiddle = null;
        switch (Keyboard.KEY_CODE) {
            case Keyboard.KEY_UP:
                fromMiddle = view.positionAbsolute;
                fromMiddle.left = fromMiddle.left + view.width / 2;
                break;
            case Keyboard.KEY_DOWN:
                fromMiddle = view.positionAbsolute;
                fromMiddle.left = fromMiddle.left + view.width / 2;
                fromMiddle.top = fromMiddle.top + view.height;
                break;
            case Keyboard.KEY_LEFT:
                fromMiddle = view.positionAbsolute;
                fromMiddle.left = fromMiddle.left + view.width;
                fromMiddle.top = fromMiddle.top + view.height / 2;
                break;
            case Keyboard.KEY_RIGHT:
                fromMiddle = view.positionAbsolute;
                fromMiddle.left = fromMiddle.left + view.width;
                fromMiddle.top = fromMiddle.top + view.height / 2;
                break;
            default:
                console.log("error:action值异常！");
                return;
        }

        var distance = 3840 * 3840;//超过4K一屏的距离

        for (var i = 0; i < groupView.childViews.length; i++) {
            var child = groupView.childViews[i];

            if (!child.isShowing) {//不显示
                continue;
            }

            if (!child.focusable) {
                continue;
            }

            if (child instanceof GroupView && child.childViews.length == 0) {
                continue;
            }

            var position = child.positionByFather;

            if (position.top + child.height / 2 > groupView.height) {//在显示范围下
                // console.log(child.id+"超过一半在显示范围下");
                continue;
            }

            if (position.top + child.height / 2 < 0) {//在显示范围上
                // console.log(child.id+"超过一半在显示范围上");
                continue;
            }

            if (position.left + child.width / 2 > groupView.width) {//在显示范围右
                // console.log(child.id+"超过一半在显示范围右");
                continue;
            }

            if (position.left + child.width / 2 < 0) {//在显示范围上
                // console.log(child.id+"超过一半在显示范围左");
                continue;
            }

            var toMiddle = null;
            toMiddle = child.positionAbsolute;
            switch (Keyboard.KEY_CODE) {
                case Keyboard.KEY_UP:
                    toMiddle.left = toMiddle.left + child.width / 2;
                    toMiddle.top = toMiddle.top + child.height;
                    break;
                case Keyboard.KEY_DOWN:
                    toMiddle.left = toMiddle.left + child.width / 2;
                    break;
                case Keyboard.KEY_LEFT:
                    toMiddle.left = toMiddle.left + child.width;
                    toMiddle.top = toMiddle.top + child.height / 2;
                    break;
                case Keyboard.KEY_RIGHT:
                    toMiddle.top = toMiddle.top + child.height / 2;
                    break;
                default:
                    console.log("error:action值异常！");
                    return;
            }

            var distance_1 = GroupView.getDistance(fromMiddle, toMiddle);
            if (distance_1 < distance) {
                next = child;
                distance = distance_1;
            }

        }

        groupView.viewManager.next(next);

    }

    /**
     *
     * @param{VPosition} position_0
     * @param{VPosition} position_1
     * @returns {number}
     */
    static getDistance(position_0, position_1) {
        var l = position_0.left - position_1.left;
        var t = position_0.top - position_1.top;
        return l * l + t * t;
    }

    /**
     * 使用ele创建控件
     * @param{Element} ele
     * @param{ViewManager} viewManager
     * @param{View} listenerLocation
     * @returns {GroupView}
     */
    static parseByEle(ele, viewManager, listenerLocation) {
        var groupView = new GroupView(viewManager, listenerLocation);
        groupView.ele = ele;
        var firstFocus = groupView.setAttributeParam(ele);
        groupView.bindImage();
        groupView.scroller.init();
        viewManager.eleToObject(groupView.scroller.ele, groupView, listenerLocation);//往内部执行
        if (!viewManager.focusView && firstFocus) {
            viewManager.focusView = groupView;
        }
        return groupView;
    }
}
