import GroupView from "./GroupView"
import {ScrollCenter, ScrollEnd, ScrollNormal, ScrollStart} from "../base/ScrollView";
import VMargin from "@core/frame/util/VMargin";
import VSize from "@core/frame/util/VSize";
import View from "@core/frame/view/base/View";
import VPosition from "@core/frame/util/VPosition";
import VMap from "@core/frame/util/VMap";
import {ViewBuilder} from "@core/frame/view/base/ViewManager";

/**
 *
 */
export default class RecycleView extends GroupView {
    constructor(viewManager, listenerLocation) {
        super(viewManager, listenerLocation);
        /**
         * 滚动位置
         * @type {object}
         * @private
         */
        this._scrollLocate = ScrollNormal;
        /**
         * 方向
         */
        this._orientation = VERTICAL;
        /**
         * 行
         * @type {number}
         */
        this._row = 1;
        /**
         * 列
         * @type {number}
         */
        this._col = 1;
        /**
         * 首尾相接的效果
         * @type {boolean}
         */
        this.circulate = false;
        /**
         * 焦点边界循环
         * @type {boolean}
         */
        this.loop = false;
        /**
         * 外边距
         * @type {VMargin}
         */
        this.margin = new VMargin(0, 0, 0, 0);
        /**
         * component占位宽高
         * @type {VSize}
         */
        this.seatSize = new VSize();
        /**
         * 已回收的Component
         * @type {Holder[]}
         */
        this.recycleHolderList = [];
        /**
         * 正在使用的Component
         * key：index相关
         * @type {VMap<number, Holder>}
         */
        this.activeHolderMap = new VMap();
        /**
         * 可见行
         * @type {number}
         */
        this.visibleRow = 0;
        /**
         * 可见列
         * @type {number}
         */
        this.visibleCol = 0;
        /**
         * 适配器
         * @type {Adapter}
         */
        this._adapter = null;
        /**
         * adapter的布局信息
         * @type {string}
         */
        this.template = "";

        this._data = [];

        /**
         * 焦点或驻留所在的位置index
         * @type {number}
         */
        this._selectIndex = 0;

        /**
         * 渲染的基准index
         * @type {number}
         */
        this.baseIndex = -1;

        this.props.concat({
            "view-orientation": "",
            "view-row": "",
            "view-col": "",
            "view-circulate": "",
            "view-loop": "",
            "view-margin": "",
        })
    }

    /**
     * 算法中决定，滚动器scroller的width、height是recycleView的3倍
     */
    measure() {
        if (this.seatSize.width < this.width) {
            this.scrollWidth = this.width * 3;
        } else {
            this.scrollWidth = this.seatSize.width * 3;
        }

        if (this.seatSize.height < this.height) {
            this.scrollHeight = this.height * 3;
        } else {
            this.scrollHeight = this.seatSize.height * 3;
        }

    }

    push(item) {
        this.data.push(item);
        if (this.data.length == 1) {//新增第一个数据
            computeSeatSize(this);//获取子控件的占位
        }
        this.render();
    }

    pop() {
        var item = this.data.pop();
        this.render();
        return item;
    }

    unshift(...items) {
        this.data.unshift(...items);
        this.render();
    }

    shift() {
        var item = this.data.shift();
        this.render();
        return item;
    }

    splice(start, deleteCount, ...items) {
        this.data.splice(start, deleteCount, ...items);
        this.render();
    }

    sort(compareFn) {
        this.data.sort(compareFn);
        this.render();
    }

    reverse() {
        this.data.reverse();
        this.render();
    }

    /**
     * 根据baseIndex渲染内部组件
     */
    render() {
        if (this.baseIndex >= this.data.length) {
            this.baseIndex = this.data.length - 1;
        }
        if (this.baseIndex < 0) {
            this.baseIndex = 0;
        }

        if (this.data.length == 0) {
            var activeHolderMap = this.activeHolderMap;
            activeHolderMap.keys().forEach(function (key) {
                var holder = activeHolderMap.get(key)
                if (holder) {
                    holder.recycle()
                }
            })
        } else {
            render(this, this.baseIndex);
        }

    }

    set data(value) {
        this._data = value;
        if (this._data) {
            // watchData(this._data, this);//重写this._data的数组相关方法，实现改变数组刷新控件
        }

        computeSeatSize(this);//获取子控件的占位

        this.baseIndex = 0;
        this.render();
    }

    get data() {
        return this._data;
    }

    set adapter(value) {
        this._adapter = value;
        this.adapter.recycleView = this;
        if (this.template && !this.adapter.template) {
            this.adapter.template = this.template;
        }
        //置空holder
        this.recycleHolderList = [];
        this.activeHolderMap = new VMap();
        this.ele.html = "";//置空节点

        computeSeatSize(this);//获取子控件的占位

        this.baseIndex = 0;
        this.render();
    }

    get selectIndex() {
        var value = (this._selectIndex + this.data.length) % this.data.length;
        return value;
    }

    set selectIndex(value) {
        this._selectIndex = value;
    }

