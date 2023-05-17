import Page from "@core/frame/page/Page";

export default class GroupPage extends Page{
    onCreate(param) {
        this.html = require("../html/group.html");
    }
}
