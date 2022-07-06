import GroupView, {ScrollCenter, ScrollEnd, ScrollNormal, ScrollStart} from "./GroupView";
import VMargin from "@core/frame/util/VMargin";
import VSize from "@core/frame/util/VSize";
import View from "@core/frame/view/base/View";
import VPosition from "@core/frame/util/VPosition";
import ItemView from "@core/frame/view/base/ItemView";
import ImageView from "@core/frame/view/single/ImageView";

/**
 *
 */
export default class RecycleView extends GroupView {
    constructor(viewManager) {
        super(viewManager);
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
         * @type {Map<number, Holder>}
         */
        this.activeHolderMap = new Map();
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

        //TODO 重写this._data的数组相关方法，实现改变数组刷新控件
        this._data = [];

        /**
         * 焦点或驻留所在的位置index
         * @type {number}
         */
        this.selectIndex = -1;
    }

    /**
     * 算法中决定，滚动器scroller的width、height是recycleView的3倍
     */
    measure() {
        this.scrollHeight = this.height * 3;
        this.scrollWidth = this.width * 3;
        // this.scroller.ele.style.background = "red";
        // this.scroller.ele.style.opacity = 0.3;
    }

    set data(value) {
        this._data = value;
        render(this, 0);
    }

    get data() {
        return this._data;
    }

