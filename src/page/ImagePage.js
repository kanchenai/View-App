import Page from "@core/frame/page/Page";

export default class ImagePage extends Page{
    onCreate(param) {
        this.html = require("../html/image.html");
    }
}
