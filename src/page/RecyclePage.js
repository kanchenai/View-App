import Page from "@core/frame/page/Page";

export default class RecyclePage extends Page{
    onCreate(param) {
        this.html = require("../html/recycle.html");
    }
}
