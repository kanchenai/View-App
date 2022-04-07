import View from "@core/frame/view/base/View";
import VSize from "@core/frame/util/VSize";
import ViewManager from "@core/frame/view/base/ViewManager";

/**
 *
 */
export default class ComponentView {
    /**
     *
     * @param{String|Element} o
     */
    constructor(ele) {
        this.ele = ele;
        /**
         * 内部节点
         * @type {Map<String, Element>}
         */
        this.eleMap = new Map();
        /**
         * 内部控件
         * @type {Map<String, View>}
         */
        this.viewMap = new Map();//为ele或子ele中有view-type属性的ele创建对应的控件，保存到这个map
    }

    /**
     * 测量宽、高
     */
    measure() {
        //根据子节点计算
        var size = View.getVisibleSize(this.ele);
        if (this.width < size.width) {
            this.width = size.width;
        }
        if (this.height < size.height) {
            this.height = size.height;
        }
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

    set size(value) {
        this.width = value.width;
        this.height = value.height;
    }

    get size() {
        return new VSize(this.width, this.height);
    }

    /**
     * 获取width
     */
    get width() {
        return View.getWidth(this.ele);
    }

    set width(value) {
        this.setStyle("width", value + "px");
    }

    /**
     * 获取height
     */
    get height() {
        return View.getHeight(this.ele);
    }

    set height(value) {
        this.setStyle("height", value + "px");
    }

    setStyle(key, value) {
        this.ele.style[key] = value;
    }

    /**
     * 将Element转Component
     * @param{Element} ele
     * @param{GroupView} groupView
     */
    static parseByEle(ele,groupView){
        var componentView = new ComponentView(ele);
        componentView.measure();
        groupView.viewManager.eleToObject(ele,groupView);

        return componentView;
    }
}