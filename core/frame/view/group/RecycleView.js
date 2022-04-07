import GroupView from "./GroupView";
import ComponentView from "@core/frame/view/other/ComponentView";
import View from "@core/frame/view/base/View";

/**
 * 使用Holder来保存ComponentView
 * 可以对其中的控件单独设置监听
 * 对Holder的回收：
 *      停止操作时回收，缺点：不停的操作，不会回收
 *      每渲染一行/一列时，判断所有存活的holder的行号判断，满足回收要求的回收
 *      判断是否在显示范围，回收
 * holder的功能
 *      对已设置控件类型的ele创建控件，添加到holder的map中
 *      获取对应ele
 *      对获取的ele设置数据
 *      为获取已创建控件
 *      对获取的ele创建控件
 *
 * Adapter：控制holder，渲染每个元素
 *          获取ComponentView的ele
 *          创建holder
 *
 * RecycleView：是否引入relative布局，使用float方式，需要实践兼容
 *      计算最小布局行数/列数
 *      各种属性
 *      触发刷新
 */
export default class RecycleView extends GroupView {
    static vertical;
    static horizontal;
    constructor() {
        super();

        this.orientation = RecycleView.vertical;
        /**
         * 已回收的Component
         * @type {Holder[]}
         */
        this.recycleHolder = [];
        /**
         * 正在使用的Component
         * @type {Map<String, Holder>}
         */
        this.aliveHolder = new Map();

        //最少子控件数
        /**
         * 适配器
         * @type {Adapter}
         */
        this._adapter = null;
    }

    //刷新布局


    set adapter(value){
        value.recycleView = this;
        this._adapter = value;
    }

    setAttributeParam(){
        super.setAttributeParam();
    }

    static parseByEle(ele, viewManager){
        var recycleView = new RecycleView();
        recycleView.ele = ele;

        var eleStr = recycleView.ele.innerHTML;
        if(eleStr){
            var adapter = new Adapter();
            adapter.eleStr = eleStr;
            recycleView.adapter = adapter;
        }
        recycleView.ele.innerHTML = "";
        recycleView.setAttributeParam();
        recycleView.scroller.init();
        viewManager.addView(recycleView);
        console.log(eleStr)

        return recycleView;
    }
}

RecycleView.vertical = 0;
RecycleView.horizontal = 1;

//计算最小行/列


export class Adapter{
    constructor() {
        this.recycleView = null;
        this.eleStr = "";
        //holder 对象，保存每个Component中对应的控件
        //对应的Component
        //获取Component的ele，
        // 1.可以从RecycleView的ele中获取
        // 2.也可以从其他的html文件中的获取
    }

    /**
     * 创建Holder
     * @param{RecycleView} recycleView
     */
    createHolder(recycleView){
        return new Holder(this.eleStr,recycleView);
    }

    //创建Holder之后，设置row、col、index、data
    //渲染Component

    bindHolder(holder){
        var data = holder.data;

        // var
    }
}

export class Holder{
    /**
     * @param{String} ele
     * @param{RecycleView} recycleView
     */
    constructor(eleStr,recycleView) {
        /**
         * 列
         * @type {number}
         */
        this.col = -1;
        /**
         * 行
         * @type {number}
         */
        this.row = -1;
        /**
         * 下标
         * @type {number}
         */
        this.index = -1;
        /**
         * 数据
         * @type {Object}
         */
        this.data = null;
        this.recycleView = recycleView;

        this.component = null;

    }

    get ele(){
        if(!this.component){
            return null;
        }
        return this.component.ele;
    }


    /**
     * 渲染
     * @param{Object} data 渲染的数据
     */
    render(data) {
        this.data = data;
        console.log(this.component, data);
        return this.component.ele;
    }

    /**
     * 回收
     */
    recycle(){
        this.col = -1;
        this.row = -1;
        this.index = -1;
        this.data = null;
        return this;
    }

    findViewById(id){
        return this.component.viewMap.get(id);
    }

    findEleById(id){
        return this.component.eleMap.get(id);
    }


}