    /**
     * 通过index滚动
     * @param index
     */
    scrollByIndex(index) {
        if (!this.adapter || this.data.length == 0) {
            return;
        }

        if (index >= this.data.length) {
            index = this.data.length - 1;
        }

        if (index < 0) {
            index = 0;
        }

        var holder = this.activeHolderMap.get(index);
        if (holder) {
            render(this, index);
            this.scrollToChild(holder.component);
            return;
        }

        render(this, index);
        var child = this.activeHolderMap.get(index).component;
        if (this.selectIndex < 0) {//这种情况不存在

        } else {
            if (this.circulate) {
                var disIndexStart = -1;
                var disIndexEnd = -1;
                if (this.selectIndex < index) {
                    disIndexStart = this.selectIndex - (index - this.data.length);
                    disIndexEnd = index - this.selectIndex;
                } else {
                    disIndexStart = this.selectIndex - index;
                    disIndexEnd = index + this.data.length - this.selectIndex;
                }
                if (disIndexStart > disIndexEnd) {//跨过0更近
                    if (this.orientation == VERTICAL) {
                        this.scrollTop = 0;
                    } else {
                        this.scrollLeft = 0;
                    }
                } else {
                    if (this.orientation == VERTICAL) {
                        this.scrollTop = this.scrollHeight - this.height;
                    } else {
                        this.scrollLeft = this.scrollWidth - this.width;
                    }
                }
            } else {
                if (this.selectIndex < index) {
                    if (this.orientation == VERTICAL) {
                        this.scrollTop = 0;
                    } else {
                        this.scrollLeft = 0;
                    }
                } else {
                    if (this.orientation == VERTICAL) {
                        this.scrollTop = this.scrollHeight - this.height;
                    } else {
                        this.scrollLeft = this.scrollWidth - this.width;
                    }
                }
            }
        }

        this.scrollToChild(child);//这里是兼容异常情况
    }

    /**
     * 通过index上焦
     * @param index
     */
    focusByIndex(index) {
        this.scrollByIndex(index);
        this.activeHolderMap.get(index).component.requestFocus();
    }

    /**
     *
     * @param{Component} childView
     * @param{string} scrollLocate
     */
    scrollVerticalToChild(childView, scrollLocate) {
        if (this.childViews.indexOf(childView) < 0) {
            return;
        }

        if (typeof scrollLocate == "undefined") {
            scrollLocate = this.scrollLocate;
            if (scrollLocate instanceof Object) {
                scrollLocate = VERTICAL;
            }
        }

        var childHeight = childView.height;

        var top = childView.positionByFather.top;
        if (this.height < childHeight) {
            this.scrollVertical(top);
            return;
        }

        var index = childView.holder.index;
        var rowNum = -1;
        var totalRow = -1;
        var scrollTop = 0;
        if (this.orientation == VERTICAL) {//纵向
            totalRow = Math.ceil(this.data.length / this.col);
            rowNum = Math.floor(index / this.col);
            if (totalRow < this.visibleRow) {
                if (scrollLocate == ScrollCenter && this.margin.top > 0) {
                    this.scrollVertical(top - rowNum * this.seatSize.height - this.margin.top);
                }
                return;
            }
            if (this.circulate) {//循环效果
                if (scrollLocate == ScrollCenter) {
                    scrollTop = top - (this.height - childHeight) / 2;
                } else if (scrollLocate == ScrollStart || top < 0) {
                    scrollTop = top;
                } else if (scrollLocate == ScrollEnd || top > (this.height - childHeight)) {
                    scrollTop = top - this.height + childHeight;
                }
            } else {
                //直接计算scrollTop
                scrollTop = computeScrollTop(this, childHeight, top, rowNum, totalRow, scrollLocate);
            }
        } else {//横向时，纵向的滚动
            if (this.data.length < this.visibleRow || this.row * this.seatSize.height - this.margin.bottom < this.height) {
                if (scrollLocate == ScrollCenter && this.margin.top > 0) {
                    this.scrollVertical(top - this.margin.top);
                }
                return;
            }
            rowNum = index % this.row;
            totalRow = this.row;
            //直接计算scrollTop
            scrollTop = computeScrollTop(this, childHeight, top, rowNum, totalRow, scrollLocate);
        }

        this.scrollVertical(scrollTop);
    }


