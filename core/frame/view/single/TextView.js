import View from "@core/frame/view/base/View";

/**
 * 纵向滚动时：
 *  1.单个单词必定一行，当后续单词超过一行，会主动为两行
 *  2.使用<br> 主动换行
 */
export default class TextView extends View {
    constructor(viewManager, listenerLocation) {
        super(viewManager, listenerLocation);

        delete this.childViews;

        this.scroller = new TextScroller(this);

        //需要判断是否执行
        this.needJudge = true;
        //可以执行跑马灯
        this.canMarquee = false;
        //默认横向跑马灯
        this.orientation = HORIZONTAL;

        //原文字的span
        this.span = null;
        //复制文字的span
        this.copySpan = null;

    }

    marquee() {
        this.judgeMarquee();//判断是否需要跑马灯
        if (!this.canMarquee) {//不需要
            return;
        }
        if (!this.copySpan) {
            this.copySpan = document.createElement("span");//创建
        }
        if (this.orientation == VERTICAL) {//纵向跑马灯
            this.ele.appendChild(document.createElement("br"));//换行
            this.copySpan.innerHTML = this.text;//给复制的span添加文字
        } else {
            this.copySpan.innerHTML = "&nbsp&nbsp&nbsp&nbsp&nbsp" + this.text;//给复制的span添加文字
        }
        this.ele.appendChild(this.copySpan);//将复制的span添加到ele
        this.scroller.init();//初始化文字滚动器
        this.scroller.marquee();//执行
    }

    clearMarquee() {
        if (this.scroller.isMarquee) {
            this.scroller.clearMarquee();//停止跑马灯
            this.html = "";//置kong
            this.ele.appendChild(this.span);//恢复原文字
            this.scroller.ele = null;//置空滚动器
        }
    }

    /**
     * 判断是否需要跑马灯
     */
    judgeMarquee() {
        if (!this.needJudge) {
            return;
        }
        this.needJudge = false;
        //判断跑马灯方向
        this.html = "";
        this.span = document.createElement("span");
        this.span.innerHTML = this.text;
        this.ele.appendChild(this.span);
        if (this.style.whiteSpace == "nowrap") {//横向
            this.orientation = HORIZONTAL;
            var spanWidth = View.getWidth(this.span);
            if (spanWidth > this.width) {
                this.canMarquee = true;
            }
        } else {//纵向
            this.orientation = VERTICAL;
            var spanHeight = View.getHeight(this.span);
            if (spanHeight > this.height) {
                this.canMarquee = true;
            }
        }
    }


    callScrollStartListener(scrollView, x, y) {
    }

    callScrollingListener(scrollView, x, y) {
    }

    callScrollEndListener(scrollView, x, y) {
    }

    /**
     * 显示
     */
    show() {
        this.setStyle("visibility", "");
        this.setStyle("display", "block");
        if (this.page.focusView == this.fatherView) {
            this.marquee();
        }
    }

    /**
     * 隐藏view
     */
    hide() {
        this.setStyle("visibility", "");
        this.setStyle("display", "none");
        this.clearMarquee();
    }

    get isScrolling() {
        return this.scroller.isScrolling;
    }

    /**
     * 绑定数据
     */
    set text(value) {
        this._data = value;
        //赋值文字，重新执行
        if (this.span) {//判断过跑马灯
            this._data = value;
            this.span.innerHTML = this.text;
            if (this.isMarquee) {
                this.clearMarquee();
            }
            this.needJudge = true;
            if (this.fatherView == this.page.focusView) {//当前页面上焦的当前textView的绑定控件
                this.marquee();
            }
        } else {
            this.ele.innerText = value;
        }
    }

    get text() {
        return this._data;
    }

    /**
     * 给对应的ele设置布局
     * @param html
     */
    set html(html) {
        this.ele.innerHTML = html;
    }

    get isMarquee() {
        return this.scroller.isMarquee;
    }

    /**
     * 将标签中的属性解析到对应的变量中
     */
    setAttributeParam() {
        var text = this.ele.innerHTML;//  类似"\n"这样的符号也会被获取并生效
        this.setStyle("lineHeight", this.height + "px");//自动加上lineHeight
        this.setStyle("overflow", "hidden");//自动加上超出隐藏
        this.text = text;

        return super.setAttributeParam();
    }

