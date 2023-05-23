import RecycleView from "@core/frame/view/group/RecycleView";
import {ViewBuilder} from "@core/frame/view/base/ViewManager";

export default class CarouselView extends RecycleView{
    constructor(viewManager, listenerLocation) {
        super(viewManager, listenerLocation);
    }


    scrollByIndex(index){
        super.scrollByIndex(index);
        //TODO 设置放大缩小
    }

    static parseByEle(ele, viewManager, listenerLocation){
        var view = new CarouselView(viewManager, listenerLocation);
        view.ele = ele;

        var firstFocus = view.setAttributeParam();
        if(firstFocus){
            viewManager.focusView = view;
        }

        return view;
    }
}

export class CarouselViewBuild extends ViewBuilder{
    constructor(props) {
        super(props);
        this.viewType = "carousel";
    }

    buildView(ele, viewManager, listenerLocation) {
        return CarouselView.parseByEle(ele, viewManager, listenerLocation);
    }
}