    /**
     * 横向滑动到childView
     * @param {Component} childView 目标控件
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

        var childWidth = childView.width;

        var left = childView.positionByFather.left;
        if (this.width < childWidth) {
            this.scrollHorizontal(left);
            return;
        }

        var index = childView.holder.index;
        var colNum = -1;
        var totalCol = -1;
        var scrollLeft = 0;

        if (this.orientation == VERTICAL) {
            if (this.data.length < this.visibleCol) {
                if (scrollLocate == ScrollCenter && this.margin.left > 0) {
                    this.scrollHorizontal(left - this.margin.left);
                }
                return;
            }
            colNum = index % this.col;
            totalCol = this.col;
            //直接计算scrollLeft
            scrollLeft = computeScrollLeft(this, childWidth, left, colNum, totalCol, scrollLocate);
        } else {
            totalCol = Math.ceil(this.data.length / this.row);
            colNum = Math.floor(index / this.row);
            if (totalCol < this.visibleCol) {
                if (scrollLocate == ScrollCenter && this.margin.left > 0) {
                    this.scrollHorizontal(left - colNum * this.seatSize.width - this.margin.left);
                }
                return;
            }
            if (this.circulate) {//循环效果
                if (scrollLocate == ScrollCenter) {
                    scrollLeft = left - (this.width - childWidth) / 2;
                } else if (scrollLocate == ScrollStart || left < 0) {
                    scrollLeft = left;
                } else if (scrollLocate == ScrollEnd || left > (this.width - childWidth)) {
                    scrollLeft = left - this.width + childWidth;
                }
            } else {
                //直接计算scrollLeft
                scrollLeft = computeScrollLeft(this, childWidth, left, colNum, totalCol, scrollLocate);
            }
        }

        this.scrollHorizontal(scrollLeft);
    }

    /**
     * 置空
     */
    scrollVerticalToStart() {
    }

    /**
     * 置空
     */
    scrollVerticalToEnd() {
    }

    /**
     * 置空
     */
    scrollHorizontalToStart() {
    };

    /**
     * 置空
     */
    scrollHorizontalToEnd() {
    }

    get adapter() {
        return this._adapter;
    }

    get row() {
        return this._row;
    }

    set row(value) {
        this._row = value;
    }

    get col() {
        return this._col;
    }

    set col(value) {
        this._col = value;
    }

    set orientation(value) {
        this._orientation = value;
    }

    get orientation() {
        return this._orientation;
    }

    set scrollLocate(value) {
        if (value instanceof Object) {
            console.warn("scrollLocate对象不完全生效，请谨慎使用")
        }
        this._scrollLocate = value;
    }

    get scrollLocate() {
        return this._scrollLocate;
    }

    setAttributeParam() {
        var firstFocus = super.setAttributeParam();
        if (this.ele.children.length > 0) {
            var eleStr = this.ele.innerHTML;
            this.template = eleStr;
            this.ele.innerHTML = "";
        }

        var orientation = this.props["view-orientation"]
        if (orientation == "vertical" || orientation == "v") {
            this.orientation = VERTICAL;
        } else if (orientation == "horizontal" || orientation == "h") {
            this.orientation = HORIZONTAL;
        }
        var row = this.props["view-row"];
        if (row) {
            row = parseInt(row);
            if (row > 0) {
                this.row = row;
            } else {
                console.warn("view-row值 错误")
            }
        }
        var col = this.props["view-col"];
        if (col) {
            col = parseInt(col);
            if (col > 0) {
                this.col = col;
            } else {
                console.warn("view-col值 错误")
            }
        }

        var circulate = this.props["view-circulate"];
        if (circulate == "true" || circulate == "1") {
            this.circulate = true;
        }
        var loop = this.props["view-loop"];
        if (loop == "true" || loop == "1") {
            this.loop = true;
        }
        var margin = this.props["view-margin"];
        if (margin) {
            var marginStrs = margin.split(",");
            if (marginStrs.length == 1) {
                var value = parseInt(marginStrs[0]);
                if (!isNaN(value)) {
                    this.margin = new VMargin(value, value, value, value);
                }
            } else if (marginStrs.length == 4) {
                var marginTop = parseInt(marginStrs[0]);
                if (!isNaN(marginTop)) {
                    this.margin.top = marginTop;
                }

                var marginBottom = parseInt(marginStrs[1]);
                if (!isNaN(marginBottom)) {
                    this.margin.bottom = marginBottom;
                }

                var marginLeft = parseInt(marginStrs[2]);
                if (!isNaN(marginLeft)) {
                    this.margin.left = marginLeft;
                }

                var marginRight = parseInt(marginStrs[3]);
                if (!isNaN(marginRight)) {
                    this.margin.right = marginRight;
                }
            } else {
                console.warn("view-margin 错误，数量必须是1或4")
            }
        }

        return firstFocus;
    }

    static parseByEle(ele, viewManager, listenerLocation) {
        var recycleView = new RecycleView(viewManager, listenerLocation);
        recycleView.ele = ele;

        recycleView.scroller.init();
        recycleView.measure();
        centerScroller(recycleView);//让滚动器居中

        return recycleView;
    }
}

export var VERTICAL = "vertical";
export var HORIZONTAL = "horizontal";

/**
 * 用于创建Holder、设置Component的渲染
 */
export class Adapter {
    constructor() {
        this._template = "";
        this.recycleView = null;
    }

    /**
     * 创建Holder
     * 可以重写这个方法，修改布局来源
     */
    createHolder() {
        return new Holder(this.template, this.recycleView);
    }

    bindHolder(holder, data) {
        console.warn("Adapter的bindHolder需要被重写");
    }

    /**
     * 这个和createHolder一样可以被重写，修改布局来源
     * @returns {string|*}
     */
    get template() {
        return this._template;
    }

