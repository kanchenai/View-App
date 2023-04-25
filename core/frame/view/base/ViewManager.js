import View from './View'
import GroupView from "../group/GroupView";
import ScrollView from "./ScrollView";
import FrameView from "../group/FrameView";
import ItemView from "./ItemView";
import Dialog from "@core/frame/view/group/Dialog";
import RecycleView from "@core/frame/view/group/RecycleView";

/**
 * @constructor
 */
export default class ViewManager {
    constructor(page) {
        this.page = page;
        this._focusView = null;
    }

    clear() {
        this.focusView = null;
    }

    /**
     * 构建控件
     * 这个方法一般是业务层主动设置html是被调用
     * 内部存在ScrollView及子类时,
     * 因为子控件还未创建及测量,
     * scroller（滚动器）的大小无法被测量
     * @param html
     */
    buildView(view) {
        if (view instanceof GroupView) {
            this.eleToObject(view.scroller.ele, view, view.listenerLocation);
        } else if (view instanceof View) {
            this.eleToObject(view.ele, view, view.listenerLocation);
        }
    }

    /**
     *
     * @param{Element} ele
     * @param{GroupView} groupView
     * @param{View} listenerLocation
     */
    eleToObject(ele, groupView, listenerLocation) {
        var ele_list = ele.children;
        for (var child_ele of ele_list) {
            var viewType = View.getViewType(child_ele);
            switch (viewType) {
                case "VIEW":
                    var view = View.parseByEle(child_ele, this, listenerLocation);
                    groupView.addChild(view);
                    break;
                case "VIEW-ITEM":
                case "ITEM":
                    var itemView = ItemView.parseByEle(child_ele, this, listenerLocation);
                    groupView.addChild(itemView);
                    break;
                case "VIEW-SCROLL":
                case "SCROLL":
                    var scrollView = ScrollView.parseByEle(child_ele, this, listenerLocation);
                    groupView.addChild(scrollView);
                    break;
                case "VIEW-GROUP":
                case "GROUP":
                    var _groupView = GroupView.parseByEle(child_ele, this, listenerLocation);
                    groupView.addChild(_groupView);
                    break;
                case "VIEW-FRAME":
                case "FRAME":
                    var frameView = FrameView.parseByEle(child_ele, this, listenerLocation);
                    groupView.addChild(frameView);
                    break;
                case "VIEW-DIALOG":
                case "DIALOG":
                    var dialog = Dialog.parseByEle(child_ele, this, listenerLocation);
                    groupView.addChild(dialog);
                    break;
                case "VIEW-RECYCLE":
                case "RECYCLE":
                    var recycleView = RecycleView.parseByEle(child_ele, this, listenerLocation);
                    groupView.addChild(recycleView);
                    break;
                default:
                    var customView = null;
                    if (customViewBuilder[viewType]) {//该控件为自定义控件
                        var viewBuilder = customViewBuilder[viewType];
                        if(viewBuilder){
                            customView = viewBuilder.buildView(child_ele, this, listenerLocation);
                        }
                    }

                    if(!customView){
                        this.eleToObject(child_ele, groupView, listenerLocation);
                    }else{
                        groupView.addChild(customView);
                    }
                    break;
            }
        }
    }

    set focusView(value) {
        this._focusView = value;
    }

    get focusView() {
        return this._focusView;
    }

    /**
     * 执行next,next可以是方法，或者view
     * @param {Function|View} next
     * @param {Page} page 触发动作的页面
     */
    next(_next) {
        if (!!!_next) {
            return;
        }

        if (typeof _next == "string") {
            if (_next == "null" || _next == "none") {
                return;
            }
            var page = this.page;
            //获取对应的控件
            var nextView = page.findViewById(_next);
            if (nextView) {//不是控件或绑定的是方法
                _next = nextView;
            } else {
                _next = page[_next];
            }
        }
        if (_next instanceof Function) {
            (_next)();
        } else if (_next.focusable) {//ItemView和GroupView都是View的子类，且只有这两类的对象可以执行上焦操作
            _next.requestFocus();
        } else {
            console.warn("操作值错误！", _next)
        }
    }

    /**
     * 初始化页面的焦点
     */
    init() {
        if (this.focusView) {
            this.focusView.requestFocus();
        }
    }

    /**
     * 添加自定义控件的的builder
     * 需要在创建页面之前执行，一版在main.js中application.launch()之前
     * @param{Array} viewBuilderConstructorList
     */
    static addCustomViewBuilder(viewBuilderConstructorList) {
        for (var i = 0; i < viewBuilderConstructorList.length; i++) {
            var viewBuilder = new viewBuilderConstructorList[i]();//创建一个viewBuilder
            var viewType = viewBuilder.viewType;

            viewType = viewType.toLocaleUpperCase()

            if (customViewBuilder[viewType]) {//已存在
                console.warn("自定义控件" + viewType + "已被定义");
            } else {
                customViewBuilder[viewType] = viewBuilder;
            }
        }
    }
}

var customViewBuilder = {}

export class ViewBuilder {
    constructor() {
        this.viewType = "";
    }

    /**
     *
     * @param ele 空间对应的节点
     * @param viewManager
     * @param listenerLocation 控件监听所在的组件
     * @return {View}
     */
    buildView(ele, viewManager, listenerLocation) {
        return null;
    }
}


//TODO 自定义view的view-type转化

