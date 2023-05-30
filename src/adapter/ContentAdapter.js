import {Adapter} from "@core/frame/view/group/RecycleView";

export default class ContentAdapter extends Adapter{
    constructor() {
        super();
        this.template = require("@html/adapter/content_adapter.html");
    }

    bindHolder(holder, data) {
        var poster = holder.findViewById("poster");//不做绝对的懒加载，但是在recycleView的回收机制下，也类似懒加载
        poster.poster = data.poster;
        var txt = holder.findViewById("txt");//TODO 使用TextView文字不显示
        var info = holder.findEleById("info");
        // pic.src = data.pic;
        txt.text = data.name;
        info.innerText = data.info;

    }
}