    set template(value) {
        value = ViewBuilder.buildHtml(value);
        this._template = value;
    }
}

export class Holder {
    /**
     * @param{String} ele
     * @param{RecycleView} recycleView
     */
    constructor(eleStr, recycleView) {
        /**
         * 序号
         * @type {number}
         */
        this.index = -1;

        this.isActive = false;

        this.recycleView = recycleView;

        this.eleStr = eleStr;

        this.component = null;
    }

    /**
     * 激活Holder
     * 生成、渲染
     */
    active(index) {
        this.index = index;

        if (this.isActive) {
            return;
        }

        if (this.component) {//创建之后对应的状态都存在
            if (!this.recycleView.ele.contains(this.component.ele)) {//如果该ele未被渲染
                this.recycleView.appendChild(this.component.ele);//渲染
            }
        } else {//只在active方法执行后第一次创建
            this.component = buildComponent(this);
        }

        if (!this.component.isShowing) {//未显示
            this.component.show();//显示
        }

        this.isActive = true;

        this.recycleView.activeHolderMap.set(index, this);//添加到活动map中

        this.recycleView.addChild(this.component);

        this.component.data = this.recycleView.data[index];
    }

    /**
     * 回收,不从节点中移除
     */
    recycle() {
        this.recycleView.activeHolderMap.set(this.index, null);//从活动的map中去除
        this.recycleView.recycleHolderList.push(this);//添加到回收列表中
        this.recycleView.removeChild(this.component);
        this.index = -1;
        this.component.hide();
        this.isActive = false;
        this.data = null;
        return this;
    }

    /**
     * 改变当前holder在activeHolderMap的key
     * @param index
     */
    changIndex(index) {
        this.recycleView.activeHolderMap.set(this.index, null);
        var holder = this.recycleView.activeHolderMap.get(index);//获取原index对应的holder
        if (holder) {//存在
            holder.recycle();//回收
        }
        this.index = index;
        this.recycleView.activeHolderMap.set(index, this);
    }

    get space() {
        var height = this.component.height;//列距
        var width = this.component.width;//行距

        return new VSize(width, height);
    }

    get row() {
        var obj = getRowAndCol(this.recycleView, this.index)//计算row，col
        return obj.row;
    }

    get col() {
        var obj = getRowAndCol(this.recycleView, this.index)//计算row，col
        return obj.col;
    }

    get componentSize() {
        return this.component.size;
    }

    findViewById(id) {
        return this.component.findViewById(id);
    }

    findEleById(id) {
        return this.component.findEleById(id);
    }

    /**
     * 数据下标
     * @return {number}
     */
    get dataIndex() {
        return (this.index + this.recycleView.data.length) % this.recycleView.data.length;
    }
}

/**
 * 用于RecycleView的每一个子控件的组件
 */
export class Component extends GroupView {
    constructor(viewManager, listenerLocation, holder) {
        super(viewManager, listenerLocation);
        this._data = null;
        this.ele = document.createElement("div");
        this.holder = holder;
    }

    addChild(view) {
        super.addChild(view);
        view.data = this.data;
    }

    set html(html) {
        //初始化滚动器
        this.scroller.init();
        //将html设置到节点中
        this.scroller.html = html;
        //业务层触发的，listenerLocation为this
        this.listenerLocation = this.holder.recycleView.listenerLocation;
        //构建控件
        this.viewManager.buildView(this);
        //测量滚动器实际大小，并设置
        this.measure();
        this.bindText();
        //绑定ImageView
        this.bindImage();

        var that = this;
        setTimeout(function () {
            if (that.isShowing) {//显示
                that.loadImageResource();//加载图片
            }
        }, 50);
    }

    get html() {
        return this.scroller.html;
    }

    callFocusChangeListener(view, hasFocus, intercept) {
        if (hasFocus) {
            var index = this.holder.index;
            this.fatherView.selectIndex = index;
            render(this.fatherView, index);
        }

        super.callFocusChangeListener(view, hasFocus, intercept);
    }

    /**
     * 数据绑定
     * @param{Object} data
     */
    set data(value) {
        this._data = value;
        for (var i = 0; i < this.childViews.length; i++) {
            this.childViews[i].data = this._data;
        }
    }

    get data() {
        return this._data;
    }
}

/**
 * 创建component
 * @param holder
 * @returns {Component}
 */
var buildComponent = function (holder) {
    var component = new Component(holder.recycleView.viewManager, holder.recycleView.listenerLocation, holder);
    if (!holder.recycleView.ele.contains(component.ele)) {//如果该ele未被渲染
        holder.recycleView.appendChild(component.ele);//渲染
    }

    var seatSize = holder.recycleView.seatSize;
    var margin = holder.recycleView.margin;
    component.width = seatSize.width - (margin.left + margin.right);
    component.height = seatSize.height - (margin.top + margin.bottom);

    component.html = holder.eleStr;

    return component;
}

