import GroupView from "@core/frame/view/group/GroupView";
import {ViewBuilder} from "@core/frame/view/base/ViewManager";
import PainterUtil from "@src/custom-view/painter/PainterUtil";

export default class PainterView extends GroupView {
    constructor(viewManager, listenerLocation) {
        super(viewManager, listenerLocation);
        this.painterUtil = new PainterUtil(this);
    }

    /**
     * 渲染
     * @param html
     */
    renderBy(data) {
        this.painterUtil.data = data;
        this.html = this.painterUtil.html;
        this.painterUtil.bindData();
        //焦点判断
        if (this.page.focusView == this) {
            this.requestFocus();
        }
    }

    /**
     * 置空
     */
    set data(value) {
    }

    get data() {
        return null;
    }

    static parseByEle(ele, viewManager, listenerLocation) {
        var view = new PainterView(viewManager, listenerLocation);
        view.ele = ele;
        view.scroller.init();
        return view;
    }
}

export class PainterViewBuilder extends ViewBuilder {
    constructor(props) {
        super(props);
        this.viewType = "painter";
    }

    buildView(ele, viewManager, listenerLocation) {
        return PainterView.parseByEle(ele, viewManager, listenerLocation);
    }
}