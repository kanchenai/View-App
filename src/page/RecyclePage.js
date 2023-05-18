import Page from "@core/frame/page/Page";
import {Adapter} from "@core/frame/view/group/RecycleView";
import AdapterDemo from "@src/adapter/AdapterDemo";

export default class RecyclePage extends Page {
    onCreate(param) {
        this.html = require("../html/recycle.html");

        this.initView();
        this.setView();
        this.initUtil();
    }

    initView() {
        this.recycle_0 = this.findViewById("recycle_0");
        this.recycle_0.margin.right = 10;
        this.recycle_0.adapter = new SimpleAdapter();

        this.recycle_1 = this.findViewById("recycle_1");
        this.recycle_1.margin.right = 10;
        this.recycle_1.adapter = new AdapterDemo();

        this.recycle_2 = this.findViewById("recycle_2");
        this.recycle_2.margin.right = 10;
        this.recycle_2.adapter = new SimpleAdapter();

        this.recycle_3 = this.findViewById("recycle_3");
        this.recycle_3.margin.right = 10;
        this.recycle_3.adapter = new PosterAdapter();
    }

    setView() {
    }

    initUtil() {
        this.recycle_0.data = new Array(15);
        this.recycle_1.data = new Array(15);
        this.recycle_2.data = new Array(15);

        var posterData = [];
        for (var i = 0; i < 15; i++) {
            posterData.push(
                {poster: require("../images/poster.png")}
            )
        }
        this.recycle_3.data = posterData;
    }
}

class SimpleAdapter extends Adapter {
    bindHolder(holder, data) {

    }
}

class PosterAdapter extends Adapter {
    bindHolder(holder, data) {
        // var poster = holder.findViewById("poster");
        // poster.data = data;
    }
}
