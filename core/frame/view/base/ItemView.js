import View from "@core/frame/view/base/View";
import ImageView from "@core/frame/view/single/ImageView";
import TextView from "@core/frame/view/single/TextView";

export default class ItemView extends View {
    constructor(viewManager, listenerLocation) {
        super(viewManager, listenerLocation);
        this.focusable = true;
        //上焦的className
        this.focusStyle = "item item_focus";
        //选中的className
        this.selectStyle = "item item_select";
        //失焦的className
        this.unFocusStyle = "item";
        //当前上焦时的前一个焦点
        this.frontView = null;
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

        //焦点向上的view或方法的命名
        this.nextUp = "";
        //焦点向下的view或方法
        this.nextDown = "";
        //焦点向左的view或方法
        this.nextLeft = "";
        //焦点向右的view或方法
        this.nextRight = "";

        this.props.concat({
            "view-focusable": "",
            "view-up": "",
            "view-down": "",
            "view-left": "",
            "view-right": "",
            "view-change": "",
            "view-click": "",
            "view-focus": "",
        })
    }

    /**
     * 去上焦,每一个Page都有且只有一个焦点
     */
    requestFocus() {
        if (!this.isShowing) {
            return;
        }
        var focusView = this.viewManager.focusView;
        if (focusView && focusView != this) {//焦点存在，并且和当前不是同一个
            focusView.requestUnFocus();
            this.frontView = focusView;
        }
        this.viewManager.focusView = this;
        this.setFocusStyle();
        this.callFocusChangeListener(this, true);
    }

    /**
     * 去失焦
     */
    requestUnFocus() {
        this.setUnFocusStyle();
        this.clearMarquee();
        this.callFocusChangeListener(this, false);
    }

    callVisibleChangeListener(view, isShowing) {
        if (isShowing) {
            this.loadImageResource();//这个方法会向子控件迭代加载图片
        }
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
     */
    callFocusChangeListener(view, hasFocus) {
        this.loadImageResource();//加载当前控件的图片

        if (hasFocus) {
            this.marquee();
        }

        var onFocusChangeListener = null;
        var intercept = false;
        if (this.onFocusChangeListener) {
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
    }

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
     * 把控件绑定的所有TextView，执行跑马灯效果
     */
    marquee() {
        for (var text of this._textList) {
            text.marquee();
        }
    }

    /**
     * 把控件绑定的所有TextView，清除跑马灯效果
     */
    clearMarquee() {
        for (var text of this._textList) {
            text.clearMarquee();
        }
    }

    /**
     * 方向键规则设置
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
     */
    loadImageResource() {
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
     * 设置成失焦样式
     */
    setUnFocusStyle() {
        this.ele.className = this.unFocusStyle;
    }

    /**
     * 设置成上焦样式
     */
    setFocusStyle() {
        this.ele.className = this.focusStyle;
    }

    /**
     * 设置成驻留样式
     */
    setSelectStyle() {
        this.ele.className = this.selectStyle;
    }

    /**
     * 给对应的ele设置布局
     * @param html
     */
    set html(html) {
        this.ele.innerHTML = html;
        //绑定TextView和ImageView
        this.bindImage();
        this.bindText();
    }

    /**
     * 将标签中的属性解析到对应的变量中
     */
    setAttributeParam() {
        //当前的view是不是默认焦点
        super.setAttributeParam();

        var focusable = this.props["view-focusable"];//上是否可以上焦
        if (focusable == "false" || focusable == "0") {
            this.focusable = false;
        }

        //当前的view是不是默认焦点
        var firstFocus = false;
        firstFocus = this.ele.hasAttribute("first-focus");

        var up = this.props["view-up"];//上
        var down = this.props["view-down"];//下
        var left = this.props["view-left"];//左
        var right = this.props["view-right"];//右
        var change = this.props["view-change"];//上、下、左、右
        if (change) {
            var strs = change.split(",");
            if (strs.length == 4) {
                up = strs[0];
                down = strs[1];
                left = strs[2];
                right = strs[3];
            }
        }

        if(up){
            this.nextUp = up;
        }
        if(down){
            this.nextDown = down;
        }
        if(left){
            this.nextLeft = left;
        }
        if(right){
            this.nextRight = right;
        }

        var click = this.props["view-click"];//点击
        var focus = this.props["view-focus"];//焦点变化

        if (click) {
            this.onClickListener = click
        }

        if (focus) {
            this.onFocusChangeListener = focus;
        }

        return firstFocus;
    }

    /**
     * 使用ele创建控件
     * @param{Element} ele
     * @param{ViewManager} viewManager
     * @param{View} listenerLocation
     * @returns {ItemView}
     */
    static parseByEle(ele, viewManager, listenerLocation) {
        var itemView = new ItemView(viewManager, listenerLocation);
        itemView.ele = ele;
        itemView.bindText();
        itemView.bindImage();
        return itemView;
    }
}
