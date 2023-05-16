import Page from "@core/frame/page/Page";

export default class ButtonPage extends Page {
    onCreate(param) {
        this.html = require("../html/button.html");

        this.initView();
        this.setView();
        this.initUtil();
    }

    initView() {
    }

    setView() {
    }

    initUtil() {
    }
}
