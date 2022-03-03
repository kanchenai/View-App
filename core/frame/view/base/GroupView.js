import ScrollView from "@core/frame/view/base/ScrollView";
import Keyboard from "@core/frame/app/Keyboard";
import VPosition from "@core/frame/util/VPosition";
import View from "@core/frame/view/base/View";
import ItemView from "@core/frame/view/base/ItemView";

export default class GroupView extends ScrollView {
    constructor(id) {
        super(id);

        this._data = [];
        /**
         * @type {ItemView[]}
         */
        this.childViews = [];
        this.selectView = null;
        //上焦前的焦点
        this.frontView = null;
        this.select = false;

        //焦点向上的view或方法的命名
        this.nextUp = "";
        //焦点向下的view或方法
        this.nextDown = "";
        //焦点向左的view或方法
        this.nextLeft = "";
        //焦点向右的view或方法
        this.nextRight = "";
    }

    requestFocus() {
        if(!this.isShowing){
            return;
        }
        if (this.childViews.length == 0) {
            return;
        }

        var focusView = this.viewManager.focusView;
        if (focusView && focusView != this) {//焦点存在，并且和当前不是同一个
            focusView.requestUnFocus();
            this.frontView = focusView;
        }

        if (this.select && this.selectView) {
            this.selectView.requestFocus();
        } else {
            GroupView.focusViewGroup(this.page.focusView, this);
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
        var onVisibleChangeListener = null;
        if (this.onVisibleChangeListener) {
            if (typeof this.onVisibleChangeListener == "string") {
                onVisibleChangeListener = this.page[this.onVisibleChangeListener];
            } else if (this.onVisibleChangeListener instanceof Function) {
                onVisibleChangeListener = this.onVisibleChangeListener;
            } else {
                console.error("显示变化监听设置错误");
                return;
            }
            this.loadImageResource();//这个方法会向子控件迭代加载图片
            onVisibleChangeListener.call(this.page, view, isShowing);
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
     */
    callFocusChangeListener(view, hasFocus) {
        var onFocusChangeListener = null;
        if (this.onFocusChangeListener) {
            if (typeof this.onFocusChangeListener == "string") {
                onFocusChangeListener = this.page[this.onFocusChangeListener];
            } else if (this.onFocusChangeListener instanceof Function) {
                onFocusChangeListener = this.onFocusChangeListener;
            } else {
                console.error("焦点变化监听设置错误");
                return;
            }
            this.loadImageResource();//这个方法会向子控件迭代加载图片
            onFocusChangeListener.call(this.page, view, hasFocus);
        } else {
            if (this.fatherView) {
                this.fatherView.callFocusChangeListener(view, hasFocus);
            }
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
                onClickListener = this.page[this.onClickListener];
            } else if (this.onClickListener instanceof Function) {
                onClickListener = this.onClickListener;
            } else {
                console.error("点击监听设置错误");
                return;
            }
            onClickListener.call(this.page, view);
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
     * @param{ItemView|GroupView} view
     */
    addChild(view) {
        if (view && (view instanceof ItemView || view instanceof GroupView)) {
            view.fatherView = this;
            this.childViews.push(view);
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

    /**
     * 滚动到对应子控件
     * @param{View} childView
     * @param{number} scrollLocate 滚动位置
     */
    scrollToChild(childView, scrollLocate) {
        this.scrollVerticalToChild(childView, scrollLocate);
        this.scrollHorizontalToChild(childView, scrollLocate);
    }

    /**
     * 纵向滑动到childView
     * @param {View} childView 目标控件
     * @param {number} scrollLocate 滚动位置
     */
    scrollVerticalToChild(childView, scrollLocate) {
        if (this.childViews.indexOf(childView) < 0) {
            return;
        }

        if (typeof scrollLocate == "undefined") {
            scrollLocate = this.scrollLocate;
        }

        var top = childView.positionByFather.top;
        if (this.height < childView.height) {
            this.scrollVertical(top);
            return;
        }

        if (scrollLocate == ScrollView.scrollCenter) {
            var scrollTop = top - (this.height - childView.height) / 2;

            this.scrollVertical(scrollTop);
            return;
        }

        if (scrollLocate == ScrollView.scrollStart) {
            this.scrollVertical(top);
            return;
        }

        if (scrollLocate == ScrollView.scrollEnd) {
            var scrollTop = top - this.height + childView.height;
            this.scrollVertical(scrollTop);
            return;
        }

        if (top < 0) {
            this.scrollVertical(top);
        } else if (top > (this.height - childView.height)) {
            var scrollTop = top - (this.height - childView.height);
            this.scrollVertical(scrollTop)
        }
    }

    /**
     * 横向滑动到childView
     * @param {View} childView 目标控件
     * @param {number} scrollLocate 滚动位置
     */
    scrollHorizontalToChild(childView, scrollLocate) {
        if (this.childViews.indexOf(childView) < 0) {
            return;
        }

        if (typeof scrollLocate == "undefined") {
            scrollLocate = this.scrollLocate;
        }

        var left = childView.positionByFather.left;
        if (this.width < childView.width) {
            this.scrollHorizontal(left);
            return;
        }

        if (scrollLocate == ScrollView.scrollCenter) {
            var scrollLeft = left - (this.width - childView.width) / 2;
            this.scrollHorizontal(scrollLeft);
            return;
        }

        if (scrollLocate == ScrollView.scrollStart) {
            this.scrollHorizontal(left);
            return;
        }

        if (scrollLocate == ScrollView.scrollEnd) {
            var scrollLeft = left - this.width + childView.width;
            this.scrollHorizontal(scrollLeft);
            return;
        }

        if (left < 0) {
            this.scrollHorizontal(left);
        } else if (left > (this.width - childView.width)) {
            var scrollLeft = left - (this.width - childView.width);
            this.scrollHorizontal(scrollLeft)
        }
    }

    /**
     * 加载当前控件绑定的图片资源
     * 就是把图片url设置到对应节点的src
     */
    loadImageResource() {
        super.loadImageResource();

        for (var child of this.childViews) {
            child.loadImageResource();
        }
    }

    setAttributeParam() {
        var viewFocus = super.setAttributeParam();

        var select = View.parseAttribute("view-select", this.ele);//开始滚动

        if (select == "1" || select == "true") {
            this.select = true;
        }

        return viewFocus;
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

            var nextUpMiddle = GroupView.getUpMiddlePosition(child);
            if (upMiddlePosition.top <= nextUpMiddle.top) {//在当前的下方
                continue;
            }

            if (!child.isShowing) {
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

            if (!child.isShowing) {
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

            if (!child.isShowing) {
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

            if (!child.isShowing) {
                continue;
            }

            var nextRightMiddle = GroupView.getRightMiddlePosition(child);
            if (rightMiddlePosition.left >= nextRightMiddle.left) {//在当前的左边
                continue;
            }

            var nextLeftMiddle = GroupView.getLeftMiddlePosition(child);

            if (nextRight && nextRightMiddle.top == GroupView.getLeftMiddlePosition(nextRight).top) {//中点在同一水平线时
                if (nextRightMiddle.left < GroupView.getLeftMiddlePosition(nextRight).left) {//越靠左的优先级越高
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
        if (!Keyboard.KEY_CODE) {//无动作，直接代码上焦
            groupView.childViews[0].requestFocus();
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

            var position = child.positionByFather;

            if (position.top + child.height / 2 >= groupView.height) {//在显示范围下
                // console.log(child.id+"超过一半在显示范围下");
                continue;
            }

            if (position.top + child.height / 2 <= 0) {//在显示范围上
                // console.log(child.id+"超过一半在显示范围上");
                continue;
            }

            if (position.left + child.width / 2 >= groupView.width) {//在显示范围右
                // console.log(child.id+"超过一半在显示范围右");
                continue;
            }

            if (position.left + child.width / 2 <= 0) {//在显示范围上
                // console.log(child.id+"超过一半在显示范围左");
                continue;
            }

            var toMiddle = null;
            toMiddle = child.positionAbsolute;
            switch (Keyboard.KEY_CODE) {
                case Keyboard.KEY_UP:
                    toMiddle.left = toMiddle.left + child.width / 2;
                    break;
                case Keyboard.KEY_DOWN:
                    toMiddle.left = toMiddle.left + child.width / 2;
                    toMiddle.top = toMiddle.top + child.height;
                    break;
                case Keyboard.KEY_LEFT:
                    toMiddle.top = toMiddle.top + child.height / 2;
                    break;
                case Keyboard.KEY_RIGHT:
                    toMiddle.left = toMiddle.left + child.width;
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
     * @returns {GroupView}
     */
    static parseByEle(ele, viewManager) {
        var groupView = new GroupView();
        groupView.ele = ele;
        var viewDefault = groupView.setAttributeParam(ele);
        viewManager.addView(groupView);
        groupView.bindImage();//必须在this.addView之后执行
        groupView.scroller.init();
        viewManager.eleToObject(groupView.scroller.ele, groupView);//往内部执行
        if (viewDefault) {
            viewManager.focusView = groupView;
        }
        return groupView;
    }
}