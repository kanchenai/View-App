import Page from "@core/frame/page/Page";
import {Adapter} from "@core/frame/view/group/RecycleView";
import VMargin from "@core/frame/util/VMargin";

export default class KeyboardPage extends Page {
    onCreate(param) {
        this.html = require("../html/keyboard.html");

        this.initView();
        this.setView();
        this.initUtil();
    }

    initView() {
        this.keyboard = this.findViewById("keyboard");
        this.keyboard.col = 6;
        this.keyboard.margin = new VMargin(0,-33,0,-33);
        this.keyboard.adapter = new TextAdapter();
    }

    setView() {
    }

    initUtil() {
        this.keyboard.data = [
            "A", "B", "C", "D", "E", "F",
            "G", "H", "I", "J", "K", "L",
            "M", "N", "O", "P", "Q", "R",
            "S", "T", "U", "V", "W", "X",
            "Y", "Z", "0", "1", "2", "3",
            "4", "5", "6", "7", "8", "9"];
    }
}

class TextAdapter extends Adapter {
    bindHolder(holder, data) {
        var button = holder.findViewById("button");
        button.value = data;
    }
}
