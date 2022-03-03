import Page from "../../core/frame/page/Page";
import View from "../../core/frame/view/base/View";
import FramePage from "./FramePage";
import html from "../html/list.html"


export default class ListPage extends Page {
    constructor() {
        super();
        this.pageName = "ListPage";
    }

    onCreate(param) {
        console.log("ListPage", this.id, "onCreate", "传入参数", param);
        this.html = html;
    }

    onClickListener() {
        console.log(this.id + "-key_ok_event");
        // var testPage = new TestPage();
        // this.startPage(testPage, {data: "tttttt"});

        var framePage = new FramePage();
        this.startPage(framePage, {data: "ffffff"});
    }

    setResult(data) {
        console.log("setResult", data);
    }

    onResume() {
        console.log(this.id + "-onResume");
    }

    onPause() {
        console.log(this.id + "-onPause");
    }

    onStop() {
        console.log(this.id + "-onStop");
    }

    onDestroy() {
        console.log(this.id + "-onDestroy");
    }

    key_back_event() {
        this.setResult({data: "来自ListPage的数据"});
        this.finish();
    }
}