/**
 * 计算一个component占位大小,adapter是后续设置的，不在原recycleView节点中
 * 使用holder（已回收/新创建的）获取size+margin
 * 只能计算当前样式时的size，如果在adapter中改变的，不会被计算到
 * @param recycleView
 * @returns {VSize}
 */
var computeSeatSize = function (recycleView) {
    var seatSize = new VSize(0, 0);
    if (!recycleView.adapter || recycleView.data.length == 0) {
        return seatSize;
    }

    // var invisibleDiv = buildInvisibleDiv();
    // invisibleDiv.innerHTML = recycleView.adapter.template;
    // recycleView.ele.appendChild(invisibleDiv);//不可见渲染
    //
    // var size = View.getVisibleSize(invisibleDiv);//组件宽高
    //
    // invisibleDiv.remove();//将当前节点从application中移除
    // //兼容ele.remove无效
    // if (recycleView.ele.contains(invisibleDiv)) {
    //     recycleView.ele.removeChild(invisibleDiv);
    // }

    renderBase(recycleView, 0);
    var holder = recycleView.activeHolderMap.get(0);
    var size = View.getVisibleSize(holder.component.ele);//组件宽高
    holder.component.size = size;//设置holder.component宽高
    var margin = recycleView.margin;
    var width = size.width + margin.left + margin.right;
    var height = size.height + margin.top + margin.bottom;

    recycleView.seatSize = new VSize(width, height);

    //根据seatSize，设置一些属性
    recycleView.visibleRow = Math.ceil(recycleView.height / recycleView.seatSize.height);//计算可见行（整个component）值
    recycleView.visibleCol = Math.ceil(recycleView.width / recycleView.seatSize.width);//计算可见列（整个component）值

    if (recycleView.row == 0) {//未设置行
        recycleView.row = Math.floor(recycleView.height / recycleView.seatSize.height);
    }

    if (recycleView.col == 0) {//未设置列
        recycleView.col = Math.floor(recycleView.width / recycleView.seatSize.width);
    }
}

var render = function (recycleView, index) {
    if (!recycleView.data || recycleView.data.length == 0) {
        return;
    }

    if (!recycleView.adapter) {
        return;
    }

    recycleView.baseIndex = index;

    var obj = renderBase(recycleView, index);
    index = obj.index;

    var position = obj.position;

    var renderIndexList = [index];

    //TODO 待优化，已渲染的数据需要重新加载，这是一个问题，可以先判断在正常范围的holder对应的是否已激活，如果未激活可以拿来使用（猜想）
    renderIndexList = renderIndexList.concat(renderSmaller(recycleView, index, position));
    renderIndexList = renderIndexList.concat(renderBigger(recycleView, index, position));
    // console.log("renderIndexList", renderIndexList)

    var keys = recycleView.activeHolderMap.keys();
    for (var i = 0; i < keys.length; i++) {
        var key = parseInt(keys[i]);
        if (renderIndexList.indexOf(key) < 0) {
            var value = recycleView.activeHolderMap.get(key);
            if (value) {
                // console.log("recycle index",key)
                value.recycle();
            }
        }
    }
}

/**
 * 渲染基准index的
 * @param recycleView
 * @param index
 * @returns {{index: number, position: VPosition}}
 */
var renderBase = function (recycleView, index) {
    var adapter = recycleView.adapter;
    var data = recycleView.data;

    //TODO 从recycle和active中的数量判断是否是初始化渲染，不需要滚动效果
    //index对应的holder在激活状态是普通滚动，是回收状态，直接滚动到index，需要渲染额外的holder实现滚动
    var holder = recycleView.activeHolderMap.get(index);//以这个holder为基准，两边创建并渲染

    // var renderType = 0;//渲染类型，如果目标index是已渲染的，动画过渡，否则，是直接定位，需要额外的holder来补足动画
    var position = null;
    if (holder) {//holder未active
        position = holder.component.getPositionByFather();
        if (index < 0 || index >= data.length) {//在正常范围外
            index = (index + data.length) % data.length;//调整index，使在正常范围
            holder.changIndex(index);//将holder的index调整到正常范围
        }
    } else {
        position = new VPosition(0, 0);
        index = (index + data.length) % data.length;//调整index，使在正常范围

        holder = recycleView.activeHolderMap.get(index);//重新获取

        if (!holder) {//重新获取的holder不存在
            holder = getEmptyHolder(recycleView);//获取一个空的holder
            holder.active(index);//使用正常范围的index激活
        }
    }

    adapter.bindHolder(holder, data[index]);//绑定数据

    centerScroller(recycleView);
    setChildPosition(recycleView, holder.component, position);

    return {index: index, position: position};
}

/**
 * 以index为中心，想序号更小的渲染
 * @param recycleView
 * @param index
 */