    set adapter(value) {
        this._adapter = value;
        this.adapter.recycleView = this;
        if (this.template) {
            this.adapter.template = this.template;
        }
        //置空holder
        this.recycleHolderList = [];
        this.activeHolderMap = new Map();
        this.ele.html = "";//置空节点

        computeSeatSize(this);//获取子控件的占位

        this.visibleRow = Math.ceil(this.height / this.seatSize.height);//计算可见行（整个component）值
        this.visibleCol = Math.ceil(this.width / this.seatSize.width);//计算可见列（整个component）值

        if (this.row == 0) {//未设置行
            this.row = Math.floor(this.height / this.seatSize.height);
        }

        if (this.col == 0) {//未设置列
            this.col = Math.floor(this.width / this.seatSize.width);
        }

        render(this, 0);
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
                scrollLocate = scrollLocate.vertical;
            }
        }

        var top = childView.positionByFather.top;
        if (this.height < childView.height) {
            this.scrollVertical(top);
            return;
        }

        var index = childView.holder.index;
        var rowNum = -1;
        var totalRow = -1;
        var scrollTop = 0;
        if (this.orientation == VERTICAL) {//纵向
            totalRow = Math.ceil(this.data.length / this.col);
            if (totalRow < this.visibleRow) {
                return;
            }
            if (this.circulate) {//循环效果
                if (scrollLocate == ScrollCenter) {
                    scrollTop = top - (this.height - childView.height) / 2;
                } else if (scrollLocate == ScrollStart || top < 0) {
                    scrollTop = top;
                } else if (scrollLocate == ScrollEnd || top > (this.height - childView.height)) {
                    scrollTop = top - this.height + childView.height;
                }
            } else {
                rowNum = Math.floor(index / this.col);
                //直接计算scrollTop
                if (scrollLocate == ScrollCenter) {
                    if (rowNum < Math.floor(this.visibleRow / 2)) {//只能滚动到start位置
                        scrollTop = top - rowNum * this.seatSize.height;
                    } else if (rowNum + Math.ceil(this.visibleRow / 2) > totalRow) {//只能滚动到end位置
                        scrollTop = (totalRow - rowNum) * this.seatSize.height + top - this.height;
                    } else {
                        scrollTop = top - (this.height - childView.height) / 2;
                    }
                } else if (scrollLocate == ScrollStart) {
                    if (rowNum + this.visibleRow > totalRow) {
                        scrollTop = (totalRow - rowNum) * this.seatSize.height + top - this.height;
                    } else {
                        scrollTop = top;
                    }
                } else if (scrollLocate == ScrollEnd) {
                    if (rowNum < this.visibleRow - 1) {
                        scrollTop = top - rowNum * this.seatSize.height;
                    } else {
                        scrollTop = top - this.height + childView.height;
                    }
                } else {
                    if (top < 0) {
                        scrollTop = top;
                    } else if (top > (this.height - childView.height)) {
                        scrollTop = top - (this.height - childView.height);
                    }
                }
            }
        } else {//横向
            if (this.data.length < this.visibleRow) {
                return;
            }
            rowNum = index % this.row;
            totalRow = this.row;
            if (scrollLocate == ScrollCenter) {
                if (rowNum < Math.floor(this.visibleRow / 2)) {//只能滚动到start位置
                    scrollTop = top - rowNum * this.seatSize.height;
                } else if (rowNum + Math.ceil(this.visibleRow / 2) > totalRow) {//只能滚动到end位置
                    scrollTop = (totalRow - rowNum) * this.seatSize.height + top - this.height;
                } else {
                    scrollTop = top - (this.height - childView.height) / 2;
                }
            } else if (scrollLocate == ScrollStart) {
                if (rowNum + this.visibleRow > totalRow) {
                    scrollTop = (totalRow - rowNum) * this.seatSize.height + top - this.height;
                } else {
                    scrollTop = top;
                }
            } else if (scrollLocate == ScrollEnd) {
                if (rowNum < this.visibleRow - 1) {
                    scrollTop = top - rowNum * this.seatSize.height;
                } else {
                    scrollTop = top - this.height + childView.height;
                }
            } else {
                if (top < 0) {
                    scrollTop = top;
                } else if (top > (this.height - childView.height)) {
                    scrollTop = top - (this.height - childView.height);
                }
            }
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

        var left = childView.positionByFather.left;
        if (this.width < childView.width) {
            this.scrollHorizontal(left);
            return;
        }

        var index = childView.holder.index;
        var colNum = -1;
        var totalCol = -1;
        var scrollLeft = 0;
        if (this.orientation == VERTICAL) {
            if (this.data.length < this.visibleCol) {
                return;
            }
            colNum = index % this.col;
            totalCol = this.col;
            if (scrollLocate == ScrollCenter) {
                if (colNum < Math.floor(this.visibleCol / 2)) {//只能滚动到start位置
                    scrollLeft = left - colNum * this.seatSize.width;
                } else if (colNum + Math.ceil(this.visibleCol / 2) > totalCol) {//只能滚动到end位置
                    scrollLeft = (totalCol - colNum) * this.seatSize.width + left - this.width;
                } else {
                    scrollLeft = left - (this.width - childView.width) / 2;
                }
            } else if (scrollLocate == ScrollStart) {
                if (colNum + this.visibleCol > totalCol) {
                    scrollLeft = (totalCol - colNum) * this.seatSize.width + left - this.width;
                } else {
                    scrollLeft = left;
                }
            } else if (scrollLocate == ScrollEnd) {
                if (colNum < this.visibleCol - 1) {
                    scrollLeft = left - colNum * this.seatSize.width;
                } else {
                    scrollLeft = left - this.width + childView.width;
                }
            } else {
                if (left < 0) {
                    scrollLeft = left;
                } else if (left > (this.width - childView.width)) {
                    scrollLeft = left - (this.width - childView.width);
                }
            }
        } else {
            totalCol = Math.ceil(this.data.length / this.row);
            if (totalCol < this.visibleCol) {
                return;
            }
            if (this.circulate) {//循环效果
                if (scrollLocate == ScrollCenter) {
                    scrollLeft = left - (this.width - childView.width) / 2;
                } else if (scrollLocate == ScrollStart || left < 0) {
                    scrollLeft = left;
                } else if (scrollLocate == ScrollEnd || left > (this.width - childView.width)) {
                    scrollLeft = left - this.width + childView.width;
                }
            } else {
                colNum = Math.floor(index / this.row);
                //直接计算scrollLeft
                if (scrollLocate == ScrollCenter) {
                    if (colNum < Math.floor(this.visibleCol / 2)) {//只能滚动到start位置
                        scrollLeft = left - colNum * this.seatSize.width;
                    } else if (colNum + Math.ceil(this.visibleCol / 2) > totalCol) {//只能滚动到end位置
                        scrollLeft = (totalCol - colNum) * this.seatSize.width + left - this.width;
                    } else {
                        scrollLeft = left - (this.width - childView.width) / 2;
                    }
                } else if (scrollLocate == ScrollStart) {
                    if (colNum + this.visibleCol > totalCol) {
                        scrollLeft = (totalCol - colNum) * this.seatSize.width + left - this.width;
                    } else {
                        scrollLeft = left;
                    }
                } else if (scrollLocate == ScrollEnd) {
                    if (colNum < this.visibleCol - 1) {
                        scrollLeft = left - colNum * this.seatSize.width;
                    } else {
                        scrollLeft = left - this.width + childView.width;
                    }
                } else {
                    if (left < 0) {
                        scrollLeft = left;
                    } else if (left > (this.width - childView.width)) {
                        scrollLeft = left - (this.width - childView.width);
                    }
                }
            }
        }

        this.scrollHorizontal(scrollLeft);
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
        var eleStr = this.ele.innerHTML;
        if (eleStr) {
            this.template = eleStr;
            this.ele.innerHTML = "";
        }
        return super.setAttributeParam();
    }

    static parseByEle(ele, viewManager) {
        var recycleView = new RecycleView(viewManager);
        recycleView.ele = ele;
        var viewDefault = recycleView.setAttributeParam();

        recycleView.scroller.init();
        recycleView.measure();
        centerScroller(recycleView);//让滚动器居中

        if (viewDefault) {
            viewManager.focusView = recycleView;
        }

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
        var margin = this.recycleView.margin;
        var height = margin.top + margin.bottom + this.component.height;//列距
        var width = margin.left + margin.right + this.component.width;//行距

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
}

