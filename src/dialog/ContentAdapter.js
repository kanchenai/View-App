import {Adapter} from "@core/frame/view/group/RecycleView";
import html from "../html/adapter/content_adapter.html"

export default class ContentAdapter extends Adapter{
    constructor() {
        super();
        this.template = html;
    }

    bindHolder(holder, data) {
        var pic = holder.findViewById("pic");//不做绝对的懒加载，但是在recycleView的回收机制下，也类似懒加载
        // var big_picture = holder.findViewById("big_picture");//绝对的懒加载,图片加载会延后
        var txt = holder.findViewById("txt");//TODO 使用TextView文字不显示
        var info = holder.findEleById("info");
        // pic.src = data.pic;
        txt.text = data.name;
        info.innerText = data.info;

    }
}