var renderSmaller = function (recycleView, baseIndex, basePosition) {
    var adapter = recycleView.adapter;
    var data = recycleView.data;
    var seatSize = recycleView.seatSize;
    var base = getRowAndCol(recycleView, baseIndex);//获取index的行列值

    var renderIndexList = [];//需要渲染的index数组

    var minNum = 0;
    var scrollLocate = recycleView.scrollLocate;
    var canCirculate = false;//数量是否够循环
    if (recycleView.orientation == VERTICAL) {
        minNum = recycleView.col;
        if (scrollLocate == ScrollEnd) {
            minNum = minNum * recycleView.visibleRow;
        } else if (scrollLocate == ScrollCenter) {
            minNum = minNum * Math.ceil(recycleView.visibleRow / 2);
        }
        minNum += baseIndex % recycleView.col;
        canCirculate = Math.ceil(data.length / recycleView.col) >= recycleView.visibleRow;
    } else {
        minNum = recycleView.row;
        if (scrollLocate == ScrollEnd) {
            minNum = minNum * recycleView.visibleCol;
        } else if (scrollLocate == ScrollCenter) {
            minNum = minNum * Math.ceil(recycleView.visibleCol / 2);
        }
        minNum += baseIndex % recycleView.row;
        canCirculate = Math.ceil(data.length / recycleView.row) >= recycleView.visibleCol;
    }
    // console.log("renderSmaller minNum",minNum);
    var index = baseIndex;
    var count = 0;//实际渲染数量
    while (true) {
        index--;

        if (index + data.length <= 0) {//最多循环到-data.length
            break;
        }

        var realIndex = index;
        if (recycleView.circulate && canCirculate) {
            realIndex = (realIndex + data.length) % data.length;
        } else {
            if (realIndex >= data.length || realIndex < 0) {
                break;
            }
        }

        count++;

        var holder = recycleView.activeHolderMap.get(index);//使用布局index获取holder

        var position = getPositionByIndex(recycleView, index, base, basePosition);
        var left = position.left;
        var top = position.top;

        if (count > minNum) {//至少渲染的数，兼容操作过快的情况，先考虑焦点在边缘的情况
            if (recycleView.orientation == VERTICAL) {
                if (top + seatSize.height < 0) {
                    break;
                }
            } else {
                if (left + seatSize.width < 0) {
                    break;
                }
            }
        }

        if (!holder) {
            holder = getEmptyHolder(recycleView);
        }

        // console.log(index)
        holder.active(index);//使用布局index激活holder
        setChildPosition(recycleView, holder.component, position);
        adapter.bindHolder(holder, data[realIndex]);

        renderIndexList.push(index);
    }

    return renderIndexList;
}

var renderBigger = function (recycleView, baseIndex, basePosition) {
    var adapter = recycleView.adapter;
    var data = recycleView.data;
    var seatSize = recycleView.seatSize;
    var base = getRowAndCol(recycleView, baseIndex);

    var renderIndexList = [];//需要渲染的index数组

    var minNum = 0;
    var scrollLocate = recycleView.scrollLocate;
    var canCirculate = false;//数量是否够循环
    if (recycleView.orientation == VERTICAL) {
        minNum = recycleView.col;
        if (scrollLocate == ScrollStart) {
            minNum = minNum * recycleView.visibleRow;
        } else if (scrollLocate == ScrollCenter) {
            minNum = minNum * Math.ceil(recycleView.visibleRow / 2);
        }

        minNum += (recycleView.col - baseIndex % recycleView.col - 1);
        canCirculate = Math.ceil(data.length / recycleView.col) >= recycleView.visibleRow;
    } else {
        minNum = recycleView.row;
        if (scrollLocate == ScrollStart) {
            minNum = minNum * recycleView.visibleCol;
        } else if (scrollLocate == ScrollCenter) {
            minNum = minNum * Math.ceil(recycleView.visibleCol / 2);
        }

        minNum += (recycleView.row - baseIndex % recycleView.row - 1);
        canCirculate = Math.ceil(data.length / recycleView.row) >= recycleView.visibleCol;
    }

    // console.log("renderBigger minNum",minNum);
    var index = baseIndex;
    var count = 0;//实际渲染数量
    while (true) {
        index++;

        if (index - data.length >= data.length) {//最多循环到2*data.length
            break;
        }
        var realIndex = index;
        if (recycleView.circulate && canCirculate) {
            realIndex = (realIndex + data.length) % data.length;
        } else {
            if (index >= data.length || index < 0) {
                break;
            }
        }

        count++;

        var holder = recycleView.activeHolderMap.get(index);//使用布局index获取holder

        var position = getPositionByIndex(recycleView, index, base, basePosition);
        var left = position.left;
        var top = position.top;


        if (count > minNum) {//至少渲染数，兼容操作过快的情况，先考虑焦点在边缘的情况
            if (recycleView.orientation == VERTICAL) {
                if (top > recycleView.height + seatSize.height) {
                    break;
                }
            } else {
                if (left > recycleView.width + seatSize.width) {
                    break;
                }
            }

        }


        if (!holder) {
            holder = getEmptyHolder(recycleView);
        }

        // console.log(index)
        holder.active(index);//使用布局index激活holder
        setChildPosition(recycleView, holder.component, position);
        adapter.bindHolder(holder, data[realIndex]);
        renderIndexList.push(index);
    }

    return renderIndexList;
}

