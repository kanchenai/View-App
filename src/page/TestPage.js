import Page from "@core/frame/page/Page";

import html from "@html/test.html"

import pic_001 from "@images-js/pic_001.png"
import {ScrollCenter, ScrollStart, ScrollEnd, ScrollNormal} from "@core/frame/view/group/GroupView";
import {Adapter, HORIZONTAL, VERTICAL} from "@core/frame/view/group/RecycleView";

export default class TestPage extends Page {
    constructor() {
        super();
        this.pageName = "TestPage";
    }

    onCreate(param) {
        this.html = html;


        var recycleView = this.findViewById("recycleView");
        window.recycleView = recycleView;
        console.log(recycleView)
        recycleView.orientation = HORIZONTAL;
        recycleView.scrollLocate = ScrollNormal;
        recycleView.col = 3;
        recycleView.row = 3;
        // recycleView.circulate = true;
        recycleView.adapter = adapter;


        recycleView.data = new Array(50);
    }
}

var adapter = new Adapter();

adapter.bindHolder = function (holder, data) {
    var len = this.recycleView.data.length;
    var index = (holder.index + len) % len;
    var test_div = holder.findEleById("test_div");

    test_div.innerText = index;

    var item = holder.findViewById("post");
    var image = holder.findViewById("pic");
    image.src = pic_001;

    // holder.findEleById("pic").style.background = data.color
}