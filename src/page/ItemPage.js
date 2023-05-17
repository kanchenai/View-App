import Page from "@core/frame/page/Page";

export default class ItemPage extends Page{
    onCreate(param) {
        this.html = require("../html/item.html");
    }
}