/**
 * 用于RecycleView的每一个子控件的组件
 */
export class Component extends GroupView {
    constructor(viewManager) {
        super(viewManager);
        this.ele = document.createElement("div");
        this.holder = null;
        /**
         * 内部节点
         * @type {Map<String, Element>}
         */
        this.eleMap = new Map();
    }

    callFocusChangeListener(view, hasFocus) {
        if (hasFocus) {
            var index = this.holder.index;
            this.fatherView.selectIndex = index;
            render(this.fatherView, index);
        }

        super.callFocusChangeListener(view, hasFocus);
    }

    findEleById(id) {
        if (!id) {
            return null;
        }
        var ele = this.eleMap.get(id);
        if (!ele) {
            ele = View.findEleBy(id, this.ele);
            this.eleMap.set(id, ele);
        }

        return ele;
    }
}

/**
 * 创建component
 * @param holder
 * @returns {Component}
 */
var buildComponent = function (holder) {
    var component = new Component(holder.recycleView.viewManager);
    component.holder = holder;
    if (!holder.recycleView.ele.contains(component.ele)) {//如果该ele未被渲染
        holder.recycleView.appendChild(component.ele);//渲染
    }

    var seatSize = holder.recycleView.seatSize;
    component.width = seatSize.width;
    component.height = seatSize.height;

    component.html = holder.eleStr;

    return component;
}

/**
 * 计算一个component占位大小,adapter是后续设置的，不在原recycleView节点中
 * 使用holder（已回收/新创建的）获取size+margin
 * @param recycleView
 * @returns {VSize}
 */
var computeSeatSize = function (recycleView) {
    var seatSize = new VSize(0, 0);
    if (!recycleView.adapter) {
        return seatSize;
    }


    var invisibleDiv = buildInvisibleDiv();
    invisibleDiv.innerHTML = recycleView.adapter.template;
    recycleView.ele.appendChild(invisibleDiv);//不可见渲染

    var size = View.getVisibleSize(invisibleDiv);//组件宽高

    invisibleDiv.remove();//将当前节点从application中移除
    //兼容ele.remove无效
    if (recycleView.ele.contains(invisibleDiv)) {
        recycleView.ele.removeChild(invisibleDiv);
    }

    var margin = recycleView.margin;
    var width = size.width + margin.left + margin.right;
    var height = size.height + margin.top + margin.bottom;

    recycleView.seatSize = new VSize(width, height);
}

