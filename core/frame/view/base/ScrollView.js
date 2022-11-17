import View from "@core/frame/view/base/View";
import ImageView from "@core/frame/view/single/ImageView";
import ViewUtils from "@core/frame/util/ViewUtils";
import TextView from "@core/frame/view/single/TextView";
import State from "@core/frame/util/State";

/**
 * ScrollView不能继承ItemView，Scroller报错
 * 子类在new之后要执行scrollView.scroller.init(),把滚动器创建起来
 * 可以传递监听
 * 由于本身不能上焦，所以不能传递焦点变化
 */

export default class ScrollView extends View {
    constructor(viewManager, listenerLocation) {
        super(viewManager, listenerLocation);
        this.focusable = false;
        /**
         * 多个跑马灯
         * @type {TextView[]}
         */
        this._textList = [];
        /**
         * 多张图片
         * @type {ImageView[]}
         * @private
         */
        this._imageList = [];
        this.animation = State.ScrollAnimation;
        //生成滚动器
        this.scroller = new Scroller(this);
    }

    set html(html) {
        //初始化滚动器
        this.scroller.init();
        //将html设置到节点中
        this.scroller.html = html;
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

    /**
     * 绑定跑马灯
     */
    bindText() {
        this._textList = [];//置空
        TextView.bindTextByEle(this.ele, this);
    }

    /**
     * 绑定跑马灯
     * @param{TextView} text
     */
    set text(text) {
        if (!text instanceof TextView) {
            console.warn("ItemView 的跑马灯绑定异常！");
            return;
        }
        text.fatherView = this;
        //添加跑马灯
        this._textList.push(text);

        if (text.id) {
            this.viewMap.set(text.id, text);
        }
    }

    /**
     * 绑定多个跑马灯
     * @param{TextView[]} textList
     */
    set textList(textList) {
        if (!textList || textList.length == 0) {
            this._textList = [];//置空
        }
        for (var text of textList) {
            this.text = text;
        }
    }

    get textList() {
        return this._textList;
    }

    /**
     * 绑定ImageView
     * 用于懒加载图片
     */
    bindImage() {
        this._imageList = [];
        ImageView.bindImageByEle(this.ele, this)
    }

    /**
     * 加载当前控件绑定的图片资源
     * 就是把图片url设置到对应节点的src
     * @param{boolean} intoChild 是否调用子控件的loadImageResource
     */
    loadImageResource(intoChild) {
        //intoChild这个参数在ScrollView中无用，是为了子类调用的
        for (var image of this.imageList) {
            image.loadImageResource();
        }
    }

    /**
     * 绑定图片
     * @param{ImageView} image
     */
    set image(image) {
        if (!image instanceof ImageView) {
            console.warn("ItemView 的图片绑定异常！")
            return;
        }
        image.fatherView = this;
        //绑定图片
        this._imageList.push(image);
        if (image.id) {
            this.viewMap.set(image.id, image);
        }
    }

    /**
     * 绑定多张图片
     * @param{ImageView[]} imageList
     */
    set imageList(imageList) {
        if (!imageList || imageList.length == 0) {
            return;
        }
        for (var i = 0; i < imageList.length; i++) {
            this.image = imageList[i];
        }
    }

    get imageList() {
        return this._imageList;
    }



    /**
     * 滚动到对应子控件
     * @param{View} childView
     * @param{string|object} scrollLocate 滚动位置
     */
    scrollToChild(childView, scrollLocate) {
        if (scrollLocate instanceof Object) {
            var vertical = scrollLocate.vertical;

            if (ViewUtils.isEmpty(vertical)) {
                vertical = ScrollNormal;
            }
            this.scrollVerticalToChild(childView, vertical);

            var horizontal = scrollLocate.horizontal;

            if (ViewUtils.isEmpty(vertical)) {
                horizontal = ScrollNormal;
            }
            this.scrollHorizontalToChild(childView, horizontal);

        } else {
            this.scrollVerticalToChild(childView, scrollLocate);
            this.scrollHorizontalToChild(childView, scrollLocate);
        }
    }

    /**
     * 纵向滑动到childView
     * @param {View} childView 目标控件
     * @param {string} scrollLocate 滚动位置
     */
    scrollVerticalToChild(childView, scrollLocate) {
        if (this.childViews.indexOf(childView) < 0) {
            return;
        }

        if (typeof scrollLocate == "undefined") {
            scrollLocate = this.scrollLocate;
            if (scrollLocate instanceof Object) {
                scrollLocate = scrollLocate.vertical;
            }
        }

        var top = childView.positionByFather.top;

        if (this.height < childView.height) {
            this.scrollVertical(top);
            return;
        }

        if (scrollLocate == ScrollCenter) {
            var scrollTop = top - (this.height - childView.height) / 2;

            this.scrollVertical(scrollTop);
            return;
        }

        if (scrollLocate == ScrollStart) {
            this.scrollVertical(top);
            return;
        }

        if (scrollLocate == ScrollEnd) {
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
     * @param {string} scrollLocate 滚动位置
     */
    scrollHorizontalToChild(childView, scrollLocate) {
        if (this.childViews.indexOf(childView) < 0) {
            return;
        }

        if (typeof scrollLocate == "undefined") {
            scrollLocate = this.scrollLocate;
            if (scrollLocate instanceof Object) {
                scrollLocate = scrollLocate.horizontal;
            }
        }

        var left = childView.positionByFather.left;
        if (this.width < childView.width) {
            this.scrollHorizontal(left);
            return;
        }

        if (scrollLocate == ScrollCenter) {
            var scrollLeft = left - (this.width - childView.width) / 2;
            this.scrollHorizontal(scrollLeft);
            return;
        }

        if (scrollLocate == ScrollStart) {
            this.scrollHorizontal(left);
            return;
        }

        if (scrollLocate == ScrollEnd) {
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

    scrollTo(x, y) {
        this.scrollVerticalTo(y);
        this.scrollHorizontalTo(x);
    }

    /**
     * 纵向滚动到
     * @param y 纵坐标
     */
    scrollVerticalTo(y) {
        var maxScrollTop = this.scrollHeight - this.height;

        if (y > maxScrollTop) {
            y = maxScrollTop;
        }

        y = y < 0 ? 0 : y;

        var scrollTop = 0 - y;
        if (this.animation) {
            this.scroller.smoothVerticalTo(scrollTop);
        } else {
            this.scroller.verticalTo(scrollTop);
        }
    }

    /**
     * 纵向滚动
     * @param y 纵向距离
     */
    scrollVertical(y) {
        var scrollTop = this.scrollTop + y;
        this.scrollVerticalTo(scrollTop);
    }

    /**
     * 滚动到顶
     */
    scrollVerticalToStart() {
        this.scrollVerticalTo(0);
    }

    /**
     * 滚动到顶
     */
    scrollVerticalToEnd() {
        var y = this.scrollHeight - this.height;
        this.scrollVerticalTo(y);
    }

    /**
     * 横向滚动到
     * @param{number} x
     */
    scrollHorizontalTo(x) {
        var maxScrollLeft = this.scrollWidth - this.width;

        if (x > maxScrollLeft) {
            x = maxScrollLeft;
        }

        x = x < 0 ? 0 : x;

        var scrollLeft = 0 - x;
        if (this.animation) {
            this.scroller.smoothHorizontalTo(scrollLeft);
        } else {
            this.scroller.horizontalTo(scrollLeft);
        }
    }

    /**
     * 横向滚动
     * @param{number} x
     */
    scrollHorizontal(x) {
        var scrollLeft = this.scrollLeft + x;
        this.scrollHorizontalTo(scrollLeft);
    }

    /**
     * 滚动到左
     */
    scrollHorizontalToStart() {
        this.scrollHorizontalTo(0);
    };

    /**
     * 滚动到右
     */
    scrollHorizontalToEnd() {
        var x = this.scrollWidth - this.width;
        this.scrollHorizontalTo(x);
    }

    measure() {
        this.scroller.measure();
    }

    /**
     * 滚动开始监听
     * @param scrollView
     * @param x
     * @param y
     */
    onScrollStartListener(scrollView, x, y) {

    };

    /**
     * 滚动中监听
     * @param scrollView
     * @param x
     * @param y
     */
    onScrollingListener(scrollView, x, y) {

    };

    /**
     * 滚动结束监听
     * @param scrollView
     * @param x
     * @param y
     */onScrollEndListener(scrollView, x, y) {

    };

    callScrollStartListener(scrollView, x, y) {
        var onScrollStartListener = null;
        if (this.onScrollStartListener) {
            if (typeof this.onScrollStartListener == "string") {
                onScrollStartListener = this.listenerLocation[this.onScrollStartListener];
            } else if (this.onScrollStartListener instanceof Function) {
                onScrollStartListener = this.onScrollStartListener;
            } else {
                console.error("开始滚动监听设置错误");
                return;
            }
            onScrollStartListener.call(this.listenerLocation, scrollView, x, y);
        } else {
            if (this.fatherView) {
                this.fatherView.callScrollStartListener(scrollView, x, y);
            }
        }
    }

    callScrollingListener(scrollView, x, y) {
        var onScrollingListener = null;
        if (this.onScrollingListener) {
            if (typeof this.onScrollingListener == "string") {
                onScrollingListener = this.listenerLocation[this.onScrollingListener];
            } else if (this.onScrollingListener instanceof Function) {
                onScrollingListener = this.onScrollingListener;
            } else {
                console.error("开始滚动监听设置错误");
                return;
            }
            onScrollingListener.call(this.listenerLocation, scrollView, x, y);
        } else {
            if (this.fatherView) {
                this.fatherView.callScrollingListener(scrollView, x, y);
            }
        }
    }

    callScrollEndListener(scrollView, x, y) {
        var onScrollEndListener = null;
        if (this.onScrollEndListener) {
            if (typeof this.onScrollEndListener == "string") {
                onScrollEndListener = this.listenerLocation[this.onScrollEndListener];
            } else if (this.onScrollEndListener instanceof Function) {
                onScrollEndListener = this.onScrollEndListener;
            } else {
                console.error("开始滚动监听设置错误");
                return;
            }

            onScrollEndListener.call(this.listenerLocation, scrollView, x, y);
        } else {
            if (this.fatherView) {
                this.fatherView.callScrollEndListener(scrollView, x, y);
            }
        }
        this.loadImageResource(true);//这个方法会向子控件迭代加载图片
    }

    /**
     * 需要向上传递监听，本身不做任何处理
     * @param{View} view
     * @param{boolean} isShowing
     */
    callVisibleChangeListener(view, isShowing) {
        if (this.fatherView) {
            this.fatherView.callVisibleChangeListener(view, isShowing);
        }
    }

    /**
     * 需要向上传递监听，本身不做任何处理
     * @param{ItemView} view
     * @param{boolean} hasFocus
     * @param{boolean} intercept 是否拦截（在子控件中已设置监听，不需要触发父控件的）
     */
    callFocusChangeListener(view, hasFocus, intercept) {
        if (this.fatherView) {
            this.fatherView.callFocusChangeListener(view, hasFocus, intercept);
            if (hasFocus) {//不能instanceof GroupView
                this.fatherView.scrollToChild(this, this.fatherView.scrollLocate);
            }
        }
    }

    /**
     * 需要向上传递监听，本身不做任何处理
     * @param{ItemView} view
     */
    callClickListener(view) {
        if (this.fatherView) {
            this.fatherView.callClickListener(view);
        }
    }

    appendChild(ele) {
        this.scroller.ele.appendChild(ele);
        this.measure();
    }

    get scrollSpeed() {
        return this.scroller.speed;
    }

    set scrollSpeed(value) {
        this.scroller.speed = value;
    }

    get scrollCell() {
        return this.scroller.cell;
    }

    set scrollCell(value) {
        this.scroller.cell = value;
    }

    get isScrolling() {
        return this.scroller.isScrolling;
    }

    get scrollTop() {
        return 0 - this.scroller.top;
    }

    set scrollTop(value) {
        this.scroller.top = 0 - value;
    }

    get scrollLeft() {
        return 0 - this.scroller.left;
    }

    set scrollLeft(value) {
        this.scroller.left = 0 - value;
    }

    get scrollHeight() {
        return this.scroller.height;
    }

    set scrollHeight(value) {
        this.scroller.height = value;
    }

    get scrollWidth() {
        return this.scroller.width;
    }

    set scrollWidth(value) {
        this.scroller.width = value;
    }

    setAttributeParam() {
        var animation = View.parseAttribute("view-animation",this.ele);
        if(animation == "false" && animation == "0" ){
            this.animation = false;
        }

        var scrollStart = View.parseAttribute("view-scrollStart", this.ele);//开始滚动
        var scrolling = View.parseAttribute("view-scrolling", this.ele);//开始滚动
        var scrollEnd = View.parseAttribute("view-scrollEnd", this.ele);//开始滚动
        this.onScrollStartListener = scrollStart;
        this.onScrollingListener = scrolling;
        this.onScrollEndListener = scrollEnd;

        return super.setAttributeParam();
    }

    /**
     * 使用ele创建控件
     * @param{Element} ele
     * @param{ViewManager} viewManager
     * @param{View} listenerLocation
     * @returns {ScrollView}
     */
    static parseByEle(ele, viewManager, listenerLocation) {
        var scrollView = new ScrollView(viewManager, listenerLocation);
        scrollView.ele = ele;
        scrollView.setAttributeParam(ele);
        scrollView.bindImage();
        scrollView.scroller.init();
        viewManager.eleToObject(scrollView.scroller.ele, scrollView, listenerLocation);//往内部执行
        return scrollView;
    }
}

export var ScrollNormal = "normal";
//对应的ele滚动到居中
export var ScrollCenter = "center";
//对应的ele滚动到开始（横向居左/纵向居顶）
export var ScrollStart = "start";
//对应的ele滚动到结束（横向居右/纵向居底）
export var ScrollEnd = "end";

/**
 * 滚动器类
 * 滚动器滚动范围没有限制，滚动范围限制是在ScrollView中实现的
 */
export class Scroller extends View {
    constructor(fatherView) {
        super(null);
        this.fatherView = fatherView;
        //最小滚动速度
        this.speed = 1;
        //刷新间隔
        this.cell = 20;
        this.isScrolling = false;

        //当前纵向滚动速度
        this.currentSpeedV = 0;
        //当前横向滚动速度
        this.currentSpeedH = 0;
        //纵向滚动的timer
        this.vTimer = null;
        //横向滚动的timer
        this.hTimer = null;
    }

    init() {
        if (!this.ele) {//创建滚动器的节点
            var ele = document.createElement("div");
            this.ele = ele;
            var children = this.fatherView.ele.children;
            while (children.length > 0) {
                this.ele.appendChild(children[0]);
            }

            this.fatherView.ele.appendChild(this.ele);
            this.setStyle("overflow", "hidden");
        }
    }

    /**
     * 测量宽、高
     */
    measure() {
        this.size = this.fatherView.size;
        for (var childView of this.fatherView.childViews) {
            if (childView instanceof ScrollView) {
                childView.measure();
            }
        }
        //根据子节点计算
        var size = View.getVisibleSize(this.ele);
        if (size.width > this.width) {
            this.width = size.width;
        }
        if (size.height > this.height) {
            this.height = size.height;
        }
    }

    verticalTo(y) {
        this.fatherView.callScrollStartListener(this.fatherView, this.scrollLeft, this.scrollTop);
        this.top = y;
        this.fatherView.callScrollEndListener(this.fatherView, this.scrollLeft, this.scrollTop);
    }

    smoothVerticalTo(y) {
        if (this.top == y) {
            return;
        }

        if (this.vTimer) {
            clearTimeout(this.vTimer);
        }
        if (!this.isScrolling) {
            this.fatherView.callScrollStartListener(this.fatherView, 0 - this.left, 0 - this.top);
        }

        var speed = this.speed;
        if (Math.abs(this.top - y) > 20 * this.speed) {
            speed = Math.abs(this.top - y) / 20 + 1;
            speed = parseInt(speed);
        }

        //使用较大的滚动速度
        if (speed > this.currentSpeedV) {
            this.currentSpeedV = speed;
        }
        // console.log("纵向滚动速度：" + this.currentSpeedV);

        startScrollVerticalTo(this, y, this.currentSpeedV);
    }

    horizontalTo(x) {
        this.fatherView.callScrollStartListener(this.fatherView, this.scrollLeft, this.scrollTop);
        this.left = x;
        this.fatherView.callScrollEndListener(this.fatherView, this.scrollLeft, this.scrollTop);
    }

    smoothHorizontalTo(x) {
        if (this.left == x) {
            return;
        }

        if (this.hTimer) {
            clearTimeout(this.hTimer);
        }
        if (!this.isScrolling) {
            this.fatherView.callScrollStartListener(this.fatherView, this.left, this.top);
        }

        var speed = this.speed;
        if (Math.abs(this.left - x) > 20 * this.speed) {
            speed = Math.abs(this.left - x) / 20 + 1;
            speed = parseInt(speed);
        }

        //使用较大的滚动速度
        if (speed > this.currentSpeedH) {
            this.currentSpeedH = speed;
        }
        // console.log("横向滚动速度：" + this.currentSpeedH);

        startScrollHorizontalTo(this, x, this.currentSpeedH);
    }

    get left() {
        return super.left;
    }

    set left(value) {
        this.position.left = value;
        this.setStyle("left", value + "px");
    }

    get top() {
        return super.top;
    }

    set top(value) {
        this.position.top = value;
        this.setStyle("top", value + "px");
    }
}

/**
 * 纵向滚动的工具，不对外
 * @param scroller
 * @param y
 * @param scrollSpeed
 */
var startScrollVerticalTo = function (scroller, y, speed) {
    var top = scroller.top;
    if (Math.abs(top - y) < speed) {
        scroller.isScrolling = false;
        scroller.top = y;
        scroller.currentSpeedV = 0;
        scroller.fatherView.callScrollEndListener(scroller.fatherView, 0 - scroller.left, 0 - y);
        return;
    }

    if (y > top) {
        top += speed;
    } else {
        top -= speed;
    }
    scroller.top = top;

    scroller.isScrolling = true;
    scroller.fatherView.callScrollingListener(scroller.fatherView, 0 - scroller.left, 0 - y);

    scroller.vTimer = setTimeout(function () {
        if (scroller && scroller.ele) {
            startScrollVerticalTo(scroller, y, speed);
        }
    }, scroller.cell);
};

/**
 * 纵向滚动的工具，不对外
 * @param scroller
 * @param y
 * @param scrollSpeed
 */
var startScrollHorizontalTo = function (scroller, x, speed) {
    var left = scroller.left;
    if (Math.abs(left - x) < speed) {
        scroller.isScrolling = false;
        scroller.left = x;
        scroller.currentSpeedH = 0;
        scroller.fatherView.callScrollEndListener(scroller.fatherView, 0 - x, 0 - scroller.top);
        return;
    }

    if (x > left) {
        left += speed;
    } else {
        left -= speed;
    }
    scroller.left = left;

    scroller.isScrolling = true;
    scroller.fatherView.callScrollingListener(scroller.fatherView, 0 - x, 0 - scroller.top);

    scroller.hTimer = setTimeout(function () {
        if (scroller && scroller.ele) {
            startScrollHorizontalTo(scroller, x, speed);
        }
    }, scroller.cell);
};
