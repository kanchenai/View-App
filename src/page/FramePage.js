import Page from "../../core/frame/page/Page";

import html from "../html/frame.html"
import Fragment_0 from "@fragment/Fragment_0";
import Fragment_1 from "@fragment/Fragment_1";
import Fragment_2 from "@fragment/Fragment_2";
import TestPage from "@page/TestPage";

export default class FramePage extends Page{
    constructor() {
        super();
        this.pageName = "FramePage";
    }

    onCreate(param) {
        console.log(this.pageName + "-onCreate");
        this.html = html;

        this.initView();
    }

    initView(){
        this.frame_view = this.findViewById("frame_view");
        this.frame_view.addFragmentList([new Fragment_0(),new Fragment_1(),new Fragment_2()]);
        // this.frame_view.switchTo(0);
    }

    onFocusChangeListener(view, hasFocus) {
        if(!hasFocus){
            return;
        }
        switch (view.id){
            case "view_0":
                this.frame_view.switchTo(0);
                break;
            case "view_1":
                this.frame_view.switchTo(1);
                break;
            case "view_2":
                this.frame_view.switchTo(2);
                break;
        }
    }

    onClickListener(view) {
        var testPage = new TestPage();
        this.startPage(testPage,null);
    }

    onResume() {
        console.log(this.pageName + "-onResume");
    }

    onPause() {
        console.log(this.pageName + "-onPause");
    }

    onStop() {
        console.log(this.pageName + "-onStop");
    }

    onDestroy() {
        console.log(this.pageName + "-onDestroy");
    }
}