var render = function (recycleView, index) {
    if (!recycleView.data || recycleView.data.length == 0) {
        return;
    }

    if (!recycleView.adapter) {
        return;
    }

    var obj = renderBase(recycleView, index);
    index = obj.index;
    let position = obj.position;

    var renderIndexList = [index];

    //TODO 待优化，已渲染的数据需要重新加载，这是一个问题，可以先判断在正常范围的holder对应的是否已激活，如果未激活可以拿来使用（猜想）
    renderIndexList = renderIndexList.concat(renderSmaller(recycleView, index, position));
    renderIndexList = renderIndexList.concat(renderBigger(recycleView, index, position));
    // console.log("renderIndexList", renderIndexList)
    recycleView.activeHolderMap.forEach(function (value, key, map) {
        if (renderIndexList.indexOf(key) < 0) {
            if (value) {
                // console.log("recycle index",key)
                value.recycle();
            }
        }
    })
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
            holder.changIndex(index);//将holder的index调整到征程范围
        }
    } else {
        position = new VPosition(0, 0);
        index = (index + data.length) % data.length;//调整index，使在正常范围

        holder = recycleView.activeHolderMap.get(index);//重新获取

        if (!holder) {//重新获取的holder不存在
            holder = getEmptyHolder(recycleView);//获取一个空的holder
            holder.active(index);//使用正常范围的index激活
            adapter.bindHolder(holder, data[index]);//绑定数据
        }
    }

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
            minNum = minNum * (recycleView.visibleRow - 1);
        } else if (scrollLocate == ScrollCenter) {
            minNum = minNum * Math.ceil(recycleView.visibleRow / 2);
        }
        minNum += baseIndex % recycleView.col;
        canCirculate = Math.ceil(data.length / recycleView.col) >= recycleView.visibleRow;
    } else {
        minNum = recycleView.row;
        if (scrollLocate == ScrollEnd) {
            minNum = minNum * (recycleView.visibleCol - 1);
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
            minNum = minNum * (recycleView.visibleRow - 1);
        } else if (scrollLocate == ScrollCenter) {
            minNum = minNum * Math.ceil(recycleView.visibleRow / 2);
        }

        minNum += (recycleView.col - baseIndex % recycleView.col - 1);
        canCirculate = Math.ceil(data.length / recycleView.col) >= recycleView.visibleRow;
    } else {
        minNum = recycleView.row;
        if (scrollLocate == ScrollStart) {
            minNum = minNum * (recycleView.visibleCol - 1);
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
var centerScroller = function (recycleView) {
    var distanceLeft = recycleView.width - recycleView.scrollLeft;
    var distanceTop = recycleView.height - recycleView.scrollTop;

    // console.log("distanceLeft", distanceLeft, "distanceTop", distanceTop)
    for (var child of recycleView.childViews) {
        child.left = child.left - distanceLeft;
        child.top = child.top - distanceTop;
    }

    recycleView.measure();//由于存在拉大滚动器的情况，在每一次变化时，重制滚动器的大小

    recycleView.scrollTop = recycleView.height;//纵向居中
    recycleView.scrollLeft = recycleView.width;//横行居中
}

/**
 * 将childView设置到position位置，这个位置是相对recycleView的左上角
 * @param recycleView
 * @param childView
 * @param{VPosition} position
 */
var setChildPosition = function (recycleView, childView, position) {
    let left = position.left + recycleView.scrollLeft;
    let top = position.top + recycleView.scrollTop;
    childView.top = top;
    childView.left = left;
    if (top < 0) {//childView已经在recycleView.scroller的范围外的上边了，需要校准
        recycleView.scrollHeight -= top;//将recycleView拉高
        recycleView.scrollTop -= top;
        for (var child of recycleView.childViews) {
            child.top = child.top - top;//将child复位
        }
    }else if(top > recycleView.scrollHeight - recycleView.scrollTop){//childView已经在recycleView.scroller的范围外的下边了，需要校准
        recycleView.scrollHeight = top + recycleView.scrollTop;//将recycleView拉高
    }

    if (left < 0) {//childView已经在recycleView.scroller的范围外的左边了，需要校准
        recycleView.scrollWidth -= left;//将recycleView拉高
        recycleView.scrollLeft -= left;
        for (var child of recycleView.childViews) {
            child.left = child.left - left;//将child复位
        }
    }else if(left > recycleView.scrollWidth - recycleView.scrollLeft){//childView已经在recycleView.scroller的范围外的右边了，需要校准
        recycleView.scrollWidth = left + recycleView.scrollLeft;//将recycleView拉高
    }
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
            let remainder = length % recycleView.col;
            if (remainder == 0) {
                row = Math.floor((index + (length % recycleView.col)) / recycleView.col);
            } else {
                row = Math.floor((index + (length % recycleView.col)) / recycleView.col) - 1;
            }
        } else if (index >= length) {
            let remainder = length % recycleView.col;
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
            let remainder = length % recycleView.row;
            if (remainder == 0) {
                col = Math.floor((index + (length % recycleView.row)) / recycleView.row);
            } else {
                col = Math.floor((index + (length % recycleView.row)) / recycleView.row) - 1;
            }
        } else if (index >= length) {
            let remainder = length % recycleView.row;
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