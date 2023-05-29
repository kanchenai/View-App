import Page from "@core/frame/page/Page";
import {Adapter} from "@core/frame/view/group/RecycleView";

export default class DetailPage extends Page {
    onCreate(param) {
        this.html = require("../html/detail.html");
        this.initView();
        this.setView();
        this.initUtil();
    }

    initView() {
        this.content_poster = this.findViewById("content_poster")
        this.content_name = this.findViewById("content_name")
        this.description = this.findEleById("description");
        this.recommend_content = this.findViewById("recommend_content");
        this.recommend_content.margin.left = 20;
        this.recommend_content.adapter = new RecommendAdapter();
    }

    setView() {
    }

    initUtil() {
        this.content_poster.poster = require("../images/poster.png")
        this.content_name.text = "这是一个内容标题";

        this.description.innerText = "这是一段内容描述，以下描述属于凑字数的。"

        this.recommend_content.data = new Array(6);

    }
}

class RecommendAdapter extends Adapter {
    bindHolder(holder, data) {
        var poster = holder.findViewById("poster");
        poster.data = {
            poster: require("../images/poster.png"),
            name: "这是一个标题"
        }
    }
}