/**
 * 获取index对应的Position
 * @param{number} index
 * @param{object} base {row,col}
 * @param{VPosition} basePosition
 */
var getPositionByIndex = function (recycleView, index, base, basePosition) {
    var seatSize = recycleView.seatSize;
    var obj = getRowAndCol(recycleView, index);

    var distanceRow = obj.row - base.row;
    var distanceCol = obj.col - base.col;
    var left = basePosition.left + distanceCol * seatSize.width;
    var top = basePosition.top + distanceRow * seatSize.height;

    return new VPosition(left, top)

}

/**
 * 创建一个width、height为0px的div
 * @returns {HTMLDivElement}
 */
var buildInvisibleDiv = function () {
    var div = document.createElement("div");
    var style = div.style;
    style.width = "0px";
    style.height = "0px";
    style.overflow = "hidden";

    return div;
}

/**
 * 获取holder
 * 如果回收中有，从回收中取，否则，新创建
 * @returns {Holder}
 */
var getEmptyHolder = function (recycleView) {
    var holder = null;
    if (recycleView.recycleHolderList.length > 0) {//回收holder中取
        holder = recycleView.recycleHolderList.splice(0, 1)[0];
    } else {
        holder = recycleView.adapter.createHolder();
    }
    return holder;
}

/**
 * 使recycleView的滚动器居中
 * @param recycleView
 */
export var centerScroller = function (recycleView) {
    var distanceLeft = recycleView.width - recycleView.scrollLeft;
    var distanceTop = recycleView.height - recycleView.scrollTop;

    // console.log("distanceLeft", distanceLeft, "distanceTop", distanceTop)
    for (var child of recycleView.childViews) {
        child.left = child.left - distanceLeft;
        child.top = child.top - distanceTop;
    }

    recycleView.measure();//由于存在拉大滚动器的情况，在每一次变化时，重制滚动器的大小

    recycleView.scrollTop = Math.ceil(recycleView.scrollHeight / 3);//纵向居中
    recycleView.scrollLeft = Math.ceil(recycleView.scrollWidth / 3);//横行居中
}

/**
 * 将childView设置到position位置，这个位置是相对recycleView的左上角
 * @param recycleView
 * @param childView
 * @param{VPosition} position
 */
var setChildPosition = function (recycleView, childView, position) {
    var left = position.left + recycleView.scrollLeft;
    var top = position.top + recycleView.scrollTop;

    childView.top = top;
    childView.left = left;

    if (recycleView.margin.left > 0) {
        left -= recycleView.margin.left;
    }

    if (recycleView.margin.top > 0) {
        top -= recycleView.margin.top;
    }

    if (top < 0) {//childView已经在recycleView.scroller的范围外的上边了，需要校准
        recycleView.scrollHeight -= top;//将recycleView拉高
        recycleView.scrollTop -= top;
        for (var child of recycleView.childViews) {
            child.top = child.top - top;//将child复位
        }
    } else if (top > recycleView.scrollHeight - recycleView.scrollTop) {//childView已经在recycleView.scroller的范围外的下边了，需要校准
        recycleView.scrollHeight = top + recycleView.scrollTop;//将recycleView拉高
    }

    if (left < 0) {//childView已经在recycleView.scroller的范围外的左边了，需要校准
        recycleView.scrollWidth -= left;//将recycleView拉宽
        recycleView.scrollLeft -= left;

        for (var child of recycleView.childViews) {
            child.left = child.left - left;//将child复位
        }
    } else if (left > recycleView.scrollWidth - recycleView.scrollLeft) {//childView已经在recycleView.scroller的范围外的右边了，需要校准
        recycleView.scrollWidth = left + recycleView.scrollLeft;//将recycleView拉高
    }
}


/**
 * 计算滚动的距离
 * @param childHeight 子控件高度
 * @param top 子控件相对于RecycleView顶部可见距离
 * @param rowNum 子控件的行
 * @param totalRow 总行数
 * @param scrollLocate 滚动模式
 * @return {number}
 */
var computeScrollTop = function (recycleView, childHeight, top, rowNum, totalRow, scrollLocate) {
    var scrollTop = 0;
    if (scrollLocate == ScrollCenter) {
        if (recycleView.visibleRow > 1) {//可见行多行时，才有最顶、最底
            if (rowNum * recycleView.seatSize.height + childHeight / 2 <= recycleView.height / 2 || totalRow < recycleView.visibleRow) {//最顶部
                scrollTop = top - rowNum * recycleView.seatSize.height;
                if (recycleView.margin.top > 0) {
                    scrollTop -= recycleView.margin.top;
                }
            } else if ((totalRow - rowNum) * recycleView.seatSize.height - childHeight / 2 <= recycleView.height / 2) {//最底部
                scrollTop = top - (recycleView.height - (totalRow - rowNum) * recycleView.seatSize.height) - recycleView.margin.top;
            } else {
                scrollTop = top - (recycleView.height - childHeight) / 2;
            }
        } else {//单行时，只能居中
            scrollTop = top - (recycleView.height - childHeight) / 2;
        }
    } else if (scrollLocate == ScrollStart) {
        if ((totalRow - rowNum) * recycleView.seatSize.height - recycleView.margin.top < recycleView.height) {//最底部
            scrollTop = (totalRow - rowNum) * recycleView.seatSize.height - recycleView.margin.top + top - recycleView.height;
        } else {
            scrollTop = top;
        }
    } else if (scrollLocate == ScrollEnd) {
        if ((rowNum + 1) * recycleView.seatSize.height - recycleView.margin.bottom < recycleView.height) {//最顶部
            scrollTop = top - (rowNum * recycleView.seatSize.height + recycleView.margin.top)
        } else {
            scrollTop = top + childHeight - recycleView.height
        }
    } else {
        if (top < 0) {
            scrollTop = top;
        } else if (top > (recycleView.height - childHeight)) {
            scrollTop = top - (recycleView.height - childHeight);
        }
    }

    return scrollTop;
}