    /**
     * 使用ele创建控件
     * @param{Element} ele
     * @param{ViewManager} viewManager
     * @param{View} listenerLocation
     * @returns {TextView}
     */
    static parseByEle(ele, viewManager, listenerLocation) {
        var textView = new TextView(viewManager, listenerLocation);
        textView.ele = ele;
        textView.setAttributeParam();
        return textView;
    }

    /**
     * 绑定TextView
     * @param ele
     */
    static bindTextByEle(ele, view) {
        var ele_list = ele.children;
        if (ele_list.length == 0) {
            return [];
        }
        for (var child_ele of ele_list) {
            var viewType = child_ele.tagName;
            if (viewType == "DIV") {
                viewType = child_ele.getAttribute("view-type");
                if (viewType) {
                    viewType = viewType.toUpperCase();
                }
            }
            if (viewType == "VIEW-TEXT" || viewType == "TEXT") {
                view.text = TextView.parseByEle(child_ele, view.viewManager, view.listenerLocation);
            } else {
                if (!viewType
                    || (viewType.indexOf("VIEW") == -1
                        && viewType != "VIEW")) {
                    TextView.bindTextByEle(child_ele, view);
                }
            }
        }
    }
};

/**
 * 如果文字单行，左右跑马灯
 * 如果多行，上下轮播
 */
class TextScroller extends View {
    constructor(fatherView) {
        super(null);
        this.fatherView = fatherView;
        //最小滚动速度
        this.speed = 2;
        //刷新间隔
        this.cell = 20;

        this.marqueeTimer = null;
        this.isMarquee = false;
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
            this.measure();//测量
        }
    }

    /**
     * 测量宽、高
     */
    measure() {
        this.size = this.fatherView.size;
        //根据子节点计算
        var size = View.getVisibleSize(this.ele);
        if (size.width > this.width) {
            this.width = size.width;
        }
        if (size.height > this.height) {
            this.height = size.height;
        }
    }

    marquee() {
        this.isMarquee = true;
        if (this.fatherView.orientation == HORIZONTAL) {
            var x = View.getWidth(this.fatherView.copySpan);
            startHorizontalScroll(this, x, this.speed);
        } else {
            var lineHeight = View.pxToNum(this.fatherView.style.lineHeight);
            var y = View.getHeight(this.fatherView.copySpan);
            startVerticalScroll(this, lineHeight, y, this.speed);
        }
    }

    clearMarquee() {
        this.isMarquee = false;
        clearTimeout(this.marqueeTimer);
    }
}

var VERTICAL = "vertical";
var HORIZONTAL = "horizontal";

/**
 * 横向跑马灯
 * @param{TextScroller} scroller 执行的TextView
 * @param x 重置坐标
 * @param speed 滚动速度
 */
var startHorizontalScroll = function (scroller, x, speed) {
    if (scroller.width <= x) {
        return;
    }
    var left = scroller.left;

    if (left + x == 0) {
        left = -1;
    } else {
        left -= speed;
    }

    scroller.left = left;

    scroller.marqueeTimer = setTimeout(function () {
        if (scroller && scroller.isMarquee) {
            startHorizontalScroll(scroller, x, speed);
        }
    }, scroller.cell);
}

/**
 * 纵向跑马灯
 * @param{TextScroller} scroller 执行的TextView
 * @param h 单次滚动距离
 * @param y copySpan的高度
 * @param speed 滚动间隔
 */
var startVerticalScroll = function (scroller, h, y, speed) {
    if (scroller.height <= y) {
        return;
    }
    var top = scroller.top;

    if (top + y < (h / 2)) {
        top = -h;
        scroller.top = 0;
    } else {
        top -= h;
    }
    startScrollVerticalTo(scroller, top, Math.ceil(h / scroller.cell) + 1);

    scroller.marqueeTimer = setTimeout(function () {
        if (scroller && scroller.isMarquee) {
            startVerticalScroll(scroller, h, y, speed);
        }
    }, (1000 * speed));
}

/**
 * 纵向滚动的工具，不对外
 * 简化ScrollView中方法
 * @param scroller
 * @param y
 * @param scrollSpeed
 */
var startScrollVerticalTo = function (scroller, y, speed) {
    var top = scroller.top;
    if (Math.abs(top - y) < speed) {
        scroller.top = y;
        return;
    }

    if (y > top) {
        top += speed;
    } else {
        top -= speed;
    }
    scroller.top = top;

    scroller.vTimer = setTimeout(function () {
        if (scroller && scroller.ele) {
            startScrollVerticalTo(scroller, y, speed);
        }
    }, scroller.cell);
};
