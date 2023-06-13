import Page from "@core/frame/page/Page";

export default class FocusPage extends Page{
    onCreate(param) {
        this.html = require("../html/focus.html")
    }
}