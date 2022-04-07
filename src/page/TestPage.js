import Page from "@core/frame/page/Page";

import html from "@html/test.html"
import ComponentView from "@core/frame/view/other/ComponentView";
import {Adapter} from "@core/frame/view/group/RecycleView";

export default class TestPage extends Page{
    constructor() {
        super();
        this.pageName = "TestPage";
    }

    onCreate(param) {
        this.html = html;

    }
}