/**
 * 计算滚动的距离
 * @param childWidth 子控件宽度
 * @param left 子控件相对于RecycleView左侧可见距离
 * @param colNum 子控件的列
 * @param totalCol 总列数
 * @param scrollLocate 滚动模式
 * @return {number}
 */
var computeScrollLeft = function (recycleView, childWidth, left, colNum, totalCol, scrollLocate) {
    var scrollLeft = 0;
    if (scrollLocate == ScrollCenter) {
        if (recycleView.visibleCol > 1) {//可见列多列时，才有最左、最右
            if (colNum * recycleView.seatSize.width + childWidth / 2 <= recycleView.width / 2 || totalCol < recycleView.visibleCol) {//最左侧
                scrollLeft = left - colNum * recycleView.seatSize.width;
                if (recycleView.margin.left > 0) {
                    scrollLeft -= recycleView.margin.left;
                }
            } else if ((totalCol - colNum) * recycleView.seatSize.width - childWidth / 2 <= recycleView.width / 2 && recycleView.visibleCol > 1) {//最右侧
                scrollLeft = left - (recycleView.width - (totalCol - colNum) * recycleView.seatSize.width) - recycleView.margin.left;
            } else {
                scrollLeft = left - (recycleView.width - childWidth) / 2;
            }
        } else {//单列时，只能居中
            scrollLeft = left - (recycleView.width - childWidth) / 2;
        }
    } else if (scrollLocate == ScrollStart) {
        if ((totalCol - colNum) * recycleView.seatSize.width - recycleView.margin.left < recycleView.width) {//最右侧
            scrollLeft = (totalCol - colNum) * recycleView.seatSize.width - recycleView.margin.left + left - recycleView.width;
        } else {
            scrollLeft = left;
        }
    } else if (scrollLocate == ScrollEnd) {
        if ((colNum + 1) * recycleView.seatSize.width - recycleView.margin.right < recycleView.width) {//最左侧
            scrollLeft = left - (colNum * recycleView.seatSize.width + recycleView.margin.left)
        } else {
            scrollLeft = left + childWidth - recycleView.width;
        }
    } else {
        if (left < 0) {
            scrollLeft = left;
        } else if (left > (recycleView.width - childWidth)) {
            scrollLeft = left - (recycleView.width - childWidth);
        }
    }

    return scrollLeft;
}

/**
 * 通过index获取行列值
 * @param recycleView
 * @param index
 * @returns {{col: number, row: number}}
 */
export var getRowAndCol = function (recycleView, index) {
    var row = -1;
    var col = -1;
    var length = recycleView.data.length;
    if (recycleView.orientation == VERTICAL) {
        if (index < 0) {
            var remainder = length % recycleView.col;
            if (remainder == 0) {
                row = Math.floor((index + (length % recycleView.col)) / recycleView.col);
            } else {
                row = Math.floor((index + (length % recycleView.col)) / recycleView.col) - 1;
            }
        } else if (index >= length) {
            var remainder = length % recycleView.col;
            if (remainder == 0) {
                row = Math.floor((index - (length % recycleView.col)) / recycleView.col);
            } else {
                row = Math.floor((index - (length % recycleView.col)) / recycleView.col) + 1;
            }

        } else {
            row = Math.floor(index / recycleView.col);
        }
        col = (index + length) % length % recycleView.col;

    } else {
        if (index < 0) {
            var remainder = length % recycleView.row;
            if (remainder == 0) {
                col = Math.floor((index + (length % recycleView.row)) / recycleView.row);
            } else {
                col = Math.floor((index + (length % recycleView.row)) / recycleView.row) - 1;
            }
        } else if (index >= length) {
            var remainder = length % recycleView.row;
            if (remainder == 0) {
                col = Math.floor((index - (length % recycleView.row)) / recycleView.row);
            } else {
                col = Math.floor((index - (length % recycleView.row)) / recycleView.row) + 1;
            }

        } else {
            col = Math.floor(index / recycleView.row);
        }
        row = (index + length) % length % recycleView.row;
    }

    return {row: row, col: col}
}


