import Page from "@core/frame/page/Page";
import {Adapter} from "@core/frame/view/group/RecycleView";
import VMargin from "@core/frame/util/VMargin";

export default class SearchPage extends Page {
    onCreate(param) {
        this.html = require("../html/search.html");

        this.initView();
        this.setView();
        this.initUtil();
    }

    initView() {
        this.keyword = this.findEleById("keyword");
        this.keyboard = this.findViewById("keyboard");

        this.result_list = this.findViewById("result_list");
        this.result_list.margin = new VMargin(0, 20, 0, 20);
        this.result_list.adapter = new PosterAdapter();
    }

    setView() {
        this.keyboard.onClickListener = onKeyboardClickListener;
    }

    initUtil() {
        this.result_list.data = new Array(17);
    }

    onClickListener(view) {
        switch (view.id) {
            case "btn_delete":
                var keyword = this.keyword.innerText;
                if (keyword.length > 0) {
                    keyword = keyword.substring(0, keyword.length - 1);
                    this.keyword.innerText = keyword;
                }
                break;
            case "btn_clear":
                this.keyword.innerText = "";
                break;
        }
    }
}

class PosterAdapter extends Adapter {
    bindHolder(holder, data) {
        var poster = holder.findViewById("poster");
        poster.data = {
            poster: require("../images/poster.png"),
            name: "搜索结果内容名"
        }
    }
}

var onKeyboardClickListener = function (view) {
    var key = view.data;
    this.i(key)
    this.keyword.innerText += key;
}